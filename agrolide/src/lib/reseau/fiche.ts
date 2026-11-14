import 'server-only'
import { and, desc, eq, inArray, isNull, or, sql } from 'drizzle-orm'
import { db } from '@/db'
import { documents, user_connections, users } from '@/db/schema'
import { lireLangues, parseList, type ConnectionState, type MemberSummary } from './profil'
import { carte, fetchMonProfil, SELECT_CARTE, type LigneCarte } from './annuaire'
import { existeBlocage, sansBloques } from './blocage.server'
import { aDesPointsCommuns, pointsCommuns, type PointsCommuns } from './en-commun'
import { classerSuggestions, profilDepuisLigne, profilSuffisant, type CandidatPourScore, type ProfilPourScore } from './suggestions'

/** Profils proches affichés sur une fiche (peu nombreux : la fiche n'est pas un moyen de parcourir l'annuaire). */
const NB_PROCHES = 3
/** Candidats lus pour chercher des profils proches. */
const MAX_CANDIDATS_PROCHES = 200
/** Noms de relations en commun affichés (le total est toujours donné). */
const NB_NOMS_COMMUNS = 5
const MAX_LIENS = 2000

export interface FicheMembre {
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
  biographie: string | null
  thematiques: string[]
  centres_interet: string[]
  /** Toutes les langues parlées, la maternelle comprise (pour comparer deux membres). */
  langues: string[]
  langue_maternelle: string
  linkedin_url: string | null
  site_web_url: string | null
  ouvert_contact: boolean | null
}

export interface RelationCommune {
  id: string
  prenom: string | null
  nom: string | null
  photo_url: string | null
}

export interface Fiche {
  membre: FicheMembre
  estMoi: boolean
  state: ConnectionState
  connectionId: string | null
  /** Note jointe à l'invitation que ce membre m'a envoyée (seulement si elle est en attente de ma réponse). */
  noteInvitation: string | null
  documents: Array<{ id: string; titre: string; type_doc: string | null }>
  /** `null` pour sa propre fiche, ou si mon profil n'existe pas. */
  communs: PointsCommuns | null
  relationsCommunes: { total: number; noms: RelationCommune[] }
  proches: MemberSummary[]
}

/** Même lecture de l'état d'une ligne `user_connections` que l'annuaire : un refus reste « en attente » pour l'invitant. */
function etat(
  link: { requester_id: string; status: string } | undefined,
  viewerId: string,
): ConnectionState {
  if (!link) return 'none'
  if (link.status === 'accepted') return 'accepted'
  if (link.status === 'pending') return link.requester_id === viewerId ? 'pending_sent' : 'pending_received'
  if (link.status === 'rejected' && link.requester_id === viewerId) return 'pending_sent'
  return 'none'
}

const voisins = (rows: Array<{ requester_id: string; receiver_id: string }>, id: string) =>
  new Set(rows.map((l) => (l.requester_id === id ? l.receiver_id : l.requester_id)))

async function relationsAcceptees(id: string) {
  return db
    .select({ requester_id: user_connections.requester_id, receiver_id: user_connections.receiver_id })
    .from(user_connections)
    .where(and(eq(user_connections.status, 'accepted'), or(eq(user_connections.requester_id, id), eq(user_connections.receiver_id, id))))
    .limit(MAX_LIENS)
}

/**
 * Fiche d'un membre pour un membre connecté. Retourne `null` si le profil n'existe pas ou s'il est masqué
 * (sauf pour son propriétaire). Colonnes nommées une à une : jamais d'e-mail ni de téléphone.
 * Requêtes : profil, mon profil, lien entre nous, relations (les miennes et les siennes), noms des relations
 * en commun, contributions, candidats proches, état de connexion des profils proches (≤ 9).
 */
export async function fetchFiche(viewerId: string, id: string): Promise<Fiche | null> {
  const [row] = await db
    .select({
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
      biographie: users.biographie,
      secteurs_expertise: users.secteurs_expertise,
      centres_interet: users.centres_interet,
      langues: users.langues,
      linkedin_url: users.linkedin_url,
      site_web_url: users.site_web_url,
      ouvert_contact: users.ouvert_contact,
      annuaire_visible: users.annuaire_visible,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  if (!row) return null
  const estMoi = viewerId === id
  // Un membre qui a quitté l'annuaire n'est consultable que par lui-même.
  if (row.annuaire_visible === false && !estMoi) return null
  // Blocage dans un sens ou dans l'autre : 404, comme un profil masqué (on ne révèle pas qu'on est bloqué).
  if (!estMoi && (await existeBlocage(viewerId, id))) return null

  const membre: FicheMembre = {
    id: row.id,
    prenom: row.prenom,
    nom: row.nom,
    photo_url: row.photo_url,
    specialite: row.specialite,
    organisation: row.organisation,
    pays: row.pays,
    ville: row.ville,
    categorie: row.categorie,
    est_organisation: row.est_organisation,
    type_organisation: row.type_organisation,
    biographie: row.biographie,
    thematiques: parseList(row.secteurs_expertise),
    centres_interet: parseList(row.centres_interet),
    langues: lireLangues(row.langues).toutes,
    langue_maternelle: lireLangues(row.langues).maternelle,
    linkedin_url: row.linkedin_url,
    site_web_url: row.site_web_url,
    ouvert_contact: row.ouvert_contact,
  }
  const profilMembre: ProfilPourScore = profilDepuisLigne(row)

  const docs = await db
    .select({ id: documents.id, titre: documents.titre, type_doc: documents.type_doc })
    .from(documents)
    .where(and(eq(documents.depose_par, id), eq(documents.statut, 'publie')))
    .orderBy(desc(documents.created_at))
    .limit(5)

  const vide: Fiche = {
    membre,
    estMoi,
    state: 'none',
    connectionId: null,
    documents: docs,
    communs: null,
    relationsCommunes: { total: 0, noms: [] },
    proches: [],
    noteInvitation: null,
  }
  if (estMoi) return vide

  const [moi, lien, mesLiens, sesLiens] = await Promise.all([
    fetchMonProfil(viewerId),
    db
      .select({ id: user_connections.id, requester_id: user_connections.requester_id, status: user_connections.status, message: user_connections.message })
      .from(user_connections)
      .where(
        or(
          and(eq(user_connections.requester_id, viewerId), eq(user_connections.receiver_id, id)),
          and(eq(user_connections.requester_id, id), eq(user_connections.receiver_id, viewerId)),
        ),
      )
      .limit(1)
      .then((r) => r[0]),
    relationsAcceptees(viewerId),
    relationsAcceptees(id),
  ])

  const state = etat(lien, viewerId)
  const connectionId = state === 'none' ? null : (lien?.id ?? null)

  // Relations en commun : intersection de deux ensembles d'identifiants calculée côté serveur ; seuls les noms
  // (jamais d'e-mail ni de téléphone) des premières sont lus.
  const miens = voisins(mesLiens, viewerId)
  const siens = voisins(sesLiens, id)
  const communsIds = [...miens].filter((x) => siens.has(x) && x !== viewerId && x !== id)
  const noms = communsIds.length
    ? await db
        .select({ id: users.id, prenom: users.prenom, nom: users.nom, photo_url: users.photo_url })
        .from(users)
        .where(inArray(users.id, communsIds.slice(0, NB_NOMS_COMMUNS)))
    : []

  const communs = moi ? pointsCommuns(moi, profilMembre) : null

  // Profils proches de ce membre (et non de moi) : même algorithme que les suggestions, appliqué à son profil.
  const proches = profilSuffisant(profilMembre) ? await profilsProches(viewerId, id, profilMembre) : []

  return {
    ...vide,
    state,
    connectionId,
    noteInvitation: state === 'pending_received' ? (lien?.message ?? null) : null,
    communs: communs && aDesPointsCommuns(communs) ? communs : null,
    relationsCommunes: { total: communsIds.length, noms },
    proches,
  }
}

async function profilsProches(viewerId: string, cibleId: string, profil: ProfilPourScore): Promise<MemberSummary[]> {
  const rows = await db
    .select({
      ...SELECT_CARTE,
      langues: users.langues,
      created_at: users.created_at,
      profilRenseigne: sql<number>`(coalesce(trim(${users.photo_url}), '') <> '' AND coalesce(trim(${users.biographie}), '') <> '')`,
    })
    .from(users)
    .where(
      and(
        or(eq(users.annuaire_visible, true), isNull(users.annuaire_visible)),
        sql`${users.id} <> ${viewerId}`,
        sql`${users.id} <> ${cibleId}`,
        sansBloques(viewerId, users.id),
        sql`trim(coalesce(${users.prenom}, '') || ' ' || coalesce(${users.nom}, '')) <> ''`,
      ),
    )
    .orderBy(desc(users.created_at))
    .limit(MAX_CANDIDATS_PROCHES)

  const candidats = rows.map((r) => ({
    ...profilDepuisLigne(r),
    langues: lireLangues(r.langues).toutes,
    id: r.id,
    profilRenseigne: Boolean(r.profilRenseigne),
    created_at: r.created_at,
    ligne: r as LigneCarte,
  })) satisfies Array<CandidatPourScore & { ligne: LigneCarte }>

  const choisis = classerSuggestions(profil, candidats).suggeres.slice(0, NB_PROCHES)
  if (choisis.length === 0) return []

  const ids = choisis.map((n) => n.membre.id)
  const liens = await db
    .select({ id: user_connections.id, requester_id: user_connections.requester_id, receiver_id: user_connections.receiver_id, status: user_connections.status })
    .from(user_connections)
    .where(
      or(
        and(eq(user_connections.requester_id, viewerId), inArray(user_connections.receiver_id, ids)),
        and(eq(user_connections.receiver_id, viewerId), inArray(user_connections.requester_id, ids)),
      ),
    )

  return choisis.map((n) => {
    const lien = liens.find((l) => l.requester_id === n.membre.id || l.receiver_id === n.membre.id)
    const state = etat(lien, viewerId)
    return { ...carte(n.membre.ligne, state, lien?.id ?? null), raisons: n.raisons, suggere: true }
  })
}
