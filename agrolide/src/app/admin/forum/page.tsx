'use client'

import React, { useState, useEffect } from 'react'

import { ShieldAlert, CheckCircle, Trash2, ArrowRight, UserX, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ignoreReport, deleteMessage, banUser } from '@/app/actions/admin-forum'
import CategoriesManager from '@/components/modules/admin/forum/CategoriesManager'
import ThreadsManager from '@/components/modules/admin/forum/ThreadsManager'
import MessagesManager from '@/components/modules/admin/forum/MessagesManager'

export const dynamic = 'force-dynamic';

export default function AdminForumPage() {
  const [reportedMessages, setReportedMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'signalements' | 'categories' | 'fils' | 'messages'>('signalements')

  const fetchReported = async () => {
    setLoading(true)
    try {
      const { fetchReportedMessages } = await import('@/app/actions/admin-forum')
      const data = await fetchReportedMessages()
      if (data) setReportedMessages(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReported()
  }, [])

  const handleIgnore = async (id: string) => {
    setProcessing(id)
    try {
      await ignoreReport(id)
      setReportedMessages(msgs => msgs.filter(m => m.id !== id))
      alert("Signalement ignoré. Le message a été republié.")
    } catch (err: any) {
      alert("Erreur: " + err.message)
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce message ?")) return
    setProcessing(id)
    try {
      await deleteMessage(id)
      setReportedMessages(msgs => msgs.filter(m => m.id !== id))
      alert("Message supprimé de la vue publique.")
    } catch (err: any) {
      alert("Erreur: " + err.message)
    } finally {
      setProcessing(null)
    }
  }

  const handleBanUser = async (messageId: string, userId: string) => {
    const reason = window.prompt("Motif du bannissement (obligatoire) :")
    if (!reason) return

    if (!window.confirm("Attention : l'utilisateur sera suspendu indéfiniment de la plateforme. Confirmer ?")) return

    setProcessing(messageId) // On utilise l'ID du message pour le statut de chargement
    try {
      await banUser(userId, reason)
      // Une fois l'utilisateur banni, on supprime aussi le message par sécurité
      await deleteMessage(messageId)
      setReportedMessages(msgs => msgs.filter(m => m.id !== messageId))
      alert("Le compte de l'utilisateur a été suspendu.")
    } catch (err: any) {
      alert("Erreur: " + err.message)
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
          Administration du Forum
        </h1>
        <p className="text-on-surface-muted">Gérez le contenu, l'architecture et les membres du forum.</p>
      </div>

      <div className="flex space-x-1 border-b border-outline-variant mb-6 overflow-x-auto pb-1">
        <button 
          onClick={() => setActiveTab('signalements')}
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'signalements' ? 'border-primary text-primary' : 'border-transparent text-on-surface-muted hover:text-on-surface-variant hover:border-outline'}`}
        >
          Signalements {reportedMessages.length > 0 && <span className="ml-2 bg-error-container text-error py-0.5 px-2 rounded-full text-xs">{reportedMessages.length}</span>}
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'categories' ? 'border-primary text-primary' : 'border-transparent text-on-surface-muted hover:text-on-surface-variant hover:border-outline'}`}
        >
          Catégories
        </button>
        <button 
          onClick={() => setActiveTab('fils')}
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'fils' ? 'border-primary text-primary' : 'border-transparent text-on-surface-muted hover:text-on-surface-variant hover:border-outline'}`}
        >
          Discussions
        </button>
        <button 
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'messages' ? 'border-primary text-primary' : 'border-transparent text-on-surface-muted hover:text-on-surface-variant hover:border-outline'}`}
        >
          Recherche & Messages
        </button>
      </div>

      {activeTab === 'signalements' && (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-on-surface-muted mb-2" />
            <span className="text-on-surface-muted">Chargement...</span>
          </div>
        ) : reportedMessages.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 bg-success-container text-success rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-on-surface">Aucun signalement</h3>
            <p className="text-on-surface-muted">Tout est en ordre sur le forum !</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant">
            {reportedMessages.map(msg => (
              <div key={msg.id} className="p-6 hover:bg-surface-container-low transition-colors">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-bold text-on-surface">{msg.auteur?.prenom} {msg.auteur?.nom}</span>
                      <span className="text-on-surface-muted">•</span>
                      <span className="text-on-surface-muted">{format(new Date(msg.created_at), "dd MMM yyyy HH:mm", { locale: fr })}</span>
                      <span className="text-on-surface-muted">•</span>
                      <Link href={`/membres/forum/fil/${msg.fil?.id}`} target="_blank" className="text-info hover:underline flex items-center gap-1 font-medium truncate">
                        Sujet : {msg.fil?.titre} <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="bg-tertiary-container/50 p-4 rounded-xl border border-warning/40 text-on-surface text-sm whitespace-pre-wrap font-sans break-words">
                      {msg.contenu}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 shrink-0 w-full lg:w-auto">
                    <button 
                      onClick={() => handleIgnore(msg.id)}
                      disabled={processing === msg.id}
                      className="px-4 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-medium rounded-lg text-sm transition-colors border border-outline-variant w-full flex justify-center items-center h-10"
                    >
                      {processing === msg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ignorer (Republier)'}
                    </button>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      disabled={processing === msg.id}
                      className="px-4 py-2 bg-tertiary-container hover:bg-warning-container text-on-warning-container font-medium rounded-lg text-sm transition-colors border border-warning/40 flex items-center gap-2 justify-center w-full h-10"
                    >
                      {processing === msg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> Supprimer le message</>}
                    </button>
                    {msg.auteur_id && (
                      <button 
                        onClick={() => handleBanUser(msg.id, msg.auteur_id)}
                        disabled={processing === msg.id}
                        className="px-4 py-2 bg-error-container hover:bg-error-container text-error font-medium rounded-lg text-sm transition-colors border border-error/30 flex items-center gap-2 justify-center w-full mt-2 h-10"
                        title="Suspendre l'utilisateur définitivement"
                      >
                         <UserX className="w-4 h-4" /> Bannir l'auteur
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      )}

      {activeTab === 'categories' && <CategoriesManager />}
      {activeTab === 'fils' && <ThreadsManager />}
      {activeTab === 'messages' && <MessagesManager />}
    </div>
  )
}
