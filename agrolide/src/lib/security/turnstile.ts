import 'server-only'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Vérifie le jeton Cloudflare Turnstile (en-tête `x-turnstile-token`).
 * - TURNSTILE_SECRET_KEY absente : vérification désactivée (développement, ou avant configuration).
 * - Retourne une réponse d'erreur 400 si le jeton est absent ou invalide, sinon null.
 */
export async function verifyTurnstile(request: NextRequest): Promise<NextResponse | null> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    if (process.env.NODE_ENV === 'production') console.warn('TURNSTILE_SECRET_KEY absente : anti-bot désactivé')
    return null
  }

  const token = request.headers.get('x-turnstile-token')
  if (!token) {
    return NextResponse.json({ error: 'Vérification anti-robot requise. Rechargez la page.' }, { status: 400 })
  }

  try {
    const body = new URLSearchParams({ secret, response: token })
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    if (ip) body.set('remoteip', ip)
    // Délai maximum de 5 s : au-delà, la réponse « anti-robot indisponible » (503) ci-dessous s'applique.
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body, signal: AbortSignal.timeout(5000) })
    const data = (await res.json()) as { success?: boolean }
    if (!data.success) {
      return NextResponse.json({ error: 'Vérification anti-robot échouée. Réessayez.' }, { status: 400 })
    }
    return null
  } catch (e) {
    console.error('Turnstile siteverify indisponible:', e)
    return NextResponse.json({ error: 'Vérification anti-robot indisponible.' }, { status: 503 })
  }
}
