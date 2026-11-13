import React from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils/formatters"
import { Widget } from "./Widget"

export interface EtapePremiersPas {
  libelle: string
  href: string
  faite: boolean
}

/**
 * Carte d'accueil d'un membre qui n'a encore rien commencé : quatre gestes simples, cochés au fur et à mesure.
 * Elle disparaît d'elle-même dès que le membre a une formation ou un événement en cours.
 */
export function PremiersPas({ etapes }: { etapes: EtapePremiersPas[] }) {
  const faites = etapes.filter((e) => e.faite).length
  return (
    <Widget className="p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-title-md text-on-surface">Premiers pas</h2>
        <p className="text-label-md tabular-nums text-on-surface-variant">{faites} sur {etapes.length}</p>
      </div>
      <ol className="grid gap-1 sm:grid-cols-2">
        {etapes.map((e, i) => (
          <li key={e.libelle}>
            <Link href={e.href} className="ag-state group flex min-h-12 items-center gap-3 rounded-control p-2">
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-label-md tabular-nums",
                  e.faite ? "bg-primary text-on-primary" : "bg-primary-container text-on-primary-container",
                )}
              >
                {e.faite ? <Check className="size-4" /> : i + 1}
              </span>
              <span className={cn("min-w-0 flex-1 text-body-md", e.faite ? "text-on-surface-muted line-through" : "text-on-surface group-hover:text-primary")}>
                {e.libelle}
                {e.faite && <span className="sr-only"> — fait</span>}
              </span>
              {!e.faite && <ArrowRight className="size-4 shrink-0 text-on-surface-muted" aria-hidden="true" />}
            </Link>
          </li>
        ))}
      </ol>
    </Widget>
  )
}
