import 'server-only'
import { and, asc, count as countFn, desc, eq, inArray, isNull, notInArray, or, sql, type SQL } from 'drizzle-orm'
import { db } from '@/db'
import { user_connections, users } from '@/db/schema'
import { PAYS, PAYS_AUTRE, lireLangues, parseList, type ConnectionState, type MemberSummary } from './profil'
import type { AnnuaireFilters } from './filtres'
import { motifGlob, normaliser } from './texte'
import { sansBloques } from './blocage.server'
import { avecEtatSuivi } from '@/lib/suivi/suivis.server'
import { classerSuggestions, profilDepuisLigne, type CandidatPourScore, type ProfilPourScore } from './suggestions'

export const PAGE_SIZE = 12
/** Plafond de résultats consultables par recherche : freine la collecte en masse (règles de visibilité v2). */
export const MAX_RESULTS = 96
/** Candidats lus pour le tri « pertinence » (borne la mémoire et le temps de calcul). */
export const MAX_CANDIDATS = 400

export { parseFilters, filtersToQuery, triParDefaut, type AnnuaireFilters, type Tri } from './filtres'

/** Motif GLOB insensible à la casse et aux accents (voir `motifGlob`) appliqué directement à la colonne. */
const contient = (expr: SQL, terme: string) => sql`${expr} GLOB ${motifGlob(terme)}`

/** Texte interrogé par la recherche : nom, organisation, spécialité, ville, thématiques. */
const meules = sql`coalesce(${users.prenom}, '') || ' ' || coalesce(${users.nom}, '') || ' ' || coalesce(${users.organisation}, '') || ' ' || coalesce(${users.specialite}, '') || ' ' || coalesce(${users.ville}, '') || ' ' || coalesce(${users.secteurs_expertise}, '')`

function buildWhere(viewerId: string, f: AnnuaireFilters) {
  const conditions: Array<SQL | undefined> = [
    // Visible dans l'annuaire (les comptes anciens sans valeur sont considérés visibles) et jamais soi-même.
    or(eq(users.annuaire_visible, true), isNull(users.annuaire_visible)),
    sql`${users.id} <> ${viewerId}`,
    sql`trim(coalesce(${users.prenom}, '') || ' ' || coalesce(${users.nom}, '')) <> ''`,
    // Blocage (dans un sens ou dans l'autre) : invisible dans l'annuaire et les suggestions.
    sansBloques(viewerId, users.id),
  ]
  // Chaque mot saisi doit se retrouver (ET) ; 5 mots au plus.
  for (const mot of normaliser(f.q).split(' ').filter(Boolean).slice(0, 5)) conditions.push(contient(meules, mot))
  if (f.pays === PAYS_AUTRE) conditions.push(notInArray(users.pays, [...PAYS]))
  else if (f.pays) conditions.push(eq(users.pays, f.pays))
  if (f.categorie) conditions.push(eq(users.categorie, f.categorie))
  if (f.theme) conditions.push(contient(sql`coalesce(${users.secteurs_expertise}, '') || ' ' || coalesce(${users.specialite}, '')`, f.theme))
  if (f.langue) conditions.push(contient(sql`coalesce(${users.langues}, '')`, f.langue))
  return and(...conditions)
}

export interface AnnuairePage {
  members: MemberSummary[]
  /** Nombre total de membres correspondants. */
  total: number
  /** Nombre de résultats réellement consultables (plafonné). */
  reachable: number
  page: number
  pageCount: number
  /** Tri « pertinence » : la liste des candidats a été tronquée à `MAX_CANDIDATS`. */
  tronque?: boolean
}

/** Profil du membre connecté, tel que lu par l'algorithme de suggestions (une requête, colonnes utiles seulement). */
export async function fetchMonProfil(viewerId: string): Promise<ProfilPourScore | null> {
  const [row] = await db
    .select({
      specialite: users.specialite,
      secteurs_expertise: users.secteurs_expertise,
      langues: users.langues,
      pays: users.pays,
      ville: users.ville,
      categorie: users.categorie,
    })
    .from(users)
    .where(eq(users.id, viewerId))
    .limit(1)
  return row ? profilDepuisLigne(row) : null
}

export const SELECT_CARTE = {
  id: users.id,
  prenom: users.prenom,
  nom: users.nom,
  photo_url: users.photo_url,
  specialite: users.specialite,
  organisation: users.organisation,
  pays: users.pays,
  ville: users.ville,
  categorie: users.categorie,
  est_organisation: users.est_organisation,
  type_organisation: users.type_organisation,
  secteurs_expertise: users.secteurs_expertise,
  ouvert_contact: users.ouvert_contact,
}

export type LigneCarte = {
  id: string
  prenom: string | null
  nom: string | null
  photo_url: string | null
  specialite: string | null
  organisation: string | null
  pays: string | null
  ville: string | null
  categorie: string | null
  est_organisation: boolean | null
  type_organisation: string | null
  secteurs_expertise: string | null
  ouvert_contact: boolean | null
}

export const carte = (r: LigneCarte, state: ConnectionState, connectionId: string | null): MemberSummary => ({
  id: r.id,
  prenom: r.prenom,
  nom: r.nom,
  photo_url: r.photo_url,
  specialite: r.specialite,
  organisation: r.organisation,
  pays: r.pays,
  ville: r.ville,
  categorie: r.categorie,
  est_organisation: r.est_organisation,
  type_organisation: r.type_organisation,
  thematiques: parseList(r.secteurs_expertise),
  ouvert_contact: r.ouvert_contact,
  state,
  connectionId: state === 'none' ? null : connectionId,
})

/**
 * Page de résultats de l'annuaire pour un membre connecté (jamais d'e-mail ni de téléphone).
 * Tri « recents » ou « nom » : trois requêtes (total, page de profils, état des connexions avec cette page).
 * Tri « pertinence » : deux ou trois requêtes, voir `fetchPertinence`.
 */
export async function fetchAnnuaire(
  viewerId: string,
  f: AnnuaireFilters,
  moi: ProfilPourScore | null,
): Promise<AnnuairePage> {
  if (f.tri === 'pertinence' && moi) return fetchPertinence(viewerId, f, moi)

  const where = buildWhere(viewerId, f)

  const [{ total }] = await db.select({ total: countFn() }).from(users).where(where)
  const reachable = Math.min(total, MAX_RESULTS)
  const pageCount = Math.max(1, Math.ceil(reachable / PAGE_SIZE))
  const page = Math.min(f.page, pageCount)

  if (total === 0) return { members: [], total: 0, reachable: 0, page: 1, pageCount: 1 }

  const order =
    f.tri === 'nom'
      ? [asc(sql`lower(coalesce(${users.nom}, ''))`), asc(sql`lower(coalesce(${users.prenom}, ''))`), asc(users.id)]
      : [desc(users.created_at), asc(users.id)]

  const rows = await db
    .select(SELECT_CARTE)
    .from(users)
    .where(where)
    .orderBy(...order)
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE)

  const ids = rows.map((r) => r.id)
  const links = ids.length
    ? await db
        .select({
          id: user_connections.id,
          requester_id: user_connections.requester_id,
          receiver_id: user_connections.receiver_id,
          status: user_connections.status,
        })
        .from(user_connections)
        .where(
          or(
            and(eq(user_connections.requester_id, viewerId), inArray(user_connections.receiver_id, ids)),
            and(eq(user_connections.receiver_id, viewerId), inArray(user_connections.requester_id, ids)),
          ),
        )
    : []

  const membresBruts = rows.map((r) => {
    const link = links.find((l) => l.requester_id === r.id || l.receiver_id === r.id)
    let state: ConnectionState = 'none'
    if (link?.status === 'accepted') state = 'accepted'
    else if (link?.status === 'pending') state = link.requester_id === viewerId ? 'pending_sent' : 'pending_received'
    // Invitation refusée : l'invitant la voit toujours « en attente » ; celui qui a refusé peut inviter à son tour.
    else if (link?.status === 'rejected' && link.requester_id === viewerId) state = 'pending_sent'
    return carte(r, state, link?.id ?? null)
  })
  const members = await avecEtatSuivi(viewerId, membresBruts)

  return { members, total, reachable, page, pageCount }
}

/**
 * Tri « pertinence » : suggestions (seuil atteint) puis « nouveaux membres », calculés côté serveur.
 * Ne propose jamais soi-même, une relation, une invitation en cours ni un profil masqué.
 * Requêtes : (1) mes relations acceptées, (2) candidats filtrés (≤ MAX_CANDIDATS, colonnes minimales),
 * (3) relations acceptées des miens, pour compter les relations en commun (omise si je n'en ai pas).
 * Le profil du membre (requête 0) est lu par la page, car il décide aussi du tri par défaut : 4 requêtes au plus.
 */
async function fetchPertinence(viewerId: string, f: AnnuaireFilters, moi: ProfilPourScore): Promise<AnnuairePage> {
  const mesLiens = await db
    .select({ requester_id: user_connections.requester_id, receiver_id: user_connections.receiver_id })
    .from(user_connections)
    .where(and(eq(user_connections.status, 'accepted'), or(eq(user_connections.requester_id, viewerId), eq(user_connections.receiver_id, viewerId))))
    .limit(2000)
  const mesRelations = new Set(mesLiens.map((l) => (l.requester_id === viewerId ? l.receiver_id : l.requester_id)))

  // Exclus quel que soit le statut : relations, invitations envoyées et reçues (sous-requête : aucun paramètre par identifiant).
  const dejaEnLien = sql`${users.id} NOT IN (
    SELECT receiver_id FROM user_connections WHERE requester_id = ${viewerId}
    UNION SELECT requester_id FROM user_connections WHERE receiver_id = ${viewerId}
  )`

  const rows = await db
    .select({
      ...SELECT_CARTE,
      langues: users.langues,
      created_at: users.created_at,
      profilRenseigne: sql<number>`(coalesce(trim(${users.photo_url}), '') <> '' AND coalesce(trim(${users.biographie}), '') <> '')`,
    })
    .from(users)
    .where(and(buildWhere(viewerId, f), dejaEnLien))
    .orderBy(desc(users.created_at), asc(users.id))
    .limit(MAX_CANDIDATS)

  // Relations en commun : relations acceptées de mes relations, comptées par membre.
  const communs = new Map<string, number>()
  if (mesRelations.size > 0 && rows.length > 0) {
    const mesPairs = sql`(SELECT CASE WHEN requester_id = ${viewerId} THEN receiver_id ELSE requester_id END FROM user_connections
      WHERE status = 'accepted' AND (requester_id = ${viewerId} OR receiver_id = ${viewerId}))`
    const autres = await db
      .select({ requester_id: user_connections.requester_id, receiver_id: user_connections.receiver_id })
      .from(user_connections)
      .where(
        and(
          eq(user_connections.status, 'accepted'),
          sql`(${user_connections.requester_id} IN ${mesPairs} OR ${user_connections.receiver_id} IN ${mesPairs})`,
        ),
      )
      .limit(5000)
    for (const l of autres) {
      const aMoi = mesRelations.has(l.requester_id)
      const bMoi = mesRelations.has(l.receiver_id)
      if (aMoi === bMoi) continue // les deux sont mes relations (ou aucune) : sans objet
      const candidat = aMoi ? l.receiver_id : l.requester_id
      communs.set(candidat, (communs.get(candidat) ?? 0) + 1)
    }
  }

  const candidats = rows.map((r) => ({
    ...profilDepuisLigne(r),
    langues: lireLangues(r.langues).toutes,
    id: r.id,
    profilRenseigne: Boolean(r.profilRenseigne),
    created_at: r.created_at,
    ligne: r as LigneCarte,
  })) satisfies Array<CandidatPourScore & { ligne: LigneCarte }>

  const { suggeres, nouveaux } = classerSuggestions(moi, candidats, communs)
  const tous = [...suggeres, ...nouveaux]

  const total = tous.length
  const reachable = Math.min(total, MAX_RESULTS)
  const pageCount = Math.max(1, Math.ceil(reachable / PAGE_SIZE))
  const page = Math.min(f.page, pageCount)
  const members = await avecEtatSuivi(viewerId, tous.slice((page - 1) * PAGE_SIZE, Math.min(page * PAGE_SIZE, reachable)).map((n) => ({
    ...carte(n.membre.ligne, 'none', null),
    raisons: n.raisons,
    suggere: n.suggere,
  })))

  return { members, total, reachable, page, pageCount, tronque: rows.length >= MAX_CANDIDATS }
}
