import { NextResponse, NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { agripreneurs, users } from "@/db/schema"
import { eq } from "drizzle-orm"

async function checkAdmin(userId: string) {
  const profile = await db.select({ role_plateforme: users.role_plateforme })
    .from(users).where(eq(users.id, userId)).limit(1).then(r => r[0])
  return profile && ["admin_content", "super_admin"].includes(profile.role_plateforme || '')
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId || !await checkAdmin(userId)) return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

  const { id } = await params
  const body = await request.json()
  try {
    await db.update(agripreneurs).set(body).where(eq(agripreneurs.id, id))
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId || !await checkAdmin(userId)) return NextResponse.json({ error: "Accès refusé" }, { status: 403 })

  const { id } = await params
  try {
    await db.delete(agripreneurs).where(eq(agripreneurs.id, id))
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
