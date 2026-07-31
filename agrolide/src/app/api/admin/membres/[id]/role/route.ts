import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { auth } from '@clerk/nextjs/server'
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId: currentUserId } = await auth();
  if (!currentUserId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const profile = await db.query.users.findFirst({
    columns: { role_plateforme: true },
    where: eq(users.id, currentUserId)
  })

  if (profile?.role_plateforme !== "super_admin") {
    return NextResponse.json({ error: "Seul le super_admin peut promouvoir des administrateurs" }, { status: 403 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { role_plateforme } = body

    const VALID_ROLES = ["membre", "admin_content", "super_admin"]
    if (!VALID_ROLES.includes(role_plateforme)) {
      return NextResponse.json({ error: "Rôle invalide" }, { status: 400 })
    }

    await db.update(users)
      .set({ role_plateforme })
      .where(eq(users.id, id))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
