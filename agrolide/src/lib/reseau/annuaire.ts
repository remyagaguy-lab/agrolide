import 'server-only'
import { and, asc, count as countFn, desc, eq, inArray, isNull, notInArray, or, sql, type AnyColumn } from 'drizzle-orm'
import { db } from '@/db'
import { user_connections, users } from '@/db/schema'
import { PAYS, PAYS_AUTRE, parseList, type ConnectionState, type MemberSummary } from './profil'
import type { AnnuaireFilters } from './filtres'

export const PAGE_SIZE = 12
/** Plafond de résultats consultables par recherche : freine la collecte en masse (règles de visibilité v2). */
export const MAX_RESULTS = 96

export { parseFilters, filtersToQuery, type AnnuaireFilters, type Tri } from './filtres'

const likeAny = (pattern: string, ...cols: AnyColumn[]) => {
  // `\` protège % et _ saisis par l'utilisateur.
  const safe = `%${pattern.replace(/[\\%_]/g, (c) => `\\${c}`)}%`
  return or(...cols.map((c) => sql`${c} LIKE ${safe} ESCAPE '\\'`))
}

function buildWhere(viewerId: string, f: AnnuaireFilters) {
  const conditions = [
    // Visible dans l'annuaire (les comptes anciens sans valeur sont considérés visibles) et jamais soi-même.
    or(eq(users.annuaire_visible, true), isNull(users.annuaire_visible)),
    sql`${users.id} <> ${viewerId}`,
    sql`trim(coalesce(${users.prenom}, '') || ' ' || coalesce(${users.nom}, '')) <> ''`,
  ]
  if (f.q) {
    conditions.push(
      likeAny(f.q, users.prenom, users.nom, users.organisation, users.specialite, users.ville, users.secteurs_expertise),
    )
  }
  if (f.pays === PAYS_AUTRE) conditions.push(notInArray(users.pays, [...PAYS]))
  else if (f.pays) conditions.push(eq(users.pays, f.pays))
  if (f.categorie) conditions.push(eq(users.categorie, f.categorie))
  if (f.theme) conditions.push(likeAny(f.theme, users.secteurs_expertise, users.specialite))
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
}

/**
 * Page de résultats de l'annuaire pour un membre connecté.
 * Trois requêtes : total, page de profils (colonnes minimales, jamais d'e-mail), état des connexions avec cette page.
 */
export async function fetchAnnuaire(viewerId: string, f: AnnuaireFilters): Promise<AnnuairePage> {
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
      secteurs_expertise: users.secteurs_expertise,
      ouvert_contact: users.ouvert_contact,
    })
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

  const members: MemberSummary[] = rows.map((r) => {
    const link = links.find((l) => l.requester_id === r.id || l.receiver_id === r.id)
    let state: ConnectionState = 'none'
    if (link?.status === 'accepted') state = 'accepted'
    else if (link?.status === 'pending') state = link.requester_id === viewerId ? 'pending_sent' : 'pending_received'
    return {
      id: r.id,
      prenom: r.prenom,
      nom: r.nom,
      photo_url: r.photo_url,
      specialite: r.specialite,
      organisation: r.organisation,
      pays: r.pays,
      ville: r.ville,
      categorie: r.categorie,
      thematiques: parseList(r.secteurs_expertise),
      ouvert_contact: r.ouvert_contact,
      state,
      connectionId: state === 'none' ? null : (link?.id ?? null),
    }
  })

  return { members, total, reachable, page, pageCount }
}
