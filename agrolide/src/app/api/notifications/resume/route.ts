import { NextResponse } from 'next/server'
import { getResumeNotifications } from '@/app/actions/notifications'

/**
 * Résumé de la cloche (dernières notifications + total des non lues).
 * Route GET et non Server Action : une Server Action en cours bloque les navigations suivantes du routeur
 * (elles passent dans la même file), alors qu'un fetch ordinaire n'attend personne. Comme la cloche interroge
 * le serveur au chargement, au retour sur l'onglet et chaque minute, c'était la cause de clics « sans effet ».
 */
export async function GET() {
  try {
    const resume = await getResumeNotifications(6)
    return NextResponse.json(resume, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (error) {
    console.error('API notifications/resume :', error)
    return NextResponse.json({ items: [], nonLues: 0 }, { status: 500 })
  }
}
