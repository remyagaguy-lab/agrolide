'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { safeNext } from '@/lib/auth/safe-next'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { ResendConfirmation } from '@/components/auth/ResendConfirmation'
import { AuthCard, buttonClass, inputClass, translateAuthError } from '@/components/auth/AuthCard'

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
      footer={<>Pas encore membre ? <Link href="/inscription" className="font-semibold text-[#1b5e38]">Créer un compte</Link></>}
    >
      <GoogleButton next={next} />
      <form onSubmit={onSubmit} className="space-y-5">
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Adresse e-mail</label>
          <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <Link href="/reset-password" className="text-xs font-medium text-[#1b5e38]">Mot de passe oublié ?</Link>
          </div>
          <input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </div>
        <button type="submit" disabled={loading} className={buttonClass}>{loading ? 'Connexion…' : 'Se connecter'}</button>
      </form>
      {needsConfirm && <ResendConfirmation email={email} />}
    </AuthCard>
  )
}
