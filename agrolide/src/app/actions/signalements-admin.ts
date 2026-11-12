'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { signalements } from '@/db/schema'
import { adminCourant, estStatutSignalement } from '@/lib/reseau/signalements'

/** Change le statut d'un signalement. Réservé à l'administration (vérifié ici, pas seulement par la page). */
export async function changerStatutSignalement(id: string, statut: string): Promise<{ success: true } | { success: false; error: string }> {
  if (!(await adminCourant())) return { success: false, error: 'Accès réservé à l’administration.' }
  if (typeof id !== 'string' || !id || !estStatutSignalement(statut)) return { success: false, error: 'Statut invalide.' }
  try {
    await db.update(signalements).set({ statut }).where(eq(signalements.id, id))
  } catch (e) {
    console.error('[signalements] statut non enregistré :', e)
    return { success: false, error: 'L’enregistrement a échoué. Réessayez dans un instant.' }
  }
  revalidatePath('/admin/signalements')
  return { success: true }
}
