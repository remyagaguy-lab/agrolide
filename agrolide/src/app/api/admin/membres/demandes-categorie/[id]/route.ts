import { NextRequest, NextResponse } from "next/server"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth/admin"
import { db } from "@/db"
import { demandes_categorie } from "@/db/schema"
import { estCategorie, libelleCategorie } from "@/lib/adhesion"
import { appliquerChangement } from "@/lib/categorie.server"
import { notifier } from "@/lib/notifications.server"

const corps = z.object({
  decision: z.enum(["accepter", "refuser"]),
  motif: z.string().trim().max(200).optional(),
})

/** Décision d'un administrateur sur une demande de changement de catégorie (Partenaire, Sénior). */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  const parsed = corps.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: "Décision invalide" }, { status: 400 })

  try {
    const { id } = await params
    const demande = await db.query.demandes_categorie.findFirst({ where: eq(demandes_categorie.id, id) })
    if (!demande) return NextResponse.json({ error: "Demande introuvable" }, { status: 404 })
    if (demande.statut !== "en_attente") return NextResponse.json({ error: "Cette demande a déjà été traitée" }, { status: 409 })
    if (!estCategorie(demande.categorie_demandee)) return NextResponse.json({ error: "Catégorie demandée invalide" }, { status: 400 })
    const nom = `« ${libelleCategorie(demande.categorie_demandee)} »`

    if (parsed.data.decision === "refuser") {
      await db.update(demandes_categorie)
        .set({ statut: "refusee", motif_refus: parsed.data.motif || null, traite_le: new Date().toISOString(), traite_par: admin.userId })
        .where(and(eq(demandes_categorie.id, id), eq(demandes_categorie.statut, "en_attente")))
      await notifier(demande.user_id, {
        type: "cotisation",
        contenu: `Votre demande de passage en ${nom} n'a pas été retenue.${parsed.data.motif ? ` Motif : ${parsed.data.motif}.` : ""} Votre catégorie ne change pas.`,
        lien: "/membres/profil/modifier",
      })
      return NextResponse.json({ success: true })
    }

    const resultat = await appliquerChangement(demande.user_id, demande.categorie_demandee, {
      demandeId: id,
      dejaValide: true,
      traitePar: admin.userId,
    })
    await notifier(demande.user_id, {
      type: "cotisation",
      contenu: `Un administrateur a validé votre demande. ${resultat.message}`,
      lien: resultat.regularisationFcfa > 0 ? "/membres/cotisation" : "/membres/profil/modifier",
    })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
