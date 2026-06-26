'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Bell, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      setCurrentUser(session.user)
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      if (data) setNotifications(data)
    }
    setLoading(false)
  }

  const markAllAsRead = async () => {
    setMarkingAll(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${session.token}` }
      })
      fetchData()
    }
    setMarkingAll(false)
  }

  const handleNotifClick = async (id: string, lien: string, isRead: boolean) => {
    if (!isRead) {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        await fetch(`/api/notifications/${id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${session.token}` }
        })
      }
    }
    if (lien) {
      window.location.href = lien
    } else {
      fetchData() // Refresh list just to show it's read if no link
    }
  }

  const unreadCount = notifications.filter(n => !n.lu).length

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500">Vous avez {unreadCount} notification{unreadCount !== 1 ? 's' : ''} non lue{unreadCount !== 1 ? 's' : ''}</p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            disabled={markingAll}
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-colors flex items-center gap-2 text-sm border border-gray-200"
          >
            {markingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Chargement...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center">
              <Bell className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Aucune notification</h3>
              <p className="text-gray-500">Vous êtes à jour !</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map(notif => (
              <button
                key={notif.id}
                onClick={() => handleNotifClick(notif.id, notif.lien, notif.lu)}
                className={`w-full text-left p-6 hover:bg-gray-50 transition-colors flex gap-4 ${!notif.lu ? 'bg-primary-50/20' : ''}`}
              >
                <div className="mt-1">
                  {notif.lu ? (
                    <div className="w-3 h-3 rounded-full bg-gray-300" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(22,101,52,0.5)]" />
                  )}
                </div>
                <div>
                  <h3 className={`text-base ${!notif.lu ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                    {notif.titre}
                  </h3>
                  {notif.contenu && (
                    <p className="text-sm text-gray-500 mt-1">{notif.contenu}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2 font-medium">
                    {format(new Date(notif.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
