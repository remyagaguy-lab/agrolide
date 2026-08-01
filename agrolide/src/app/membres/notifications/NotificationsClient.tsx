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
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f0f7f0] text-[#1b5e38] flex items-center justify-center border border-[#c3dec4] shadow-sm">
            <Bell size={18} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a1a] font-heading">Notifications</h1>
            <p className="text-xs text-gray-500 mt-0.5">Vous avez {unreadCount} notification{unreadCount !== 1 ? 's' : ''} non lue{unreadCount !== 1 ? 's' : ''}</p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            disabled={markingAll}
            className="bg-white border border-[#e8e8e4] text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:border-[#1b5e38] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {markingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center border border-[#e8e8e4]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1a1a1a]">Aucune notification</h3>
              <p className="text-xs text-gray-500">Vous êtes à jour !</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[#e8e8e4]">
            {notifications.map(notif => (
              <button
                key={notif.id}
                onClick={() => handleNotifClick(notif.id, notif.lien, notif.lu)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex gap-3 ${!notif.lu ? 'bg-[#f8faf8]' : ''}`}
              >
                <div className="mt-1 shrink-0">
                  {notif.lu ? (
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-[#1b5e38] shadow-[0_0_8px_rgba(27,94,56,0.5)]" />
                  )}
                </div>
                <div>
                  <h3 className={`text-sm ${!notif.lu ? 'font-bold text-[#1a1a1a]' : 'font-bold text-gray-600'}`}>
                    {notif.titre}
                  </h3>
                  {notif.contenu && (
                    <p className="text-xs text-gray-500 mt-1">{notif.contenu}</p>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1.5 font-bold uppercase tracking-wider">
                    {format(new Date(notif.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
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
