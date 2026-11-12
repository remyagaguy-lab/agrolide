'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/auth/client'
import { ArrowLeft, Send, MessageCircle, Users } from 'lucide-react'
import { format } from 'date-fns'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils/formatters'

/** Ce que la page serveur sait du contact ouvert : nom, photo et spécialité (jamais d'e-mail ni de téléphone). */
export interface ContactMessagerie {
  id: string
  prenom: string | null
  nom: string | null
  photo_url: string | null
  specialite: string | null
}

export interface MessagesClientProps {
  /** Contact demandé par l'adresse (`?user=`), vérifié côté serveur comme relation acceptée. */
  contact: ContactMessagerie | null
  /** Pourquoi le contact demandé n'est pas utilisable ; `null` si tout va bien ou si aucun contact n'est demandé. */
  refus: { raison: 'introuvable' | 'pas-de-relation'; id: string } | null
}

const nomComplet = (c?: { prenom?: string | null; nom?: string | null } | null) => `${c?.prenom ?? ''} ${c?.nom ?? ''}`.trim()

export default function MessagesClient({ contact, refus }: MessagesClientProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(contact?.id ?? null)
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
    setError('')
    if (user) {
      try {
        const res = await fetch(`/api/messages/${correspondantId}`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setMessages(data)
          // Le chargement a marqué les messages comme lus : le compteur de la navigation se recalcule.
          router.refresh()
        } else {
          setError('Impossible de charger les messages. Réessayez dans un instant.')
        }
      } catch (err) {
        console.error(err)
        setError('Impossible de charger les messages. Réessayez dans un instant.')
      }
    }
    setLoadingMessages(false)
    scrollToBottom()
  }

  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId)

      // Le chargement des messages les marque comme lus côté serveur : on met à jour la liste localement.
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

          if (activeConvId && newMsg.expediteur_id === activeConvId) {
            // Message de la conversation ouverte : il est affiché ; il sera marqué lu au prochain chargement.
            setMessages(prev => [...prev, newMsg]);
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
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
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
          setMessages(prev => [...prev, data.message])
          setNewMessage('')
          scrollToBottom()
          fetchConversations()
        }
      } catch (err: any) {
        setError(err.message)
      }
    }
    setSending(false)
  }

  // Le contact connu du serveur (nom, photo, spécialité) prime sur la liste, qui n'a pas la spécialité.
  const fromList = conversations.find(c => c.correspondant.id === activeConvId)?.correspondant
  const activeCorrespondant = activeConvId
    ? {
        id: activeConvId,
        prenom: contact?.id === activeConvId ? contact.prenom : fromList?.prenom,
        nom: contact?.id === activeConvId ? contact.nom : fromList?.nom,
        photo_url: contact?.id === activeConvId ? contact.photo_url : fromList?.photo_url,
        specialite: contact?.id === activeConvId ? contact.specialite : null,
      }
    : null
  const activeName = nomComplet(activeCorrespondant) || 'ce membre'

  return (
    <div className="relative flex h-[calc(100dvh-14rem)] min-h-[28rem] overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest lg:h-[calc(100dvh-9rem)]">

      {/* Liste des conversations */}
      <div
        role="region"
        aria-labelledby="messages-liste"
        className={cn('w-full flex-col border-r border-outline-variant bg-surface-container-low md:w-80', activeConvId ? 'hidden md:flex' : 'flex')}
      >
        <div className="flex items-center justify-between border-b border-outline-variant p-4">
          <h2 id="messages-liste" className="text-title-lg text-on-surface">Messages</h2>
        </div>

        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="flex justify-center p-8 text-on-surface-muted" role="status" aria-label="Chargement des conversations"><Spinner /></div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-6 text-center">
              <p className="text-body-sm text-on-surface-variant">Aucune conversation pour le moment. Vous pouvez écrire à vos relations.</p>
              <Button variant="outline" href="/membres/reseau?onglet=relations">
                <Users className="size-5" aria-hidden />
                Voir mes relations
              </Button>
            </div>
          ) : (
            <ul className="space-y-1 p-2">
              {conversations.map(conv => {
                const name = nomComplet(conv.correspondant)
                const actif = activeConvId === conv.correspondant.id
                return (
                  <li key={conv.correspondant.id}>
                    <button
                      type="button"
                      onClick={() => setActiveConvId(conv.correspondant.id)}
                      aria-current={actif ? 'true' : undefined}
                      className={cn(
                        'ag-state flex min-h-14 w-full items-center gap-3 rounded-control border p-2.5 text-left transition-colors duration-150 ease-standard',
                        actif ? 'border-outline-variant bg-primary-container' : 'border-transparent hover:bg-surface-container',
                      )}
                    >
                      <span className="relative shrink-0">
                        <Avatar src={conv.correspondant.photo_url} name={name} size="md" />
                        {conv.non_lus > 0 && (
                          <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full border-2 border-surface-container-low bg-tertiary px-1 text-label-sm text-on-tertiary">
                            <span aria-hidden>{conv.non_lus}</span>
                            <span className="sr-only">{conv.non_lus} {conv.non_lus > 1 ? 'messages non lus' : 'message non lu'}</span>
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-label-lg text-on-surface">{name || 'Membre agrolide'}</span>
                          <span className="shrink-0 text-label-sm text-on-surface-muted">
                            {format(new Date(conv.dernier_message.created_at), 'dd/MM')}
                          </span>
                        </span>
                        <span className={cn('block truncate text-body-sm', conv.non_lus > 0 ? 'font-semibold text-on-surface' : 'text-on-surface-variant')}>
                          {conv.dernier_message.expediteur_id === currentUser?.id ? 'Vous : ' : ''}
                          {conv.dernier_message.contenu}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Conversation */}
      <div className={cn('min-w-0 flex-1 flex-col', !activeConvId ? 'hidden md:flex' : 'flex')}>
        {activeConvId ? (
          <>
            <div className="flex shrink-0 items-center gap-2 border-b border-outline-variant bg-surface-container-lowest p-3 md:px-5">
              <IconButton label="Retour à la liste des conversations" className="md:hidden" onClick={() => setActiveConvId(null)}>
                <ArrowLeft className="size-5" aria-hidden />
              </IconButton>
              <Avatar src={activeCorrespondant?.photo_url} name={activeName} size="md" />
              <div className="min-w-0">
                <h3 className="truncate text-title-sm text-on-surface">{activeName}</h3>
                {activeCorrespondant?.specialite && (
                  <p className="truncate text-body-sm text-on-surface-variant">{activeCorrespondant.specialite}</p>
                )}
              </div>
            </div>

            <div
              role="log"
              aria-live="polite"
              aria-label={`Conversation avec ${activeName}`}
              className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-surface-container-low p-4"
            >
              {loadingMessages ? (
                <div className="flex justify-center py-10 text-on-surface-muted" role="status" aria-label="Chargement des messages"><Spinner /></div>
              ) : messages.length === 0 ? (
                <p className="mx-auto max-w-sm rounded-control border border-outline-variant bg-surface-container-lowest px-4 py-3 text-center text-body-sm text-on-surface-variant">
                  Aucun message pour le moment. Écrivez le premier à {activeCorrespondant?.prenom || activeName}.
                </p>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.expediteur_id === currentUser?.id
                  return (
                    <div key={msg.id} className={cn('flex max-w-[85%] flex-col md:max-w-[70%]', isMe ? 'items-end self-end' : 'items-start self-start')}>
                      <p className={cn(
                        'whitespace-pre-wrap break-words rounded-card px-4 py-2.5 text-body-sm',
                        isMe ? 'rounded-br-sm bg-primary text-on-primary' : 'rounded-bl-sm border border-outline-variant bg-surface-container-lowest text-on-surface',
                      )}>
                        <span className="sr-only">{isMe ? 'Vous' : activeName} : </span>
                        {msg.contenu}
                      </p>
                      <span className="mt-1 px-1 text-label-sm text-on-surface-muted">
                        {format(new Date(msg.created_at), 'HH:mm')}
                      </span>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="shrink-0 border-t border-outline-variant bg-surface-container-lowest p-3 md:p-4">
              {error && <p role="alert" className="mb-2 rounded-control bg-error-container px-3 py-2 text-body-sm text-on-error-container">{error}</p>}
              <form onSubmit={handleSend} className="flex items-end gap-2">
                <textarea
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  aria-label={`Votre message à ${activeName}`}
                  placeholder="Écrivez votre message…"
                  maxLength={2000}
                  rows={1}
                  className="custom-scrollbar max-h-28 min-h-12 w-full flex-1 resize-none rounded-control border border-outline bg-surface-container-lowest px-4 py-3 text-body-sm text-on-surface placeholder:text-on-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend(e)
                    }
                  }}
                />
                <Button type="submit" variant="secondary" className="size-12 !min-h-12 !px-0" disabled={sending || !newMessage.trim()} loading={sending} aria-label="Envoyer le message">
                  <Send className="size-5" aria-hidden />
                </Button>
              </form>
            </div>
          </>
        ) : refus ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <EmptyState arche
              icon={<MessageCircle />}
              title={refus.raison === 'introuvable' ? 'Ce membre est introuvable' : 'Vous n’êtes pas connecté(e) à ce membre'}
              description={
                refus.raison === 'introuvable'
                  ? 'Le lien ouvert ne correspond à aucun membre de l’annuaire.'
                  : 'Vous pouvez échanger par message avec vos relations. Envoyez une invitation depuis sa fiche.'
              }
              action={
                refus.raison === 'introuvable' ? (
                  <Button variant="secondary" href="/membres/annuaire">Découvrir des membres</Button>
                ) : (
                  <Button variant="secondary" href={`/annuaire/${refus.id}`}>Voir sa fiche</Button>
                )
              }
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <span aria-hidden className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-surface-container text-on-surface-muted">
              <MessageCircle className="size-8" strokeWidth={1.5} />
            </span>
            <h3 className="text-title-lg text-on-surface">Vos messages</h3>
            <p className="mt-1 text-body-md text-on-surface-variant">Sélectionnez une conversation pour écrire.</p>
          </div>
        )}
      </div>

    </div>
  )
}
