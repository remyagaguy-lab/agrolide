import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { Arche, ARCHE_EMBLEME } from "./Arche"

export interface ArcheBadgeProps {
  /** Pictogramme (lucide-react, 24 × 24 en trait) ou court texte (jour d'une date, chiffre d'étape). */
  children: React.ReactNode
  /** soleil : arche jaune, contenu vert (sur fond vert ou clair) ; marque : arche verte, contenu blanc. */
  ton?: "soleil" | "marque"
  /** Largeur : classes `w-*` (défaut 64 px ; de 40 à 112 px). */
  className?: string
}

const { centre, inscrit } = ARCHE_EMBLEME

/**
 * Badge : l'arche déduite de l'emblème porte un pictogramme ou un chiffre au CENTRE OPTIQUE de son dôme
 * (axe de symétrie du dôme, mi-hauteur de sa corde verticale), la bande reste vide.
 * Pictogramme : 60 % du cercle inscrit du dôme. Texte : centré sur la hauteur des capitales (text-box), corps de 34 % de la largeur.
 * Rôle : tête de carte de service ou de valeur, étape d'un parcours, jour d'un événement.
 */
export function ArcheBadge({ children, ton = "soleil", className }: ArcheBadgeProps) {
  const texte = typeof children === "string" || typeof children === "number"
  return (
    <span aria-hidden={texte ? undefined : true} className={cn("@container relative inline-block w-16 shrink-0", className)}>
      <Arche source="embleme" variant="plein" className={cn("w-full", ton === "soleil" ? "text-accent-sun" : "text-primary")} />
      <span
        className={cn(
          "absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center",
          ton === "soleil" ? "text-surface-brand" : "text-on-primary",
          texte
            ? "text-[34cqw] font-extrabold leading-none tabular-nums [text-box:trim-both_cap_alphabetic]"
            : "aspect-square [&>svg]:size-full [&>svg]:[stroke-width:2]",
        )}
        style={{ left: `${centre.x}%`, top: `${centre.y}%`, width: texte ? undefined : `${inscrit * 0.6}%` }}
      >
        {children}
      </span>
    </span>
  )
}
