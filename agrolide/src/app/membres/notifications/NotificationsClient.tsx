'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getNotifications, markAllAsReadAction, markAsReadAction } from '@/app/actions/notifications'
import { AlertesPush } from '@/components/modules/notifications/AlertesPush'
import { depuis, libelleType, lienSur, type NotificationItem } from '@/lib/notifications'

import { Bell, CheckCircle2, Loader2 } from "@/components/ui/icons"
export default function NotificationsClient() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setNotifications(await getNotifications())
    } catch (e) {
      console.error('[notifications] chargement impossible :', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  const markAllAsRead = async () => {
    setMarkingAll(true)
    try {
      await markAllAsReadAction()
      await fetchData()
    } finally {
      setMarkingAll(false)
    }
  }

  const handleNotifClick = async (n: NotificationItem) => {
    if (!n.lu) {
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, lu: true } : x)))
      void markAsReadAction(n.id).catch(() => fetchData())
    }
    // Sans lien propre à la notification, on reste sur cette page : elle vient juste d'être marquée comme lue.
    if (n.lien) router.push(lienSur(n.lien))
  }

  const unreadCount = notifications.filter((n) => !n.lu).length

  return (
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-primary flex items-center justify-center border border-outline-variant shadow-sm">
            <Bell size={20} aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-bold text-on-surface font-heading">Notifications</h1>
            <p className="text-xs text-on-surface-muted mt-0.5" aria-live="polite">
              {loading
                ? 'Chargement…'
                : `Vous avez ${unreadCount} notification${unreadCount !== 1 ? 's' : ''} non lue${unreadCount !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={markingAll}
            className="bg-surface-container-lowest border border-outline-variant text-on-surface-variant px-3 py-1.5 rounded-lg text-xs font-bold hover:border-primary transition-colors flex items-center gap-1.5 shadow-sm min-h-11"
          >
            {markingAll ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <CheckCircle2 className="size-4" aria-hidden />}
            Tout marquer comme lu
          </button>
        )}
      </div>

      <AlertesPush />

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-on-surface-muted"><Loader2 className="size-5 animate-spin mx-auto" aria-label="Chargement" /></div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-container-low text-outline flex items-center justify-center border border-outline-variant">
              <Bell className="size-5" aria-hidden />
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">Aucune notification</h3>
              <p className="text-xs text-on-surface-muted">Vous êtes à jour !</p>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant">
            {notifications.map((notif) => (
              <li key={notif.id}>
                <button
                  type="button"
                  onClick={() => handleNotifClick(notif)}
                  className={`w-full text-left p-4 hover:bg-surface-container-low transition-colors flex gap-3 ${!notif.lu ? 'bg-surface-container-low' : ''}`}
                >
                  <div className="mt-1.5 shrink-0" aria-hidden>
                    <div className={notif.lu ? 'size-2 rounded-full bg-outline-variant' : 'size-2 rounded-full bg-primary'} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-label-sm uppercase tracking-wider text-on-surface-muted">
                      {libelleType(notif.type)}
                      {!notif.lu && <span className="sr-only"> — non lue</span>}
                    </p>
                    <p className={`mt-0.5 text-sm ${!notif.lu ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>
                      {notif.contenu}
                    </p>
                    {depuis(notif.created_at) && (
                      <p className="text-label-sm text-on-surface-muted mt-1.5">{depuis(notif.created_at)}</p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}
