import * as React from "react"
import { cn } from "@/lib/utils/formatters"

export interface HorizonDividerProps {
  /** `crest` : une colline qui monte vers le centre ; `slope` : une pente douce d'un côté à l'autre. */
  shape?: "crest" | "slope"
  /** Retourne la courbe (pour faire descendre la section du dessus). */
  flip?: boolean
  className?: string
}

const PATHS = {
  crest: "M0 100 L0 52 Q 48 6 100 56 L100 100 Z",
  slope: "M0 100 L0 62 Q 55 8 100 30 L100 100 Z",
}

/**
 * Transition organique entre deux sections, reprenant la courbe des collines du logo (sillons de champs).
 * Se place à la FIN de la section du dessus ; la forme prend la couleur de la section du dessous :
 *
 *   <section className="bg-surface-brand">…<HorizonDivider className="text-surface" /></section>
 *
 * Remplace les ruptures nettes et les dégradés (interdits par la charte).
 */
export function HorizonDivider({ shape = "crest", flip = false, className }: HorizonDividerProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={cn("-mb-px block h-10 w-full sm:h-14 lg:h-20", flip && "-scale-x-100", className)}
    >
      <path d={PATHS[shape]} fill="currentColor" />
    </svg>
  )
}
