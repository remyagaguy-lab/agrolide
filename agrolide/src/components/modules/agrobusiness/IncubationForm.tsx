'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Turnstile, turnstileEnabled } from "@/components/ui/Turnstile"
import { Loader2 } from "lucide-react"

/** Coordonnées préremplies quand le formulaire est ouvert par un membre connecté. */
export interface CoordonneesInitiales {
  prenom?: string
  nom?: string
  email?: string
  pays?: string
  organisation?: string
}

export default function IncubationForm({ initial }: { initial?: CoordonneesInitiales } = {}) {
  const [formData, setFormData] = useState({
    prenom: initial?.prenom ?? '',
    nom: initial?.nom ?? '',
    email: initial?.email ?? '',
    telephone: '',
    pays: initial?.pays ?? '',
    titre_projet: '',
    stade_avancement: '',
    description_projet: '',
    besoins: '', // "equipe" from UI mapped to besoins? Or we can just concatenate. We'll use "secteur" and "besoins"
    secteur: 'Agriculture', // par défaut pour simplifier, on pourrait ajouter un champ
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
      // 1. Soumettre les données
      const res = await fetch('/api/agrobusiness/incubation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-turnstile-token': turnstileToken },
        body: JSON.stringify({
          ...formData,
          cv_nom: file ? file.name : undefined,
          cv_type: file ? file.type : undefined
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue")
      }

      // 2. Upload R2 si URL présente
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
        <h3 className="text-2xl font-bold text-on-success-container mb-2">Candidature envoyée !</h3>
        <p className="text-success">Merci {formData.prenom}, votre projet "{formData.titre_projet}" a bien été soumis. Notre comité l'évaluera prochainement.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 md:p-10 rounded-2xl border border-outline-variant shadow-sm">
      {errorMsg && (
        <div className="mb-6 p-4 bg-error-container text-error rounded-xl border border-error/30 text-sm">
          {errorMsg}
        </div>
      )}
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-on-surface border-b pb-2">1. Porteur du projet</h3>
          
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
              <label className="text-sm font-semibold text-on-surface-variant" htmlFor="telephone">Téléphone *</label>
              <Input id="telephone" type="tel" required value={formData.telephone} onChange={handleChange} placeholder="+228..." />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor="pays">Pays de résidence *</label>
            <Input id="pays" required value={formData.pays} onChange={handleChange} placeholder="Ex: Togo, Sénégal, Côte d'Ivoire..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor="cv">CV (Optionnel)</label>
            <Input id="cv" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="cursor-pointer" />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="font-bold text-lg text-on-surface border-b pb-2">2. Le Projet</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor="titre_projet">Nom du projet / de la startup *</label>
            <Input id="titre_projet" required value={formData.titre_projet} onChange={handleChange} placeholder="Nom de votre entreprise" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor="stade_avancement">Stade d'avancement *</label>
            <select id="stade_avancement" required value={formData.stade_avancement} onChange={handleChange} className="w-full h-12 px-4 rounded-md border border-outline-variant bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary text-on-surface-variant">
              <option value="">Sélectionnez un stade...</option>
              <option value="idee">Idée (Concept validé)</option>
              <option value="prototype">Prototype / POC</option>
              <option value="lancement">Phase de lancement (Premières ventes)</option>
              <option value="croissance">En croissance (Recherche de fonds)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor="description_projet">Pitch du projet (Problème résolu, solution, marché) *</label>
            <Textarea 
              id="description_projet" 
              required
              value={formData.description_projet}
              onChange={handleChange}
              placeholder="Expliquez brièvement votre projet. Quel problème de l'agriculture africaine résolvez-vous et comment ?"
              className="min-h-[150px]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor="besoins">Présentation de l'équipe</label>
            <Textarea 
              id="besoins" 
              value={formData.besoins}
              onChange={handleChange}
              placeholder="Qui sont les fondateurs et quelles sont leurs compétences clés ?"
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="pt-6">
          <Turnstile onToken={setTurnstileToken} resetSignal={isSubmitting} />
          <Button type="submit" variant="primary" disabled={isSubmitting || (turnstileEnabled && !turnstileToken)} className="w-full text-lg h-14">
            {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Envoi en cours...</> : "Soumettre ma candidature"}
          </Button>
          <p className="text-center text-xs text-on-surface-muted mt-4">
            Vos données sont traitées de manière confidentielle et ne seront pas partagées avec des tiers sans votre accord.
          </p>
        </div>
      </div>
    </form>
  )
}
