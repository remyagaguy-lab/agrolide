import 'server-only'
import { after } from 'next/server'
import { and, eq, inArray, like, notInArray } from 'drizzle-orm'
import { db } from '@/db'
import { abonnements_push } from '@/db/schema'
import { lienSur } from '@/lib/notifications'
import { clesVapid, envoyerWebPush, type ClesVapid } from './webpush'
import { normaliserCategories, type CategoriePush } from './categories'

export interface MessagePush {
  titre: string
  corps: string
  /** Chemin interne ouvert au toucher de l'alerte. */
  lien?: string | null
  /** Deux alertes de même `tag` se remplacent au lieu de s'empiler. */
  tag?: string
}

/** Nombre maximal d'appareils joints par diffusion (une alerte à tous les membres passe par lots). */
const MAX_DIFFUSION = 2000
const LOT = 20

let avertissement = false
function cles(): ClesVapid | null {
  const c = clesVapid()
  if (!c && !avertissement) {
    avertissement = true
    console.warn('[push] VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY absentes ou invalides : aucune alerte push envoyée.')
  }
  return c
}

type Ligne = { id: string; endpoint: string; p256dh: string; auth: string; categories: string }

/** Envoie à chaque appareil, purge ceux que le service de push dit disparus (404 / 410), note les envois réussis. */
async function envoyerAuxAbonnements(lignes: Ligne[], categorie: CategoriePush, message: MessagePush, vapid: ClesVapid): Promise<number> {
  const charge = {
    titre: message.titre.slice(0, 80),
    corps: message.corps.slice(0, 200),
    lien: lienSur(message.lien),
    tag: message.tag ?? categorie,
    categorie,
  }
  const perimes: string[] = []
  const reussis: string[] = []
  for (let i = 0; i < lignes.length; i += LOT) {
    await Promise.all(
      lignes.slice(i, i + LOT).map(async (l) => {
        if (!normaliserCategories(l.categories).includes(categorie)) return
        const r = await envoyerWebPush({ endpoint: l.endpoint, p256dh: l.p256dh, auth: l.auth }, charge, vapid)
        if (r.perime) perimes.push(l.id)
        else if (r.ok) reussis.push(l.id)
        else if (r.statut) console.warn(`[push] envoi refusé (HTTP ${r.statut})`)
      }),
    )
  }
  const maintenant = new Date().toISOString()
  if (perimes.length) await db.delete(abonnements_push).where(inArray(abonnements_push.id, perimes))
  if (reussis.length) await db.update(abonnements_push).set({ derniere_utilisation: maintenant }).where(inArray(abonnements_push.id, reussis))
  return reussis.length
}

const colonnes = { id: abonnements_push.id, endpoint: abonnements_push.endpoint, p256dh: abonnements_push.p256dh, auth: abonnements_push.auth, categories: abonnements_push.categories }

/** Alerte push à tous les appareils d'un membre qui ont activé cette catégorie. Ne lève jamais d'erreur. */
export async function envoyerPush(userId: string | null | undefined, categorie: CategoriePush, message: MessagePush): Promise<void> {
  if (!userId) return
  try {
    const vapid = cles()
    if (!vapid) return
    const lignes = await db.select(colonnes).from(abonnements_push).where(and(eq(abonnements_push.user_id, userId), like(abonnements_push.categories, `%${categorie}%`)))
    if (lignes.length) await envoyerAuxAbonnements(lignes, categorie, message, vapid)
  } catch (e) {
    console.error('[push] envoi impossible :', e)
  }
}

/**
 * Alerte push à tous les appareils ayant activé la catégorie, sauf ceux des membres de `sauf` (par exemple l'auteur).
 * Réservé aux annonces d'intérêt général (nouvelle opportunité publiée). Ne lève jamais d'erreur ; renvoie le nombre d'appareils joints.
 */
export async function diffuserPush(categorie: CategoriePush, message: MessagePush, sauf: Array<string | null | undefined> = []): Promise<number> {
  try {
    const vapid = cles()
    if (!vapid) return 0
    const exclus = sauf.filter((x): x is string => !!x)
    const condition = and(like(abonnements_push.categories, `%${categorie}%`), exclus.length ? notInArray(abonnements_push.user_id, exclus) : undefined)
    const lignes = await db.select(colonnes).from(abonnements_push).where(condition).limit(MAX_DIFFUSION)
    return lignes.length ? await envoyerAuxAbonnements(lignes, categorie, message, vapid) : 0
  } catch (e) {
    console.error('[push] diffusion impossible :', e)
    return 0
  }
}

/** Lance l'envoi après la réponse à l'utilisateur (il n'attend pas les services de push) ; repli : exécution immédiate. */
export function apresReponse(tache: () => Promise<unknown>): void {
  try {
    after(tache)
  } catch {
    void tache()
  }
}
