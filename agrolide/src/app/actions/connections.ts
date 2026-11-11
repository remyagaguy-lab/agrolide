'use server';

import { db } from '@/db';
import { notifications, user_connections } from '@/db/schema';
import { auth } from '@/lib/auth/server';
import { and, count, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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

/** Une notification ne doit jamais faire échouer l'action qui la provoque. */
async function notifier(userId: string, contenu: string, lien: string) {
  try {
    await db.insert(notifications).values({
      user_id: userId,
      type: 'connexion',
      contenu,
      lien,
      lu: false,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('[connexions] notification non enregistrée :', e);
  }
}

/**
 * `badge` : le nombre d'invitations de la barre de navigation change (accepter, ignorer) → on rafraîchit tout l'espace membre.
 * Sinon seule « Mon réseau » est rafraîchie : l'annuaire garde l'état de ses cartes affiché jusqu'à la prochaine visite.
 */
function rafraichir(badge = false) {
  revalidatePath(badge ? '/membres' : '/membres/reseau', 'layout');
}

export async function sendConnectionRequest(receiverId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Non autorisé" };
  if (receiverId === userId) return { error: "Vous ne pouvez pas vous inviter vous-même." };

  const receiver = await db.query.users.findFirst({
    columns: { id: true, annuaire_visible: true, ouvert_contact: true },
    where: (u, { eq }) => eq(u.id, receiverId),
  });
  if (!receiver || receiver.annuaire_visible === false) return { error: "Ce membre est introuvable." };
  // Décision D2 : seul un refus explicite ferme les invitations (valeur vide = ouvert).
  if (receiver.ouvert_contact === false) return { error: "Ce membre ne reçoit pas d’invitations." };

  const existing = await db.query.user_connections.findFirst({
    where: (c, { eq, and, or }) =>
      or(
        and(eq(c.requester_id, userId), eq(c.receiver_id, receiverId)),
        and(eq(c.requester_id, receiverId), eq(c.receiver_id, userId))
      ),
  });
  if (existing) {
    return { error: "Une connexion ou une invitation existe déjà avec ce membre." };
  }

  const [{ enAttente }] = await db
    .select({ enAttente: count() })
    .from(user_connections)
    .where(and(eq(user_connections.requester_id, userId), eq(user_connections.status, 'pending')));
  if (enAttente >= MAX_INVITATIONS_EN_ATTENTE) {
    return {
      error: `Vous avez déjà ${MAX_INVITATIONS_EN_ATTENTE} invitations en attente. Retirez-en une ou attendez une réponse avant d’en envoyer d’autres.`,
    };
  }

  const [created] = await db.insert(user_connections).values({
    requester_id: userId,
    receiver_id: receiverId,
    status: 'pending',
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
    notifier(connection.requester_id, `${nomInvite} a accepté votre invitation. Vous pouvez désormais échanger.`, `/membres/messages?user=${userId}`),
    notifier(userId, `Vous êtes maintenant connecté(e) à ${nomInvitant}.`, `/membres/messages?user=${connection.requester_id}`),
  ]);

  rafraichir(true);
  return { success: true };
}

/**
 * Ignorer une invitation reçue ou retirer une invitation envoyée : la ligne est supprimée
 * (ni l'un ni l'autre n'est averti, et chacun pourra de nouveau inviter l'autre).
 * Ne s'applique qu'aux invitations en attente ; pour une relation, voir `removeConnection`.
 */
export async function declineConnectionRequest(connectionId: string): Promise<Resultat> {
  const { userId } = await auth();
  if (!userId) return { error: "Non autorisé" };

  const connection = await db.query.user_connections.findFirst({
    where: (c, { eq }) => eq(c.id, connectionId),
  });
  if (
    !connection ||
    connection.status !== 'pending' ||
    (connection.receiver_id !== userId && connection.requester_id !== userId)
  ) {
    return { error: "Invitation introuvable ou déjà traitée." };
  }

  await db.delete(user_connections).where(eq(user_connections.id, connectionId));

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
