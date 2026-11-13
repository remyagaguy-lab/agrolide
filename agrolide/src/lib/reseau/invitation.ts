/** Ce que doit faire `sendConnectionRequest` d'une ligne `user_connections` déjà présente entre deux membres. */
export type DecisionInvitation =
  | { action: 'creer' }
  /** Ancienne ligne sans valeur : elle est supprimée puis l'invitation est créée. */
  | { action: 'remplacer'; id: string }
  /** Déjà invité(e) par moi : rien à créer, on répond comme un succès (double clic, page périmée). */
  | { action: 'deja_envoyee'; id: string }
  | { action: 'refuser'; message: string }

export interface LigneConnexion {
  id: string
  requester_id: string
  receiver_id: string
  status: string
}

/**
 * - rien → créer ;
 * - j'ai ignoré son invitation (refusée, je suis destinataire) → je peux l'inviter à mon tour (ligne remplacée) ;
 * - mon invitation est déjà là (en attente, ou refusée sans que je le sache) → succès sans doublon ;
 * - il m'a invité(e) → message précis, c'est à moi d'accepter ;
 * - déjà connectés → message précis ;
 * - statut inconnu (ligne orpheline ou ancienne) → ligne remplacée, au lieu de bloquer à vie.
 */
export function decideInvitation(existing: LigneConnexion | undefined | null, userId: string): DecisionInvitation {
  if (!existing) return { action: 'creer' }
  const jeSuisInvitant = existing.requester_id === userId
  switch (existing.status) {
    case 'accepted':
      return { action: 'refuser', message: 'Vous êtes déjà connecté(e) avec ce membre.' }
    case 'pending':
      return jeSuisInvitant
        ? { action: 'deja_envoyee', id: existing.id }
        : { action: 'refuser', message: 'Ce membre vous a déjà invité(e) : acceptez son invitation dans « Mon réseau ».' }
    case 'rejected':
      return jeSuisInvitant ? { action: 'deja_envoyee', id: existing.id } : { action: 'remplacer', id: existing.id }
    default:
      return { action: 'remplacer', id: existing.id }
  }
}
