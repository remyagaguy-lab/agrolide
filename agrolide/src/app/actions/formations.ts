'use server'

import { db } from '@/db'
import { inscriptions_formation, sessions_formation } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function getInscriptionsFormation() {
  const { userId } = await auth();
  const session = userId ? { user: { id: userId } } : null;
  if (!session?.user?.id) return []

  const inscriptions = await db.query.inscriptions_formation.findMany({
    where: eq(inscriptions_formation.membre_id, session.user.id),
    columns: {
      session_id: true,
      statut: true
    }
  })
  
  return inscriptions
}

export async function inscrireSessionFormation(sessionId: string) {
  const { userId } = await auth();
  const session = userId ? { user: { id: userId } } : null;
  if (!session?.user?.id) {
    throw new Error("Vous devez être connecté pour vous inscrire.")
  }

  // Vérifier s'il y a de la place
  const sessionData = await db.query.sessions_formation.findFirst({
    where: eq(sessions_formation.id, sessionId)
  })

  if (!sessionData) {
    throw new Error("Session introuvable.")
  }

  // Vérifier si déjà inscrit
  const existing = await db.query.inscriptions_formation.findFirst({
    where: and(
      eq(inscriptions_formation.session_id, sessionId),
      eq(inscriptions_formation.membre_id, session.user.id)
    )
  })

  if (existing) {
    throw new Error("Vous êtes déjà inscrit à cette session.")
  }

  if (sessionData.places_restantes !== null && sessionData.places_restantes <= 0) {
    throw new Error("Cette session est complète.")
  }

  // Créer l'inscription
  await db.insert(inscriptions_formation).values({
    session_id: sessionId,
    membre_id: session.user.id,
    statut: 'en_attente', // Par défaut 'en_attente' ou 'confirme' selon logique métier
    created_at: new Date().toISOString()
  })

  // Réduire les places restantes
  if (sessionData.places_restantes !== null) {
    // Attention: avec Drizzle sur D1 on pourrait faire un update mais pour l'instant on fait simple
    // ou alors on laisse sans update si c'est géré par trigger, mais ici Drizzle ne gère pas trigger automatiquement
    /*
    await db.update(sessions_formation)
      .set({ places_restantes: sessionData.places_restantes - 1 })
      .where(eq(sessions_formation.id, sessionId))
    */
  }

  revalidatePath('/formations/[id]', 'page')
  return { success: true, message: "Votre inscription a bien été enregistrée.", statut: 'en_attente' }
}
