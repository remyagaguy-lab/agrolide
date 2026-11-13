import React from "react"
import Link from "next/link"
import { BookOpen, Search } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { DOMAINES } from "@/lib/bibliotheque/taxonomie"
import { Widget, WidgetHeader } from "./Widget"

export interface DocumentRecent {
  id: string
  titre: string
  /** Libellé affiché sous le titre (domaine, à défaut type de document). */
  categorie: string
}

/** Bloc principal du tableau de bord : la bibliothèque, avec son compteur, sa recherche, ses domaines et ses dernières entrées. */
export function BibliothequeWidget({ total, documents }: { total: number; documents: DocumentRecent[] }) {
  return (
    <Widget>
      <WidgetHeader title="Bibliothèque" sousTitre={`${total.toLocaleString("fr-FR")} documents en ligne`} icon={<BookOpen />} href="/membres/bibliotheque" linkLabel="Tout voir" />

      <div className="flex flex-col gap-4 p-5 pt-3">
        <form action="/membres/bibliotheque" method="get" role="search" className="flex gap-2">
          <label htmlFor="dashboard-recherche-biblio" className="sr-only">Rechercher un document</label>
          <input
            id="dashboard-recherche-biblio"
            name="search"
            type="search"
            placeholder="Rechercher un document, un sujet, une culture"
            className="ag-state min-h-11 min-w-0 flex-1 rounded-control border border-outline bg-surface-container-lowest px-3.5 text-body-md text-on-surface placeholder:text-on-surface-muted"
          />
          <Button type="submit" variant="secondary" size="sm" className="min-h-11" aria-label="Lancer la recherche">
            <Search className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Rechercher</span>
          </Button>
        </form>

        <ul className="flex flex-wrap gap-2" aria-label="Domaines">
          {DOMAINES.map((d) => (
            <li key={d.code}>
              <Link
                href={`/membres/bibliotheque?domaine=${d.code}`}
                className="ag-state inline-flex min-h-11 items-center rounded-full border border-outline-variant bg-surface-container-low px-3.5 text-label-md text-on-surface-variant hover:text-primary"
              >
                {d.label}
              </Link>
            </li>
          ))}
        </ul>

        <div>
          <h3 className="mb-1 text-label-md text-on-surface-variant">Derniers ajouts</h3>
          {documents.length > 0 ? (
            <ul className="flex flex-col">
              {documents.map((doc) => (
                <li key={doc.id}>
                  <Link href={`/membres/bibliotheque/${doc.id}`} className="ag-state group flex min-h-12 flex-col justify-center rounded-control px-2.5 py-1.5">
                    <span className="line-clamp-1 text-title-sm text-on-surface group-hover:text-primary">{doc.titre}</span>
                    <span className="text-label-md text-on-surface-muted">{doc.categorie}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-2.5 py-2 text-body-md text-on-surface-muted">Les nouveaux documents apparaîtront ici.</p>
          )}
        </div>
      </div>
    </Widget>
  )
}
