'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Loader2 } from "lucide-react"

export default function PartenariatForm() {
  const [formData, setFormData] = useState({
    raison_sociale: '',
    secteur: '',
    nature_collaboration: '',
    budget: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/fonds/contact-partenariat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue")
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
        <p className="text-green-700">Merci de l'intérêt que vous portez à agrolide. Notre équipe des partenariats vous contactera très rapidement pour discuter de cette collaboration.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-2xl border border-[var(--color-gris-clair)] shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Devenir Partenaire / Sponsor</h2>
        <p className="text-gray-600">Associez votre image à la transition agricole en Afrique.</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="raison_sociale">Raison sociale / Nom de l'organisation *</label>
            <Input id="raison_sociale" required value={formData.raison_sociale} onChange={handleChange} placeholder="Ex: Agence Francaise de Dev..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="secteur">Secteur d'activité *</label>
            <Input id="secteur" required value={formData.secteur} onChange={handleChange} placeholder="Ex: Finance, Institutionnel, Tech..." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="nature_collaboration">Nature de la collaboration souhaitée *</label>
            <select id="nature_collaboration" required value={formData.nature_collaboration} onChange={handleChange} className="w-full h-12 px-4 rounded-md border border-[var(--color-gris-clair)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-vert-principal)] text-gray-700">
              <option value="">Sélectionnez...</option>
              <option value="sponsoring_financier">Sponsoring Financier</option>
              <option value="partenariat_technique">Partenariat Technique</option>
              <option value="financement_incubation">Financement Cohorte Incubation</option>
              <option value="media">Partenariat Média</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="budget">Budget estimatif (Optionnel)</label>
            <select id="budget" value={formData.budget} onChange={handleChange} className="w-full h-12 px-4 rounded-md border border-[var(--color-gris-clair)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-vert-principal)] text-gray-700">
              <option value="">Ne se prononce pas</option>
              <option value="< 5000">Moins de 5 000 €</option>
              <option value="5000 - 15000">5 000 € - 15 000 €</option>
              <option value="15000 - 50000">15 000 € - 50 000 €</option>
              <option value="> 50000">Plus de 50 000 €</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700" htmlFor="email">Email professionnel de contact *</label>
          <Input id="email" type="email" required value={formData.email} onChange={handleChange} placeholder="contact@organisation.com" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700" htmlFor="message">Votre message *</label>
          <Textarea 
            id="message" 
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Détaillez brièvement vos objectifs de partenariat avec agrolide..."
            className="min-h-[120px]"
          />
        </div>

        <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full h-14 text-lg mt-4">
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Envoi...</> : "Envoyer la demande"}
        </Button>
      </div>
    </form>
  )
}
