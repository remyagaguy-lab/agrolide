'use server';

import { db } from '@/db';
import { user_connections } from '@/db/schema';
import { auth } from '@/lib/auth/server';
import { notifier as notifierMembre } from '@/lib/notifications.server';
import { and, count, eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { existeBlocage } from '@/lib/reseau/blocage.server';

/** Invitations envoyées en attente au plus (freine le démarchage en masse). */
const MAX_INVITATIONS_EN_ATTENTE = 20;

type Resultat = { success?: true; error?: string };

async function nomDe(id: string) {
  const u = await db.query.users.findFirst({
    columns: { prenom: true, nom: true },
    where: (t, { eq }) => eq(t.id, id),
  });
  return `${u?.prenom ?? ''} ${u?.nom ?? ''}`.trim() || 'Un membre';
}

/** Une notification de réseau (ne fait jamais échouer l'action qui la provoque). */
const notifier = (userId: string, contenu: string, lien: string) =>
  notifierMembre(userId, { type: 'connexion', contenu, lien });

/**
 * `badge` : le nombre d'invitations de la barre de navigation change (accepter, ignorer) → on rafraîchit tout l'espace membre.
 * Sinon seule « Mon réseau » est rafraîchie : l'annuaire garde l'état de ses cartes affiché jusqu'à la prochaine visite.
 */
function rafraichir(badge = false) {
  revalidatePath(badge ? '/membres' : '/membres/reseau', 'layout');
}

/** Longueur maximale de la note facultative jointe à une invitation. */
const NOTE_INVITATION_MAX = 300;

export async function sendConnectionRequest(receiverId: string, note?: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Non autorisé" };
  // Note facultative : texte brut, vide = aucune note.
  if (note !== undefined && typeof note !== 'string') return { error: "Note invalide." };
  const message = (note ?? '').trim();
  if (message.length > NOTE_INVITATION_MAX) return { error: `La note ne doit pas dépasser ${NOTE_INVITATION_MAX} caractères.` };
  if (receiverId === userId) return { error: "Vous ne pouvez pas vous inviter vous-même." };

  const receiver = await db.query.users.findFirst({
    columns: { id: true, annuaire_visible: true, ouvert_contact: true },
    where: (u, { eq }) => eq(u.id, receiverId),
  });
  if (!receiver || receiver.annuaire_visible === false) return { error: "Ce membre est introuvable." };
  // Décision D2 : seul un refus explicite ferme les invitations (valeur vide = ouvert).
  if (receiver.ouvert_contact === false) return { error: "Ce membre ne reçoit pas d’invitations." };

  // Blocage dans un sens ou dans l'autre : même réponse que « introuvable », on ne révèle pas qu'on est bloqué.
  if (await existeBlocage(userId, receiverId)) return { error: "Ce membre est introuvable." };

  const existing = await db.query.user_connections.findFirst({
    where: (c, { eq, and, or }) =>
      or(
        and(eq(c.requester_id, userId), eq(c.receiver_id, receiverId)),
        and(eq(c.requester_id, receiverId), eq(c.receiver_id, userId))
      ),
  });
  if (existing) {
    // J'ai refusé son invitation plus tôt : je peux à mon tour l'inviter (l'ancienne ligne est remplacée).
    if (existing.status === 'rejected' && existing.receiver_id === userId) {
      await db.delete(user_connections).where(eq(user_connections.id, existing.id));
    } else {
      return { error: "Une connexion ou une invitation existe déjà avec ce membre." };
    }
  }

  const [{ enAttente }] = await db
    .select({ enAttente: count() })
    .from(user_connections)
    .where(and(eq(user_connections.requester_id, userId), inArray(user_connections.status, ['pending', 'rejected'])));
  if (enAttente >= MAX_INVITATIONS_EN_ATTENTE) {
    return {
      error: `Vous avez déjà ${MAX_INVITATIONS_EN_ATTENTE} invitations en attente. Retirez-en une ou attendez une réponse avant d’en envoyer d’autres.`,
    };
  }

  const [created] = await db.insert(user_connections).values({
    requester_id: userId,
    receiver_id: receiverId,
    status: 'pending',
    message: message || null,
  }).returning({ id: user_connections.id });

  await notifier(receiverId, `${await nomDe(userId)} vous a invité(e) à vous connecter.`, '/membres/reseau?onglet=invitations');

  rafraichir();
  return { success: true as const, connectionId: created?.id ?? null };
}

export async function acceptConnectionRequest(connectionId: string): Promise<Resultat> {
  const { userId } = await auth();
  if (!userId) return { error: "Non autorisé" };

  const connection = await db.query.user_connections.findFirst({
    where: (c, { eq }) => eq(c.id, connectionId),
  });
  // Seul le destinataire accepte, et uniquement une invitation en attente.
  if (!connection || connection.receiver_id !== userId || connection.status !== 'pending') {
    return { error: "Invitation introuvable ou déjà traitée." };
  }

  await db.update(user_connections)
    .set({ status: 'accepted', updated_at: new Date().toISOString() })
    .where(eq(user_connections.id, connectionId));

  // L'invitant apprend que l'invitation est acceptée ; l'invité garde une trace dans ses notifications.
  const [nomInvitant, nomInvite] = await Promise.all([nomDe(connection.requester_id), nomDe(userId)]);
  await Promise.all([
    notifier(connection.requester_id, `${nomInvite} a accepté votre invitation. Vous pouvez désormais échanger.`, '/membres/reseau?onglet=relations'),
    notifier(userId, `Vous êtes maintenant connecté(e) à ${nomInvitant}.`, '/membres/reseau?onglet=relations'),
  ]);

  rafraichir(true);
  return { success: true };
}

/**
 * Ignorer une invitation reçue : elle est marquée « refusée » ; l'invitant n'est pas averti et la voit toujours « En attente »
 * (il ne peut pas réinviter ce membre, qui reste libre de l'inviter). Retirer une invitation envoyée : la ligne est supprimée.
 * Ne s'applique qu'aux invitations non répondues ; pour une relation, voir `removeConnection`.
 */
export async function declineConnectionRequest(connectionId: string): Promise<Resultat> {
  const { userId } = await auth();
  if (!userId) return { error: "Non autorisé" };

  const connection = await db.query.user_connections.findFirst({
    where: (c, { eq }) => eq(c.id, connectionId),
  });
  if (
    !connection ||
    (connection.status !== 'pending' && connection.status !== 'rejected') ||
    (connection.receiver_id !== userId && connection.requester_id !== userId)
  ) {
    return { error: "Invitation introuvable ou déjà traitée." };
  }

  if (connection.receiver_id === userId) {
    if (connection.status === 'rejected') return { success: true };
    await db.update(user_connections)
      .set({ status: 'rejected', updated_at: new Date().toISOString() })
      .where(eq(user_connections.id, connectionId));
  } else {
    await db.delete(user_connections).where(eq(user_connections.id, connectionId));
  }

  rafraichir(true);
  return { success: true };
}

/** Retire une relation existante (l'un ou l'autre des deux membres peut le faire). L'autre membre n'est pas averti. */
export async function removeConnection(connectionId: string): Promise<Resultat> {
  const { userId } = await auth();
  if (!userId) return { error: "Non autorisé" };

  const connection = await db.query.user_connections.findFirst({
    where: (c, { eq }) => eq(c.id, connectionId),
  });
  if (
    !connection ||
    connection.status !== 'accepted' ||
    (connection.receiver_id !== userId && connection.requester_id !== userId)
  ) {
    return { error: "Relation introuvable." };
  }

  await db.delete(user_connections).where(eq(user_connections.id, connectionId));

  rafraichir();
  return { success: true };
}

export async function getConnectionStatus(otherUserId: string) {
  const { userId } = await auth();
  if (!userId) return null;

  const connection = await db.query.user_connections.findFirst({
    where: (c, { eq, and, or }) =>
      or(
        and(eq(c.requester_id, userId), eq(c.receiver_id, otherUserId)),
        and(eq(c.requester_id, otherUserId), eq(c.receiver_id, userId))
      ),
  });

  return connection;
}
