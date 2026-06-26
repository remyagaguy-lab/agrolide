'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { ShieldAlert, CheckCircle, Trash2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function AdminForumPage() {
  const [reportedMessages, setReportedMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReported = async () => {
    setLoading(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data } = await supabase
      .from('forum_messages')
      .select('*, auteur:profiles(prenom, nom), fil:forum_fils(id, titre)')
      .eq('statut', 'en_revue')
      .order('updated_at', { ascending: false })
      
    if (data) setReportedMessages(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchReported()
  }, [])

  const handleAction = async (id: string, action: 'publie' | 'supprime') => {
    if (action === 'supprime' && !window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce message ?")) return
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    await supabase
      .from('forum_messages')
      .update({ statut: action })
      .eq('id', id)
      
    fetchReported()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-orange-500" />
            Modération du Forum
          </h1>
          <p className="text-gray-500">Gérez les messages signalés par la communauté.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Chargement...</div>
        ) : reportedMessages.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Aucun signalement</h3>
            <p className="text-gray-500">Tout est en ordre sur le forum !</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reportedMessages.map(msg => (
              <div key={msg.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-gray-900">{msg.auteur?.prenom} {msg.auteur?.nom}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{format(new Date(msg.created_at), "dd MMM yyyy HH:mm", { locale: fr })}</span>
                      <span className="text-gray-400">•</span>
                      <Link href={`/membres/forum/fil/${msg.fil?.id}`} target="_blank" className="text-primary-600 hover:underline flex items-center gap-1 font-medium">
                        Sujet : {msg.fil?.titre} <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 text-gray-800 text-sm whitespace-pre-wrap font-sans">
                      {msg.contenu}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 shrink-0">
                    <button 
                      onClick={() => handleAction(msg.id, 'publie')}
                      className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-lg text-sm transition-colors border border-green-200"
                    >
                      Ignorer (Republier)
                    </button>
                    <button 
                      onClick={() => handleAction(msg.id, 'supprime')}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg text-sm transition-colors border border-red-200 flex items-center gap-2 justify-center"
                    >
                      <Trash2 className="w-4 h-4" /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
