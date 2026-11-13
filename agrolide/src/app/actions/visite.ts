'use server'

import { auth } from '@/lib/auth/server'
import { db } from '@/db'
import { visite_guidee } from '@/db/schema'

/**
 * Enregistre que le membre connecté a vu la visite guidée du tableau de bord (jusqu'au bout, ou en la passant).
 * Sans effet si la table n'existe pas encore (migration 0011 non appliquée) : la visite se rejouera, rien ne casse.
 */
export async function enregistrerVisiteVue(issue: 'terminee' | 'passee'): Promise<{ ok: boolean }> {
  const { userId } = await auth()
  if (!userId) return { ok: false }
  const valeur = issue === 'terminee' ? 'terminee' : 'passee'
  try {
    await db
      .insert(visite_guidee)
      .values({ membre_id: userId, vue_le: new Date().toISOString(), issue: valeur })
      .onConflictDoUpdate({ target: visite_guidee.membre_id, set: { vue_le: new Date().toISOString(), issue: valeur } })
    return { ok: true }
  } catch (e) {
    console.error('[visite] enregistrement impossible (migration 0011 appliquée ?) :', e)
    return { ok: false }
  }
}
