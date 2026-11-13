import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/server'
import { clesVapid } from '@/lib/push/webpush'

/** Clé publique VAPID (nécessaire au navigateur pour s'abonner). 503 tant que le serveur n'est pas configuré. */
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })
  const cles = clesVapid()
  if (!cles) return NextResponse.json({ error: 'Les alertes ne sont pas encore disponibles.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  return NextResponse.json({ cle: cles.publique }, { headers: { 'Cache-Control': 'no-store' } })
}
