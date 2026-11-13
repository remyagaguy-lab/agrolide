import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { peutSuivre } from "@/lib/formations/acces.server";
import { trouverFiche } from "@/content/cadre-pays";
import { ArrowLeft } from "@/components/ui/icons";

const dateFr = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default async function FichePaysPage({ params }: { params: Promise<{ id: string; pays: string }> }) {
  const { id, pays } = await params;
  const { autorise } = await peutSuivre(id);
  if (!autorise) redirect(`/membres/formations/${id}`);
  const fiche = trouverFiche(pays);
  if (!fiche || !fiche.disponible) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10 md:py-14">
      <Link href={`/membres/formations/${id}/cadre-pays`} className="mb-6 inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft className="size-4" /> Tous les pays
      </Link>
      <h1 className="font-urbanist text-headline-md text-on-surface">Cadre pays : {fiche.nom}</h1>
      <p className="mt-2 mb-8 text-label-md text-on-surface-variant">
        Monnaie : {fiche.devise} · vérifiée le {dateFr(fiche.verifieLe)} · prochaine révision avant le {dateFr(fiche.prochaineRevision)}
      </p>
      <div className="prose prose-slate prose-lg max-w-none prose-headings:font-urbanist prose-headings:text-on-surface prose-p:font-baskerville prose-p:text-on-surface-variant prose-li:font-baskerville prose-li:text-on-surface-variant prose-a:text-primary prose-strong:font-bold prose-strong:text-on-surface">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{fiche.contenu}</ReactMarkdown>
      </div>
    </div>
  );
}
