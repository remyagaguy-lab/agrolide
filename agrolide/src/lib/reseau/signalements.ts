import { aliasedTable, count, desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { signalements, users } from '@/db/schema'
import { auth, currentUser, isBootstrapAdminEmail } from '@/lib/auth/server'

/** Suivi d'un signalement par l'administration : nouveau → en cours → traité. */
export const STATUTS_SIGNALEMENT = [
  { value: 'nouveau', label: 'Nouveaux' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'traite', label: 'Traités' },
] as const

export type StatutSignalement = (typeof STATUTS_SIGNALEMENT)[number]['value']

export const estStatutSignalement = (v: unknown): v is StatutSignalement =>
  STATUTS_SIGNALEMENT.some((s) => s.value === v)

/**
 * Même règle d'accès que l'espace `/admin` (layout) : rôle `admin_content` ou `super_admin`,
 * ou adresse d'administrateur de secours. Renvoie l'identifiant de l'administrateur, sinon `null`.
 */
export async function adminCourant(): Promise<string | null> {
  const { userId } = await auth()
  if (!userId) return null
  const [row] = await db.select({ role: users.role_plateforme }).from(users).where(eq(users.id, userId)).limit(1)
  if (row && ['admin_content', 'super_admin'].includes(row.role ?? '')) return userId
  const moi = await currentUser()
  return isBootstrapAdminEmail(moi?.emailAddresses?.[0]?.emailAddress) ? userId : null
}

export interface LigneSignalement {
  id: string
  motif: string
  statut: string
  created_at: string
  signaleurId: string
  signaleurNom: string
  signaleId: string
  signaleNom: string
  /** Nombre total de signalements reçus par la personne signalée (tous statuts). */
  totalSignale: number
}

const nomDe = (p: string | null, n: string | null) => `${p ?? ''} ${n ?? ''}`.trim() || 'Membre sans nom'

/** Les signalements d'un statut (100 au plus, les plus récents d'abord) ; jamais d'e-mail ni de téléphone. */
export async function fetchSignalements(statut: StatutSignalement): Promise<LigneSignalement[]> {
  const signaleur = aliasedTable(users, 'signaleur')
  const signale = aliasedTable(users, 'signale')
  const rows = await db
    .select({
      id: signalements.id,
      motif: signalements.motif,
      statut: signalements.statut,
      created_at: signalements.created_at,
      signaleurId: signalements.signaleur_id,
      signaleurPrenom: signaleur.prenom,
      signaleurNom: signaleur.nom,
      signaleId: signalements.signale_id,
      signalePrenom: signale.prenom,
      signaleNom: signale.nom,
    })
    .from(signalements)
    .leftJoin(signaleur, eq(signaleur.id, signalements.signaleur_id))
    .leftJoin(signale, eq(signale.id, signalements.signale_id))
    .where(eq(signalements.statut, statut))
    .orderBy(desc(signalements.created_at))
    .limit(100)

  const totaux = await db
    .select({ id: signalements.signale_id, total: count() })
    .from(signalements)
    .groupBy(signalements.signale_id)
  const parPersonne = new Map(totaux.map((t) => [t.id, Number(t.total)]))

  return rows.map((r) => ({
    id: r.id,
    motif: r.motif,
    statut: r.statut,
    created_at: r.created_at,
    signaleurId: r.signaleurId,
    signaleurNom: nomDe(r.signaleurPrenom, r.signaleurNom),
    signaleId: r.signaleId,
    signaleNom: nomDe(r.signalePrenom, r.signaleNom),
    totalSignale: parPersonne.get(r.signaleId) ?? 1,
  }))
}

/** Nombre de signalements par statut, pour les onglets. */
export async function compterSignalements(): Promise<Record<StatutSignalement, number>> {
  const rows = await db.select({ statut: signalements.statut, total: count() }).from(signalements).groupBy(signalements.statut)
  const out: Record<StatutSignalement, number> = { nouveau: 0, en_cours: 0, traite: 0 }
  for (const r of rows) if (estStatutSignalement(r.statut)) out[r.statut] = Number(r.total)
  return out
}
