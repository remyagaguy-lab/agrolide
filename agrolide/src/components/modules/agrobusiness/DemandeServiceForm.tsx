'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Loader2 } from "lucide-react"

export default function DemandeServiceForm() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    pays: '',
    organisation: '',
    type_service: '',
    description: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/agrobusiness/demandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          fichier_nom: file ? file.name : undefined,
          fichier_type: file ? file.type : undefined
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'envoi.")
      }

      if (data.presignedUrl && file) {
        await fetch(data.presignedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file
        })
      }

      setSuccess(true)
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 p-8 rounded-2xl border border-green-200 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Demande envoyée !</h3>
        <p className="text-green-700">Merci {formData.prenom}, votre demande a bien été reçue. Un expert vous contactera sous 48h.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-8 md:p-10 rounded-2xl border border-[var(--color-gris-clair)] shadow-sm">
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
          {errorMsg}
        </div>
      )}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="prenom">Prénom *</label>
            <Input id="prenom" required value={formData.prenom} onChange={handleChange} placeholder="Votre prénom" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="nom">Nom *</label>
            <Input id="nom" required value={formData.nom} onChange={handleChange} placeholder="Votre nom" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="email">Email *</label>
            <Input id="email" type="email" required value={formData.email} onChange={handleChange} placeholder="votre@email.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="telephone">Téléphone</label>
            <Input id="telephone" type="tel" value={formData.telephone} onChange={handleChange} placeholder="+228..." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="pays">Pays *</label>
            <Input id="pays" required value={formData.pays} onChange={handleChange} placeholder="Ex: Sénégal" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="organisation">Organisation (Optionnel)</label>
            <Input id="organisation" value={formData.organisation} onChange={handleChange} placeholder="Nom de votre structure" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700" htmlFor="type_service">Type d'accompagnement souhaité *</label>
          <select id="type_service" required value={formData.type_service} onChange={handleChange} className="w-full h-12 px-4 rounded-md border border-[var(--color-gris-clair)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-vert-principal)] text-gray-700">
            <option value="">Sélectionnez un service...</option>
            <option value="business-plan">Étude & Business Plan</option>
            <option value="conseil">Conseil Stratégique / Appui technique</option>
            <option value="autre">Autre demande</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700" htmlFor="description">Description de votre projet ou de votre besoin *</label>
          <Textarea 
            id="description" 
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez brièvement votre projet, vos objectifs et vos attentes..."
            className="min-h-[150px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700" htmlFor="fichier">Pièce jointe (Brief, présentation, etc. - Optionnel)</label>
          <Input id="fichier" type="file" onChange={handleFileChange} className="cursor-pointer bg-white" />
        </div>

        <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full text-lg h-14">
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Envoi en cours...</> : "Envoyer ma demande"}
        </Button>
      </div>
    </form>
  )
}
