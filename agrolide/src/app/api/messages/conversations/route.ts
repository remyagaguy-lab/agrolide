import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { messages } from '@/db/schema'
import { eq, or, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }

    // On récupère tous les messages envoyés ou reçus par l'utilisateur
    const userMessages = await db.query.messages.findMany({
      where: or(eq(messages.expediteur_id, userId), eq(messages.destinataire_id, userId)),
      with: {
        expediteur: {
          columns: { id: true, prenom: true, nom: true, photo_url: true }
        },
        destinataire: {
          columns: { id: true, prenom: true, nom: true, photo_url: true }
        }
      },
      orderBy: [desc(messages.created_at)]
    })

    // Grouper par correspondant
    const conversationsMap = new Map()

    userMessages?.forEach((msg: any) => {
      const isExpediteur = msg.expediteur_id === userId
      const correspondantId = isExpediteur ? msg.destinataire_id : msg.expediteur_id
      const correspondant = isExpediteur ? msg.destinataire : msg.expediteur

      if (!conversationsMap.has(correspondantId)) {
        conversationsMap.set(correspondantId, {
          correspondant,
          dernier_message: msg,
          non_lus: isExpediteur ? 0 : (msg.lu ? 0 : 1) // simpliste: compte juste le dernier s'il est non lu
        })
      } else {
        const conv = conversationsMap.get(correspondantId)
        if (!isExpediteur && !msg.lu) {
          conv.non_lus += 1
        }
      }
    })

    const conversations = Array.from(conversationsMap.values())

    return NextResponse.json(conversations)

  } catch (error: any) {
    console.error("API Conversations Error:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
