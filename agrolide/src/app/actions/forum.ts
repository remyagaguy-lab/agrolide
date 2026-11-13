'use server'

import { auth } from '@/lib/auth/server'
import { db } from '@/db'
import { forum_categories, forum_fils, forum_messages, users } from '@/db/schema'
import { eq, desc, asc, and, count } from 'drizzle-orm'
import { notifier } from '@/lib/notifications.server'
import { retirerEmojis } from "@/lib/utils/sans-emoji"

export async function getForumCategories() {
  return await db.query.forum_categories.findMany({
    orderBy: [asc(forum_categories.ordre)]
  })
}

export async function getCategoryWithThreads(categoryId: string, limit: number = 20, offset: number = 0) {
  const category = await db.query.forum_categories.findFirst({
    where: eq(forum_categories.id, categoryId)
  })

  if (!category) return null

  // count threads
  const countResult = await db.select({ value: count() }).from(forum_fils).where(eq(forum_fils.categorie_id, categoryId))
  
  const threads = await db.query.forum_fils.findMany({
    where: eq(forum_fils.categorie_id, categoryId),
    with: {
      auteur: { columns: { prenom: true, nom: true, photo_url: true } }
    },
    orderBy: [desc(forum_fils.last_activity_at)],
    limit,
    offset
  })

  return { category, threads, totalCount: countResult[0].value }
}

export async function getRecentThreadsByCategory(categoryId: string, limit: number = 3) {
  return await db.query.forum_fils.findMany({
    where: eq(forum_fils.categorie_id, categoryId),
    with: {
      auteur: { columns: { prenom: true, nom: true, photo_url: true } }
    },
    orderBy: [desc(forum_fils.last_activity_at)],
    limit
  })
}

export async function getThreadDetails(filId: string) {
  const fil = await db.query.forum_fils.findFirst({
    where: eq(forum_fils.id, filId),
    with: {
      categorie: true,
      auteur: { columns: { prenom: true, nom: true, photo_url: true } }
    }
  })

  if (!fil) return null

  const messages = await db.query.forum_messages.findMany({
    where: eq(forum_messages.fil_id, filId),
    with: {
      auteur: { columns: { prenom: true, nom: true, photo_url: true } }
    },
    orderBy: [asc(forum_messages.created_at)]
  })

  return { fil, messages }
}

export async function addReplyToThread(filId: string, contenuBrut: string) {
  const contenu = retirerEmojis(contenuBrut)
  const { userId } = await auth();
  const user = userId ? { id: userId } : null;
  const session = userId ? { user: { id: userId } } : null;
  if (!user || !user.id) throw new Error("Non autorisé")

  // Check if thread exists
  const fil = await db.query.forum_fils.findFirst({
    where: eq(forum_fils.id, filId)
  })
  if (!fil) throw new Error("Fil introuvable")

  // Insert message
  await db.insert(forum_messages).values({
    fil_id: filId,
    auteur_id: user.id,
    contenu: contenu.trim(),
    statut: 'publie'
  })

  // Update thread stats
  await db.update(forum_fils).set({
    last_activity_at: new Date().toISOString(),
    nb_reponses: (fil.nb_reponses || 0) + 1
  }).where(eq(forum_fils.id, filId))

  // L'auteur du fil est prévenu d'une réponse (pas de notification pour ses propres messages).
  if (fil.auteur_id !== user.id) {
    const repondant = await db.query.users.findFirst({
      columns: { prenom: true, nom: true },
      where: eq(users.id, user.id)
    })
    const nom = `${repondant?.prenom ?? ''} ${repondant?.nom ?? ''}`.trim() || 'Un membre'
    await notifier(fil.auteur_id, {
      type: 'forum',
      contenu: `${nom} a répondu à votre fil « ${fil.titre} ».`,
      lien: `/membres/forum/fil/${filId}`,
    })
  }

  return { success: true }
}

export async function getForumCategoriesWithRecentThreads() {
  const cats = await db.query.forum_categories.findMany({
    orderBy: [asc(forum_categories.ordre)]
  })
  
  const catsWithThreads = await Promise.all(cats.map(async (cat) => {
    const threads = await db.query.forum_fils.findMany({
      where: eq(forum_fils.categorie_id, cat.id),
      with: {
        auteur: { columns: { prenom: true, nom: true, photo_url: true } }
      },
      orderBy: [desc(forum_fils.last_activity_at)],
      limit: 3
    })
    return { ...cat, recent_threads: threads }
  }))
  
  return catsWithThreads
}
