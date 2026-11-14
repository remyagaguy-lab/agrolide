'use client'

import { useState, useEffect, type FormEvent } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { ResendConfirmation } from '@/components/auth/ResendConfirmation'
import { ChoixProfil, estProfilInscription, libelleProfil } from '@/components/auth/ChoixProfil'
import { safeNext } from '@/lib/auth/safe-next'
import { AuthCard, authLinkClass, translateAuthError } from '@/components/auth/AuthCard'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'

export default function InscriptionPage() {
  // Étape 1 : le profil. Étape 2 : le compte (Google ou e-mail). Une organisation saisit son nom, pas un prénom et un nom.
  const [profil, setProfil] = useState('')
  const [etape, setEtape] = useState<'profil' | 'compte'>('profil')
  const [form, setForm] = useState({ prenom: '', nom: '', organisation: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [nextParam, setNextParam] = useState('/membres/dashboard')
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setNextParam(safeNext(params.get('next')))
    // Lien « Rejoindre » d'une formule (?categorie=…) : le profil est déjà choisi, on passe directement au compte.
    const demande = params.get('categorie')
    if (estProfilInscription(demande)) {
      setProfil(demande)
      setEtape('compte')
    }
  }, [])

  const estOrganisation = profil === 'partenaire'
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const identite = estOrganisation
      ? { prenom: '', nom: form.organisation.trim(), full_name: form.organisation.trim() }
      : { prenom: form.prenom.trim(), nom: form.nom.trim(), full_name: `${form.prenom} ${form.nom}`.trim() }
    const { data, error } = await createSupabaseBrowser().auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { ...identite, profil },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext(new URLSearchParams(window.location.search).get('next')))}`,
      },
    })
    setLoading(false)
    if (error) return setError(translateAuthError(error.message))
    // Supabase renvoie un utilisateur sans identité si l'e-mail existe déjà (anti-énumération).
    if (data.user && data.user.identities?.length === 0) {
      return setError(translateAuthError('already registered'))
    }
    setSent(true)
  }

  if (sent) {
    return (
      <AuthCard title="Vérifiez votre boîte e-mail" subtitle={`Un lien de confirmation a été envoyé à ${form.email}.`}>
        <p className="text-center text-body-md text-on-surface-variant">
          Cliquez sur le lien pour activer votre compte (valable 15 minutes). Pensez à vérifier votre dossier spam.
        </p>
        <ResendConfirmation email={form.email} showInput={false} />
      </AuthCard>
    )
  }

  const pied = <>Déjà membre ? <Link href="/login" className={authLinkClass}>Se connecter</Link></>

  if (etape === 'profil') {
    return (
      <AuthCard wide title="Rejoindre le réseau" subtitle="Commencez par choisir le profil qui vous correspond" footer={pied}>
        <div className="space-y-6">
          <ChoixProfil valeur={profil} onChange={setProfil} />
          <Button type="button" variant="secondary" fullWidth disabled={!profil} onClick={() => setEtape('compte')}>Continuer</Button>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Créer votre compte" subtitle={`Profil ${libelleProfil(profil)} : création gratuite`} footer={pied}>
      <p className="mb-5 text-center text-body-sm text-on-surface-variant">
        <button type="button" onClick={() => setEtape('profil')} className={authLinkClass}>Changer de profil</button>
      </p>
      <GoogleButton next={nextParam} profil={profil} />
      <form onSubmit={onSubmit} className="space-y-5">
        {error && <Alert variant="error">{error}</Alert>}
        {estOrganisation ? (
          <FormField label="Nom de l'organisation" required>
            <Input required minLength={2} maxLength={120} autoComplete="organization" value={form.organisation} onChange={set('organisation')} />
          </FormField>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Prénom" required>
              <Input required autoComplete="given-name" value={form.prenom} onChange={set('prenom')} />
            </FormField>
            <FormField label="Nom" required>
              <Input required autoComplete="family-name" value={form.nom} onChange={set('nom')} />
            </FormField>
          </div>
        )}
        <FormField label={estOrganisation ? 'Adresse e-mail de l\'organisation' : 'Adresse e-mail'} required>
          <Input type="email" required autoComplete="email" value={form.email} onChange={set('email')} />
        </FormField>
        <FormField label="Mot de passe" hint="8 caractères minimum." required>
          <Input type="password" required minLength={8} autoComplete="new-password" value={form.password} onChange={set('password')} />
        </FormField>
        <Button type="submit" variant="secondary" fullWidth loading={loading}>{loading ? 'Création…' : 'Créer mon compte'}</Button>
        <p className="text-center text-body-sm text-on-surface-muted">
          En créant un compte, vous acceptez de recevoir notre newsletter « Parlons agriculture ». Vous pourrez vous désabonner à tout moment.
        </p>
      </form>
    </AuthCard>
  )
}
