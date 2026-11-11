'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Turnstile, turnstileEnabled } from "@/components/ui/Turnstile"
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
  const [turnstileToken, setTurnstileToken] = useState('')
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
        headers: { 'Content-Type': 'application/json', 'x-turnstile-token': turnstileToken },
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
      <div className="bg-success-container p-8 rounded-2xl border border-success/30 text-center">
        <div className="w-16 h-16 bg-success-container text-success rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 className="text-2xl font-bold text-on-success-container mb-2">Demande envoyée !</h3>
        <p className="text-success">Merci {formData.prenom}, votre demande a bien été reçue. Un expert vous contactera sous 48h.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-low p-8 md:p-10 rounded-2xl border border-[var(--color-gris-clair)] shadow-sm">
      {errorMsg && (
        <div className="mb-6 p-4 bg-error-container text-error rounded-xl border border-error/30 text-sm">
          {errorMsg}
        </div>
      )}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor="prenom">Prénom *</label>
            <Input id="prenom" required value={formData.prenom} onChange={handleChange} placeholder="Votre prénom" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor="nom">Nom *</label>
            <Input id="nom" required value={formData.nom} onChange={handleChange} placeholder="Votre nom" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor="email">Email *</label>
            <Input id="email" type="email" required value={formData.email} onChange={handleChange} placeholder="votre@email.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor="telephone">Téléphone</label>
            <Input id="telephone" type="tel" value={formData.telephone} onChange={handleChange} placeholder="+228..." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor="pays">Pays *</label>
            <Input id="pays" required value={formData.pays} onChange={handleChange} placeholder="Ex: Sénégal" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor="organisation">Organisation (Optionnel)</label>
            <Input id="organisation" value={formData.organisation} onChange={handleChange} placeholder="Nom de votre structure" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-on-surface-variant" htmlFor="type_service">Type d'accompagnement souhaité *</label>
          <select id="type_service" required value={formData.type_service} onChange={handleChange} className="w-full h-12 px-4 rounded-md border border-[var(--color-gris-clair)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-vert-principal)] text-on-surface-variant">
            <option value="">Sélectionnez un service...</option>
            <option value="business-plan">Étude & Business Plan</option>
            <option value="conseil">Conseil Stratégique / Appui technique</option>
            <option value="autre">Autre demande</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-on-surface-variant" htmlFor="description">Description de votre projet ou de votre besoin *</label>
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
          <label className="text-sm font-semibold text-on-surface-variant" htmlFor="fichier">Pièce jointe (Brief, présentation, etc. - Optionnel)</label>
          <Input id="fichier" type="file" onChange={handleFileChange} className="cursor-pointer bg-white" />
        </div>

        <Turnstile onToken={setTurnstileToken} resetSignal={isSubmitting} />
        <Button type="submit" variant="primary" disabled={isSubmitting || (turnstileEnabled && !turnstileToken)} className="w-full text-lg h-14">
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Envoi en cours...</> : "Envoyer ma demande"}
        </Button>
      </div>
    </form>
  )
}
