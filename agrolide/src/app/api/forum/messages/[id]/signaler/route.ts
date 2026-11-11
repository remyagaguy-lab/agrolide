import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/server'
import { rateLimit } from '@/lib/security/rate-limit'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Connexion requise' }, { status: 401 })
    const limited = await rateLimit(request, 'forum-signaler', 20, 600)
    if (limited) return limited

    const { id } = await params
    if (!id || id.length > 100) return NextResponse.json({ error: 'Identifiant invalide' }, { status: 400 })
    
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
