import 'server-only'
import { and, count, eq, inArray, sql } from 'drizzle-orm'
import { db } from '@/db'
import { suivis_organisations, users } from '@/db/schema'
import { AGROLIDE_ID, estOrganisation } from './organisation'

export interface EtatSuivi {
  suivi: boolean
  notifier: boolean
}

/** Le membre est-il en train de suivre ces organisations ? Renvoie une table id -> état (seuls les suivis existent). */
export async function suivisParMembre(suiveurId: string, organisationIds: string[]): Promise<Map<string, EtatSuivi>> {
  const ids = [...new Set(organisationIds)]
  const res = new Map<string, EtatSuivi>()
  if (!ids.length) return res
  const lignes = await db
    .select({ id: suivis_organisations.organisation_id, notifier: suivis_organisations.notifier })
    .from(suivis_organisations)
    .where(and(eq(suivis_organisations.suiveur_id, suiveurId), inArray(suivis_organisations.organisation_id, ids)))
  for (const l of lignes) res.set(l.id, { suivi: true, notifier: l.notifier })
  return res
}

/** Ajoute `suivi` / `alertes` aux cartes qui sont des organisations (les autres cartes sont renvoyées telles quelles). */
export async function avecEtatSuivi<T extends { id: string; categorie: string | null }>(
  suiveurId: string,
  membres: T[],
): Promise<Array<T & { suivi?: boolean; alertes?: boolean }>> {
  const orgs = membres.filter((m) => estOrganisation(m.id, m.categorie)).map((m) => m.id)
  if (!orgs.length) return membres
  const etats = await suivisParMembre(suiveurId, orgs)
  return membres.map((m) => {
    const e = etats.get(m.id)
    return estOrganisation(m.id, m.categorie) ? { ...m, suivi: !!e, alertes: e?.notifier ?? true } : m
  })
}

/** Abonne un membre à agrolide (à l'inscription). Idempotent, ne lève jamais d'erreur : l'inscription ne doit pas échouer pour cela. */
export async function suivreAgrolide(suiveurId: string): Promise<void> {
  if (suiveurId === AGROLIDE_ID) return
  try {
    await db.run(sql`
      INSERT OR IGNORE INTO suivis_organisations (id, suiveur_id, organisation_id, notifier, created_at)
      SELECT lower(hex(randomblob(16))), ${suiveurId}, ${AGROLIDE_ID}, 1, ${new Date().toISOString()}
      WHERE EXISTS (SELECT 1 FROM user WHERE id = ${AGROLIDE_ID})
        AND EXISTS (SELECT 1 FROM user WHERE id = ${suiveurId})
    `)
  } catch (e) {
    console.error('[suivi] abonnement automatique à agrolide impossible :', e)
  }
}

/** Liste et nombre des abonnés d'une organisation : réservé à l'organisation elle-même (le contrôle d'accès est fait par l'appelant). */
export async function abonnesDe(organisationId: string) {
  const lignes = await db
    .select({
      id: users.id,
      prenom: users.prenom,
      nom: users.nom,
      photo_url: users.photo_url,
      pays: users.pays,
      depuis: suivis_organisations.created_at,
      notifier: suivis_organisations.notifier,
    })
    .from(suivis_organisations)
    .innerJoin(users, eq(users.id, suivis_organisations.suiveur_id))
    .where(eq(suivis_organisations.organisation_id, organisationId))
    .orderBy(sql`${suivis_organisations.created_at} desc`)
    .limit(500)
  const [{ total }] = await db
    .select({ total: count() })
    .from(suivis_organisations)
    .where(eq(suivis_organisations.organisation_id, organisationId))
  return { total: Number(total), abonnes: lignes }
}
