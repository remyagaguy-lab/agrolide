import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { Arche, ARCHE } from "./Arche"

/** @deprecated Remplacé par `EncocheBadge` (décision du 14/11/2026). Conservé jusqu'à la suppression de l'arche. */
export interface ArcheBadgeProps {
  /** Court texte : jour d'une date, chiffre d'étape. Pas de pictogramme : les icônes restent libres (décision du 12/11/2026). */
  children: React.ReactNode
  /** soleil : dôme jaune, contenu vert (sur fond vert ou clair) ; marque : dôme vert, contenu blanc. */
  ton?: "soleil" | "marque"
  /** Largeur : classes `w-*` (défaut 64 px ; de 40 à 112 px). */
  className?: string
}

const { centre, inscrit } = ARCHE

/**
 * Badge : le dôme de l'emblème porte un chiffre à son CENTRE OPTIQUE
 * (axe de symétrie du dôme, mi-hauteur de sa corde verticale).
 * Texte : centré sur la hauteur des capitales (text-box), corps de 30 % de la largeur.
 * Rôle : étape d'un parcours, jour d'un événement.
 */
export function ArcheBadge({ children, ton = "soleil", className }: ArcheBadgeProps) {
  const texte = typeof children === "string" || typeof children === "number"
  return (
    <span aria-hidden={texte ? undefined : true} className={cn("@container relative inline-block w-16 shrink-0", className)}>
      <Arche variant="plein" className={cn("w-full", ton === "soleil" ? "text-accent-sun" : "text-primary")} />
      <span
        className={cn(
          "absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center",
          ton === "soleil" ? "text-surface-brand" : "text-on-primary",
          texte
            ? "text-[30cqw] font-extrabold leading-none tabular-nums [text-box:trim-both_cap_alphabetic]"
            : "aspect-square [&>svg]:size-full [&>svg]:[stroke-width:2]",
        )}
        style={{ left: `${centre.x}%`, top: `${centre.y}%`, width: texte ? undefined : `${inscrit * 0.6}%` }}
      >
        {children}
      </span>
    </span>
  )
}
