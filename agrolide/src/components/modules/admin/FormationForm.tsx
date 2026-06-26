"use client"

import React, { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface FormationFormProps {
  initialData?: any
  onSuccess: () => void
  onCancel: () => void
}

export default function FormationForm({ initialData, onSuccess, onCancel }: FormationFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    titre: initialData?.titre || "",
    description: initialData?.description || "",
    thematique: initialData?.thematique || "",
    niveau: initialData?.niveau || "Tous niveaux",
    modalite: initialData?.modalite || "En ligne",
    prix: initialData?.prix || 0,
    statut: initialData?.statut || "brouillon"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      setError("Vous devez être connecté.")
      setLoading(false)
      return
    }

    const payload = {
      ...formData,
      prix: formData.prix ? parseFloat(formData.prix.toString()) : 0,
    }

    try {
      let result;
      if (initialData?.id) {
        result = await supabase
          .from("formations")
          .update(payload)
          .eq("id", initialData.id)
      } else {
        result = await supabase
          .from("formations")
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
          {initialData ? "Modifier la formation" : "Nouvelle formation"}
        </h2>
        
        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
          <input 
            type="checkbox" 
            checked={formData.statut === "publie"} 
            onChange={(e) => setFormData({ ...formData, statut: e.target.checked ? "publie" : "brouillon" })}
            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
          <span className="text-sm font-medium text-gray-700">Publié en ligne</span>
        </label>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Titre de la formation *</label>
          <input required type="text" name="titre" value={formData.titre} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Thématique *</label>
          <input required type="text" name="thematique" value={formData.thematique} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="Ex: Entrepreneuriat" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Niveau *</label>
          <select required name="niveau" value={formData.niveau} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
            <option value="Débutant">Débutant</option>
            <option value="Intermédiaire">Intermédiaire</option>
            <option value="Avancé">Avancé</option>
            <option value="Tous niveaux">Tous niveaux</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Modalité *</label>
          <select required name="modalite" value={formData.modalite} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
            <option value="En ligne">En ligne</option>
            <option value="Présentiel">Présentiel</option>
            <option value="Hybride">Hybride</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Prix (FCFA) *</label>
          <input required type="number" min="0" name="prix" value={formData.prix} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="0 pour gratuit" />
        </div>
      </div>

      <div className="flex gap-4 justify-end pt-4 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">
          Annuler
        </button>
        <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
        </button>
      </div>
    </form>
  )
}
