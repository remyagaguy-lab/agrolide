import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { peutSuivre } from "@/lib/formations/acces.server";
import { corriger, lireBanque, seuilReussite, tirerQuestions } from "@/lib/formations/quiz.server";
import { trouverFiliere } from "@/content/filieres";
import { QUIZ_FILIERES } from "@/content/filieres/quiz_banque";

type Ctx = { params: Promise<{ id: string; slug: string; lecon: string }> };

/** Auto-évaluation d'une leçon de module par filière : même moteur que les quiz de leçon (tirage et correction côté serveur), mais rien n'est enregistré. */
async function contexte(ctx: Ctx) {
  const { userId } = await auth();
  if (!userId) return { res: NextResponse.json({ error: "Non autorisé" }, { status: 401 }) };
  const { id, slug, lecon } = await ctx.params;
  if (!(await peutSuivre(id)).autorise) return { res: NextResponse.json({ error: "Inscription requise" }, { status: 403 }) };
  const filiere = trouverFiliere(slug);
  if (!filiere || filiere.statut !== "disponible" || !filiere.lecons.some((l) => l.id === lecon)) {
    return { res: NextResponse.json({ error: "Leçon introuvable" }, { status: 404 }) };
  }
  const banque = lireBanque(QUIZ_FILIERES[lecon]);
  if (banque.length === 0) return { res: NextResponse.json({ error: "Pas de quiz pour cette leçon" }, { status: 404 }) };
  return { banque };
}

export async function GET(_req: Request, ctx: Ctx) {
  const c = await contexte(ctx);
  if ("res" in c) return c.res;
  return NextResponse.json({ questions: tirerQuestions(c.banque), seuil: seuilReussite() });
}

/** Corps : { reponses: [{ id, choix }] }. */
export async function POST(req: Request, ctx: Ctx) {
  try {
    const c = await contexte(ctx);
    if ("res" in c) return c.res;
    const body = await req.json().catch(() => null);
    const resultat = corriger(c.banque, body?.reponses);
    if (!resultat) return NextResponse.json({ error: "Réponses invalides" }, { status: 400 });
    return NextResponse.json({ ...resultat, seuil: seuilReussite() });
  } catch (error) {
    console.error("Erreur correction quiz filière:", error);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
