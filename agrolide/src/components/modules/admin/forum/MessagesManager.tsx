'use client'

import React, { useState, useEffect } from 'react'

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
    try {
      const { fetchAdminMessages } = await import('@/app/actions/admin-forum')
      const data = await fetchAdminMessages(query)
      if (data) setMessages(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
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
        <h2 className="text-xl font-bold text-on-surface">Recherche globale des messages</h2>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input 
          type="text" 
          placeholder="Rechercher un mot-clé dans les messages..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-outline rounded-xl outline-none focus:ring-2 focus:ring-primary"
        />
        <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl flex items-center gap-2">
          <Search className="w-5 h-5" /> Rechercher
        </button>
      </form>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="divide-y divide-outline-variant">
          {loading ? (
            <div className="p-8 text-center text-on-surface-muted flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              Chargement...
            </div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-on-surface-muted">Aucun message trouvé</div>
          ) : messages.map(msg => (
            <div key={msg.id} className="p-4 hover:bg-surface-container-low flex justify-between items-start gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 text-sm text-on-surface-muted">
                  <span className="font-bold text-on-surface">{msg.auteur?.prenom} {msg.auteur?.nom}</span>
                  <span>•</span>
                  <span>{format(new Date(msg.created_at), "dd MMM yyyy HH:mm", { locale: fr })}</span>
                  <span>•</span>
                  <span className="bg-surface-container px-2 py-0.5 rounded text-xs">Fil : {msg.fil?.titre}</span>
                </div>
                <div className="text-on-surface text-sm whitespace-pre-wrap font-sans">
                  {msg.contenu}
                </div>
              </div>
              <button onClick={() => handleDelete(msg.id)} disabled={processing===msg.id} className="p-2 text-error bg-error-container hover:bg-error-container rounded-lg transition-colors shrink-0">
                {processing === msg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
