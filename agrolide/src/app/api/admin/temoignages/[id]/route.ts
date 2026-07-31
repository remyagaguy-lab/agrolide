import { NextResponse, NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { temoignages, users } from "@/db/schema"
import { eq } from "drizzle-orm"

async function checkAdmin() {
  const { userId: currentUserId } = await auth()
  if (!currentUserId) return false
  const user = await db.query.users.findFirst({
    columns: { role_plateforme: true },
    where: eq(users.id, currentUserId)
  })
  return user && ["admin_content", "super_admin"].includes(user.role_plateforme || "")
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

  try {
    const { id } = await params
    const body = await request.json()
    await db.update(temoignages).set(body).where(eq(temoignages.id, id))
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

  try {
    const { id } = await params
    await db.delete(temoignages).where(eq(temoignages.id, id))
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
