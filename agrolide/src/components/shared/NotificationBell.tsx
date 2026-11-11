'use client'

import React, { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import * as Popover from '@radix-ui/react-popover'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getNotifications, markAsReadAction } from '@/app/actions/notifications'
import { useUser } from '@/lib/auth/client'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && user) {
      fetchNotifications()
    }
  }, [user, isLoaded])

  const fetchNotifications = async () => {
    const data = await getNotifications()
    if (data) {
      setNotifications(data.slice(0, 5))
      setUnreadCount(data.filter(n => !n.lu).length)
    }
  }

  // Realtime WebSockets with Cloudflare Durable Objects
  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8787';
    // Connect to the specific channel for this user's notifications
    const ws = new WebSocket(`${WS_URL}/ws/notif_${user.id}`);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'NEW_NOTIFICATION') {
          fetchNotifications();
        }
      } catch (err) {
        console.error('WebSocket message parsing error', err);
      }
    };

    return () => {
      ws.close();
    };
  }, [user?.id, isLoaded]);

  const markAsRead = async (id: string, lien: string) => {
    await markAsReadAction(id)
    await fetchNotifications()
    window.location.href = lien || '/membres/notifications'
  }

  if (!isLoaded || !user) return null

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="relative p-2 text-on-surface-muted hover:bg-surface-container rounded-full transition-colors outline-none focus:ring-2 focus:ring-primary">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content 
          className="w-80 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant mr-4 mt-2 z-50 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95" 
          sideOffset={5}
        >
          <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
            <h3 className="font-bold text-on-surface">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-primary-container text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} nvx
              </span>
            )}
          </div>
          
          <div className="max-h-[300px] overflow-y-auto divide-y divide-outline-variant">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-on-surface-muted text-sm">
                Aucune notification
              </div>
            ) : (
              notifications.map(notif => (
                <button
                  key={notif.id}
                  onClick={() => markAsRead(notif.id, notif.lien)}
                  className={`w-full text-left p-4 hover:bg-surface-container-low transition-colors ${!notif.lu ? 'bg-primary-container/30' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.lu ? 'bg-accent-leaf' : 'bg-transparent'}`} />
                    <div>
                      <p className={`text-sm ${!notif.lu ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>
                        {notif.titre}
                      </p>
                      {notif.contenu && (
                        <p className="text-xs text-on-surface-muted mt-0.5 line-clamp-1">{notif.contenu}</p>
                      )}
                      <p className="text-[10px] text-on-surface-muted mt-1">
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: fr })}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
          
          <div className="p-2 border-t border-outline-variant bg-surface-container-low/50 text-center">
            <Link href="/membres/notifications" className="text-sm font-medium text-primary hover:text-primary hover:underline block p-2">
              Voir toutes les notifications
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
