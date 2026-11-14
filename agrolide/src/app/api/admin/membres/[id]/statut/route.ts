import { NextResponse, NextRequest } from "next/server"
import { requireAdmin } from "@/lib/auth/admin"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notifier } from "@/lib/notifications.server"

const MESSAGES_ADHESION: Record<string, string | undefined> = {
  actif: "Votre adhésion est active. Bienvenue dans le réseau !",
  expire: "Votre adhésion a expiré. Renouvelez votre cotisation pour retrouver tous les services.",
  en_attente_paiement: "Votre adhésion est en attente de paiement.",
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(['super_admin'])
  if (!admin.ok) return admin.response

  const { id } = await params
  const body = await request.json()
  const { statut_adhesion } = body

  if (!["actif", "suspendu", "expire", "en_attente_paiement", "gratuit"].includes(statut_adhesion)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
  }

  try {
    const avant = await db.query.users.findFirst({
      columns: { statut_adhesion: true },
      where: eq(users.id, id),
    })

    await db.update(users)
      .set({ statut_adhesion, updated_at: new Date().toISOString() })
      .where(eq(users.id, id))

    // Le membre est prévenu quand son adhésion change (pas pour une suspension : il n'a plus accès à son espace).
    const message = avant?.statut_adhesion === statut_adhesion ? null : MESSAGES_ADHESION[statut_adhesion]
    if (message) {
      await notifier(id, { type: 'cotisation', contenu: message, lien: '/membres/cotisation' })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
