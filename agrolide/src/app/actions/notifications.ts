'use server'

import { auth } from '@/auth'
import { db } from '@/db'
import { notifications } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'

export async function getNotifications() {
  const session = await auth()
  if (!session?.user?.id) return []
  
  return await db.query.notifications.findMany({
    where: eq(notifications.user_id, session.user.id),
    orderBy: [desc(notifications.created_at)]
  })
}

export async function markAllAsReadAction() {
  const session = await auth()
  if (!session?.user?.id) return false
  
  await db.update(notifications)
    .set({ lu: true })
    .where(and(eq(notifications.user_id, session.user.id), eq(notifications.lu, false)))
    
  return true
}

export async function markAsReadAction(id: string) {
  const session = await auth()
  if (!session?.user?.id) return false
  
  await db.update(notifications)
    .set({ lu: true })
    .where(and(eq(notifications.id, id), eq(notifications.user_id, session.user.id)))
    
  return true
}
