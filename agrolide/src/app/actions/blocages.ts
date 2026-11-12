'use server'

import { and, eq, gt, or } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { signalements, user_blocks, user_connections, users } from '@/db/schema'
import { auth } from '@/lib/auth/server'
import { estMotifSignalement } from '@/lib/reseau/blocage'

type Resultat = { success: true } | { success: false; error: string }

const ID_MAX = 64
const idValide = (v: unknown): v is string => typeof v === 'string' && v.length > 0 && v.length <= ID_MAX

function rafraichir() {
  revalidatePath('/membres', 'layout')
}

/**
 * Bloque un membre. Effets (décision D13) : les deux membres deviennent invisibles l'un pour l'autre (annuaire, suggestions, fiche),
 * plus aucune invitation possible, et tout lien (accepté, en attente, refusé) est supprimé, ce qui ferme aussi la messagerie
 * (elle exige une relation acceptée). Les messages passés restent. Débloquer ne rétablit pas le lien. Le membre bloqué n'est pas averti.
 * Le blocage est enregistré d'abord, puis le lien supprimé : en cas d'échec au milieu, réessayer est sans danger.
 */
async function appliquerBlocage(userId: string, cibleId: string): Promise<Resultat> {
  const [cible] = await db.select({ id: users.id }).from(users).where(eq(users.id, cibleId)).limit(1)
  if (!cible) return { success: false, error: 'Ce membre est introuvable.' }

  await db.insert(user_blocks).values({ blocker_id: userId, blocked_id: cibleId, created_at: new Date().toISOString() }).onConflictDoNothing()
  await db.delete(user_connections).where(
    or(
      and(eq(user_connections.requester_id, userId), eq(user_connections.receiver_id, cibleId)),
      and(eq(user_connections.requester_id, cibleId), eq(user_connections.receiver_id, userId)),
    ),
  )
  return { success: true }
}

export async function bloquerMembre(cibleId: string): Promise<Resultat> {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Votre session a expiré. Reconnectez-vous pour continuer.' }
  if (!idValide(cibleId)) return { success: false, error: 'Membre invalide.' }
  if (cibleId === userId) return { success: false, error: 'Vous ne pouvez pas vous bloquer vous-même.' }
  try {
    const res = await appliquerBlocage(userId, cibleId)
    if (res.success) rafraichir()
    return res
  } catch (e) {
    console.error('[blocage] échec :', e)
    return { success: false, error: 'Le blocage a échoué. Réessayez dans un instant.' }
  }
}

export async function debloquerMembre(cibleId: string): Promise<Resultat> {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Votre session a expiré. Reconnectez-vous pour continuer.' }
  if (!idValide(cibleId)) return { success: false, error: 'Membre invalide.' }
  try {
    await db.delete(user_blocks).where(and(eq(user_blocks.blocker_id, userId), eq(user_blocks.blocked_id, cibleId)))
    rafraichir()
    return { success: true }
  } catch (e) {
    console.error('[blocage] déblocage échoué :', e)
    return { success: false, error: 'Le déblocage a échoué. Réessayez dans un instant.' }
  }
}

/** Signale un membre (motif de la liste fermée), avec en option un blocage immédiat. Un doublon identique dans les 24 h est ignoré en silence. */
export async function signalerMembre(payload: { id: string; motif: string; bloquer?: boolean }): Promise<Resultat> {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Votre session a expiré. Reconnectez-vous pour continuer.' }
  const { id, motif } = payload ?? ({} as typeof payload)
  if (!idValide(id) || !estMotifSignalement(motif)) return { success: false, error: 'Signalement invalide.' }
  if (id === userId) return { success: false, error: 'Vous ne pouvez pas vous signaler vous-même.' }

  try {
    const [cible] = await db.select({ id: users.id }).from(users).where(eq(users.id, id)).limit(1)
    if (!cible) return { success: false, error: 'Ce membre est introuvable.' }

    const depuis = new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    const [doublon] = await db
      .select({ id: signalements.id })
      .from(signalements)
      .where(and(eq(signalements.signaleur_id, userId), eq(signalements.signale_id, id), eq(signalements.motif, motif), gt(signalements.created_at, depuis)))
      .limit(1)
    if (!doublon) {
      await db.insert(signalements).values({ signaleur_id: userId, signale_id: id, motif, statut: 'nouveau', created_at: new Date().toISOString() })
    }
    if (payload.bloquer === true) {
      const res = await appliquerBlocage(userId, id)
      if (!res.success) return res
    }
    rafraichir()
    return { success: true }
  } catch (e) {
    console.error('[signalement] échec :', e)
    return { success: false, error: 'Le signalement a échoué. Réessayez dans un instant.' }
  }
}
