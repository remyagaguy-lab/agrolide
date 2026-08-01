'use client'

import React, { useState, useEffect } from 'react'
import { Bell, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getNotifications, markAllAsReadAction, markAsReadAction } from '@/app/actions/notifications'

export default function NotificationsClient() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const data = await getNotifications()
    setNotifications(data)
    setLoading(false)
  }

  const markAllAsRead = async () => {
    setMarkingAll(true)
    await markAllAsReadAction()
    await fetchData()
    setMarkingAll(false)
  }

  const handleNotifClick = async (id: string, lien: string, isRead: boolean) => {
    if (!isRead) {
      await markAsReadAction(id)
    }
    if (lien) {
      window.location.href = lien
    } else {
      fetchData() // Refresh list just to show it's read if no link
    }
  }

  const unreadCount = notifications.filter(n => !n.lu).length

  return (
    <div className="max-w-[1600px] mx-auto px-2 md:px-4 py-4 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-glass p-6">
        <div className="flex items-center gap-3">
          <div className="icon-circle-lg bg-[#e8f5e9] text-[#1b5e38]">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="dash-page-title text-2xl">Notifications</h1>
            <p className="text-gray-500 text-sm mt-1">Vous avez {unreadCount} notification{unreadCount !== 1 ? 's' : ''} non lue{unreadCount !== 1 ? 's' : ''}</p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            disabled={markingAll}
            className="btn-dash-outline"
          >
            {markingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="card-glass overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Chargement...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="icon-circle-lg bg-gray-50 text-gray-300">
              <Bell className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Aucune notification</h3>
              <p className="text-gray-500">Vous êtes à jour !</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-50/50">
            {notifications.map(notif => (
              <button
                key={notif.id}
                onClick={() => handleNotifClick(notif.id, notif.lien, notif.lu)}
                className={`w-full text-left p-6 hover:bg-[#e8f5e9]/30 transition-colors flex gap-4 ${!notif.lu ? 'bg-[#e8f5e9]/10' : ''}`}
              >
                <div className="mt-1">
                  {notif.lu ? (
                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-[#50a853] shadow-[0_0_10px_rgba(80,168,83,0.4)]" />
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
