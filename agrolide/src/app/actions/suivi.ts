'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { suivis_organisations, users } from '@/db/schema'
import { auth } from '@/lib/auth/server'
import { existeBlocage } from '@/lib/reseau/blocage.server'
import { estOrganisation } from '@/lib/suivi/organisation'

type Resultat = { success: true } | { error: string }

async function organisationSuivable(userId: string, organisationId: string): Promise<string | null> {
  if (organisationId === userId) return 'Vous ne pouvez pas vous suivre vous-même.'
  const org = await db.query.users.findFirst({ columns: { id: true, categorie: true, annuaire_visible: true }, where: eq(users.id, organisationId) })
  if (!org || org.annuaire_visible === false || !estOrganisation(org.id, org.categorie)) return 'Cette organisation est introuvable.'
  if (await existeBlocage(userId, organisationId)) return 'Cette organisation est introuvable.'
  return null
}

/** Suivre une organisation : idempotent (un second clic ne crée pas de doublon et ne change pas le réglage des alertes). */
export async function suivreOrganisation(organisationId: string): Promise<Resultat> {
  const { userId } = await auth()
  if (!userId) return { error: 'Non autorisé' }
  const refus = await organisationSuivable(userId, organisationId)
  if (refus) return { error: refus }
  await db.insert(suivis_organisations).values({ suiveur_id: userId, organisation_id: organisationId, notifier: true }).onConflictDoNothing()
  revalidatePath('/membres', 'layout')
  return { success: true }
}

export async function nePlusSuivreOrganisation(organisationId: string): Promise<Resultat> {
  const { userId } = await auth()
  if (!userId) return { error: 'Non autorisé' }
  await db.delete(suivis_organisations).where(and(eq(suivis_organisations.suiveur_id, userId), eq(suivis_organisations.organisation_id, organisationId)))
  revalidatePath('/membres', 'layout')
  return { success: true }
}

/** Garde l'abonnement mais coupe (ou rétablit) les alertes de cette organisation. */
export async function reglerAlertesOrganisation(organisationId: string, actives: boolean): Promise<Resultat> {
  const { userId } = await auth()
  if (!userId) return { error: 'Non autorisé' }
  await db
    .update(suivis_organisations)
    .set({ notifier: !!actives })
    .where(and(eq(suivis_organisations.suiveur_id, userId), eq(suivis_organisations.organisation_id, organisationId)))
  revalidatePath('/membres', 'layout')
  return { success: true }
}
