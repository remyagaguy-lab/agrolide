import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { peutSuivre } from "@/lib/formations/acces.server";
import { FICHES_PAYS } from "@/content/cadre-pays";
import { ArrowLeft, ChevronRight } from "@/components/ui/icons";

const dateFr = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/** Cadre pays : une fiche par pays (statuts, foncier, fiscalité, financeurs), hors parcours de leçons. */
export default async function CadrePaysPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { autorise } = await peutSuivre(id);
  if (!autorise) redirect(`/membres/formations/${id}`);
  if (FICHES_PAYS.length === 0) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10 md:py-14">
      <Link href={`/membres/formations/${id}`} className="mb-6 inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft className="size-4" /> Retour à la formation
      </Link>
      <h1 className="font-urbanist text-headline-md text-on-surface mb-3">Cadre pays</h1>
      <p className="mb-8 text-on-surface-variant">
        Statuts juridiques, foncier, identifiants fiscaux, fiscalité de base à vérifier, financeurs et garanties : une fiche par pays, vérifiée sur des sources publiques et datée.
        Les taux et plafonds ne sont pas recopiés (ils changent chaque année) : chaque fiche dit où lire la valeur en vigueur.
      </p>
      <ul className="space-y-3">
        {FICHES_PAYS.map((f) => {
          const contenu = (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-outline-variant p-5">
              <div>
                <p className="font-urbanist font-semibold text-on-surface">{f.nom}</p>
                <p className="text-sm text-on-surface-variant">{f.resume}</p>
                <p className="mt-1 text-label-md text-on-surface-muted">
                  {f.disponible ? `Vérifiée le ${dateFr(f.verifieLe)}` : `En préparation : publication prévue le ${dateFr(f.prevuLe!)}`}
                </p>
              </div>
              {f.disponible ? <ChevronRight className="size-5 shrink-0 text-primary" /> : null}
            </div>
          );
          return (
            <li key={f.slug}>
              {f.disponible ? (
                <Link href={`/membres/formations/${id}/cadre-pays/${f.slug}`} className="block hover:bg-surface-container-low rounded-xl">
                  {contenu}
                </Link>
              ) : (
                <div className="opacity-70">{contenu}</div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-8 text-sm text-on-surface-variant">
        Ghana et Nigeria (fiches en anglais) viendront après les pays francophones de l'espace OHADA.
      </p>
    </div>
  );
}
