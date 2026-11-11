'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { AuthCard, authLinkClass, translateAuthError } from '@/components/auth/AuthCard'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'

/**
 * Deux modes :
 *  1. Sans session : demande du lien de réinitialisation par e-mail.
 *  2. Avec session de récupération (arrivée par le lien e-mail via /auth/callback) : nouveau mot de passe.
 */
export default function ResetPasswordClient() {
  const [hasSession, setHasSession] = useState<boolean | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    createSupabaseBrowser().auth.getSession().then(({ data }) => setHasSession(!!data.session))
  }, [])

  async function requestLink(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await createSupabaseBrowser().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    setLoading(false)
    if (error) return setError(translateAuthError(error.message))
    setMessage('Si un compte existe pour cette adresse, un lien de réinitialisation vient d’être envoyé.')
  }

  async function saveNewPassword(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await createSupabaseBrowser().auth.updateUser({ password })
    setLoading(false)
    if (error) return setError(translateAuthError(error.message))
    window.location.assign('/membres/dashboard')
  }

  if (hasSession === null) return null

  if (hasSession) {
    return (
      <AuthCard title="Nouveau mot de passe" subtitle="Choisissez un mot de passe d’au moins 8 caractères">
        <form onSubmit={saveNewPassword} className="space-y-5">
          {error && <Alert variant="error">{error}</Alert>}
          <FormField label="Nouveau mot de passe" hint="8 caractères minimum." required>
            <Input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormField>
          <Button type="submit" variant="secondary" fullWidth loading={loading}>{loading ? 'Enregistrement…' : 'Enregistrer'}</Button>
        </form>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Mot de passe oublié"
      subtitle="Recevez un lien de réinitialisation par e-mail"
      footer={<Link href="/login" className={authLinkClass}>Retour à la connexion</Link>}
    >
      {message ? (
        <Alert variant="success">{message}</Alert>
      ) : (
        <form onSubmit={requestLink} className="space-y-5">
          {error && <Alert variant="error">{error}</Alert>}
          <FormField label="Adresse e-mail de votre compte" required>
            <Input type="email" required autoComplete="email" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
          <Button type="submit" variant="secondary" fullWidth loading={loading}>{loading ? 'Envoi…' : 'Envoyer le lien'}</Button>
        </form>
      )}
    </AuthCard>
  )
}
