import React from "react"
import Link from "next/link"
import { DOMAINES_VISUELS, DOMAINE_PAR_DEFAUT } from "@/components/modules/bibliotheque/DocumentCard"
import { cn } from "@/lib/utils/formatters"
import { Widget } from "./Widget"

import { ArrowRight, Library, Search } from "@/components/ui/icons"
export interface DocumentRecent {
  id: string
  titre: string
  /** Code du domaine (production_vegetale…) : donne la teinte et le pictogramme. */
  domaine: string | null
  /** Libellé du domaine (badge). */
  domaineLabel: string
  /** Libellé du type de document (« Guide pratique »…), sous le titre. */
  typeLabel: string
}

/**
 * Bloc principal du tableau de bord : la bibliothèque. L'en-tête est en vert de marque (comme le bandeau de bienvenue)
 * et porte le compteur et la recherche ; chaque dernier ajout a la teinte, le pictogramme et le badge de son domaine,
 * les mêmes que sur les cartes de la bibliothèque.
 */
export function BibliothequeWidget({ total, documents }: { total: number; documents: DocumentRecent[] }) {
  return (
    <Widget data-visite="bibliotheque">
      <div className="bg-surface-brand p-5 text-on-surface-brand">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-control bg-accent-sun text-on-accent [&>svg]:size-[18px]">
              <Library />
            </span>
            <div className="min-w-0">
              <h2 className="text-title-md">Explorer la bibliothèque</h2>
              <p className="text-label-md text-on-surface-brand/85">{total.toLocaleString("fr-FR")} documents en ligne</p>
            </div>
          </div>
          <Link href="/membres/bibliotheque" className="ag-state inline-flex min-h-11 shrink-0 items-center gap-1 rounded-control px-2 text-label-md">
            Tout voir
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <form action="/membres/bibliotheque" method="get" role="search" className="flex gap-2">
          <label htmlFor="dashboard-recherche-biblio" className="sr-only">Rechercher un document</label>
          <input
            id="dashboard-recherche-biblio"
            name="search"
            type="search"
            placeholder="Rechercher un document, un sujet, une culture"
            className="ag-state min-h-11 min-w-0 flex-1 rounded-control border-0 bg-surface-container-lowest px-3.5 text-body-md text-on-surface placeholder:text-on-surface-muted"
          />
          <button
            type="submit"
            aria-label="Lancer la recherche"
            className="ag-state inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-control bg-accent-sun px-4 text-label-lg font-bold text-on-accent"
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Rechercher</span>
          </button>
        </form>
      </div>

      <div className="p-3">
        <h3 className="px-2.5 pb-1 pt-1 text-label-md text-on-surface-variant">Derniers ajouts</h3>
        {documents.length > 0 ? (
          <ul className="flex flex-col">
            {documents.map((doc) => {
              const { Icone, fond } = (doc.domaine && DOMAINES_VISUELS[doc.domaine]) || DOMAINE_PAR_DEFAUT
              return (
                <li key={doc.id}>
                  <Link href={`/membres/bibliotheque/${doc.id}`} className="ag-state group flex min-h-14 items-center gap-3 rounded-control px-2.5 py-1.5">
                    <span aria-hidden="true" className={cn("flex size-10 shrink-0 items-center justify-center rounded-control", fond)}>
                      <Icone className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 block text-title-sm text-on-surface group-hover:text-primary">{doc.titre}</span>
                      <span className="block text-label-md text-on-surface-muted">{doc.typeLabel}</span>
                    </span>
                    {doc.domaineLabel && (
                      <span className={cn("hidden shrink-0 rounded-full px-2.5 py-0.5 text-label-md sm:inline-flex", fond)}>{doc.domaineLabel}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="px-2.5 py-2 text-body-md text-on-surface-muted">Les nouveaux documents apparaîtront ici.</p>
        )}
      </div>
    </Widget>
  )
}
