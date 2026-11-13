import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { peutSuivre } from "@/lib/formations/acces.server";
import { trouverFiliere } from "@/content/filieres";
import { ArrowLeft } from "@/components/ui/icons";

const PROSE =
  "prose prose-slate prose-lg max-w-none overflow-x-auto prose-headings:font-urbanist prose-headings:text-on-surface prose-p:font-baskerville prose-p:text-on-surface-variant prose-li:font-baskerville prose-li:text-on-surface-variant prose-a:text-primary prose-strong:font-bold prose-strong:text-on-surface";

export default async function FilierePage({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id, slug } = await params;
  const { autorise } = await peutSuivre(id);
  if (!autorise) redirect(`/membres/formations/${id}`);
  const filiere = trouverFiliere(slug);
  if (!filiere || filiere.statut !== "disponible") notFound();
  const minutes = filiere.lecons.reduce((s, l) => s + l.duree_minutes, 0);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10 md:py-14">
      <Link href={`/membres/formations/${id}/filieres`} className="mb-6 inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft className="size-4" /> Tous les modules par filière
      </Link>
      <h1 className="font-urbanist text-headline-md text-on-surface">{filiere.titre}</h1>
      <p className="mt-2 mb-6 text-on-surface-variant">
        Module facultatif · {filiere.lecons.length} leçons · environ {minutes} min. {filiere.resume}
      </p>

      <nav className="mb-10 rounded-xl border border-outline-variant p-5">
        <p className="mb-2 font-urbanist font-semibold text-on-surface">Dans ce module</p>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {filiere.lecons.map((l) => (
            <li key={l.id}><a href={`#${l.id}`} className="text-primary">{l.titre}</a></li>
          ))}
        </ol>
        {filiere.casSlug && (
          <p className="mt-3 text-sm">
            Cas chiffré : <Link href={`/membres/formations/${id}/cas/${filiere.casSlug}`} className="text-primary">ouvrir le cas complet</Link>
          </p>
        )}
        {filiere.gabarit && (
          <p className="mt-1 text-sm">
            Gabarit : <a href={filiere.gabarit.url} className="text-primary">{filiere.gabarit.libelle}</a>
          </p>
        )}
      </nav>

      {filiere.lecons.map((l, i) => (
        <section key={l.id} id={l.id} className="mb-14 scroll-mt-24">
          <p className="text-label-md text-on-surface-muted">Leçon {i + 1} · {l.duree_minutes} min</p>
          <h2 className="font-urbanist text-title-lg text-on-surface mb-4">{l.titre}</h2>
          <div className={PROSE}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{l.contenu}</ReactMarkdown>
          </div>
        </section>
      ))}
    </div>
  );
}
