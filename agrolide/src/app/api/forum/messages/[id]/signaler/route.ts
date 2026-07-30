import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    const { db } = await import('@/db')
    const { forum_messages } = await import('@/db/schema')
    const { eq } = await import('drizzle-orm')
    
    // Mettre à jour le statut du message (pourrait être dans une table de signalements à part dans une appli complexe, mais ici on simplifie)
    await db.update(forum_messages)
      .set({ statut: 'en_revue' })
      .where(eq(forum_messages.id, id))

    return NextResponse.json({ success: true })
    
  } catch (error: any) {
    console.error("Erreur API signalement:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
