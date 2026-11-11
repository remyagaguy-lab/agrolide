"use client"

import React, { useState } from "react"
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

    const payload = {
      ...formData,
      prix: formData.prix ? parseFloat(formData.prix.toString()) : 0,
    }

    try {
      const { upsertFormation } = await import("@/app/actions/admin-formations")
      await upsertFormation(initialData?.id || null, payload)
      onSuccess()
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-on-surface">
          {initialData ? "Modifier la formation" : "Nouvelle formation"}
        </h2>
        
        <label className="flex items-center gap-2 cursor-pointer bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant">
          <input 
            type="checkbox" 
            checked={formData.statut === "publie"} 
            onChange={(e) => setFormData({ ...formData, statut: e.target.checked ? "publie" : "brouillon" })}
            className="w-4 h-4 text-success rounded focus:ring-success"
          />
          <span className="text-sm font-medium text-on-surface-variant">Publié en ligne</span>
        </label>
      </div>

      {error && <div className="p-3 bg-error-container text-error rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-on-surface-variant">Titre de la formation *</label>
          <input required type="text" name="titre" value={formData.titre} onChange={handleChange} className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:ring-2 focus:ring-success outline-none" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-on-surface-variant">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:ring-2 focus:ring-success outline-none" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface-variant">Thématique *</label>
          <input required type="text" name="thematique" value={formData.thematique} onChange={handleChange} className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:ring-2 focus:ring-success outline-none" placeholder="Ex: Entrepreneuriat" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface-variant">Niveau *</label>
          <select required name="niveau" value={formData.niveau} onChange={handleChange} className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:ring-2 focus:ring-success outline-none">
            <option value="Débutant">Débutant</option>
            <option value="Intermédiaire">Intermédiaire</option>
            <option value="Avancé">Avancé</option>
            <option value="Tous niveaux">Tous niveaux</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface-variant">Modalité *</label>
          <select required name="modalite" value={formData.modalite} onChange={handleChange} className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:ring-2 focus:ring-success outline-none">
            <option value="En ligne">En ligne</option>
            <option value="Présentiel">Présentiel</option>
            <option value="Hybride">Hybride</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface-variant">Prix (FCFA) *</label>
          <input required type="number" min="0" name="prix" value={formData.prix} onChange={handleChange} className="w-full px-4 py-2 border border-outline-variant rounded-xl focus:ring-2 focus:ring-success outline-none" placeholder="0 pour gratuit" />
        </div>
      </div>

      <div className="flex gap-4 justify-end pt-4 border-t border-outline-variant">
        <button type="button" onClick={onCancel} className="px-6 py-2 text-on-surface-variant font-medium hover:bg-surface-container rounded-xl transition-colors">
          Annuler
        </button>
        <button type="submit" disabled={loading} className="px-6 py-2 bg-success hover:bg-success text-white font-medium rounded-xl transition-colors flex items-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
        </button>
      </div>
    </form>
  )
}
