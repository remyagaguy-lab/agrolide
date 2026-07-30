'use server'

import { auth } from '@/auth'
import { db } from '@/db'
import { forum_categories, forum_fils, forum_messages, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
  const session = await auth()
  const user = session?.user

  if (!user || !user.id) throw new Error("Non autorisé")

  const profile = await db.query.users.findFirst({
    columns: { role_plateforme: true },
    where: eq(users.id, user.id)
  })

  if (!profile || (profile.role_plateforme !== 'admin' && profile.role_plateforme !== 'super_admin')) {
    throw new Error("Privilèges insuffisants")
  }

  return { user }
}

// Catégories
export async function createCategory(data: { nom: string, description: string, icone: string, ordre: number }) {
  await checkAdmin()
  await db.insert(forum_categories).values(data)
  revalidatePath('/admin/forum')
}

export async function updateCategory(id: string, data: { nom: string, description: string, icone: string, ordre: number }) {
  await checkAdmin()
  await db.update(forum_categories).set(data).where(eq(forum_categories.id, id))
  revalidatePath('/admin/forum')
}

export async function deleteCategory(id: string) {
  await checkAdmin()
  // Ensure no threads are linked, or cascade depending on DB settings.
  // We'll just attempt to delete.
  await db.delete(forum_categories).where(eq(forum_categories.id, id))
  revalidatePath('/admin/forum')
}

// Fils
export async function deleteThread(id: string) {
  await checkAdmin()
  // Delete all messages first if no cascade
  await db.delete(forum_messages).where(eq(forum_messages.fil_id, id))
  await db.delete(forum_fils).where(eq(forum_fils.id, id))
  revalidatePath('/admin/forum')
}

export async function createAdminThread(categorie_id: string, titre: string, contenu: string) {
  const { user } = await checkAdmin()
  
  // Create thread
  const filId = crypto.randomUUID()
  await db.insert(forum_fils).values({
    id: filId,
    categorie_id,
    titre,
    auteur_id: user.id as string
  })

  // Create first message
  await db.insert(forum_messages).values({
    fil_id: filId,
    auteur_id: user.id as string,
    contenu,
    statut: 'publie'
  })

  revalidatePath('/admin/forum')
  return filId
}
