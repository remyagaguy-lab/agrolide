'use client'

import React, { useState, useEffect } from 'react'

import { createCategory, updateCategory, deleteCategory } from '@/app/actions/admin-forum-extended'

import { Plus, Pencil, Trash2, Loader2, Save, X } from "@/components/ui/icons"
export default function CategoriesManager() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)
  const [formData, setFormData] = useState({ nom: '', description: '', icone: 'MessageSquare', ordre: 10 })

  const fetchCats = async () => {
    setLoading(true)
    try {
      const { getForumCategories } = await import('@/app/actions/forum')
      const data = await getForumCategories()
      if (data) setCategories(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCats()
  }, [])

  const handleCreate = async () => {
    if (!formData.nom) return alert("Le nom est obligatoire")
    setProcessing('new')
    try {
      await createCategory(formData)
      setFormData({ nom: '', description: '', icone: 'MessageSquare', ordre: 10 })
      setEditingId(null)
      fetchCats()
    } catch (e: any) {
      alert("Erreur: " + e.message)
    } finally {
      setProcessing(null)
    }
  }

  const handleUpdate = async (id: string) => {
    if (!formData.nom) return alert("Le nom est obligatoire")
    setProcessing(id)
    try {
      await updateCategory(id, formData)
      setEditingId(null)
      fetchCats()
    } catch (e: any) {
      alert("Erreur: " + e.message)
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cette catégorie ? Cela échouera s'il y a des fils de discussion dedans.")) return
    setProcessing(id)
    try {
      await deleteCategory(id)
      fetchCats()
    } catch (e: any) {
      alert("Erreur: " + e.message)
    } finally {
      setProcessing(null)
    }
  }

  const startEdit = (cat: any) => {
    setEditingId(cat.id)
    setFormData({ nom: cat.nom, description: cat.description, icone: cat.icone, ordre: cat.ordre })
  }

  const startCreate = () => {
    setEditingId('new')
    setFormData({ nom: '', description: '', icone: 'MessageSquare', ordre: 10 })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-on-surface">Catégories du Forum</h2>
        <button onClick={startCreate} className="bg-primary hover:bg-primary/90 text-on-primary px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
          <Plus className="size-4" /> Nouvelle catégorie
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant">
            <tr>
              <th className="p-4 font-semibold">Ordre</th>
              <th className="p-4 font-semibold">Nom</th>
              <th className="p-4 font-semibold">Description</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {editingId === 'new' && (
              <tr className="bg-surface-container-low/50">
                <td className="p-4"><input type="number" value={formData.ordre} onChange={e=>setFormData({...formData, ordre: parseInt(e.target.value)})} className="w-16 p-1 border rounded" /></td>
                <td className="p-4"><input type="text" placeholder="Nom" value={formData.nom} onChange={e=>setFormData({...formData, nom: e.target.value})} className="w-full p-1 border rounded" /></td>
                <td className="p-4"><input type="text" placeholder="Description" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full p-1 border rounded" /></td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={handleCreate} disabled={processing==='new'} className="text-success p-1 bg-success-container rounded hover:bg-success-container"><Save className="size-4" /></button>
                  <button onClick={() => setEditingId(null)} className="text-on-surface-muted p-1 bg-surface-container rounded hover:bg-surface-container-high"><X className="size-4" /></button>
                </td>
              </tr>
            )}
            
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-on-surface-muted">Chargement...</td></tr>
            ) : categories.map(cat => (
              editingId === cat.id ? (
                <tr key={cat.id} className="bg-surface-container-low/50">
                  <td className="p-4"><input type="number" value={formData.ordre} onChange={e=>setFormData({...formData, ordre: parseInt(e.target.value)})} className="w-16 p-1 border rounded" /></td>
                  <td className="p-4"><input type="text" value={formData.nom} onChange={e=>setFormData({...formData, nom: e.target.value})} className="w-full p-1 border rounded" /></td>
                  <td className="p-4"><input type="text" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full p-1 border rounded" /></td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleUpdate(cat.id)} disabled={processing===cat.id} className="text-success p-1 bg-success-container rounded hover:bg-success-container"><Save className="size-4" /></button>
                    <button onClick={() => setEditingId(null)} className="text-on-surface-muted p-1 bg-surface-container rounded hover:bg-surface-container-high"><X className="size-4" /></button>
                  </td>
                </tr>
              ) : (
                <tr key={cat.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 text-on-surface-muted">{cat.ordre}</td>
                  <td className="p-4 font-bold text-on-surface">{cat.nom}</td>
                  <td className="p-4 text-on-surface-variant">{cat.description}</td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => startEdit(cat)} className="p-2 text-info bg-info-container hover:bg-info-container rounded-lg transition-colors" title="Modifier">
                      <Pencil className="size-4" />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} disabled={processing===cat.id} className="p-2 text-error bg-error-container hover:bg-error-container rounded-lg transition-colors" title="Supprimer">
                      {processing === cat.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                    </button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
