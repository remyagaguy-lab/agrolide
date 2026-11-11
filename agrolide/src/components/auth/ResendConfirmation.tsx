'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { inputClass, translateAuthError } from '@/components/auth/AuthCard'

const COOLDOWN_SECONDS = 60

/** Renvoie l'e-mail de confirmation (1 envoi par minute). */
export function ResendConfirmation({ email: initialEmail = '', showInput = true }: { email?: string; showInput?: boolean }) {
  const [email, setEmail] = useState(initialEmail)
  const [wait, setWait] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => setEmail(initialEmail), [initialEmail])

  useEffect(() => {
    if (wait <= 0) return
    const t = setTimeout(() => setWait((w) => w - 1), 1000)
    return () => clearTimeout(t)
  }, [wait])

  async function resend() {
    if (!email || wait > 0) return
    setLoading(true)
    setError('')
    setMessage('')
    const { error } = await createSupabaseBrowser().auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) return setError(translateAuthError(error.message))
    setMessage('E-mail renvoyé. Vérifiez votre boîte de réception et votre dossier spam.')
    setWait(COOLDOWN_SECONDS)
  }

  return (
    <div className="mt-4 space-y-3 rounded-lg bg-gray-50 p-4 text-sm">
      {showInput && (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse e-mail"
          aria-label="Adresse e-mail"
          className={inputClass}
        />
      )}
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {message && <p role="status" className="text-[#1b5e38]">{message}</p>}
      <button
        type="button"
        onClick={resend}
        disabled={loading || wait > 0 || !email}
        className="w-full rounded-lg border border-[#1b5e38] px-4 py-2.5 font-semibold text-[#1b5e38] hover:bg-[#1b5e38] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
        {wait > 0 ? `Renvoyer l’e-mail (${wait} s)` : loading ? 'Envoi…' : 'Renvoyer l’e-mail de confirmation'}
      </button>
    </div>
  )
}
