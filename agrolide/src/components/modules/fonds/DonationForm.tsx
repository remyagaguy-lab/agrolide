'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
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
        headers: { 'Content-Type': 'application/json' },
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
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Faire un don</h3>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Paliers de don */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Choisissez un montant (FCFA)</label>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button 
            type="button" 
            onClick={() => handleMontantClick(5000)}
            className={`py-3 rounded-xl font-bold text-lg border-2 transition-colors ${montant === 5000 && !isMontantLibre ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}
          >
            5 000
          </button>
          <button 
            type="button" 
            onClick={() => handleMontantClick(15000)}
            className={`py-3 rounded-xl font-bold text-lg border-2 transition-colors ${montant === 15000 && !isMontantLibre ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}
          >
            15 000
          </button>
          <button 
            type="button" 
            onClick={() => handleMontantClick(50000)}
            className={`py-3 rounded-xl font-bold text-lg border-2 transition-colors ${montant === 50000 && !isMontantLibre ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}
          >
            50 000
          </button>
          <button 
            type="button" 
            onClick={() => { setIsMontantLibre(true); setMontant(0) }}
            className={`py-3 rounded-xl font-bold text-sm border-2 transition-colors ${isMontantLibre ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}
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
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">FCFA</span>
          </div>
        )}

        <div className="mt-3 text-sm text-gray-500 italic text-center">
          {montant === 5000 && "Financera 1 fiche technique vulgarisée."}
          {montant === 15000 && "Financera l'accompagnement d'un agripreneur sur 1 mois."}
          {montant === 50000 && "Contribuera à la bourse d'une startup agricole."}
          {montant > 50000 && "Un immense merci pour votre soutien exceptionnel !"}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700" htmlFor="prenom">Prénom *</label>
            <Input id="prenom" required value={formData.prenom} onChange={handleChange} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700" htmlFor="nom">Nom</label>
            <Input id="nom" value={formData.nom} onChange={handleChange} />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-700" htmlFor="email">Email *</label>
          <Input id="email" type="email" required value={formData.email} onChange={handleChange} />
        </div>

        <div className="space-y-1 pt-2">
          <label className="text-sm font-semibold text-gray-700">Méthode de paiement</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="methode" value="stripe" checked={formData.methode === 'stripe'} onChange={(e) => setFormData(prev => ({...prev, methode: e.target.value}))} className="w-4 h-4 text-primary-600 focus:ring-primary-500" />
              <span>Carte bancaire (Stripe)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer opacity-50">
              <input type="radio" name="methode" value="cinetpay" disabled className="w-4 h-4" />
              <span>Mobile Money (Bientôt)</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <input 
            type="checkbox" 
            id="anonyme" 
            checked={formData.anonyme} 
            onChange={handleChange}
            className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <label htmlFor="anonyme" className="text-sm text-gray-700 cursor-pointer">
            Garder mon don anonyme (ne pas afficher sur la liste publique)
          </label>
        </div>

        <Button type="submit" variant="primary" disabled={isSubmitting || montant < 1000} className="w-full h-14 text-lg font-bold mt-6 bg-[#fcb726] hover:bg-[#f99e1d] text-gray-900 border-none">
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Préparation...</> : `Soutenir avec ${montant.toLocaleString('fr-FR')} FCFA`}
        </Button>
      </div>
    </form>
  )
}
