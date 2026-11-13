import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { peutSuivre } from "@/lib/formations/acces.server";
import { corrigerTentative, formationAUnExamen, ouvrirTentative } from "@/lib/formations/examen.server";

type Ctx = { params: Promise<{ id: string }> };

async function contexte(ctx: Ctx) {
  const { userId } = await auth();
  if (!userId) return { res: NextResponse.json({ error: "Non autorisé" }, { status: 401 }) };
  const { id: formationId } = await ctx.params;
  if (!formationAUnExamen(formationId)) return { res: NextResponse.json({ error: "Pas d'examen pour cette formation" }, { status: 404 }) };
  if (!(await peutSuivre(formationId)).autorise) return { res: NextResponse.json({ error: "Inscription requise" }, { status: 403 }) };
  return { userId, formationId };
}

/** Ouvre (ou reprend) une tentative : 30 questions sans bonnes réponses. */
export async function GET(_req: Request, ctx: Ctx) {
  try {
    const c = await contexte(ctx);
    if ("res" in c) return c.res;
    const r = await ouvrirTentative(c.userId, c.formationId);
    if ("erreur" in r) return NextResponse.json({ error: r.erreur, attenteJusqua: "attenteJusqua" in r ? r.attenteJusqua : undefined }, { status: r.status });
    return NextResponse.json(r);
  } catch (error) {
    console.error("Erreur ouverture examen:", error);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}

/** Correction côté serveur. Corps : { reponses: [{ id, choix }] }. */
export async function POST(req: Request, ctx: Ctx) {
  try {
    const c = await contexte(ctx);
    if ("res" in c) return c.res;
    const body = await req.json().catch(() => null);
    const r = await corrigerTentative(c.userId, c.formationId, body?.reponses);
    if ("erreur" in r) return NextResponse.json({ error: r.erreur }, { status: r.status });
    return NextResponse.json(r);
  } catch (error) {
    console.error("Erreur correction examen:", error);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
