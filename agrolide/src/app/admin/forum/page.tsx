'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
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
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Administration du Forum
        </h1>
        <p className="text-gray-500">Gérez le contenu, l'architecture et les membres du forum.</p>
      </div>

      <div className="flex space-x-1 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
        <button 
          onClick={() => setActiveTab('signalements')}
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'signalements' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          Signalements {reportedMessages.length > 0 && <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">{reportedMessages.length}</span>}
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'categories' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          Catégories
        </button>
        <button 
          onClick={() => setActiveTab('fils')}
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'fils' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          Discussions
        </button>
        <button 
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'messages' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          Recherche & Messages
        </button>
      </div>

      {activeTab === 'signalements' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-2" />
            <span className="text-gray-500">Chargement...</span>
          </div>
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
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-bold text-gray-900">{msg.auteur?.prenom} {msg.auteur?.nom}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{format(new Date(msg.created_at), "dd MMM yyyy HH:mm", { locale: fr })}</span>
                      <span className="text-gray-400">•</span>
                      <Link href={`/membres/forum/fil/${msg.fil?.id}`} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1 font-medium truncate">
                        Sujet : {msg.fil?.titre} <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 text-gray-800 text-sm whitespace-pre-wrap font-sans break-words">
                      {msg.contenu}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 shrink-0 w-full lg:w-auto">
                    <button 
                      onClick={() => handleIgnore(msg.id)}
                      disabled={processing === msg.id}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg text-sm transition-colors border border-gray-200 w-full flex justify-center items-center h-10"
                    >
                      {processing === msg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ignorer (Republier)'}
                    </button>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      disabled={processing === msg.id}
                      className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium rounded-lg text-sm transition-colors border border-orange-200 flex items-center gap-2 justify-center w-full h-10"
                    >
                      {processing === msg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> Supprimer le message</>}
                    </button>
                    {msg.auteur_id && (
                      <button 
                        onClick={() => handleBanUser(msg.id, msg.auteur_id)}
                        disabled={processing === msg.id}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg text-sm transition-colors border border-red-200 flex items-center gap-2 justify-center w-full mt-2 h-10"
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
