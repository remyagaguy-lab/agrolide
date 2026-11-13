'use client'

import React, { useState, useEffect } from 'react'

import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { deleteThread, createAdminThread } from '@/app/actions/admin-forum-extended'

import { Plus, Trash2, Loader2, MessageCircle, ExternalLink } from "@/components/ui/icons"
export default function ThreadsManager() {
  const [threads, setThreads] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({ categorie_id: '', titre: '', contenu: '' })

  const fetchThreads = async () => {
    setLoading(true)
    try {
      const { getForumCategories } = await import('@/app/actions/forum')
      const cats = await getForumCategories()
      if (cats) {
        setCategories(cats)
        if (cats.length > 0) setFormData(f => ({ ...f, categorie_id: cats[0].id }))
      }

      const { fetchAdminThreads } = await import('@/app/actions/admin-forum')
      const data = await fetchAdminThreads()
      if (data) setThreads(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
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
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm max-w-3xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-on-surface">Nouvelle discussion officielle</h2>
        
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant">Catégorie *</label>
            <select 
              required 
              value={formData.categorie_id} 
              onChange={e=>setFormData({...formData, categorie_id: e.target.value})}
              className="w-full px-3 py-2 border border-outline rounded-lg outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant">Titre de la discussion *</label>
            <input 
              required 
              type="text" 
              value={formData.titre} 
              onChange={e=>setFormData({...formData, titre: e.target.value})}
              className="w-full px-3 py-2 border border-outline rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface-variant">Premier message *</label>
            <textarea 
              required 
              rows={5}
              value={formData.contenu} 
              onChange={e=>setFormData({...formData, contenu: e.target.value})}
              className="w-full px-3 py-2 border border-outline rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-xl font-medium">
              Annuler
            </button>
            <button type="submit" disabled={processing==='new'} className="px-4 py-2 bg-primary hover:bg-primary/90 text-on-primary rounded-xl font-medium flex items-center gap-2">
              {processing === 'new' ? <Loader2 className="size-4 animate-spin" /> : 'Créer et publier'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-on-surface">Discussions</h2>
        <button onClick={() => setIsFormOpen(true)} className="bg-primary hover:bg-primary/90 text-on-primary px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
          <Plus className="size-4" /> Nouvelle discussion
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant">
            <tr>
              <th className="p-4 font-semibold">Titre</th>
              <th className="p-4 font-semibold">Catégorie</th>
              <th className="p-4 font-semibold">Auteur</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-on-surface-muted">Chargement...</td></tr>
            ) : threads.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-on-surface-muted">Aucune discussion</td></tr>
            ) : threads.map(thread => (
              <tr key={thread.id} className="hover:bg-surface-container-low transition-colors">
                <td className="p-4 font-bold text-on-surface max-w-xs truncate" title={thread.titre}>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="size-4 text-on-surface-muted" /> {thread.titre}
                  </div>
                </td>
                <td className="p-4 text-on-surface-variant">{thread.categorie?.nom}</td>
                <td className="p-4 text-on-surface">{thread.auteur?.prenom} {thread.auteur?.nom}</td>
                <td className="p-4 text-on-surface-muted">{format(new Date(thread.created_at), "dd MMM yyyy", { locale: fr })}</td>
                <td className="p-4 flex justify-end gap-2">
                  <Link href={`/membres/forum/fil/${thread.id}`} target="_blank" className="p-2 text-info bg-info-container hover:bg-info-container rounded-lg transition-colors" title="Voir sur le site">
                    <ExternalLink className="size-4" />
                  </Link>
                  <button onClick={() => handleDelete(thread.id)} disabled={processing===thread.id} className="p-2 text-error bg-error-container hover:bg-error-container rounded-lg transition-colors" title="Supprimer la discussion">
                    {processing === thread.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
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
