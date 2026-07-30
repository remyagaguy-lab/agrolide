import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import { notifications } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }
    const userId = session.user.id

    // Tout marquer comme lu
    await db.update(notifications)
      .set({ lu: true })
      .where(and(eq(notifications.user_id, userId), eq(notifications.lu, false)))

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("API Notifications Error:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
