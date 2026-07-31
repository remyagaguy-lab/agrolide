import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { messages } from '@/db/schema'
import { eq, or, and, inArray, asc } from 'drizzle-orm'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: correspondantId } = await params
    
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }

    // Récupérer l'historique
    const userMessages = await db.query.messages.findMany({
      where: or(
        and(eq(messages.expediteur_id, userId), eq(messages.destinataire_id, correspondantId)),
        and(eq(messages.expediteur_id, correspondantId), eq(messages.destinataire_id, userId))
      ),
      orderBy: [asc(messages.created_at)]
    })

    // Marquer les messages reçus comme lus
    const nonLus = userMessages?.filter(m => m.destinataire_id === userId && !m.lu).map(m => m.id) || []
    if (nonLus.length > 0) {
      await db.update(messages)
        .set({ lu: true })
        .where(inArray(messages.id, nonLus))
    }

    return NextResponse.json(userMessages || [])

  } catch (error: any) {
    console.error("API Messages Error:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
