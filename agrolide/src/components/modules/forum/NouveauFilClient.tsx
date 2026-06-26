'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NouveauFilClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultCatId = searchParams.get('cat') || ''
  
  const [categories, setCategories] = useState<any[]>([])
  const [loadingCats, setLoadingCats] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    categorie_id: defaultCatId,
    titre: '',
    contenu: ''
  })

  useEffect(() => {
    const fetchCats = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      const { data } = await supabase.from('forum_categories').select('*').order('ordre')
      if (data) {
        setCategories(data)
        if (!defaultCatId && data.length > 0) {
          setFormData(prev => ({ ...prev, categorie_id: data[0].id }))
        }
      }
      setLoadingCats(false)
    }
    fetchCats()
  }, [defaultCatId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    
    try {
      const response = await fetch('/api/forum/fils', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue")
      }
      
      // Redirection vers le nouveau fil
      if (data.fil_id) {
        router.push(`/membres/forum/fil/${data.fil_id}`)
      } else {
        router.push('/membres/forum')
      }
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link href="/membres/forum" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour au forum
      </Link>
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nouveau sujet</h1>
        <p className="text-gray-600 mt-2">Lancez une nouvelle discussion avec la communauté.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Catégorie *</label>
          <select 
            required
            disabled={loadingCats}
            value={formData.categorie_id}
            onChange={e => setFormData({ ...formData, categorie_id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
          >
            {loadingCats ? <option>Chargement...</option> : categories.map(c => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Titre du sujet *</label>
          <input 
            type="text" 
            required
            value={formData.titre}
            onChange={e => setFormData({ ...formData, titre: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="Ex: Conseils pour la culture hors-sol de la tomate"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Premier message *</label>
          <textarea 
            required
            maxLength={3000}
            value={formData.contenu}
            onChange={e => setFormData({ ...formData, contenu: e.target.value })}
            className="w-full h-48 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-y"
            placeholder="Décrivez votre sujet, posez votre question... (Markdown supporté)"
          />
        </div>
        
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button 
            type="submit"
            disabled={submitting || !formData.titre.trim() || !formData.contenu.trim()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publier le sujet'}
          </button>
        </div>
      </form>
    </div>
  )
}
