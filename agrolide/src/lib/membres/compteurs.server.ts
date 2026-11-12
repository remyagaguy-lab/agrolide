import "server-only"
import { cache } from "react"
import { and, count, eq, isNull, or } from "drizzle-orm"
import { db } from "@/db"
import { messages, user_connections, users } from "@/db/schema"
import { sansBloques } from "@/lib/reseau/blocage.server"

/**
 * Compteurs de l'espace membre (barre latérale, tableau de bord). Chacun est un COUNT en base — jamais une liste
 * tronquée dont on mesure la longueur — et mis en cache pour la durée de la requête : le layout et la page
 * qui l'affichent n'interrogent la base qu'une fois.
 */

/** Invitations de connexion reçues et en attente. */
export const compterInvitations = cache(async (userId: string): Promise<number> => {
  const [row] = await db
    .select({ total: count() })
    .from(user_connections)
    .innerJoin(users, eq(users.id, user_connections.requester_id))
    .where(and(
      eq(user_connections.receiver_id, userId),
      eq(user_connections.status, "pending"),
      // Comme dans « Mon réseau » : un invitant qui a masqué son profil n'est pas compté.
      or(eq(users.annuaire_visible, true), isNull(users.annuaire_visible)),
    ))
  return Number(row?.total ?? 0)
})

/**
 * Messages non lus : un seul comptage, sur l'index (destinataire_id, lu).
 * Une valeur vide de `lu` compte comme non lue, comme dans l'API des conversations.
 */
export const compterMessagesNonLus = cache(async (userId: string): Promise<number> => {
  const [row] = await db
    .select({ total: count() })
    .from(messages)
    .where(and(
      eq(messages.destinataire_id, userId),
      or(eq(messages.lu, false), isNull(messages.lu)),
      // Les messages d'un membre bloqué ne comptent plus comme « non lus ».
      sansBloques(userId, messages.expediteur_id),
    ))
  return Number(row?.total ?? 0)
})
