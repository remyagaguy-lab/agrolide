'use client'

import React, { useState, useEffect } from 'react'

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
      try {
        const { getForumCategories } = await import('@/app/actions/forum')
        const data = await getForumCategories()
        if (data) {
          setCategories(data)
          if (!defaultCatId && data.length > 0) {
            setFormData(prev => ({ ...prev, categorie_id: data[0].id }))
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingCats(false)
      }
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
      <Link href="/membres/forum" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-muted hover:text-on-surface transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour au forum
      </Link>
      
      <div>
        <h1 className="text-3xl font-bold text-on-surface">Nouveau sujet</h1>
        <p className="text-on-surface-variant mt-2">Lancez une nouvelle discussion avec la communauté.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant space-y-6">
        {error && <div className="p-3 bg-error-container text-error rounded-lg text-sm">{error}</div>}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface-variant">Catégorie *</label>
          <select 
            required
            disabled={loadingCats}
            value={formData.categorie_id}
            onChange={e => setFormData({ ...formData, categorie_id: e.target.value })}
            className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
          >
            {loadingCats ? <option>Chargement...</option> : categories.map(c => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface-variant">Titre du sujet *</label>
          <input 
            type="text" 
            required
            value={formData.titre}
            onChange={e => setFormData({ ...formData, titre: e.target.value })}
            className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none"
            placeholder="Ex: Conseils pour la culture hors-sol de la tomate"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface-variant">Premier message *</label>
          <textarea 
            required
            maxLength={3000}
            value={formData.contenu}
            onChange={e => setFormData({ ...formData, contenu: e.target.value })}
            className="w-full h-48 px-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none resize-y"
            placeholder="Décrivez votre sujet, posez votre question... (Markdown supporté)"
          />
        </div>
        
        <div className="flex justify-end pt-4 border-t border-outline-variant">
          <button 
            type="submit"
            disabled={submitting || !formData.titre.trim() || !formData.contenu.trim()}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publier le sujet'}
          </button>
        </div>
      </form>
    </div>
  )
}
