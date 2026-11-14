import { NextResponse } from "next/server";
import { db } from "@/db";
import { formations, inscriptions_formation, reponses_inscription_formation } from "@/db/schema";
import { validerReponses, type Reponses } from "@/lib/formations/questionnaire";
import { auth } from "@/lib/auth/server";
import { notifier } from "@/lib/notifications.server";
import { and, eq } from "drizzle-orm";
import { consommerCode, formationExigeCode, libererCode, verifierCode } from "@/lib/formations/acces.server";

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
      // Ce contrôle est ici, côté serveur : il ne dépend pas du bouton affiché.
      const exigeCode = await formationExigeCode(formationId);
      if (exigeCode === null) return NextResponse.json({ error: "Formation introuvable" }, { status: 404 });
      let codeId: string | null = null;
      let reponses: Reponses | null = null;
      if (exigeCode) {
        const corps = (await request.json().catch(() => ({}))) as { code?: unknown; verifier?: unknown; reponses?: unknown };
        const saisie = typeof corps.code === "string" ? corps.code : "";
        // Le questionnaire est obligatoire et validé ici, pas seulement dans le formulaire.
        const rep = validerReponses(corps.reponses);
        if (!rep.ok) return NextResponse.json({ error: rep.erreur }, { status: 400 });
        reponses = rep.reponses;
        if (corps.verifier === true) {
          // Étape « saisie du code » : on vérifie sans consommer.
          const verdict = await verifierCode(saisie, formationId);
          if (!verdict.ok) return NextResponse.json({ error: verdict.erreur }, { status: 400 });
          return NextResponse.json({ success: true, verifie: true });
        }
        const resultat = await consommerCode(saisie, userId, formationId);
        if (!resultat.ok) return NextResponse.json({ error: resultat.erreur }, { status: 400 });
        codeId = resultat.codeId;
      }

      try {
        // Deux requêtes simultanées du même membre : la seconde ne crée pas de doublon et rend son code.
        const doublon = await db.query.inscriptions_formation.findFirst({
          columns: { id: true },
          where: and(eq(inscriptions_formation.membre_id, userId), eq(inscriptions_formation.formation_id, formationId)),
        });
        if (doublon) {
          if (codeId) await libererCode(codeId, userId);
          return NextResponse.json({ success: true });
        }
        await db.insert(inscriptions_formation).values({
          membre_id: userId,
          formation_id: formationId,
          statut: "en_cours",
          created_at: new Date().toISOString(),
        });
      } catch (e) {
        // L'inscription a échoué : le code n'est pas perdu.
        if (codeId) await libererCode(codeId, userId).catch(() => {});
        throw e;
      }

      if (reponses) {
        // Les réponses sont un plus : si leur enregistrement échoue (table absente), l'inscription reste valable.
        await db
          .insert(reponses_inscription_formation)
          .values({ membre_id: userId, formation_id: formationId, ...reponses, created_at: new Date().toISOString() })
          .catch((e) => console.error("Réponses d'inscription non enregistrées:", e));
      }

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
