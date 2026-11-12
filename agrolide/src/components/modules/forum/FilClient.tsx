'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, AlertTriangle, Send, User } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'
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

  if (loading) return <div className="py-20 text-center text-on-surface-muted">Chargement...</div>
  if (!thread) return <div className="py-20 text-center text-error">Fil introuvable.</div>

  return (
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm">
        <Breadcrumb jsonLd={false} className="mb-3" items={[{ label: 'Forum', href: '/membres/forum' }, { label: thread.categorie?.nom ?? 'Catégorie', href: `/membres/forum/categorie/${thread.categorie_id}` }, { label: thread.titre }]} />
        <div className="flex items-start gap-3 mb-2">
          <h1 className="text-lg md:text-xl font-bold text-on-surface flex-1 font-heading">{thread.titre}</h1>
          <span className="bg-primary-container text-primary px-2.5 py-1 rounded border border-outline-variant text-label-sm font-bold uppercase tracking-wider shrink-0">
            {thread.categorie?.nom}
          </span>
        </div>
        <div className="flex items-center gap-2 text-label-sm font-medium text-on-surface-muted">
          <span>Par <span className="font-bold text-on-surface-variant">{thread.auteur?.prenom} {thread.auteur?.nom}</span></span>
          <span>•</span>
          <span>{format(new Date(thread.created_at), "dd MMM yyyy", { locale: fr })}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-6">
        {messages.map((msg, index) => (
          <div key={msg.id} className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden flex flex-col sm:flex-row">
            {/* Profil Sidebar */}
            <div className="bg-surface-container-low p-4 sm:w-40 sm:border-r border-outline-variant flex flex-col items-center text-center shrink-0">
              <div className="w-12 h-12 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center justify-center mb-2 shadow-sm overflow-hidden relative">
                {msg.auteur?.avatar_url ? (
                  <Image src={msg.auteur.avatar_url} alt="Avatar" fill sizes="48px" className="object-cover" />
                ) : (
                  <User className="w-6 h-6 text-on-surface-muted" />
                )}
              </div>
              <div className="font-bold text-on-surface text-xs truncate w-full">{msg.auteur?.prenom}</div>
              <div className="font-medium text-on-surface-muted text-label-sm truncate w-full">{msg.auteur?.nom}</div>
            </div>
            
            {/* Contenu */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-3 text-label-sm text-on-surface-muted font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: fr })}
                </div>
                <div className="flex items-center gap-2">
                  <span>#{index + 1}</span>
                  <button onClick={() => handleReport(msg.id)} className="text-on-surface-muted hover:text-error transition-colors p-1" title="Signaler">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              <div 
                className="prose prose-sm max-w-none text-on-surface-variant flex-1"
                dangerouslySetInnerHTML={{ __html: marked.parse(msg.contenu) as string }}
              />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Form */}
      {thread.statut === 'ouvert' ? (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-5">
          <h3 className="text-sm font-bold text-on-surface mb-3">Répondre</h3>
          {currentUser ? (
            <form onSubmit={handleReply}>
              <textarea 
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder="Écrivez votre réponse ici... (Markdown supporté)"
                className="w-full h-24 p-3 text-sm border border-outline-variant rounded-xl focus:ring-2 focus:ring-accent-leaf focus:border-transparent outline-none resize-y font-sans"
                maxLength={3000}
                required
              />
              <div className="flex justify-between items-center mt-3">
                <div className="text-label-sm text-on-surface-muted font-medium uppercase tracking-wider">
                  {replyContent.length}/3000 caractères
                </div>
                <button 
                  type="submit" 
                  disabled={replying || !replyContent.trim()}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Publier
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-surface-container-low p-4 rounded-xl text-center text-xs text-on-surface-variant border border-outline-variant">
              Vous devez être connecté pour participer à la discussion.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-surface-container-low p-4 rounded-xl text-center text-xs text-on-surface-muted font-medium border border-outline-variant">
          🔒 Ce sujet a été fermé. Il n'est plus possible d'y répondre.
        </div>
      )}
    </div>
  )
}
