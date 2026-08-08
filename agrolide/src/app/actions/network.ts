'use server'

import { db } from '@/db'
import { user_connections } from '@/db/schema'
import { auth } from '@clerk/nextjs/server'
import { eq, and, or } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function acceptConnectionRequest(requestId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Vous devez être connecté" };
    }

    const connection = await db.query.user_connections.findFirst({
      where: eq(user_connections.id, requestId)
    });

    if (!connection) {
      return { error: "Demande introuvable" };
    }

    if (connection.receiver_id !== userId) {
      return { error: "Non autorisé" };
    }

    await db.update(user_connections)
      .set({ status: 'accepted', updated_at: new Date().toISOString() })
      .where(eq(user_connections.id, requestId));

    revalidatePath('/membres/reseau');
    revalidatePath('/annuaire', 'layout');
    
    return { success: true };
  } catch (error: any) {
    console.error("Erreur acceptConnectionRequest:", error);
    return { error: error.message || "Une erreur est survenue" };
  }
}

export async function declineConnectionRequest(requestId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Vous devez être connecté" };
    }

    const connection = await db.query.user_connections.findFirst({
      where: eq(user_connections.id, requestId)
    });

    if (!connection) {
      return { error: "Demande introuvable" };
    }

    if (connection.receiver_id !== userId && connection.requester_id !== userId) {
      return { error: "Non autorisé" };
    }

    await db.delete(user_connections)
      .where(eq(user_connections.id, requestId));

    revalidatePath('/membres/reseau');
    revalidatePath('/annuaire', 'layout');

    return { success: true };
  } catch (error: any) {
    console.error("Erreur declineConnectionRequest:", error);
    return { error: error.message || "Une erreur est survenue" };
  }
}
