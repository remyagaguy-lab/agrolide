import { NextRequest, NextResponse } from 'next/server'
import { and, asc, eq } from 'drizzle-orm'
import { auth } from '@/lib/auth/server'
import { db } from '@/db'
import { abonnements_push } from '@/db/schema'
import { endpointAutorise } from '@/lib/push/webpush'
import { normaliserCategories, serialiserCategories, TOUTES_CATEGORIES } from '@/lib/push/categories'

/** Appareils au plus par membre : au-delà, les plus anciens sont retirés (téléphones changés, navigateurs oubliés). */
const MAX_APPAREILS = 8
const SANS_CACHE = { 'Cache-Control': 'no-store' }

const reponse = (corps: object, statut = 200) => NextResponse.json(corps, { status: statut, headers: SANS_CACHE })

async function corps(request: NextRequest): Promise<Record<string, any> | null> {
  try {
    const c = await request.json()
    return c && typeof c === 'object' ? c : null
  } catch {
    return null
  }
}

/** État de CET appareil : abonné ou non, et pour quelles catégories. `?endpoint=…` */
export async function GET(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return reponse({ error: 'Non autorisé.' }, 401)
  const endpoint = request.nextUrl.searchParams.get('endpoint') ?? ''
  if (!endpoint) return reponse({ actif: false, categories: [] })
  const [ligne] = await db
    .select({ categories: abonnements_push.categories })
    .from(abonnements_push)
    .where(and(eq(abonnements_push.endpoint, endpoint), eq(abonnements_push.user_id, userId)))
    .limit(1)
  return reponse({ actif: !!ligne, categories: ligne ? normaliserCategories(ligne.categories) : [] })
}

/** Enregistre (ou met à jour) l'abonnement de cet appareil. Un même appareil ne crée jamais de doublon. */
export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return reponse({ error: 'Non autorisé.' }, 401)
  const c = await corps(request)
  const sub = c?.subscription
  const endpoint: string = sub?.endpoint ?? ''
  const p256dh: string = sub?.keys?.p256dh ?? ''
  const cleAuth: string = sub?.keys?.auth ?? ''
  if (!endpointAutorise(endpoint) || !/^[\w-]{80,100}$/.test(p256dh) || !/^[\w-]{20,30}$/.test(cleAuth)) {
    return reponse({ error: 'Abonnement invalide.' }, 400)
  }
  // Sans `categories` (renouvellement automatique par le navigateur), un abonnement existant garde ses choix.
  const fourni = c?.categories !== undefined
  const categories = fourni ? normaliserCategories(c.categories) : TOUTES_CATEGORIES
  const maintenant = new Date().toISOString()
  const userAgent = (request.headers.get('user-agent') ?? '').slice(0, 200)

  // Même endpoint = même appareil : on le rattache au membre connecté (changement de compte sur le téléphone).
  await db
    .insert(abonnements_push)
    .values({ user_id: userId, endpoint, p256dh, auth: cleAuth, categories: serialiserCategories(categories), user_agent: userAgent, created_at: maintenant })
    .onConflictDoUpdate({
      target: abonnements_push.endpoint,
      set: { user_id: userId, p256dh, auth: cleAuth, user_agent: userAgent, ...(fourni ? { categories: serialiserCategories(categories) } : {}) },
    })

  // Plafond d'appareils : on retire les plus anciens.
  const tous = await db.select({ id: abonnements_push.id }).from(abonnements_push).where(eq(abonnements_push.user_id, userId)).orderBy(asc(abonnements_push.created_at))
  for (const vieux of tous.slice(0, Math.max(0, tous.length - MAX_APPAREILS))) {
    await db.delete(abonnements_push).where(eq(abonnements_push.id, vieux.id))
  }
  const [courant] = await db.select({ categories: abonnements_push.categories }).from(abonnements_push).where(eq(abonnements_push.endpoint, endpoint)).limit(1)
  return reponse({ actif: true, categories: courant ? normaliserCategories(courant.categories) : categories })
}

/** Change les catégories d'alertes de cet appareil. */
export async function PUT(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return reponse({ error: 'Non autorisé.' }, 401)
  const c = await corps(request)
  const endpoint: string = c?.endpoint ?? ''
  if (!endpoint) return reponse({ error: 'Appareil inconnu.' }, 400)
  const categories = normaliserCategories(c?.categories)
  const maj = await db
    .update(abonnements_push)
    .set({ categories: serialiserCategories(categories) })
    .where(and(eq(abonnements_push.endpoint, endpoint), eq(abonnements_push.user_id, userId)))
    .returning({ id: abonnements_push.id })
  if (!maj.length) return reponse({ error: 'Cet appareil n’est plus abonné. Réactivez les alertes.' }, 404)
  return reponse({ actif: true, categories })
}

/** Désabonne cet appareil (idempotent : supprimer un abonnement absent n'est pas une erreur). */
export async function DELETE(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return reponse({ error: 'Non autorisé.' }, 401)
  const c = await corps(request)
  const endpoint: string = c?.endpoint ?? ''
  if (!endpoint) return reponse({ error: 'Appareil inconnu.' }, 400)
  await db.delete(abonnements_push).where(and(eq(abonnements_push.endpoint, endpoint), eq(abonnements_push.user_id, userId)))
  return reponse({ actif: false })
}
