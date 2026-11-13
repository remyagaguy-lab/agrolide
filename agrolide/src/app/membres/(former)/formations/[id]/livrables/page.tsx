import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { livrables_formation } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { peutSuivre } from "@/lib/formations/acces.server";
import { formationAUnExamen } from "@/lib/formations/examen.server";
import { ArrowLeft } from "@/components/ui/icons";
import { LivrableForm } from "./LivrableForm";

export const metadata = { title: "Livrables" };

const MODULES = [
  "Module 1 · Fiche synoptique du projet (idée, porteur, objectifs)",
  "Module 2 · Étude de marché (segments, concurrence, FFOM)",
  "Module 3 · Plan de production et choix juridique",
  "Module 4 · Stratégie commerciale et plan de prospection",
  "Module 5 · Modèle financier (canevas Excel rempli)",
  "Module 6 · Dossier complet : résumé exécutif, risques, pitch",
];
const STATUTS: Record<string, string> = { soumis: "Remis, en attente de correction", valide: "Validé", a_revoir: "À revoir" };

export default async function LivrablesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!formationAUnExamen(id)) notFound();
  const { userId } = await auth();
  if (!userId) redirect(`/login?next=${encodeURIComponent(`/membres/formations/${id}/livrables`)}`);
  if (!(await peutSuivre(id)).autorise) redirect(`/membres/formations/${id}`);
  const rows = await db.select().from(livrables_formation).where(and(eq(livrables_formation.membre_id, userId), eq(livrables_formation.formation_id, id)));
  const parModule = new Map(rows.map((r) => [r.module_ordre, r]));

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10 md:py-14">
      <Link href={`/membres/formations/${id}/examen`} className="mb-6 inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft className="size-4" /> Examen final
      </Link>
      <h1 className="mb-3 font-urbanist text-headline-md text-on-surface">Livrables par module</h1>
      <p className="mb-8 text-on-surface-variant">
        Un livrable par module, appuyé sur le canevas Word et le modèle Excel de la formation. Facultatifs pour l’instant : ils ne conditionnent pas le certificat.
        Une nouvelle remise remplace la précédente et repasse en attente de correction.
      </p>
      <div className="space-y-8">
        {MODULES.map((titre, i) => {
          const r = parModule.get(i + 1);
          return (
            <section key={i} className="space-y-2">
              <h2 className="font-urbanist font-semibold text-on-surface">{titre}</h2>
              {r && (
                <p className="text-sm text-on-surface-variant">
                  {STATUTS[r.statut] ?? r.statut}{r.note != null ? ` · note ${r.note}/20` : ""}{r.commentaire ? ` · ${r.commentaire}` : ""}
                </p>
              )}
              <LivrableForm formationId={id} module={i + 1} initial={r?.contenu ?? ""} statut={r?.statut ?? null} bloque={r?.statut === "valide"} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
