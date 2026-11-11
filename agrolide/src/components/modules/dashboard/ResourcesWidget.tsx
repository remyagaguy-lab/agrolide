import React from "react"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import { Widget, WidgetHeader } from "./Widget"

export interface ResourceItem {
  id: string | number
  titre: string
  categorie?: string | null
  slug?: string | null
  published_at?: string | Date | null
}

export interface ResourcesWidgetProps {
  resources: ResourceItem[]
  title?: string
  viewAllHref?: string
  className?: string
}

export function ResourcesWidget({
  resources,
  title = "Fiches techniques & bibliothèque",
  viewAllHref = "/membres/bibliotheque",
  className,
}: ResourcesWidgetProps) {
  return (
    <Widget className={className}>
      <WidgetHeader title={title} tone="leaf" href={viewAllHref} linkLabel="Bibliothèque" />
      <ul className="flex flex-col gap-1 p-3">
        {resources && resources.length > 0 ? (
          resources.map((res) => (
            <li key={res.id}>
              <Link
                href={`/membres/bibliotheque/${res.slug || res.id}`}
                className="ag-state group flex min-h-12 items-center gap-3 rounded-control p-2.5"
              >
                <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-control bg-primary-container text-on-primary-container">
                  <BookOpen className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-title-sm text-on-surface group-hover:text-primary">{res.titre}</span>
                  <span className="mt-0.5 block text-label-sm uppercase tracking-wider text-on-surface-muted">{res.categorie || "Guide technique"}</span>
                </span>
              </Link>
            </li>
          ))
        ) : (
          <li className="py-4 text-center text-body-sm text-on-surface-muted">Aucune publication récente dans la bibliothèque.</li>
        )}
      </ul>
    </Widget>
  )
}
