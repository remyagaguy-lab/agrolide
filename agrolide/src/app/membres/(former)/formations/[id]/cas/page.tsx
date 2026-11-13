import { redirect } from "next/navigation";
import Link from "next/link";
import { peutSuivre } from "@/lib/formations/acces.server";
import { CAS_CHIFFRES } from "@/content/cas-chiffres";
import { ArrowLeft, ChevronRight } from "@/components/ui/icons";

/** Cas chiffrés complémentaires au cas fil rouge Diap Touré, hors parcours de leçons. */
export default async function CasChiffresPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { autorise } = await peutSuivre(id);
  if (!autorise) redirect(`/membres/formations/${id}`);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10 md:py-14">
      <Link href={`/membres/formations/${id}`} className="mb-6 inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft className="size-4" /> Retour à la formation
      </Link>
      <h1 className="font-urbanist text-headline-md text-on-surface mb-3">Autres cas chiffrés</h1>
      <p className="mb-8 text-on-surface-variant">
        Après le cas Diap Touré (maraîchage au Sénégal), deux cas complets dans d'autres filières et d'autres pays : même méthode, mêmes indicateurs (seuil de rentabilité,
        couverture de la dette, VAN, TRI), calculés par script. Les chiffres sont des hypothèses pédagogiques : remplacez-les par les vôtres.
      </p>
      <ul className="space-y-3">
        {CAS_CHIFFRES.map((c) => (
          <li key={c.slug}>
            <Link href={`/membres/formations/${id}/cas/${c.slug}`} className="block rounded-xl hover:bg-surface-container-low">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-outline-variant p-5">
                <div>
                  <p className="font-urbanist font-semibold text-on-surface">{c.titre}</p>
                  <p className="text-sm text-on-surface-variant">{c.resume}</p>
                  <p className="mt-1 text-label-md text-on-surface-muted">{c.pays} · {c.monnaie}</p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-primary" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
