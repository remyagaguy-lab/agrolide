import { NextResponse, NextRequest } from "next/server"
import { requireAdmin } from "@/lib/auth/admin"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  const { id } = await params
  const body = await request.json()
  const { statut_adhesion } = body

  if (!["actif", "suspendu", "expire", "en_attente_paiement", "gratuit"].includes(statut_adhesion)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
  }

  try {
    await db.update(users)
      .set({ statut_adhesion, updated_at: new Date().toISOString() })
      .where(eq(users.id, id))

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
