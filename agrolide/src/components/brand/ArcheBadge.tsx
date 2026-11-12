import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { Arche } from "./Arche"

export interface ArcheBadgeProps {
  /** Pictogramme (lucide-react ou SVG 24 × 24 en trait) : il se place dans le dôme. */
  children: React.ReactNode
  /** soleil : arche jaune, pictogramme vert (sur fond vert ou clair) ; marque : arche verte, pictogramme blanc. */
  ton?: "soleil" | "marque"
  /** Largeur : classes `w-*` (défaut 64 px ; de 40 à 112 px). */
  className?: string
}

/**
 * Badge de pictogramme : l'arche pleine porte le pictogramme dans son dôme (le soleil), la bande reste vide.
 * Rôle : tête de carte de service ou de valeur, étape d'un parcours. Jamais de cercle ou de carré à la place.
 */
export function ArcheBadge({ children, ton = "soleil", className }: ArcheBadgeProps) {
  return (
    <span aria-hidden="true" className={cn("relative inline-block w-16 shrink-0", className)}>
      <Arche variant="plein" className={cn("w-full", ton === "soleil" ? "text-accent-sun" : "text-primary")} />
      <span
        className={cn(
          "absolute left-1/2 top-[36%] flex aspect-square w-[36%] -translate-x-1/2 -translate-y-1/2 items-center justify-center [&>svg]:size-full [&>svg]:[stroke-width:2]",
          ton === "soleil" ? "text-surface-brand" : "text-on-primary",
        )}
      >
        {children}
      </span>
    </span>
  )
}
