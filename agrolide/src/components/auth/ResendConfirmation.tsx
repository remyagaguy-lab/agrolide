'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { translateAuthError } from '@/components/auth/AuthCard'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

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
    <div className="mt-5 space-y-3 rounded-card bg-surface-container p-4">
      {showInput && (
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse e-mail"
          aria-label="Adresse e-mail"
          autoComplete="email"
        />
      )}
      {error && <Alert variant="error">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      <Button type="button" variant="outline" fullWidth onClick={resend} disabled={wait > 0 || !email} loading={loading}>
        {wait > 0 ? `Renvoyer l’e-mail (${wait} s)` : loading ? 'Envoi…' : 'Renvoyer l’e-mail de confirmation'}
      </Button>
    </div>
  )
}
