import { NextResponse } from "next/server";
import { db } from "@/db";
import { progression_lecons } from "@/db/schema";
import { auth } from "@/auth";
import { and, eq } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; lecon_id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { lecon_id: leconId } = await params;
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
