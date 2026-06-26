'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useSearchParams } from 'next/navigation'
import { Send, Loader2, MessageCircle, User } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function MessagesClient() {
  const searchParams = useSearchParams()
  const initialConvId = searchParams.get('conv') || searchParams.get('nouveau')

  const [conversations, setConversations] = useState<any[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(initialConvId)
  const [messages, setMessages] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  
  const [newMessage, setNewMessage] = useState('')
  const [error, setError] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')

  useEffect(() => {
    fetchSession()
  }, [])

  const fetchSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      setCurrentUser(session.user)
      fetchConversations(session.access_token)
    }
  }

  const fetchConversations = async (token: string) => {
    try {
      const res = await fetch('/api/messages/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setConversations(data)
      }
    } catch (err) {
      console.error(err)
    }
    setLoadingConvs(false)
  }

  const fetchMessages = async (correspondantId: string) => {
    setLoadingMessages(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      try {
        const res = await fetch(`/api/messages/${correspondantId}`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        })
        const data = await res.json()
        if (Array.isArray(data)) {
          setMessages(data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    setLoadingMessages(false)
    scrollToBottom()
  }

  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId)
      
      // Update non-lus localement
      setConversations(prev => prev.map(c => 
        c.correspondant.id === activeConvId ? { ...c, non_lus: 0 } : c
      ))
    }
  }, [activeConvId])

  // Realtime subscription
  useEffect(() => {
    if (!currentUser) return

    const channel = supabase.channel(`messages:${currentUser.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `destinataire_id=eq.${currentUser.id}` 
      }, (payload) => {
        const newMsg = payload.new
        
        // Si c'est un message pour la conversation active
        if (activeConvId && newMsg.expediteur_id === activeConvId) {
          setMessages(prev => [...prev, newMsg])
          // Marquer comme lu
          supabase.from('messages').update({ lu: true }).eq('id', newMsg.id).then()
          scrollToBottom()
        } else {
          // Sinon, on met à jour la liste des conversations (simplifié)
          fetchSession()
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser, activeConvId])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConvId) return
    
    setSending(true)
    setError('')
    
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      try {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            destinataire_id: activeConvId,
            contenu: newMessage
          })
        })
        const data = await res.json()
        if (data.error) {
          setError(data.error)
        } else if (data.success) {
          // Message sent
          setMessages(prev => [...prev, data.message])
          setNewMessage('')
          scrollToBottom()
          // Update conversation list
          fetchConversations(session.access_token)
        }
      } catch (err: any) {
        setError(err.message)
      }
    }
    setSending(false)
  }

  const activeCorrespondant = conversations.find(c => c.correspondant.id === activeConvId)?.correspondant || 
    (initialConvId && !conversations.find(c => c.correspondant.id === initialConvId) ? { id: initialConvId, prenom: 'Nouveau', nom: 'Contact' } : null)

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Sidebar - Liste des conversations */}
      <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-gray-900 text-lg">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="p-8 text-center text-gray-500"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
              <MessageCircle className="w-8 h-8 text-gray-300" />
              <p>Aucune conversation</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {conversations.map(conv => (
                <button
                  key={conv.correspondant.id}
                  onClick={() => setActiveConvId(conv.correspondant.id)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center gap-3 ${activeConvId === conv.correspondant.id ? 'bg-primary-50/50' : ''}`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold overflow-hidden shrink-0">
                      {conv.correspondant.avatar_url ? (
                        <img src={conv.correspondant.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        conv.correspondant.prenom?.charAt(0) || <User className="w-5 h-5" />
                      )}
                    </div>
                    {conv.non_lus > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {conv.non_lus}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <div className="font-bold text-gray-900 truncate">
                        {conv.correspondant.prenom} {conv.correspondant.nom?.charAt(0)}.
                      </div>
                      <div className="text-xs text-gray-400 shrink-0">
                        {format(new Date(conv.dernier_message.created_at), "dd/MM")}
                      </div>
                    </div>
                    <div className={`text-sm truncate ${conv.non_lus > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                      {conv.dernier_message.expediteur_id === currentUser?.id ? 'Vous: ' : ''}
                      {conv.dernier_message.contenu}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
        {activeConvId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setActiveConvId(null)}
                className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                &larr; Retour
              </button>
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold overflow-hidden">
                {activeCorrespondant?.avatar_url ? (
                  <img src={activeCorrespondant.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  activeCorrespondant?.prenom?.charAt(0) || <User className="w-4 h-4" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{activeCorrespondant?.prenom} {activeCorrespondant?.nom}</h3>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50 flex flex-col gap-4">
              {loadingMessages ? (
                <div className="text-center text-gray-400 py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-400 py-10 text-sm">Début de la conversation</div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.expediteur_id === currentUser?.id
                  return (
                    <div key={msg.id} className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-[15px] ${isMe ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'}`}>
                        {msg.contenu}
                      </div>
                      <span className="text-xs text-gray-400 mt-1 px-1">
                        {format(new Date(msg.created_at), "HH:mm")}
                      </span>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              {error && <div className="mb-2 text-xs text-red-600 bg-red-50 p-2 rounded">{error}</div>}
              <form onSubmit={handleSend} className="flex gap-2 items-end">
                <textarea 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 resize-none max-h-32 min-h-[50px] text-sm"
                  rows={1}
                  onKeyDown={e => {
                    if(e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                />
                <button 
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shrink-0 disabled:opacity-50 transition-colors"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageCircle className="w-16 h-16 text-gray-200 mb-4" />
            <p>Sélectionnez une conversation pour commencer à discuter</p>
          </div>
        )}
      </div>

    </div>
  )
}
