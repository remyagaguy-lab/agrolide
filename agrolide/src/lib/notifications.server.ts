import 'server-only'
import { db } from '@/db'
import { notifications } from '@/db/schema'

/**
 * Crée une notification pour un membre (visible dans la cloche et la page « Notifications »).
 * Ne lève jamais d'erreur : une notification ratée ne doit pas faire échouer l'action qui la provoque.
 *
 * `type` : connexion | evenement | formation | cotisation | forum | opportunite | document
 * (la rubrique affichée vient de `libelleType` dans `@/lib/notifications`).
 * `lien` : chemin interne uniquement (commençant par « / »).
 */
export async function notifier(
  userId: string | null | undefined,
  notification: { type: string; contenu: string; lien?: string | null },
): Promise<void> {
  if (!userId) return
  try {
    await db.insert(notifications).values({
      user_id: userId,
      type: notification.type,
      contenu: notification.contenu,
      lien: notification.lien ?? null,
      lu: false,
      created_at: new Date().toISOString(),
    })
  } catch (e) {
    console.error(`[notifications] « ${notification.type} » non enregistrée :`, e)
  }
}
