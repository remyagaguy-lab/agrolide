'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { forum_messages, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function ignoreReport(messageId: string) {
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

  await db.update(forum_messages).set({
    statut: 'publie'
  }).where(eq(forum_messages.id, messageId))

  revalidatePath('/admin/forum')
  
  return { success: true }
}

export async function deleteMessage(messageId: string) {
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

  await db.update(forum_messages).set({
    statut: 'supprime'
  }).where(eq(forum_messages.id, messageId))

  revalidatePath('/admin/forum')
  
  return { success: true }
}

export async function banUser(userId: string, reason: string) {
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

  // Ban the user by updating their role to 'banni'
  await db.update(users).set({
    role_plateforme: 'banni'
  }).where(eq(users.id, userId))

  revalidatePath('/admin/forum')
  
  return { success: true }
}

export async function fetchReportedMessages() {
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

  const msgs = await db.query.forum_messages.findMany({
    where: eq(forum_messages.statut, 'en_revue'),
    with: {
      auteur: { columns: { prenom: true, nom: true } },
      fil: { columns: { id: true, titre: true } }
    },
    // Assuming you have an updated_at column or fall back to created_at
    orderBy: (forum_messages, { desc }) => [desc(forum_messages.created_at)]
  })

  return msgs
}

export async function fetchAdminMessages(query: string = '') {
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

  const msgs = await db.query.forum_messages.findMany({
    where: (forum_messages, { ne, ilike, and }) => 
      query ? and(ne(forum_messages.statut, 'supprime'), ilike(forum_messages.contenu, `%${query}%`)) : ne(forum_messages.statut, 'supprime'),
    with: {
      auteur: { columns: { prenom: true, nom: true } },
      fil: { columns: { titre: true } }
    },
    orderBy: (forum_messages, { desc }) => [desc(forum_messages.created_at)],
    limit: 50
  })

  return msgs
}

export async function fetchAdminThreads() {
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

  const threads = await db.query.forum_fils.findMany({
    with: {
      auteur: { columns: { prenom: true, nom: true } },
      categorie: { columns: { nom: true } }
    },
    orderBy: (forum_fils, { desc }) => [desc(forum_fils.created_at)]
  })

  return threads
}
