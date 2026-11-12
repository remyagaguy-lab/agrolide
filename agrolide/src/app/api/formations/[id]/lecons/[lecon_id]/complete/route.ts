import { NextResponse } from "next/server";
import { db } from "@/db";
import { formation_lecons, formation_modules, formations, progression_lecons } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { notifier } from "@/lib/notifications.server";
import { and, eq, inArray } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; lecon_id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id: formationId, lecon_id: leconId } = await params;
    const userId = session.user.id;

    // Check if already completed
    const existingCompletion = await db.query.progression_lecons.findFirst({
      where: and(
        eq(progression_lecons.membre_id, userId),
        eq(progression_lecons.lecon_id, leconId)
      ),
    });

    if (!existingCompletion) {
      // Mark as completed
      await db.insert(progression_lecons).values({
        membre_id: userId,
        lecon_id: leconId,
      });

      // Dernière leçon validée : on prévient le membre que la formation est terminée.
      const lecons = await db
        .select({ id: formation_lecons.id })
        .from(formation_lecons)
        .innerJoin(formation_modules, eq(formation_lecons.module_id, formation_modules.id))
        .where(eq(formation_modules.formation_id, formationId));
      if (lecons.length > 0) {
        const faites = await db
          .select({ id: progression_lecons.id })
          .from(progression_lecons)
          .where(and(
            eq(progression_lecons.membre_id, userId),
            inArray(progression_lecons.lecon_id, lecons.map((l) => l.id)),
          ));
        if (faites.length >= lecons.length) {
          const formation = await db.query.formations.findFirst({
            columns: { titre: true },
            where: eq(formations.id, formationId),
          });
          await notifier(userId, {
            type: "formation",
            contenu: `Bravo ! Vous avez terminé la formation « ${formation?.titre ?? "Formation"} ».`,
            lien: "/membres/formations/mes-certificats",
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la validation:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
