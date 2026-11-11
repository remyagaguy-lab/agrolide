'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { safeNext } from '@/lib/auth/safe-next'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { ResendConfirmation } from '@/components/auth/ResendConfirmation'
import { AuthCard, authLinkClass, translateAuthError } from '@/components/auth/AuthCard'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'

const URL_ERRORS: Record<string, string> = {
  lien_invalide: 'Ce lien est invalide ou a expiré. Demandez-en un nouveau.',
  session_expiree: 'Votre session a expiré. Reconnectez-vous.',
  profil: 'Votre profil n’a pas pu être préparé. Réessayez ou contactez-nous.',
}

export default function LoginForm() {
  const params = useSearchParams()
  const next = safeNext(params.get('next'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(URL_ERRORS[params.get('error') ?? ''] ?? '')
  const [loading, setLoading] = useState(false)
  // Lien expiré (?error=lien_invalide) ou compte non confirmé : proposer un nouvel e-mail.
  const [needsConfirm, setNeedsConfirm] = useState(params.get('error') === 'lien_invalide')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await createSupabaseBrowser().auth.signInWithPassword({ email, password })
    if (error) {
      setNeedsConfirm(error.message.toLowerCase().includes('not confirmed'))
      setError(translateAuthError(error.message))
      setLoading(false)
      return
    }
    // Navigation complète : le serveur crée/lie le profil D1 puis redirige.
    window.location.assign(`/auth/callback?next=${encodeURIComponent(next)}`)
  }

  return (
    <AuthCard
      title="Connexion"
      subtitle="Accédez à votre espace membre"
      footer={<>Pas encore membre ? <Link href="/inscription" className={authLinkClass}>Créer un compte</Link></>}
    >
      <GoogleButton next={next} />
      <form onSubmit={onSubmit} className="space-y-5">
        {error && <Alert variant="error">{error}</Alert>}
        <FormField label="Adresse e-mail" required>
          <Input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormField>
        <div>
          <FormField label="Mot de passe" required>
            <Input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormField>
          <p className="mt-2 text-right text-body-sm">
            <Link href="/reset-password" className={authLinkClass}>Mot de passe oublié ?</Link>
          </p>
        </div>
        <Button type="submit" variant="secondary" fullWidth loading={loading}>{loading ? 'Connexion…' : 'Se connecter'}</Button>
      </form>
      {needsConfirm && <ResendConfirmation email={email} />}
    </AuthCard>
  )
}
