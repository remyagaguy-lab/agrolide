import { NextResponse, NextRequest } from "next/server"
import { requireAdmin } from "@/lib/auth/admin"
import { db } from "@/db"
import { partenaires } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  const { id } = await params
  const body = await request.json()
  try {
    await db.update(partenaires).set(body).where(eq(partenaires.id, id))
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  const { id } = await params
  try {
    await db.delete(partenaires).where(eq(partenaires.id, id))
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
