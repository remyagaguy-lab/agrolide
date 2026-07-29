'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Plus, Trash2, Loader2, MessageCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { deleteThread, createAdminThread } from '@/app/actions/admin-forum-extended'

export default function ThreadsManager() {
  const [threads, setThreads] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({ categorie_id: '', titre: '', contenu: '' })

  const fetchThreads = async () => {
    setLoading(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Fetch categories for the form
    const { data: cats } = await supabase.from('forum_categories').select('id, nom').order('ordre')
    if (cats) {
      setCategories(cats)
      if (cats.length > 0) setFormData(f => ({ ...f, categorie_id: cats[0].id }))
    }

    // Fetch threads
    const { data } = await supabase
      .from('forum_fils')
      .select('*, auteur:profiles(prenom, nom), categorie:forum_categories(nom)')
      .order('created_at', { ascending: false })
      
    if (data) setThreads(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchThreads()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette discussion et TOUS les messages qu'elle contient ?")) return
    setProcessing(id)
    try {
      await deleteThread(id)
      fetchThreads()
    } catch (e: any) {
      alert("Erreur: " + e.message)
    } finally {
      setProcessing(null)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing('new')
    try {
      await createAdminThread(formData.categorie_id, formData.titre, formData.contenu)
      setIsFormOpen(false)
      setFormData({ ...formData, titre: '', contenu: '' })
      fetchThreads()
      alert("Discussion créée avec succès")
    } catch (e: any) {
      alert("Erreur: " + e.message)
    } finally {
      setProcessing(null)
    }
  }

  if (isFormOpen) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-3xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Nouvelle discussion officielle</h2>
        
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Catégorie *</label>
            <select 
              required 
              value={formData.categorie_id} 
              onChange={e=>setFormData({...formData, categorie_id: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Titre de la discussion *</label>
            <input 
              required 
              type="text" 
              value={formData.titre} 
              onChange={e=>setFormData({...formData, titre: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Premier message *</label>
            <textarea 
              required 
              rows={5}
              value={formData.contenu} 
              onChange={e=>setFormData({...formData, contenu: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium">
              Annuler
            </button>
            <button type="submit" disabled={processing==='new'} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium flex items-center gap-2">
              {processing === 'new' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Créer et publier'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Discussions</h2>
        <button onClick={() => setIsFormOpen(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" /> Nouvelle discussion
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
            <tr>
              <th className="p-4 font-semibold">Titre</th>
              <th className="p-4 font-semibold">Catégorie</th>
              <th className="p-4 font-semibold">Auteur</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Chargement...</td></tr>
            ) : threads.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Aucune discussion</td></tr>
            ) : threads.map(thread => (
              <tr key={thread.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-900 max-w-xs truncate" title={thread.titre}>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-gray-400" /> {thread.titre}
                  </div>
                </td>
                <td className="p-4 text-gray-600">{thread.categorie?.nom}</td>
                <td className="p-4 text-gray-900">{thread.auteur?.prenom} {thread.auteur?.nom}</td>
                <td className="p-4 text-gray-500">{format(new Date(thread.created_at), "dd MMM yyyy", { locale: fr })}</td>
                <td className="p-4 flex justify-end gap-2">
                  <Link href={`/membres/forum/fil/${thread.id}`} target="_blank" className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Voir sur le site">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(thread.id)} disabled={processing===thread.id} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Supprimer la discussion">
                    {processing === thread.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
