'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { AuthCard, buttonClass, inputClass, translateAuthError } from '@/components/auth/AuthCard'

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
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div>
            <label htmlFor="new-password" className="mb-1 block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
            <input id="new-password" type="password" required minLength={8} autoComplete="new-password" placeholder="8 caractères minimum" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          </div>
          <button type="submit" disabled={loading} className={buttonClass}>{loading ? 'Enregistrement…' : 'Enregistrer'}</button>
        </form>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Mot de passe oublié"
      subtitle="Recevez un lien de réinitialisation par e-mail"
      footer={<Link href="/login" className="font-semibold text-[#1b5e38]">Retour à la connexion</Link>}
    >
      {message ? (
        <p className="text-sm text-gray-700 text-center">{message}</p>
      ) : (
        <form onSubmit={requestLink} className="space-y-5">
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div>
            <label htmlFor="reset-email" className="mb-1 block text-sm font-medium text-gray-700">Adresse e-mail de votre compte</label>
            <input id="reset-email" type="email" required autoComplete="email" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          <button type="submit" disabled={loading} className={buttonClass}>{loading ? 'Envoi…' : 'Envoyer le lien'}</button>
        </form>
      )}
    </AuthCard>
  )
}
