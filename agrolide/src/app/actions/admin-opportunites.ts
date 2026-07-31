'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { opportunites, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
  const { userId: currentUserId } = await auth();
  const user = currentUserId ? { id: currentUserId } : null;
  const session = currentUserId ? { user: { id: currentUserId } } : null;

  if (!user || !currentUserId) throw new Error("Non autorisé")

  const profile = await db.query.users.findFirst({
    columns: { role_plateforme: true },
    where: eq(users.id, currentUserId)
  })

  if (!profile || (profile.role_plateforme !== 'admin' && profile.role_plateforme !== 'super_admin')) {
    throw new Error("Privilèges insuffisants")
  }
}

export async function validateOpportunity(id: string) {
  await checkAdmin()

  await db.update(opportunites).set({ statut: 'publie' }).where(eq(opportunites.id, id))

  revalidatePath('/admin/contenus/opportunites')
  revalidatePath('/opportunites')
  
  return { success: true }
}

export async function rejectOpportunity(id: string) {
  await checkAdmin()

  await db.update(opportunites).set({ statut: 'rejete' }).where(eq(opportunites.id, id))

  revalidatePath('/admin/contenus/opportunites')
  
  return { success: true }
}

export async function deleteOpportunityAdmin(id: string) {
  await checkAdmin()

  await db.delete(opportunites).where(eq(opportunites.id, id))

  revalidatePath('/admin/contenus/opportunites')
  revalidatePath('/opportunites')
  
  return { success: true }
}

export async function getAdminOpportunites() {
  await checkAdmin()
  const data = await db.query.opportunites.findMany({
    with: {
      auteur: { columns: { prenom: true, nom: true } }
    },
    orderBy: (opportunites, { desc }) => [desc(opportunites.created_at)]
  })
  return data
}
