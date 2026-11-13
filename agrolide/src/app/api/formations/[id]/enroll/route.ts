import { NextResponse } from "next/server";
import { db } from "@/db";
import { formations, inscriptions_formation } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { notifier } from "@/lib/notifications.server";
import { and, eq } from "drizzle-orm";
import { consommerCode, formationExigeCode } from "@/lib/formations/acces.server";

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
      // Formation Agrolide : l'inscription exige un code d'accès (challenge). Les formations externes restent libres.
      const exigeCode = await formationExigeCode(formationId);
      if (exigeCode === null) return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
      if (exigeCode) {
        const corps = (await request.json().catch(() => ({}))) as { code?: unknown };
        const resultat = await consommerCode(typeof corps.code === "string" ? corps.code : "", userId, formationId);
        if (!resultat.ok) return NextResponse.json({ error: resultat.erreur }, { status: 400 });
      }

      // Create new enrollment
      await db.insert(inscriptions_formation).values({
        membre_id: userId,
        formation_id: formationId,
        statut: "en_cours",
      });

      const formation = await db.query.formations.findFirst({
        columns: { titre: true },
        where: eq(formations.id, formationId),
      });
      await notifier(userId, {
        type: "formation",
        contenu: `Vous êtes inscrit(e) à la formation « ${formation?.titre ?? "Formation"} ».`,
        lien: `/membres/formations/${formationId}`,
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
