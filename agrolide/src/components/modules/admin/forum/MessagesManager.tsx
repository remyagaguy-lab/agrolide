'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Trash2, Loader2, MessageSquare, Search } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { deleteMessage } from '@/app/actions/admin-forum'

export default function MessagesManager() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const fetchMessages = async (query = '') => {
    setLoading(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    let q = supabase
      .from('forum_messages')
      .select('*, auteur:profiles(prenom, nom), fil:forum_fils(titre)')
      .neq('statut', 'supprime')
      .order('created_at', { ascending: false })
      .limit(50)

    if (query) {
      q = q.ilike('contenu', `%${query}%`)
    }

    const { data } = await q
    if (data) setMessages(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchMessages(search)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce message ?")) return
    setProcessing(id)
    try {
      await deleteMessage(id)
      setMessages(msgs => msgs.filter(m => m.id !== id))
      alert("Message supprimé")
    } catch (err: any) {
      alert("Erreur: " + err.message)
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recherche globale des messages</h2>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input 
          type="text" 
          placeholder="Rechercher un mot-clé dans les messages..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center gap-2">
          <Search className="w-5 h-5" /> Rechercher
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              Chargement...
            </div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Aucun message trouvé</div>
          ) : messages.map(msg => (
            <div key={msg.id} className="p-4 hover:bg-gray-50 flex justify-between items-start gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-bold text-gray-900">{msg.auteur?.prenom} {msg.auteur?.nom}</span>
                  <span>•</span>
                  <span>{format(new Date(msg.created_at), "dd MMM yyyy HH:mm", { locale: fr })}</span>
                  <span>•</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">Fil : {msg.fil?.titre}</span>
                </div>
                <div className="text-gray-800 text-sm whitespace-pre-wrap font-sans">
                  {msg.contenu}
                </div>
              </div>
              <button onClick={() => handleDelete(msg.id)} disabled={processing===msg.id} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors shrink-0">
                {processing === msg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
