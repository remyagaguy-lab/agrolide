import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { forum_fils, forum_messages } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const { categorie_id, titre, contenu } = await request.json()
    
    if (!categorie_id || !titre || !contenu) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 })
    }

    const { userId } = await auth();
  const user = userId ? { id: userId } : null;
  const session = userId ? { user: { id: userId } } : null;
    
    if (!user || !user.id) {
      return NextResponse.json({ error: "Session invalide." }, { status: 401 })
    }

    // 1. Créer le fil
    const filId = crypto.randomUUID()
    await db.insert(forum_fils).values({
      id: filId,
      categorie_id,
      titre,
      auteur_id: user.id,
      statut: 'ouvert',
      nb_reponses: 0
    })
    
    // 2. Créer le premier message
    try {
      await db.insert(forum_messages).values({
        fil_id: filId,
        auteur_id: user.id,
        contenu
      })
    } catch (msgError) {
      // Nettoyage si erreur
      await db.delete(forum_fils).where(eq(forum_fils.id, filId))
      throw new Error("Erreur création message")
    }

    return NextResponse.json({ success: true, fil_id: filId })
    
  } catch (error: any) {
    console.error("Erreur API forum fils:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
