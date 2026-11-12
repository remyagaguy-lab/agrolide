import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { and, eq, sql } from "drizzle-orm"
import { Resend } from "resend"
import { requireAdmin } from "@/lib/auth/admin"
import { notifier } from "@/lib/notifications.server"
import { db } from "@/db"
import { cotisations, users } from "@/db/schema"
import { FIN_ADHESION_GRATUITE, joursAvant, paiementOuvert } from "@/lib/adhesion"
import { construireRappel } from "@/app/api/cron/rappels-adhesion/email"

/**
 * Rappel manuel d'un administrateur : même texte que le rappel automatique, adapté à la situation réelle du membre
 * (fin de l'année gratuite ou fin d'une cotisation payée). Aucune trace d'unicité : un envoi manuel reste possible à tout moment.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  try {
    const { id } = await params
    const [membre] = await db
      .select({ email: users.email, prenom: users.prenom, categorie: users.categorie, statut: users.statut_adhesion })
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
    if (!membre) return NextResponse.json({ error: "Membre introuvable" }, { status: 404 })

    const [payee] = await db
      .select({ fin: sql<string | null>`max(${cotisations.date_fin})` })
      .from(cotisations)
      .where(and(eq(cotisations.membre_id, id), eq(cotisations.statut, "valide")))
    const finPayee = payee?.fin ? payee.fin.slice(0, 10) : null

    const origine = finPayee ? "payante" : "gratuite"
    const echeance = finPayee ?? FIN_ADHESION_GRATUITE
    const jours = Math.max(0, joursAvant(echeance))
    const texte = construireRappel({
      prenom: membre.prenom,
      categorie: membre.categorie,
      type: jours === 0 ? "j0" : jours <= 7 ? "j7" : "j30",
      jours,
      echeance,
      origine,
      paiementOuvert: paiementOuvert(),
    })

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({ from: "agrolide <noreply@agrolide.org>", to: membre.email, subject: texte.sujet, html: texte.html })
    if (error) return NextResponse.json({ error: error.message }, { status: 502 })

    await notifier(id, { type: "cotisation", contenu: texte.notification, lien: "/membres/cotisation" })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
