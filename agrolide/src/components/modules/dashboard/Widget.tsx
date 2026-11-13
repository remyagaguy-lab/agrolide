import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils/formatters"

/** Conteneur commun des widgets du tableau de bord : carte à bordure fine, en-tête et corps. */
export function Widget({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest shadow-elev-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * En-tête de bloc : pictogramme dans un carré pâle, titre en casse normale (jamais tronqué : il passe à la ligne),
 * lien « tout voir » discret à droite. Pas de capitales, pas de pastille de couleur.
 */
export function WidgetHeader({
  title,
  icon,
  count,
  sousTitre,
  href,
  linkLabel,
}: {
  title: string
  icon?: React.ReactNode
  count?: number
  /** Ligne discrète sous le titre (un compteur, par exemple). */
  sousTitre?: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 px-5 pb-1 pt-4">
      <div className="flex min-w-0 items-center gap-3">
        {icon ? (
          <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-control bg-primary-container text-on-primary-container [&>svg]:size-[18px]">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="text-title-md text-on-surface">{title}</h2>
          {sousTitre ? <p className="text-label-md text-on-surface-variant">{sousTitre}</p> : null}
        </div>
        {count ? (
          <span className="rounded-full bg-primary-container px-2 py-0.5 text-label-sm tabular-nums text-on-primary-container">{count}</span>
        ) : null}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="ag-state inline-flex min-h-11 shrink-0 items-center gap-1 rounded-control px-2 text-label-md text-primary"
        >
          {linkLabel}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
