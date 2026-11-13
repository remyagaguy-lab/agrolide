import 'server-only'
import { db } from '@/db'
import { notifications } from '@/db/schema'
import { libelleType } from '@/lib/notifications'
import { categorieDuType } from '@/lib/push/categories'
import { apresReponse, envoyerPush } from '@/lib/push/envoyer.server'

/**
 * Crée une notification pour un membre (visible dans la cloche et la page « Notifications »).
 * Ne lève jamais d'erreur : une notification ratée ne doit pas faire échouer l'action qui la provoque.
 * Si le membre a activé les alertes push sur un appareil (pour la catégorie correspondante), l'alerte y est envoyée
 * aussi, après la réponse à l'utilisateur.
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
    return
  }
  apresReponse(() =>
    envoyerPush(userId, categorieDuType(notification.type), {
      titre: libelleType(notification.type),
      corps: notification.contenu,
      lien: notification.lien,
      tag: `${notification.type}-${Date.now()}`, // chaque alerte reste visible, sans en remplacer une autre
    }),
  )
}
