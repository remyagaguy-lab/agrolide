import { NextResponse } from "next/server";
import { db } from "@/db";
import { inscriptions_formation } from "@/db/schema";
import { auth } from "@/auth";
import { and, eq } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id: formationId } = await params;
    const userId = session.user.id;

    // Check if already enrolled
    const existingEnrollment = await db.query.inscriptions_formation.findFirst({
      where: and(
        eq(inscriptions_formation.membre_id, userId),
        eq(inscriptions_formation.formation_id, formationId)
      ),
    });

    if (!existingEnrollment) {
      // Create new enrollment
      await db.insert(inscriptions_formation).values({
        membre_id: userId,
        formation_id: formationId,
        statut: "en_cours",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
