"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitOnboarding } from '@/app/actions/onboarding'
import { AuthCard } from '@/components/auth/AuthCard'
import { ChoixProfil, estProfilInscription, libelleProfil } from '@/components/auth/ChoixProfil'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { NativeSelect } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { TypeOrganisationChamp } from '@/components/modules/profil/TypeOrganisationChamp'
import { createSupabaseBrowser } from '@/lib/supabase/client'

const paysOptions = ["Sénégal", "Côte d'Ivoire", "Cameroun", "Bénin", "Togo", "Mali", "Burkina Faso", "Guinée", "Congo", "Gabon", "RDC", "Madagascar", "Maroc", "Tunisie", "Algérie", "France", "Canada"]

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categorie, setCategorie] = useState('')
  // Profil déjà choisi à l'inscription : on ne le redemande pas (on peut le changer).
  const [choisiAvant, setChoisiAvant] = useState(false)
  const [pret, setPret] = useState(false)
  const [typeOrganisation, setTypeOrganisation] = useState('')
  const [nomOrganisation, setNomOrganisation] = useState('')

  useEffect(() => {
    createSupabaseBrowser().auth.getUser().then(({ data }) => {
      const meta = (data.user?.user_metadata ?? {}) as Record<string, string | undefined>
      if (estProfilInscription(meta.profil)) {
        setCategorie(meta.profil)
        setChoisiAvant(true)
        if (meta.profil === 'partenaire' && meta.nom) setNomOrganisation(meta.nom)
      } else {
        setCategorie('professionnel')
      }
      setPret(true)
    }).catch(() => {
      setCategorie('professionnel')
      setPret(true)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.set('categorie', categorie)
    formData.set('type_organisation', categorie === 'partenaire' ? typeOrganisation : '')
    formData.set('nom_organisation', categorie === 'partenaire' ? nomOrganisation : '')

    const res = await submitOnboarding(formData)

    if (res.success) {
      router.push('/membres/dashboard')
    } else {
      setError(res.error || 'Erreur lors de l\'enregistrement.')
      setLoading(false)
    }
  }

  if (!pret) return <AuthCard title="Bienvenue sur agrolide !" subtitle="Un instant…"><div aria-busy="true" className="h-24" /></AuthCard>

  const organisation = categorie === 'partenaire'

  return (
    <AuthCard
      wide
      title="Bienvenue sur agrolide !"
      subtitle="Complétez votre profil pour rejoindre l'annuaire public du réseau."
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {choisiAvant ? (
          <p className="text-body-md text-on-surface-variant">
            Votre profil : <strong className="text-on-surface">{libelleProfil(categorie)}</strong>.{' '}
            <button type="button" className="text-primary underline" onClick={() => setChoisiAvant(false)}>Changer</button>
          </p>
        ) : (
          <ChoixProfil valeur={categorie} onChange={setCategorie} />
        )}

        {organisation && (
          <>
            <FormField label="Nom de l'organisation" required>
              <Input value={nomOrganisation} onChange={(e) => setNomOrganisation(e.target.value)} required minLength={2} maxLength={120} autoComplete="organization" />
            </FormField>
            <TypeOrganisationChamp valeur={typeOrganisation} onChange={setTypeOrganisation} required />
          </>
        )}

        <FormField label={organisation ? "Mission ou activité principale" : "Spécialité / Fonction"}>
          <Input name="specialite" type="text" placeholder={organisation ? "Ex : appui aux coopératives de producteurs de cacao" : "Ex : ingénieur agronome, consultant…"} />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label={organisation ? "Pays" : "Pays de résidence"} required>
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

        <FormField label={organisation ? "Présentation" : "Courte biographie"}>
          <Textarea name="biographie" rows={3} placeholder={organisation ? "Présentez votre organisation en quelques mots…" : "Présentez-vous en quelques mots…"} />
        </FormField>

        {error && <Alert variant="error">{error}</Alert>}

        <Button type="submit" variant="secondary" fullWidth loading={loading}>Terminer mon inscription</Button>
      </form>
    </AuthCard>
  )
}
