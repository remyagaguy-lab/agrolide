import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { notifications } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }

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
