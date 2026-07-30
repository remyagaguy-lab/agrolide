import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import { notifications } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }
    const userId = session.user.id

    // Marquer comme lu
    await db.update(notifications)
      .set({ lu: true })
      .where(and(eq(notifications.id, id), eq(notifications.user_id, userId)))

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("API Notifications Error:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
