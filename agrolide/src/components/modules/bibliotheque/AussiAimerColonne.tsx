import Link from 'next/link'
import { FileText } from 'lucide-react'

export type DocSuggere = { id: string; titre: string; type_doc: string; thematique: string }

/** « Vous aimerez peut-être aussi » : colonne à droite sur ordinateur, bande défilante sous le lecteur sur téléphone. */
export function AussiAimerColonne({ docs }: { docs: DocSuggere[] }) {
  if (docs.length === 0) return null
  return (
    <section aria-label="Vous aimerez peut-être aussi">
      <h2 className="mb-3 text-sm font-bold text-on-surface">Vous aimerez peut-être aussi</h2>
      <ul className="flex gap-3 overflow-x-auto pb-2 snap-x lg:flex-col lg:overflow-visible lg:pb-0">
        {docs.map((d) => (
          <li key={d.id} className="snap-start shrink-0 w-[70%] sm:w-[45%] lg:w-auto">
            <Link
              href={`/bibliotheque/${d.id}`}
              className="flex h-full items-start gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-3 hover:border-success/30 hover:shadow-sm transition"
            >
              <span className="mt-0.5 flex h-10 w-8 shrink-0 items-center justify-center rounded bg-success-container text-success">
                <FileText className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-on-surface line-clamp-2">{d.titre}</span>
                <span className="mt-1 block text-xs text-on-surface-muted">{d.type_doc} · {d.thematique}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
