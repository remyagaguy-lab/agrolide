'use server';

import { db } from '@/db';
import { user_connections } from '@/db/schema';
import { auth } from '@/lib/auth/server';
import { eq, and, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function sendConnectionRequest(receiverId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Non autorisé" };
  if (receiverId === userId) return { error: "Vous ne pouvez pas vous inviter vous-même." };

  const receiver = await db.query.users.findFirst({
    columns: { id: true, annuaire_visible: true },
    where: (u, { eq }) => eq(u.id, receiverId),
  });
  if (!receiver || receiver.annuaire_visible === false) return { error: "Ce membre est introuvable." };

  // Check if connection already exists
  const existing = await db.query.user_connections.findFirst({
    where: (connections, { eq, and, or }) =>
      or(
        and(eq(connections.requester_id, userId), eq(connections.receiver_id, receiverId)),
        and(eq(connections.requester_id, receiverId), eq(connections.receiver_id, userId))
      ),
  });

  if (existing) {
    return { error: "Une connexion ou demande existe déjà" };
  }

  const [created] = await db.insert(user_connections).values({
    requester_id: userId,
    receiver_id: receiverId,
    status: 'pending',
  }).returning({ id: user_connections.id });

  revalidatePath('/annuaire', 'layout');
  revalidatePath('/membres/reseau', 'layout');
  return { success: true, connectionId: created?.id ?? null };
}

export async function acceptConnectionRequest(connectionId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Non autorisé" };

  // Only the receiver can accept
  const connection = await db.query.user_connections.findFirst({
    where: (connections, { eq }) => eq(connections.id, connectionId)
  });

  if (!connection || connection.receiver_id !== userId) {
    return { error: "Demande introuvable ou non autorisée" };
  }

  await db.update(user_connections)
    .set({ status: 'accepted', updated_at: new Date().toISOString() })
    .where(eq(user_connections.id, connectionId));

  revalidatePath('/membres/reseau');
  return { success: true };
}

export async function rejectConnectionRequest(connectionId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Non autorisé" };

  const connection = await db.query.user_connections.findFirst({
    where: (connections, { eq }) => eq(connections.id, connectionId)
  });

  if (!connection || connection.receiver_id !== userId) {
    return { error: "Demande introuvable ou non autorisée" };
  }

  await db.update(user_connections)
    .set({ status: 'rejected', updated_at: new Date().toISOString() })
    .where(eq(user_connections.id, connectionId));

  revalidatePath('/membres/reseau');
  return { success: true };
}

export async function getConnectionStatus(otherUserId: string) {
  const { userId } = await auth();
  if (!userId) return null;

  const connection = await db.query.user_connections.findFirst({
    where: (connections, { eq, and, or }) =>
      or(
        and(eq(connections.requester_id, userId), eq(connections.receiver_id, otherUserId)),
        and(eq(connections.requester_id, otherUserId), eq(connections.receiver_id, userId))
      ),
  });

  return connection;
}
