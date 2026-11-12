import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { GEOMETRIE } from "./geometrie"

const [x, y, w, h] = GEOMETRIE.feuilleVB

export interface FeuilleProps extends Omit<React.SVGAttributes<SVGSVGElement>, "viewBox"> {
  /** Alternative textuelle. Sans elle, la feuille est décorative. */
  title?: string
}

/**
 * Feuille : la lentille de l'emblème (intersection du disque de l'emblème et d'un arc des sillons, mesurés
 * sur le favicon), dans son inclinaison d'origine. Couleur : `currentColor`.
 * Rôle : petit repère, de 8 à 24 px de large : puce de liste, pastille d'état ou de catégorie, marque « nouveau ».
 * Jamais en grand, jamais comme cadre photo.
 */
export function Feuille({ title, className, ...props }: FeuilleProps) {
  return (
    <svg
      viewBox={`${x} ${y} ${w} ${h}`}
      className={cn("inline-block h-auto w-4 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      <path d={GEOMETRIE.feuilleD} fill="currentColor" />
    </svg>
  )
}
