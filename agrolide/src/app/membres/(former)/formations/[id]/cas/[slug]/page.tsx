import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { peutSuivre } from "@/lib/formations/acces.server";
import { trouverCas } from "@/content/cas-chiffres";
import { ArrowLeft } from "@/components/ui/icons";

export default async function CasChiffrePage({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id, slug } = await params;
  const { autorise } = await peutSuivre(id);
  if (!autorise) redirect(`/membres/formations/${id}`);
  const cas = trouverCas(slug);
  if (!cas) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10 md:py-14">
      <Link href={`/membres/formations/${id}/cas`} className="mb-6 inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft className="size-4" /> Tous les cas
      </Link>
      <h1 className="font-urbanist text-headline-md text-on-surface">{cas.titre}</h1>
      <p className="mt-2 mb-8 text-label-md text-on-surface-variant">{cas.pays} · montants en millions de {cas.monnaie}</p>
      <div className="prose prose-slate prose-lg max-w-none overflow-x-auto prose-headings:font-urbanist prose-headings:text-on-surface prose-p:font-baskerville prose-p:text-on-surface-variant prose-li:font-baskerville prose-li:text-on-surface-variant prose-a:text-primary prose-strong:font-bold prose-strong:text-on-surface">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{cas.contenu}</ReactMarkdown>
      </div>
    </div>
  );
}
