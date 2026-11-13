import { NextResponse } from "next/server";
import { db } from "@/db";
import { formations, inscriptions_formation } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { and, eq, isNull } from "drizzle-orm";

/**
 * Formation externe : enregistre le premier clic sur « Accéder au cours ».
 * Réservé aux membres déjà inscrits à la formation ; la date n'est écrite qu'une fois (le premier accès).
 * Renvoie le lien du cours chez l'organisme.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id: formationId } = await params;

    const formation = await db.query.formations.findFirst({
      columns: { lien_externe: true },
      where: eq(formations.id, formationId),
    });
    if (!formation?.lien_externe) return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });

    const inscription = await db.query.inscriptions_formation.findFirst({
      columns: { id: true },
      where: and(eq(inscriptions_formation.membre_id, userId), eq(inscriptions_formation.formation_id, formationId)),
    });
    if (!inscription) return NextResponse.json({ error: "Inscription requise" }, { status: 403 });

    await db
      .update(inscriptions_formation)
      .set({ premier_acces_le: new Date().toISOString() })
      .where(and(eq(inscriptions_formation.id, inscription.id), isNull(inscriptions_formation.premier_acces_le)));

    return NextResponse.json({ success: true, lien: formation.lien_externe });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'accès:", error);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
