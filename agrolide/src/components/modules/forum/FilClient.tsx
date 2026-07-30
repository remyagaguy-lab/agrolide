'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock, AlertTriangle, Send, User } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { marked } from 'marked'

interface FilClientProps {
  filId: string
}

export default function FilClient({ filId }: FilClientProps) {
  const [thread, setThread] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Nouveau message
  const [replyContent, setReplyContent] = useState('')
  const [replying, setReplying] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentUser = true

  useEffect(() => {
    fetchData()
  }, [filId])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { getThreadDetails } = await import('@/app/actions/forum')
      const result = await getThreadDetails(filId)
      if (result) {
        setThread(result.fil)
        setMessages(result.messages)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setTimeout(scrollToBottom, 100)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return
    
    setReplying(true)
    try {
      const { addReplyToThread } = await import('@/app/actions/forum')
      await addReplyToThread(filId, replyContent)
      setReplyContent('')
      // Re-fetch to get new message
      await fetchData()
    } catch (err) {
      console.error(err)
      alert("Erreur lors de la publication.")
    } finally {
      setReplying(false)
    }
  }

  const handleReport = async (msgId: string) => {
    if (!window.confirm("Voulez-vous signaler ce message aux administrateurs ?")) return
    
    try {
      const res = await fetch(`/api/forum/messages/${msgId}/signaler`, {
        method: 'POST'
      })
      if (res.ok) alert("Message signalé avec succès. Merci.")
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) return <div className="py-20 text-center text-gray-500">Chargement...</div>
  if (!thread) return <div className="py-20 text-center text-red-500">Fil introuvable.</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <Link href={`/membres/forum/categorie/${thread.categorie_id}`} className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Retour à {thread.categorie?.nom}
        </Link>
        <div className="flex items-start gap-4">
          <h1 className="text-3xl font-bold text-gray-900 flex-1">{thread.titre}</h1>
          <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium shrink-0">
            {thread.categorie?.nom}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <span>Créé par {thread.auteur?.prenom} {thread.auteur?.nom}</span>
          <span>•</span>
          <span>{format(new Date(thread.created_at), "dd MMMM yyyy", { locale: fr })}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-6">
        {messages.map((msg, index) => (
          <div key={msg.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row">
            {/* Profil Sidebar */}
            <div className="bg-gray-50 p-6 sm:w-48 sm:border-r border-gray-100 flex flex-col items-center text-center shrink-0">
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-3 shadow-sm overflow-hidden relative">
                {msg.auteur?.avatar_url ? (
                  <Image src={msg.auteur.avatar_url} alt="Avatar" fill sizes="64px" className="object-cover" />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="font-bold text-gray-900 truncate w-full">{msg.auteur?.prenom}</div>
              <div className="font-medium text-gray-700 text-sm truncate w-full">{msg.auteur?.nom}</div>
            </div>
            
            {/* Contenu */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: fr })}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">#{index + 1}</span>
                  <button onClick={() => handleReport(msg.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Signaler">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              <div 
                className="prose prose-sm md:prose-base max-w-none text-gray-800 flex-1"
                dangerouslySetInnerHTML={{ __html: marked.parse(msg.contenu) as string }}
              />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Form */}
      {thread.statut === 'ouvert' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Répondre</h3>
          {currentUser ? (
            <form onSubmit={handleReply}>
              <textarea 
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder="Écrivez votre réponse ici... (Markdown supporté)"
                className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-y font-sans"
                maxLength={3000}
                required
              />
              <div className="flex justify-between items-center mt-3">
                <div className="text-xs text-gray-500">
                  {replyContent.length}/3000 caractères
                </div>
                <button 
                  type="submit" 
                  disabled={replying || !replyContent.trim()}
                  className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors"
                >
                  <Send className="w-4 h-4" /> Publier la réponse
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 p-4 rounded-xl text-center text-gray-600 border border-gray-100">
              Vous devez être connecté pour participer à la discussion.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-xl text-center text-gray-500 font-medium border border-gray-100">
          🔒 Ce sujet a été fermé. Il n'est plus possible d'y répondre.
        </div>
      )}
    </div>
  )
}
