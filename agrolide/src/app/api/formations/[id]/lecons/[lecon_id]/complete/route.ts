import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { peutSuivre } from "@/lib/formations/acces.server";
import { leconAccessible, lireBanque, validerLecon } from "@/lib/formations/quiz.server";

/**
 * Validation « simple bouton » : réservée aux leçons SANS quiz (par exemple 6.4).
 * Une leçon avec quiz ne se valide que par la route /quiz, qui vérifie le score réel côté serveur.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; lecon_id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id: formationId, lecon_id: leconId } = await params;
    const userId = session.user.id;
    if (!(await peutSuivre(formationId)).autorise) {
      return NextResponse.json({ error: "Inscription requise" }, { status: 403 });
    }

    const acces = await leconAccessible(userId, formationId, leconId);
    if ("erreur" in acces) return NextResponse.json({ error: acces.erreur }, { status: acces.status });
    if (lireBanque(acces.lecon.quiz_json).length > 0) {
      return NextResponse.json({ error: "Cette leçon se valide en réussissant son quiz" }, { status: 403 });
    }

    await validerLecon(userId, formationId, leconId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la validation:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
