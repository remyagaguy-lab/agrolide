import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { peutSuivre } from "@/lib/formations/acces.server";
import {
  corriger,
  leconAccessible,
  lireBanque,
  seuilReussite,
  tirerQuestions,
  validerLecon,
} from "@/lib/formations/quiz.server";

type Ctx = { params: Promise<{ id: string; lecon_id: string }> };

async function contexte(ctx: Ctx) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { res: NextResponse.json({ error: "Non autorisé" }, { status: 401 }) };
  const { id: formationId, lecon_id: leconId } = await ctx.params;
  if (!(await peutSuivre(formationId)).autorise) {
    return { res: NextResponse.json({ error: "Inscription requise" }, { status: 403 }) };
  }
  const acces = await leconAccessible(userId, formationId, leconId);
  if ("erreur" in acces) return { res: NextResponse.json({ error: acces.erreur }, { status: acces.status }) };
  return { userId, formationId, leconId, banque: lireBanque(acces.lecon.quiz_json) };
}

/** Nouvelle tentative : tire les questions, sans les bonnes réponses. */
export async function GET(_req: Request, ctx: Ctx) {
  const c = await contexte(ctx);
  if ("res" in c) return c.res;
  return NextResponse.json({ questions: tirerQuestions(c.banque), seuil: seuilReussite() });
}

/** Correction côté serveur. Corps : { reponses: [{ id, choix }] }. Valide la leçon si le seuil est atteint. */
export async function POST(req: Request, ctx: Ctx) {
  try {
    const c = await contexte(ctx);
    if ("res" in c) return c.res;
    if (c.banque.length === 0) {
      return NextResponse.json({ error: "Cette leçon n’a pas de quiz" }, { status: 400 });
    }
    const body = await req.json().catch(() => null);
    const resultat = corriger(c.banque, body?.reponses);
    if (!resultat) return NextResponse.json({ error: "Réponses invalides" }, { status: 400 });
    if (resultat.reussi) await validerLecon(c.userId, c.formationId, c.leconId);
    return NextResponse.json({ ...resultat, seuil: seuilReussite() });
  } catch (error) {
    console.error("Erreur lors de la correction du quiz:", error);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
