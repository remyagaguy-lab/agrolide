'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Plus, Edit2, Trash2, Loader2, Save, X } from 'lucide-react'
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/admin-forum-extended'

export default function CategoriesManager() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)
  const [formData, setFormData] = useState({ nom: '', description: '', icone: 'MessageSquare', ordre: 10 })

  const fetchCats = async () => {
    setLoading(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data } = await supabase.from('forum_categories').select('*').order('ordre')
    if (data) setCategories(data)
    setLoading(false)
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
        <h2 className="text-xl font-bold text-gray-900">Catégories du Forum</h2>
        <button onClick={startCreate} className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" /> Nouvelle catégorie
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
            <tr>
              <th className="p-4 font-semibold">Ordre</th>
              <th className="p-4 font-semibold">Nom</th>
              <th className="p-4 font-semibold">Description</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {editingId === 'new' && (
              <tr className="bg-gray-50/50">
                <td className="p-4"><input type="number" value={formData.ordre} onChange={e=>setFormData({...formData, ordre: parseInt(e.target.value)})} className="w-16 p-1 border rounded" /></td>
                <td className="p-4"><input type="text" placeholder="Nom" value={formData.nom} onChange={e=>setFormData({...formData, nom: e.target.value})} className="w-full p-1 border rounded" /></td>
                <td className="p-4"><input type="text" placeholder="Description" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full p-1 border rounded" /></td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={handleCreate} disabled={processing==='new'} className="text-green-600 p-1 bg-green-50 rounded hover:bg-green-100"><Save className="w-4 h-4" /></button>
                  <button onClick={() => setEditingId(null)} className="text-gray-500 p-1 bg-gray-100 rounded hover:bg-gray-200"><X className="w-4 h-4" /></button>
                </td>
              </tr>
            )}
            
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Chargement...</td></tr>
            ) : categories.map(cat => (
              editingId === cat.id ? (
                <tr key={cat.id} className="bg-gray-50/50">
                  <td className="p-4"><input type="number" value={formData.ordre} onChange={e=>setFormData({...formData, ordre: parseInt(e.target.value)})} className="w-16 p-1 border rounded" /></td>
                  <td className="p-4"><input type="text" value={formData.nom} onChange={e=>setFormData({...formData, nom: e.target.value})} className="w-full p-1 border rounded" /></td>
                  <td className="p-4"><input type="text" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full p-1 border rounded" /></td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleUpdate(cat.id)} disabled={processing===cat.id} className="text-green-600 p-1 bg-green-50 rounded hover:bg-green-100"><Save className="w-4 h-4" /></button>
                    <button onClick={() => setEditingId(null)} className="text-gray-500 p-1 bg-gray-100 rounded hover:bg-gray-200"><X className="w-4 h-4" /></button>
                  </td>
                </tr>
              ) : (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-500">{cat.ordre}</td>
                  <td className="p-4 font-bold text-gray-900">{cat.nom}</td>
                  <td className="p-4 text-gray-600">{cat.description}</td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => startEdit(cat)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Modifier">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} disabled={processing===cat.id} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Supprimer">
                      {processing === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
