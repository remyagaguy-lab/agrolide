import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { livrables_formation } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { accorderReussite, LIVRABLE_FINAL_MODULE } from "@/lib/formations/examen.server";
import { notifier } from "@/lib/notifications.server";

/** Correction d'un livrable. Corps : { decision: "valide" | "a_revoir", note (0-20), commentaire }. */
export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdmin();
    if (!admin.ok) return admin.response;
    const { id } = await ctx.params;
    const body = await req.json().catch(() => null);
    const decision = body?.decision;
    const note = Number(body?.note);
    const commentaire = typeof body?.commentaire === "string" ? body.commentaire.trim().slice(0, 2000) : "";
    if (decision !== "valide" && decision !== "a_revoir") return NextResponse.json({ error: "Décision invalide" }, { status: 400 });
    if (!Number.isInteger(note) || note < 0 || note > 20) return NextResponse.json({ error: "La note doit être un entier de 0 à 20" }, { status: 400 });
    if (decision === "a_revoir" && commentaire.length < 5) return NextResponse.json({ error: "Expliquez ce qu'il faut revoir" }, { status: 400 });

    const livrable = await db.query.livrables_formation.findFirst({ where: eq(livrables_formation.id, id) });
    if (!livrable) return NextResponse.json({ error: "Livrable introuvable" }, { status: 404 });

    await db
      .update(livrables_formation)
      .set({ statut: decision, note, commentaire: commentaire || null, correcteur_id: admin.userId, corrige_le: new Date().toISOString() })
      .where(eq(livrables_formation.id, id));

    await notifier(livrable.membre_id, {
      type: "formation",
      contenu: decision === "valide"
        ? `Votre livrable du module ${livrable.module_ordre} est validé (${note}/20).`
        : `Votre livrable du module ${livrable.module_ordre} est à revoir : ${commentaire}`,
      lien: `/membres/formations/${livrable.formation_id}/livrables`,
    });
    // Business plan complet validé : si l'examen est déjà réussi, le certificat « Réussite » est délivré (sinon il le sera à la réussite de l'examen).
    if (decision === "valide" && livrable.module_ordre === LIVRABLE_FINAL_MODULE) await accorderReussite(livrable.membre_id, livrable.formation_id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erreur correction livrable:", error);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
