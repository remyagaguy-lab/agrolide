'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Turnstile, turnstileEnabled } from "@/components/ui/Turnstile"
import { Loader2 } from "lucide-react"

export default function DonationForm({ campagneId }: { campagneId: string }) {
  const [montant, setMontant] = useState<number>(15000)
  const [isMontantLibre, setIsMontantLibre] = useState(false)
  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    methode: 'stripe',
    anonyme: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleMontantClick = (val: number) => {
    setMontant(val)
    setIsMontantLibre(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData(prev => ({ ...prev, [e.target.id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')

    if (montant < 1000) {
      setErrorMsg("Le montant minimum est de 1 000 FCFA.")
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/fonds/don', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-turnstile-token': turnstileToken },
        body: JSON.stringify({
          campagneId,
          montant_fcfa: montant,
          ...formData
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la création du paiement")
      }

      // Redirection vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("URL de paiement non reçue.")
      }

    } catch (err: any) {
      setErrorMsg(err.message)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant">
      <h3 className="text-xl font-bold text-on-surface mb-6">Faire un don</h3>

      {errorMsg && (
        <div className="mb-6 p-4 bg-error-container text-error rounded-xl border border-error/30 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Paliers de don */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-on-surface-variant mb-3">Choisissez un montant (FCFA)</label>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button 
            type="button" 
            onClick={() => handleMontantClick(5000)}
            className={`py-3 rounded-xl font-bold text-lg border-2 transition-colors ${montant === 5000 && !isMontantLibre ? 'border-primary bg-primary-container text-primary' : 'border-outline-variant text-on-surface-variant hover:border-outline-variant'}`}
          >
            5 000
          </button>
          <button 
            type="button" 
            onClick={() => handleMontantClick(15000)}
            className={`py-3 rounded-xl font-bold text-lg border-2 transition-colors ${montant === 15000 && !isMontantLibre ? 'border-primary bg-primary-container text-primary' : 'border-outline-variant text-on-surface-variant hover:border-outline-variant'}`}
          >
            15 000
          </button>
          <button 
            type="button" 
            onClick={() => handleMontantClick(50000)}
            className={`py-3 rounded-xl font-bold text-lg border-2 transition-colors ${montant === 50000 && !isMontantLibre ? 'border-primary bg-primary-container text-primary' : 'border-outline-variant text-on-surface-variant hover:border-outline-variant'}`}
          >
            50 000
          </button>
          <button 
            type="button" 
            onClick={() => { setIsMontantLibre(true); setMontant(0) }}
            className={`py-3 rounded-xl font-bold text-sm border-2 transition-colors ${isMontantLibre ? 'border-primary bg-primary-container text-primary' : 'border-outline-variant text-on-surface-variant hover:border-outline-variant'}`}
          >
            Montant libre
          </button>
        </div>

        {isMontantLibre && (
          <div className="relative">
            <Input 
              type="number" 
              value={montant || ''} 
              onChange={(e) => setMontant(parseInt(e.target.value) || 0)} 
              placeholder="Saisissez un montant..." 
              className="pl-4 pr-16 h-14 text-lg font-bold"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-muted">FCFA</span>
          </div>
        )}

        <div className="mt-3 text-sm text-on-surface-muted italic text-center">
          {montant === 5000 && "Financera 1 fiche technique vulgarisée."}
          {montant === 15000 && "Financera l'accompagnement d'un agripreneur sur 1 mois."}
          {montant === 50000 && "Contribuera à la bourse d'une startup agricole."}
          {montant > 50000 && "Un immense merci pour votre soutien exceptionnel !"}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor="prenom">Prénom *</label>
            <Input id="prenom" required value={formData.prenom} onChange={handleChange} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface-variant" htmlFor="nom">Nom</label>
            <Input id="nom" value={formData.nom} onChange={handleChange} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-on-surface-variant" htmlFor="email">Email *</label>
          <Input id="email" type="email" required value={formData.email} onChange={handleChange} />
        </div>

        <div className="space-y-1 pt-2">
          <label className="text-sm font-semibold text-on-surface-variant">Méthode de paiement</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="methode" value="stripe" checked={formData.methode === 'stripe'} onChange={(e) => setFormData(prev => ({...prev, methode: e.target.value}))} className="w-4 h-4 text-primary focus:ring-primary" />
              <span>Carte bancaire (Stripe)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer opacity-50">
              <input type="radio" name="methode" value="cinetpay" disabled className="w-4 h-4" />
              <span>Mobile Money (Bientôt)</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-outline-variant">
          <input 
            type="checkbox" 
            id="anonyme" 
            checked={formData.anonyme} 
            onChange={handleChange}
            className="w-4 h-4 text-primary rounded border-outline focus:ring-primary"
          />
          <label htmlFor="anonyme" className="text-sm text-on-surface-variant cursor-pointer">
            Garder mon don anonyme (ne pas afficher sur la liste publique)
          </label>
        </div>

        <Turnstile onToken={setTurnstileToken} resetSignal={isSubmitting} />
        <Button type="submit" variant="primary" disabled={isSubmitting || montant < 1000 || (turnstileEnabled && !turnstileToken)} className="w-full h-14 text-lg font-bold mt-6 bg-accent-sun hover:bg-tertiary text-on-surface border-none">
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Préparation...</> : `Soutenir avec ${montant.toLocaleString('fr-FR')} FCFA`}
        </Button>
      </div>
    </form>
  )
}
