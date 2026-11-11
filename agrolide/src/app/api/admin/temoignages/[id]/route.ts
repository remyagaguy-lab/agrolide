import { NextResponse, NextRequest } from "next/server"
import { requireAdmin } from "@/lib/auth/admin"
import { db } from "@/db"
import { temoignages } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

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
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  try {
    const { id } = await params
    await db.delete(temoignages).where(eq(temoignages.id, id))
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
