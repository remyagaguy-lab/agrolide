'use client'

import React, { useState } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { ChoiceChip } from '@/components/ui/ChoiceChip'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Turnstile, turnstileEnabled } from '@/components/ui/Turnstile'

import { Lock } from "@/components/ui/icons"
const MONTANTS = [5000, 15000, 50000] as const
const MONTANT_MIN = 1000
const fcfa = (n: number) => n.toLocaleString('fr-FR')

export default function DonationForm({ campagneId }: { campagneId: string }) {
  const [montant, setMontant] = useState<number>(15000)
  const [isMontantLibre, setIsMontantLibre] = useState(false)

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    methode: 'stripe',
    anonyme: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const montantInvalide = montant < MONTANT_MIN

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData((prev) => ({ ...prev, [e.target.id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')

    if (montantInvalide) {
      setErrorMsg(`Le montant minimum est de ${fcfa(MONTANT_MIN)} FCFA.`)
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
          ...formData,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création du paiement')
      }

      // Redirection vers Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('URL de paiement non reçue.')
      }
    } catch (err: any) {
      setErrorMsg(err.message)
      setIsSubmitting(false)
    }
  }

  // Aucune campagne active : le paiement ne peut pas être créé, on le dit plutôt que d'échouer à l'envoi.
  if (!campagneId) {
    return (
      <Alert variant="info" title="Les dons en ligne ne sont pas ouverts pour le moment">
        Pour soutenir le réseau, écrivez-nous à{' '}
        <a href="mailto:contact@agrolide.org" className="font-semibold text-primary underline underline-offset-2">
          contact@agrolide.org
        </a>
        .
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <Alert variant="error" title="Le paiement n'a pas pu être préparé">
          {errorMsg}
        </Alert>
      )}

      <fieldset>
        <legend className="mb-2 text-label-lg text-on-surface">Choisissez un montant (en FCFA)</legend>
        <div className="grid grid-cols-2 gap-3">
          {MONTANTS.map((val) => (
            <ChoiceChip
              key={val}
              name="montant"
              value={val}
              checked={!isMontantLibre && montant === val}
              onChange={() => {
                setMontant(val)
                setIsMontantLibre(false)
              }}
            >
              {fcfa(val)}
            </ChoiceChip>
          ))}
          <ChoiceChip
            name="montant"
            value="libre"
            checked={isMontantLibre}
            onChange={() => {
              setIsMontantLibre(true)
              setMontant(0)
            }}
          >
            Autre montant
          </ChoiceChip>
        </div>

        {isMontantLibre && (
          <FormField
            className="mt-4"
            label="Votre montant (FCFA)"
            hint={`Minimum ${fcfa(MONTANT_MIN)} FCFA.`}
            error={montant > 0 && montantInvalide ? `Le montant minimum est de ${fcfa(MONTANT_MIN)} FCFA.` : undefined}
            required
          >
            <Input
              type="number"
              inputMode="numeric"
              min={MONTANT_MIN}
              value={montant || ''}
              onChange={(e) => setMontant(parseInt(e.target.value) || 0)}
              autoFocus
            />
          </FormField>
        )}
      </fieldset>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Prénom" id="prenom" required>
            <Input id="prenom" required autoComplete="given-name" value={formData.prenom} onChange={handleChange} />
          </FormField>
          <FormField label="Nom" id="nom">
            <Input id="nom" autoComplete="family-name" value={formData.nom} onChange={handleChange} />
          </FormField>
        </div>

        <FormField label="Adresse e-mail" id="email" hint="Pour la confirmation de votre don." required>
          <Input id="email" type="email" required autoComplete="email" value={formData.email} onChange={handleChange} />
        </FormField>
      </div>

      <fieldset>
        <legend className="mb-2 text-label-lg text-on-surface">Mode de paiement</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ChoiceChip
            name="methode"
            value="stripe"
            checked={formData.methode === 'stripe'}
            onChange={(e) => setFormData((prev) => ({ ...prev, methode: e.target.value }))}
          >
            Carte bancaire
          </ChoiceChip>
          <ChoiceChip name="methode" value="cinetpay" disabled>
            Mobile Money (bientôt)
          </ChoiceChip>
        </div>
      </fieldset>

      <label className="flex min-h-11 cursor-pointer items-start gap-3 border-t border-outline-variant pt-4 text-body-md text-on-surface-variant">
        <input
          type="checkbox"
          id="anonyme"
          checked={formData.anonyme}
          onChange={handleChange}
          className="mt-0.5 size-5 shrink-0 accent-primary"
        />
        <span>Garder mon don anonyme (mon nom n&apos;apparaît pas dans la liste publique des soutiens).</span>
      </label>

      <Turnstile onToken={setTurnstileToken} resetSignal={isSubmitting} />

      <div>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting || montantInvalide || (turnstileEnabled && !turnstileToken)}
        >
          {isSubmitting ? 'Préparation du paiement…' : montantInvalide ? 'Choisissez un montant' : `Faire un don de ${fcfa(montant)} FCFA`}
        </Button>
        <p className="mt-3 flex items-start gap-2 text-body-sm text-on-surface-muted">
          <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>Vous serez redirigé vers la page de paiement sécurisée de Stripe. agrolide ne voit ni ne conserve votre numéro de carte.</span>
        </p>
      </div>
    </form>
  )
}
