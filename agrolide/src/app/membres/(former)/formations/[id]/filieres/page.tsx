import { redirect } from "next/navigation";
import Link from "next/link";
import { peutSuivre } from "@/lib/formations/acces.server";
import { FILIERES } from "@/content/filieres";
import { ArrowLeft, ChevronRight } from "@/components/ui/icons";

/** Modules par filière : optionnels, hors de la séquence de leçons. */
export default async function FilieresPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { autorise } = await peutSuivre(id);
  if (!autorise) redirect(`/membres/formations/${id}`);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10 md:py-14">
      <Link href={`/membres/formations/${id}`} className="mb-6 inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft className="size-4" /> Retour à la formation
      </Link>
      <h1 className="font-urbanist text-headline-md text-on-surface mb-3">Modules facultatifs</h1>
      <p className="mb-8 text-on-surface-variant">
        Facultatifs : ils ne comptent ni dans votre progression ni dans votre certificat. Chaque module reprend la méthode de la formation pour une filière précise (ou, pour le financement, pour tous les projets),
        avec un cas chiffré et un gabarit à télécharger quand le sujet s'y prête.
      </p>
      <ul className="space-y-3">
        {FILIERES.map((f) => {
          const dispo = f.statut === "disponible";
          const carte = (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-outline-variant p-5">
              <div>
                <p className="font-urbanist font-semibold text-on-surface">{f.titre}</p>
                <p className="text-sm text-on-surface-variant">{f.resume}</p>
                <p className="mt-1 text-label-md text-on-surface-muted">
                  {dispo ? `${f.lecons.length} leçons${f.casSlug ? ' · cas chiffré' : ''}${f.gabarit ? ' · gabarit' : ''}` : `Prévu le ${f.prevu}`}
                </p>
              </div>
              {dispo && <ChevronRight className="size-5 shrink-0 text-primary" />}
            </div>
          );
          return (
            <li key={f.slug} className={dispo ? "" : "opacity-70"}>
              {dispo ? (
                <Link href={`/membres/formations/${id}/filieres/${f.slug}`} className="block rounded-xl hover:bg-surface-container-low">
                  {carte}
                </Link>
              ) : (
                carte
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
