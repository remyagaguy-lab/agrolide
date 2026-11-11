'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { NativeSelect } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Turnstile, turnstileEnabled } from '@/components/ui/Turnstile'

type Fields = {
  raison_sociale: string
  secteur: string
  nature_collaboration: string
  budget: string
  email: string
  message: string
}

const MESSAGE_MIN = 10

function validate(values: Fields): Partial<Record<keyof Fields, string>> {
  const errors: Partial<Record<keyof Fields, string>> = {}
  if (!values.raison_sociale.trim()) errors.raison_sociale = "Indiquez le nom de votre organisation."
  if (!values.secteur.trim()) errors.secteur = "Indiquez votre secteur d'activité."
  if (!values.nature_collaboration) errors.nature_collaboration = "Choisissez une forme de collaboration."
  if (!values.email.trim()) errors.email = "Indiquez une adresse e-mail de contact."
  else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = "Cette adresse e-mail ne semble pas valide."
  if (values.message.trim().length < MESSAGE_MIN) errors.message = `Votre message doit comporter au moins ${MESSAGE_MIN} caractères.`
  return errors
}

export default function PartenariatForm() {
  const [formData, setFormData] = useState<Fields>({
    raison_sociale: '',
    secteur: '',
    nature_collaboration: '',
    budget: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const successRef = useRef<HTMLDivElement>(null)

  // Après l'envoi, le focus passe au message de confirmation (lecteurs d'écran et clavier).
  useEffect(() => {
    if (success) successRef.current?.focus()
  }, [success])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (errors[id as keyof Fields]) setErrors((prev) => ({ ...prev, [id]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')

    const found = validate(formData)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      // Le focus va au premier champ en erreur, dans l'ordre d'affichage.
      const first = (['raison_sociale', 'secteur', 'nature_collaboration', 'email', 'message'] as const).find((k) => found[k])
      if (first) (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus()
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/fonds/contact-partenariat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-turnstile-token': turnstileToken },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
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
      <div ref={successRef} tabIndex={-1} className="outline-none">
        <Alert variant="success" title="Demande envoyée">
          Merci de l&apos;intérêt que vous portez à agrolide. Un accusé de réception a été envoyé à {formData.email}. Notre équipe vous contactera pour échanger sur votre proposition.
        </Alert>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errorMsg && (
        <Alert variant="error" title="Votre demande n'a pas pu être envoyée">
          {errorMsg.replace(/[.\s]+$/, '')}. Réessayez, ou écrivez-nous à{' '}
          <a href="mailto:partenaires@agrolide.org" className="font-semibold underline underline-offset-2">
            partenaires@agrolide.org
          </a>
          .
        </Alert>
      )}

      <p className="text-body-sm text-on-surface-muted">Les champs marqués d&apos;un * sont obligatoires.</p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField label="Nom de l'organisation" id="raison_sociale" error={errors.raison_sociale} required>
          <Input id="raison_sociale" name="raison_sociale" autoComplete="organization" value={formData.raison_sociale} onChange={handleChange} />
        </FormField>
        <FormField
          label="Secteur d'activité"
          id="secteur"
          hint="Par exemple : institution publique, ONG, entreprise, média."
          error={errors.secteur}
          required
        >
          <Input id="secteur" name="secteur" value={formData.secteur} onChange={handleChange} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField label="Forme de collaboration souhaitée" id="nature_collaboration" error={errors.nature_collaboration} required>
          <NativeSelect id="nature_collaboration" name="nature_collaboration" value={formData.nature_collaboration} onChange={handleChange}>
            <option value="">Choisissez une option</option>
            <option value="sponsoring_financier">Sponsoring financier</option>
            <option value="partenariat_technique">Partenariat technique</option>
            <option value="financement_incubation">Financement du programme d&apos;incubation</option>
            <option value="media">Partenariat média</option>
            <option value="autre">Autre</option>
          </NativeSelect>
        </FormField>
        <FormField label="Budget estimatif" id="budget" hint="Facultatif.">
          <NativeSelect id="budget" name="budget" value={formData.budget} onChange={handleChange}>
            <option value="">Je ne souhaite pas le préciser</option>
            <option value="< 5000">Moins de 5 000 €</option>
            <option value="5000 - 15000">5 000 € - 15 000 €</option>
            <option value="15000 - 50000">15 000 € - 50 000 €</option>
            <option value="> 50000">Plus de 50 000 €</option>
          </NativeSelect>
        </FormField>
      </div>

      <FormField label="Adresse e-mail professionnelle" id="email" hint="Nous répondrons à cette adresse." error={errors.email} required>
        <Input id="email" name="email" type="email" autoComplete="email" value={formData.email} onChange={handleChange} />
      </FormField>

      <FormField
        label="Votre message"
        id="message"
        hint="Présentez votre organisation et ce que vous envisagez avec le réseau."
        error={errors.message}
        required
      >
        <Textarea id="message" name="message" value={formData.message} onChange={handleChange} />
      </FormField>

      <Turnstile onToken={setTurnstileToken} resetSignal={isSubmitting} />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={isSubmitting}
        disabled={isSubmitting || (turnstileEnabled && !turnstileToken)}
      >
        {isSubmitting ? 'Envoi en cours…' : 'Envoyer ma demande'}
      </Button>
    </form>
  )
}
