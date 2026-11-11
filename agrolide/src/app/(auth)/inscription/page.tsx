'use client'

import { useState, useEffect, type FormEvent } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { ResendConfirmation } from '@/components/auth/ResendConfirmation'
import { safeNext } from '@/lib/auth/safe-next'
import { AuthCard, authLinkClass, translateAuthError } from '@/components/auth/AuthCard'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'

export default function InscriptionPage() {
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [nextParam, setNextParam] = useState('/membres/dashboard')
  useEffect(() => {
    setNextParam(safeNext(new URLSearchParams(window.location.search).get('next')))
  }, [])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await createSupabaseBrowser().auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { prenom: form.prenom.trim(), nom: form.nom.trim(), full_name: `${form.prenom} ${form.nom}`.trim() },
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

  return (
    <AuthCard
      title="Rejoindre le réseau"
      subtitle="Créez votre compte membre gratuitement"
      footer={<>Déjà membre ? <Link href="/login" className={authLinkClass}>Se connecter</Link></>}
    >
      <GoogleButton next={nextParam} />
      <form onSubmit={onSubmit} className="space-y-5">
        {error && <Alert variant="error">{error}</Alert>}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Prénom" required>
            <Input required autoComplete="given-name" value={form.prenom} onChange={set('prenom')} />
          </FormField>
          <FormField label="Nom" required>
            <Input required autoComplete="family-name" value={form.nom} onChange={set('nom')} />
          </FormField>
        </div>
        <FormField label="Adresse e-mail" required>
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
