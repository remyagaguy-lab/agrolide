import 'server-only'
import { and, desc, eq, inArray, isNull, or } from 'drizzle-orm'
import { db } from '@/db'
import { suivis_organisations, user_connections, users } from '@/db/schema'
import { type ConnectionState, type MemberSummary } from './profil'
import { carte, SELECT_CARTE, type LigneCarte } from './annuaire'
import { normaliser } from './texte'

/** Nombre maximal de lignes lues par liste (invitations, relations) : borne la mémoire et le temps de calcul. */
const LIMITE = 500

export type LigneReseau = MemberSummary & {
  /** Date de l'invitation ou de la mise en relation (ISO), pour le tri « récentes ». */
  depuis: string | null
}

type Lien = { connectionId: string; depuis: string | null; message: string | null }

/**
 * Lit l'autre membre de chaque ligne `user_connections` : une jointure par sens (je suis l'invitant / l'invité).
 * Colonnes de carte uniquement : jamais d'e-mail ni de téléphone. Aucun paramètre par identifiant (limite des requêtes D1).
 */
async function lire(viewerId: string, status: 'pending' | 'accepted', sens: 'envoyees' | 'recues'): Promise<Array<Lien & { ligne: LigneCarte }>> {
  const jointure = sens === 'envoyees' ? user_connections.receiver_id : user_connections.requester_id
  const moi = sens === 'envoyees' ? user_connections.requester_id : user_connections.receiver_id
  const statuts = status === 'accepted' ? ['accepted'] : sens === 'envoyees' ? ['pending', 'rejected'] : ['pending']
  const rows = await db
    .select({ connectionId: user_connections.id, depuis: user_connections.created_at, message: user_connections.message, ...SELECT_CARTE })
    .from(user_connections)
    .innerJoin(users, eq(users.id, jointure))
    .where(
      and(
        eq(moi, viewerId),
        inArray(user_connections.status, statuts),
        // Un membre qui a masqué son profil disparaît de mes invitations (pas de mes relations déjà établies).
        status === 'pending' ? or(eq(users.annuaire_visible, true), isNull(users.annuaire_visible)) : undefined,
      ),
    )
    .orderBy(desc(user_connections.created_at))
    .limit(LIMITE)
  return rows.map(({ connectionId, depuis, message, ...ligne }) => ({ connectionId, depuis, message, ligne }))
}

const versLigne = (r: Awaited<ReturnType<typeof lire>>[number], state: ConnectionState): LigneReseau => ({
  ...carte(r.ligne, state, r.connectionId),
  // La note n'est montrée qu'à celui qui reçoit l'invitation.
  note: state === 'pending_received' ? r.message : null,
  depuis: r.depuis,
})

/** Compteurs des onglets et listes d'invitations. 2 requêtes. */
export async function fetchInvitations(viewerId: string) {
  const [recues, envoyees] = await Promise.all([lire(viewerId, 'pending', 'recues'), lire(viewerId, 'pending', 'envoyees')])
  return {
    recues: recues.map((r) => versLigne(r, 'pending_received')),
    envoyees: envoyees.map((r) => versLigne(r, 'pending_sent')),
  }
}

/** Organisations que je suis (Partenaires, compte agrolide), les plus récemment suivies d'abord. Seules mes propres lignes sont lues. */
export async function fetchOrganisationsSuivies(viewerId: string): Promise<MemberSummary[]> {
  const rows = await db
    .select({ notifier: suivis_organisations.notifier, ...SELECT_CARTE })
    .from(suivis_organisations)
    .innerJoin(users, eq(users.id, suivis_organisations.organisation_id))
    .where(eq(suivis_organisations.suiveur_id, viewerId))
    .orderBy(desc(suivis_organisations.created_at))
    .limit(LIMITE)
  return rows.map(({ notifier, ...ligne }) => ({ ...carte(ligne, 'none', null), suivi: true, alertes: notifier }))
}

export type TriRelations = 'recentes' | 'nom'

/** Relations acceptées (dans les deux sens), filtrées par recherche (sans accents) et triées. 2 requêtes. */
export async function fetchRelations(viewerId: string, q: string, tri: TriRelations): Promise<{ relations: LigneReseau[]; total: number }> {
  const [a, b] = await Promise.all([lire(viewerId, 'accepted', 'envoyees'), lire(viewerId, 'accepted', 'recues')])
  const toutes = [...a, ...b].map((r) => versLigne(r, 'accepted'))
  const mots = normaliser(q).split(' ').filter(Boolean).slice(0, 5)
  const filtrees = mots.length
    ? toutes.filter((m) => {
        const meule = normaliser([m.prenom, m.nom, m.organisation, m.specialite, m.ville, m.pays, ...m.thematiques].filter(Boolean).join(' '))
        return mots.every((mot) => meule.includes(mot))
      })
    : toutes
  if (tri === 'nom') {
    filtrees.sort((x, y) => (x.nom ?? '').localeCompare(y.nom ?? '', 'fr') || (x.prenom ?? '').localeCompare(y.prenom ?? '', 'fr'))
  } else {
    filtrees.sort((x, y) => (y.depuis ?? '').localeCompare(x.depuis ?? ''))
  }
  return { relations: filtrees, total: toutes.length }
}
