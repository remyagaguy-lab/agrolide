'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import * as Popover from '@radix-ui/react-popover'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')

  useEffect(() => {
    fetchSessionAndNotifs()
  }, [])

  const fetchSessionAndNotifs = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      setCurrentUser(session.user)
      fetchNotifications(session.user.id)
    }
  }

  const fetchNotifications = async (userId: string) => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)
      
    if (data) {
      setNotifications(data)
      // On compte les non lues
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('lu', false)
      setUnreadCount(count || 0)
    }
  }

  // Realtime subscription
  useEffect(() => {
    if (!currentUser) return

    const channel = supabase.channel(`notifications:${currentUser.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications', 
        filter: `user_id=eq.${currentUser.id}` 
      }, () => {
        fetchNotifications(currentUser.id)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser])

  const markAsRead = async (id: string, lien: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${session.token}` }
      })
      fetchNotifications(currentUser.id)
      window.location.href = lien || '/membres/notifications'
    }
  }

  if (!currentUser) return null

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors outline-none focus:ring-2 focus:ring-primary-500">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content 
          className="w-80 bg-white rounded-2xl shadow-xl border border-gray-100 mr-4 mt-2 z-50 overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95" 
          sideOffset={5}
        >
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} nvx
              </span>
            )}
          </div>
          
          <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                Aucune notification
              </div>
            ) : (
              notifications.map(notif => (
                <button
                  key={notif.id}
                  onClick={() => markAsRead(notif.id, notif.lien)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${!notif.lu ? 'bg-primary-50/30' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.lu ? 'bg-primary-500' : 'bg-transparent'}`} />
                    <div>
                      <p className={`text-sm ${!notif.lu ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {notif.titre}
                      </p>
                      {notif.contenu && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{notif.contenu}</p>
                      )}
                      <p className="text-[10px] text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: fr })}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
          
          <div className="p-2 border-t border-gray-100 bg-gray-50/50 text-center">
            <Link href="/membres/notifications" className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline block p-2">
              Voir toutes les notifications
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
