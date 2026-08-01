'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { Send, Loader2, MessageCircle, User } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function MessagesClient() {
  const searchParams = useSearchParams()
  const initialConvId = searchParams.get('conv') || searchParams.get('nouveau')

  const { user, isLoaded } = useUser()
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

  useEffect(() => {
    if (isLoaded && user) {
      setCurrentUser(user)
      fetchConversations()
    }
  }, [user, isLoaded])

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/messages/conversations')
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
    if (user) {
      try {
        const res = await fetch(`/api/messages/${correspondantId}`)
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

  // Realtime subscription via Custom WebSocket Server
  useEffect(() => {
    if (!currentUser) return

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8787';
    const ws = new WebSocket(`${WS_URL}/ws/msg_${currentUser.id}`);

    ws.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        if (messageData.type === 'NEW_MESSAGE') {
          const newMsg = messageData.message;
          
          // Si c'est un message pour la conversation active
          if (activeConvId && newMsg.expediteur_id === activeConvId) {
            setMessages(prev => [...prev, newMsg]);
            
            // Marquer comme lu via API
            fetch(`/api/messages/${newMsg.id}/read`, { method: 'POST' }).catch(console.error);
            scrollToBottom();
          } else {
            // Sinon, on met à jour la liste des conversations
            fetchConversations();
          }
        }
      } catch (err) {
        console.error('WS Error:', err);
      }
    };

    return () => {
      ws.close();
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
    
    if (user) {
      try {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
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
          fetchConversations()
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
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl shadow-sm border border-[#e8e8e4] overflow-hidden">
      
      {/* Sidebar - Liste des conversations */}
      <div className={`w-full md:w-80 border-r border-gray-100/50 flex flex-col bg-white/50 ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-gray-100/50 bg-transparent flex items-center justify-between">
          <h2 className="font-heading font-bold text-gray-900 text-xl tracking-tight">Messages</h2>
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
             <MessageCircle size={16} className="text-gray-500" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loadingConvs ? (
            <div className="p-8 text-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-3 mt-10">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                 <MessageCircle className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium">Aucune conversation</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100/30 p-2 space-y-1">
              {conversations.map(conv => (
                <button
                  key={conv.correspondant.id}
                  onClick={() => setActiveConvId(conv.correspondant.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-center gap-4 ${activeConvId === conv.correspondant.id ? 'bg-[var(--color-vert-clair)] shadow-sm ring-1 ring-white/50' : 'hover:bg-gray-50/80'}`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-vert-clair)] text-[var(--color-vert-profond)] flex items-center justify-center font-bold overflow-hidden shrink-0 relative shadow-sm ring-2 ring-white">
                      {conv.correspondant.avatar_url ? (
                        <Image src={conv.correspondant.avatar_url} alt="avatar" fill sizes="48px" className="object-cover" />
                      ) : (
                        conv.correspondant.prenom?.charAt(0) || <User className="w-5 h-5" />
                      )}
                    </div>
                    {conv.non_lus > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        {conv.non_lus}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="font-bold text-gray-900 truncate">
                        {conv.correspondant.prenom} {conv.correspondant.nom?.charAt(0)}.
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 shrink-0 uppercase tracking-wider">
                        {format(new Date(conv.dernier_message.created_at), "dd/MM")}
                      </div>
                    </div>
                    <div className={`text-[13px] truncate ${conv.non_lus > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
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
      <div className={`flex-1 flex flex-col bg-transparent ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
        {activeConvId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 md:px-8 border-b border-gray-100/50 bg-white/50 backdrop-blur-sm flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveConvId(null)}
                  className="md:hidden p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  &larr; Retour
                </button>
                <div className="w-10 h-10 rounded-full bg-[var(--color-vert-clair)] text-[var(--color-vert-profond)] flex items-center justify-center font-bold overflow-hidden relative shadow-sm ring-2 ring-white">
                  {activeCorrespondant?.avatar_url ? (
                    <Image src={activeCorrespondant.avatar_url} alt="avatar" fill sizes="40px" className="object-cover" />
                  ) : (
                    activeCorrespondant?.prenom?.charAt(0) || <User className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{activeCorrespondant?.prenom} {activeCorrespondant?.nom}</h3>
                  <p className="text-xs text-[var(--color-vert-principal)] font-medium">En ligne</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent flex flex-col gap-6 custom-scrollbar">
              {loadingMessages ? (
                <div className="text-center text-gray-400 py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-400 py-10 text-sm bg-white/50 rounded-2xl mx-auto px-6 max-w-sm">Début de la conversation sécurisée avec {activeCorrespondant?.prenom}.</div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.expediteur_id === currentUser?.id
                  return (
                    <div key={msg.id} className={`flex flex-col max-w-[80%] md:max-w-[70%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                      <div className={`px-5 py-3 rounded-[20px] shadow-sm text-[14px] leading-relaxed ${isMe ? 'bg-[var(--color-vert-principal)] text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'}`}>
                        {msg.contenu}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 mt-1.5 px-2 tracking-wider">
                        {format(new Date(msg.created_at), "HH:mm")}
                      </span>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 md:p-6 bg-white/50 backdrop-blur-sm border-t border-gray-100/50 shrink-0">
              {error && <div className="mb-3 text-xs text-red-600 bg-red-50 px-4 py-2 rounded-xl font-medium">{error}</div>}
              <form onSubmit={handleSend} className="flex gap-3 items-end max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <textarea 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="w-full bg-white border border-gray-200 rounded-[24px] pl-5 pr-12 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-vert-principal)] focus:border-transparent resize-none max-h-32 min-h-[52px] text-[14px] shadow-sm transition-all custom-scrollbar"
                    rows={1}
                    onKeyDown={e => {
                      if(e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="w-[52px] h-[52px] bg-[var(--color-vert-principal)] hover:bg-green-800 text-white rounded-full flex items-center justify-center shrink-0 disabled:opacity-50 disabled:hover:bg-[var(--color-vert-principal)] shadow-md hover:shadow-lg hover:shadow-green-900/20 transition-all"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" strokeWidth={2.5} />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-transparent">
            <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6 shadow-sm border border-white">
               <MessageCircle className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">Vos Messages</h3>
            <p className="text-gray-500 font-medium">Sélectionnez une conversation pour discuter.</p>
          </div>
        )}
      </div>

    </div>
  )
}
