'use client'

import React, { useState } from 'react'

import { Loader2, Upload, FileText, Image as ImageIcon } from 'lucide-react'

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
    publie: initialData?.publie ?? false,
    image_url: initialData?.image_url || '',
    presentation_url: initialData?.presentation_url || '',
    ressources_url: initialData?.ressources_url || ''
  })
  
  const [uploadingField, setUploadingField] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'image_url' | 'presentation_url' | 'ressources_url', folder: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingField(fieldName)
    setError('')

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder: folder
        })
      })

      if (!res.ok) throw new Error("Erreur lors de la génération de l'URL d'upload")
      
      const { presignedUrl, publicUrl } = await res.json()

      const uploadRes = await fetch(presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      })

      if (!uploadRes.ok) throw new Error("Erreur lors de l'upload du fichier")

      setFormData(prev => ({ ...prev, [fieldName]: publicUrl }))
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Erreur d'upload")
    } finally {
      setUploadingField(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      ...formData,
      places_max: formData.places_max ? parseInt(formData.places_max as string) : null,
      date_fin: formData.date_fin || null,
    }

    try {
      const { upsertAdminEvenement } = await import('@/app/actions/admin-evenements')
      await upsertAdminEvenement(payload, initialData?.id)
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

        {/* Fichiers & Ressources */}
        <div className="md:col-span-2 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ressources & Fichiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Affiche */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Affiche de l'événement</label>
              {formData.image_url ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  <img src={formData.image_url} alt="Affiche" className="w-full h-32 object-cover" />
                  <button type="button" onClick={() => setFormData({...formData, image_url: ''})} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 text-xs">Retirer</button>
                </div>
              ) : (
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    {uploadingField === 'image_url' ? <Loader2 className="mx-auto h-8 w-8 text-gray-400 animate-spin" /> : <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />}
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                        <span>Téléverser l'affiche</span>
                        <input type="file" accept="image/*" className="sr-only" disabled={uploadingField !== null} onChange={(e) => handleFileUpload(e, 'image_url', 'evenements/affiches')} />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Présentation */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Présentation (PPT, PDF)</label>
              {formData.presentation_url ? (
                <div className="p-4 border border-green-200 bg-green-50 rounded-xl flex flex-col justify-between h-32">
                  <div className="flex items-center gap-2 text-green-700 font-medium break-all text-sm line-clamp-2">
                    <FileText className="w-5 h-5 flex-shrink-0" />
                    <span>Document de présentation lié</span>
                  </div>
                  <button type="button" onClick={() => setFormData({...formData, presentation_url: ''})} className="text-xs text-red-600 hover:underline self-end">Retirer</button>
                </div>
              ) : (
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    {uploadingField === 'presentation_url' ? <Loader2 className="mx-auto h-8 w-8 text-gray-400 animate-spin" /> : <Upload className="mx-auto h-8 w-8 text-gray-400" />}
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                        <span>Téléverser présentation</span>
                        <input type="file" className="sr-only" disabled={uploadingField !== null} onChange={(e) => handleFileUpload(e, 'presentation_url', 'evenements/presentations')} />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ressources */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Autres ressources</label>
              {formData.ressources_url ? (
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-xl flex flex-col justify-between h-32">
                  <div className="flex items-center gap-2 text-blue-700 font-medium break-all text-sm line-clamp-2">
                    <FileText className="w-5 h-5 flex-shrink-0" />
                    <span>Ressources liées</span>
                  </div>
                  <button type="button" onClick={() => setFormData({...formData, ressources_url: ''})} className="text-xs text-red-600 hover:underline self-end">Retirer</button>
                </div>
              ) : (
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <div className="space-y-1 text-center">
                    {uploadingField === 'ressources_url' ? <Loader2 className="mx-auto h-8 w-8 text-gray-400 animate-spin" /> : <Upload className="mx-auto h-8 w-8 text-gray-400" />}
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                        <span>Téléverser ressource</span>
                        <input type="file" className="sr-only" disabled={uploadingField !== null} onChange={(e) => handleFileUpload(e, 'ressources_url', 'evenements/ressources')} />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
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
