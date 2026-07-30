import { NextResponse, NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  // Vérifier rôle admin
  const profile = await db.select({ role_plateforme: users.role_plateforme })
    .from(users).where(eq(users.id, userId)).limit(1).then(r => r[0])

  if (!profile || !["admin_content", "super_admin"].includes(profile.role_plateforme || '')) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

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
