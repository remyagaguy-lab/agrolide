'use client'

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'

/** Bouton « Continuer avec Google » + séparateur. Le retour passe par /auth/callback (création/liaison du profil). */
export function GoogleButton({ next = '/membres/dashboard' }: { next?: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function signIn() {
    setLoading(true)
    setError('')
    const { error } = await createSupabaseBrowser().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    })
    if (error) {
      setError('Connexion Google indisponible pour le moment.')
      setLoading(false)
    }
  }

  return (
    <div className="mb-6">
      {error && <Alert variant="error" className="mb-3">{error}</Alert>}
      <Button type="button" variant="outline" fullWidth onClick={signIn} loading={loading} className="gap-3 text-on-surface">
        {/* Couleurs officielles de la marque Google : à ne pas remplacer par nos jetons. */}
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/>
          <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"/>
          <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
        </svg>
        {loading ? 'Redirection…' : 'Continuer avec Google'}
      </Button>
      <div className="mt-6 flex items-center gap-3 text-body-sm text-on-surface-muted" role="separator">
        <span className="h-px flex-1 bg-outline-variant" /> ou avec votre e-mail <span className="h-px flex-1 bg-outline-variant" />
      </div>
    </div>
  )
}
