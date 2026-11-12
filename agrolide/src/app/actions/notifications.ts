'use server'

import { auth } from '@/lib/auth/server'
import { db } from '@/db'
import { notifications } from '@/db/schema'
import { and, count, desc, eq, isNull, notInArray, or } from 'drizzle-orm'
import { TYPES_HORS_CLOCHE, type NotificationItem } from '@/lib/notifications'

// `lu` est nullable en base : une valeur vide compte comme « non lue » (comme pour les messages).
const nonLue = or(eq(notifications.lu, false), isNull(notifications.lu))

const colonnes = {
  id: notifications.id,
  type: notifications.type,
  contenu: notifications.contenu,
  lien: notifications.lien,
  lu: notifications.lu,
  created_at: notifications.created_at,
}

function visiblesPour(userId: string) {
  return and(eq(notifications.user_id, userId), notInArray(notifications.type, TYPES_HORS_CLOCHE))
}

function enItem(r: { id: string; type: string; contenu: string; lien: string | null; lu: boolean | null; created_at: string | null }): NotificationItem {
  return { id: r.id, type: r.type, contenu: r.contenu, lien: r.lien, lu: Boolean(r.lu), created_at: r.created_at }
}

/** Les notifications les plus récentes du membre connecté (50 par défaut, 100 au plus). */
export async function getNotifications(limit = 50): Promise<NotificationItem[]> {
  const { userId } = await auth()
  if (!userId) return []

  const rows = await db
    .select(colonnes)
    .from(notifications)
    .where(visiblesPour(userId))
    .orderBy(desc(notifications.created_at))
    .limit(Math.min(Math.max(Math.trunc(limit) || 50, 1), 100))

  return rows.map(enItem)
}

/** Pour la cloche : les dernières notifications et le total des non lues, sans charger tout l'historique. */
export async function getResumeNotifications(limit = 6): Promise<{ items: NotificationItem[]; nonLues: number }> {
  const { userId } = await auth()
  if (!userId) return { items: [], nonLues: 0 }

  const [rows, [total]] = await Promise.all([
    db
      .select(colonnes)
      .from(notifications)
      .where(visiblesPour(userId))
      .orderBy(desc(notifications.created_at))
      .limit(Math.min(Math.max(Math.trunc(limit) || 6, 1), 20)),
    db
      .select({ total: count() })
      .from(notifications)
      .where(and(visiblesPour(userId), nonLue)),
  ])

  return { items: rows.map(enItem), nonLues: Number(total?.total ?? 0) }
}

export async function markAllAsReadAction(): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  await db.update(notifications).set({ lu: true }).where(and(visiblesPour(userId), nonLue))
  return true
}

export async function markAsReadAction(id: string): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  await db
    .update(notifications)
    .set({ lu: true })
    .where(and(eq(notifications.id, id), eq(notifications.user_id, userId)))
  return true
}
