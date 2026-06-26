'use client'

import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'

interface EventFormProps {
  initialData?: any
  onSuccess: () => void
  onCancel: () => void
}

export default function EventForm({ initialData, onSuccess, onCancel }: EventFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    titre: initialData?.titre || '',
    description: initialData?.description || '',
    type_evt: initialData?.type_evt || 'webinaire',
    date_debut: initialData?.date_debut ? new Date(initialData.date_debut).toISOString().slice(0, 16) : '',
    date_fin: initialData?.date_fin ? new Date(initialData.date_fin).toISOString().slice(0, 16) : '',
    lieu: initialData?.lieu || '',
    pays: initialData?.pays || '',
    en_ligne: initialData?.en_ligne || false,
    lien_inscription: initialData?.lien_inscription || '',
    places_max: initialData?.places_max || '',
    publie: initialData?.publie ?? false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // On utilise la session courante (qui doit être admin)
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      setError("Vous devez être connecté.")
      setLoading(false)
      return
    }

    const payload = {
      ...formData,
      places_max: formData.places_max ? parseInt(formData.places_max as string) : null,
      date_fin: formData.date_fin || null,
    }

    try {
      let result;
      if (initialData?.id) {
        result = await supabase
          .from('evenements')
          .update(payload)
          .eq('id', initialData.id)
      } else {
        result = await supabase
          .from('evenements')
          .insert(payload)
      }

      if (result.error) throw result.error
      onSuccess()
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {initialData ? 'Modifier l\'événement' : 'Nouvel événement'}
        </h2>
        
        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
          <input 
            type="checkbox" 
            name="publie" 
            checked={formData.publie} 
            onChange={handleChange}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700">Publié en ligne</span>
        </label>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Titre de l'événement *</label>
          <input required type="text" name="titre" value={formData.titre} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Type d'événement *</label>
          <select required name="type_evt" value={formData.type_evt} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
            <option value="webinaire">Webinaire</option>
            <option value="atelier">Atelier</option>
            <option value="conference">Conférence</option>
            <option value="rencontre_locale">Rencontre locale</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Places maximum</label>
          <input type="number" name="places_max" value={formData.places_max} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Illimité si vide" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Date de début *</label>
          <input required type="datetime-local" name="date_debut" value={formData.date_debut} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Date de fin</label>
          <input type="datetime-local" name="date_fin" value={formData.date_fin} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Pays</label>
          <input type="text" name="pays" value={formData.pays} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>

        <div className="space-y-2 flex flex-col justify-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="en_ligne" checked={formData.en_ligne} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
            <span className="text-sm font-medium text-gray-700">Événement en ligne</span>
          </label>
        </div>

        {!formData.en_ligne && (
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Lieu physique</label>
            <input type="text" name="lieu" value={formData.lieu} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
        )}

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Lien d'inscription externe (Optionnel, ex: Zoom, Eventbrite)</label>
          <input type="url" name="lien_inscription" value={formData.lien_inscription} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="https://" />
          <p className="text-xs text-gray-500">Si vide, l'inscription se fera en interne sur Agrolide.</p>
        </div>
      </div>

      <div className="flex gap-4 justify-end pt-4 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">
          Annuler
        </button>
        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
