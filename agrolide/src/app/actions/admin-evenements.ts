'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { evenements, inscriptions_evenement, users } from '@/db/schema'
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

export async function getAdminEvenements() {
  await checkAdmin()
  
  const evts = await db.query.evenements.findMany({
    orderBy: (evenements, { desc }) => [desc(evenements.date_debut)]
  })
  
  // get counts (manual count since drizzle query builder may need manual aggregation or separate query)
  const counts = await db.select({
    evenement_id: inscriptions_evenement.evenement_id
  }).from(inscriptions_evenement)
  
  const countMap = counts.reduce((acc: any, row) => {
    acc[row.evenement_id] = (acc[row.evenement_id] || 0) + 1
    return acc
  }, {})

  return evts.map(e => ({
    ...e,
    inscriptions: [{ count: countMap[e.id] || 0 }]
  }))
}

export async function deleteAdminEvenement(id: string) {
  await checkAdmin()
  
  await db.delete(inscriptions_evenement).where(eq(inscriptions_evenement.evenement_id, id))
  await db.delete(evenements).where(eq(evenements.id, id))
  
  revalidatePath('/admin/contenus/evenements')
  revalidatePath('/evenements')
  
  return { success: true }
}

export async function upsertAdminEvenement(payload: any, id?: string) {
  await checkAdmin()
  
  if (id) {
    await db.update(evenements).set(payload).where(eq(evenements.id, id))
  } else {
    await db.insert(evenements).values({ ...payload, id: crypto.randomUUID() })
  }
  
  revalidatePath('/admin/contenus/evenements')
  revalidatePath('/evenements')
  
  return { success: true }
}
