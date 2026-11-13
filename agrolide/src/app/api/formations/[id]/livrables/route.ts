import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { livrables_formation } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { peutSuivre } from "@/lib/formations/acces.server";
import { formationAUnExamen, NB_MODULES_LIVRABLES } from "@/lib/formations/examen.server";

type Ctx = { params: Promise<{ id: string }> };

/** Remise (ou nouvelle remise) du livrable d'un module. Corps : { module, contenu }. Une nouvelle remise repasse le livrable à « soumis ». */
export async function PUT(req: Request, ctx: Ctx) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const { id: formationId } = await ctx.params;
    if (!formationAUnExamen(formationId)) return NextResponse.json({ error: "Pas de livrables pour cette formation" }, { status: 404 });
    if (!(await peutSuivre(formationId)).autorise) return NextResponse.json({ error: "Inscription requise" }, { status: 403 });

    const body = await req.json().catch(() => null);
    const moduleOrdre = Number(body?.module);
    const contenu = typeof body?.contenu === "string" ? body.contenu.trim() : "";
    if (!Number.isInteger(moduleOrdre) || moduleOrdre < 1 || moduleOrdre > NB_MODULES_LIVRABLES) return NextResponse.json({ error: "Module invalide" }, { status: 400 });
    if (contenu.length < 20 || contenu.length > 20000) return NextResponse.json({ error: "Le livrable doit faire entre 20 et 20 000 caractères (ou un lien vers votre fichier)." }, { status: 400 });

    const maintenant = new Date().toISOString();
    const existant = await db.query.livrables_formation.findFirst({
      where: and(eq(livrables_formation.membre_id, userId), eq(livrables_formation.formation_id, formationId), eq(livrables_formation.module_ordre, moduleOrdre)),
    });
    if (existant) {
      await db
        .update(livrables_formation)
        .set({ contenu, statut: "soumis", note: null, commentaire: null, correcteur_id: null, corrige_le: null, soumis_le: maintenant })
        .where(eq(livrables_formation.id, existant.id));
    } else {
      await db.insert(livrables_formation).values({ membre_id: userId, formation_id: formationId, module_ordre: moduleOrdre, contenu, statut: "soumis", soumis_le: maintenant });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erreur remise livrable:", error);
    return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
  }
}
