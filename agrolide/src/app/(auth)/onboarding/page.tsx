"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitOnboarding } from '@/app/actions/onboarding'
import { AuthCard } from '@/components/auth/AuthCard'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { NativeSelect } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { cn } from '@/lib/utils/formatters'

import { CheckCircle2, UserRound, Building2, Briefcase, GraduationCap, Heart } from "@/components/ui/icons"
const profiles = [
  { id: 'passionne', label: 'Passionné', icon: Heart, desc: 'Curieux ou non-professionnel' },
  { id: 'junior', label: 'Junior / Étudiant', icon: GraduationCap, desc: 'Vous débutez dans le secteur' },
  { id: 'professionnel', label: 'Professionnel', icon: UserRound, desc: 'Vous êtes un acteur du secteur' },
  { id: 'partenaire', label: 'Partenaire', icon: Building2, desc: 'Entreprise, ONG, Coopérative' },
  { id: 'senior', label: 'Sénior', icon: Briefcase, desc: 'Vous avez une forte expérience' },
]

const paysOptions = ["Sénégal", "Côte d'Ivoire", "Cameroun", "Bénin", "Togo", "Mali", "Burkina Faso", "Guinée", "Congo", "Gabon", "RDC", "Madagascar", "Maroc", "Tunisie", "Algérie", "France", "Canada"]

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categorie, setCategorie] = useState('professionnel')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.set('categorie', categorie)

    const res = await submitOnboarding(formData)

    if (res.success) {
      router.push('/membres/dashboard')
    } else {
      setError(res.error || 'Erreur lors de l\'enregistrement.')
      setLoading(false)
    }
  }

  return (
    <AuthCard
      wide
      title="Bienvenue sur agrolide !"
      subtitle="Complétez votre profil pour rejoindre l'annuaire public du réseau."
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Choix du profil : groupe de boutons radio (clavier : flèches) */}
        <fieldset>
          <legend className="mb-3 text-label-lg text-on-surface">
            Quel est votre profil ? <span aria-hidden="true" className="text-error">*</span>
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {profiles.map((p) => {
              const Icon = p.icon
              const isSelected = categorie === p.id
              return (
                <label
                  key={p.id}
                  className={cn(
                    'relative flex min-h-12 cursor-pointer flex-col items-center rounded-card border p-4 text-center transition-colors duration-150 ease-standard',
                    'has-[:focus-visible]:outline has-[:focus-visible]:outline-[length:var(--ag-sys-focus-width)] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus-ring',
                    isSelected
                      ? 'border-primary bg-primary-container text-on-primary-container ring-1 ring-primary'
                      : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-outline',
                  )}
                >
                  <input
                    type="radio"
                    name="profil-categorie"
                    value={p.id}
                    checked={isSelected}
                    onChange={() => setCategorie(p.id)}
                    className="sr-only"
                  />
                  {isSelected && <CheckCircle2 className="absolute right-2 top-2 size-5 text-primary" aria-hidden="true" />}
                  <Icon className={cn('mb-2 size-6', isSelected ? 'text-primary' : 'text-on-surface-muted')} aria-hidden="true" />
                  <span className="text-title-sm">{p.label}</span>
                  <span className={cn('mt-1 text-body-sm', isSelected ? 'text-on-primary-container' : 'text-on-surface-muted')}>{p.desc}</span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <FormField label="Spécialité / Fonction">
          <Input name="specialite" type="text" placeholder="Ex : ingénieur agronome, consultant…" />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Pays de résidence" required>
            <NativeSelect name="pays" required defaultValue="">
              <option value="">Sélectionnez un pays</option>
              {paysOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
              <option value="Autre">Autre</option>
            </NativeSelect>
          </FormField>
          <FormField label="Ville" required>
            <Input name="ville" type="text" required placeholder="Ex : Dakar" />
          </FormField>
        </div>

        <FormField label="Courte biographie">
          <Textarea name="biographie" rows={3} placeholder="Présentez-vous en quelques mots…" />
        </FormField>

        {error && <Alert variant="error">{error}</Alert>}

        <Button type="submit" variant="secondary" fullWidth loading={loading}>Terminer mon inscription</Button>
      </form>
    </AuthCard>
  )
}
