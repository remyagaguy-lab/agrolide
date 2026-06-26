'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
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
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  // Nouveau message
  const [replyContent, setReplyContent] = useState('')
  const [replying, setReplying] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)

  useEffect(() => {
    fetchData()
    
    // S'abonner aux nouveaux messages via Realtime
    const channel = supabase
      .channel(`forum:fil:${filId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'forum_messages',
        filter: `fil_id=eq.${filId}`
      }, (payload) => {
        // Au lieu de faire un fetchData() complet, on ajoute le message
        // On doit récupérer les infos de l'auteur car elles ne sont pas dans le payload
        fetchMessageAuthor(payload.new)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [filId])

  const fetchMessageAuthor = async (newMessage: any) => {
    const { data: auteur } = await supabase
      .from('profiles')
      .select('prenom, nom, avatar_url')
      .eq('id', newMessage.auteur_id)
      .single()
      
    setMessages(prev => [...prev, { ...newMessage, auteur }])
    setTimeout(scrollToBottom, 100)
  }

  const fetchData = async () => {
    setLoading(true)
    
    // Utilisateur courant
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
    
    // Info du fil + catégorie
    const { data: t } = await supabase
      .from('forum_fils')
      .select('*, categorie:forum_categories(*), auteur:profiles(prenom, nom, avatar_url)')
      .eq('id', filId)
      .single()
      
    if (t) setThread(t)
    
    // Messages
    const { data: msgs } = await supabase
      .from('forum_messages')
      .select('*, auteur:profiles(prenom, nom, avatar_url)')
      .eq('fil_id', filId)
      .order('created_at', { ascending: true })
      
    if (msgs) setMessages(msgs)
    setLoading(false)
    setTimeout(scrollToBottom, 100)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim() || !currentUser) return
    
    setReplying(true)
    
    // Insérer le message
    const { error } = await supabase
      .from('forum_messages')
      .insert({
        fil_id: filId,
        auteur_id: currentUser.id,
        contenu: replyContent.trim()
      })
      
    if (!error) {
      setReplyContent('')
      // Mettre à jour last_activity_at et nb_reponses
      await supabase
        .from('forum_fils')
        .update({ 
          last_activity_at: new Date().toISOString(),
          nb_reponses: messages.length + 1 
        })
        .eq('id', filId)
    } else {
      alert("Erreur lors de la publication.")
    }
    setReplying(false)
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
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-3 shadow-sm overflow-hidden">
                {msg.auteur?.avatar_url ? (
                  <img src={msg.auteur.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
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
