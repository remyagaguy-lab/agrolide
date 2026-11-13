import { NextResponse } from 'next/server'
import { eq, inArray } from 'drizzle-orm'
import { auth } from '@/lib/auth/server'
import { db } from '@/db'
import { abonnements_push } from '@/db/schema'
import { clesVapid, envoyerWebPush } from '@/lib/push/webpush'

/** Dernier essai par membre (mémoire du serveur : limite simple, suffisante contre les clics répétés). */
const dernier = new Map<string, number>()

/** Envoie une alerte d'essai AUX APPAREILS DU MEMBRE CONNECTÉ seulement (jamais à d'autres membres). */
export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })
  const cles = clesVapid()
  if (!cles) return NextResponse.json({ error: 'Les alertes ne sont pas encore disponibles.' }, { status: 503 })
  const maintenant = Date.now()
  if (maintenant - (dernier.get(userId) ?? 0) < 15_000) {
    return NextResponse.json({ error: 'Patientez quelques secondes avant un nouvel essai.' }, { status: 429 })
  }
  dernier.set(userId, maintenant)

  const lignes = await db.select().from(abonnements_push).where(eq(abonnements_push.user_id, userId))
  if (!lignes.length) return NextResponse.json({ error: 'Aucun appareil n’est abonné. Activez d’abord les alertes.' }, { status: 404 })

  const resultats = await Promise.all(
    lignes.map((l) =>
      envoyerWebPush(
        { endpoint: l.endpoint, p256dh: l.p256dh, auth: l.auth },
        { titre: 'Alerte d’essai', corps: 'Tout fonctionne : vous recevrez ici les alertes agrolide.', lien: '/membres/notifications', tag: 'essai' },
        cles,
        { ttlSecondes: 300 },
      ),
    ),
  )
  const perimes = lignes.filter((_, i) => resultats[i].perime).map((l) => l.id)
  if (perimes.length) await db.delete(abonnements_push).where(inArray(abonnements_push.id, perimes))
  const envoyes = resultats.filter((r) => r.ok).length
  if (!envoyes) return NextResponse.json({ error: 'L’alerte n’a pas pu être envoyée. Réactivez les alertes sur cet appareil.' }, { status: 502 })
  return NextResponse.json({ envoyes })
}
