import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { GEOMETRIE } from "./geometrie"

const { gauche: G, droite: D, creux: V } = GEOMETRIE.horizon
/** Fenêtre : de la crête de la colline gauche à la crête de la colline droite (repère du favicon). */
const X0 = G.c[0]
const X1 = D.c[0]
const Y_HAUT = G.c[1] - G.r // crête gauche (la plus haute)
const Y_CRETE_D = D.c[1] - D.r
const Y_BAS = V[1] + 24 // un peu sous le creux, pour que l'aplat ait un pied
const VB = `${X0} ${Y_HAUT} ${X1 - X0} ${Y_BAS - Y_HAUT}`
/** Terre sous l'horizon : crête gauche, arc gauche jusqu'au creux, arc droit jusqu'à la crête droite. */
const TERRE = `M${X0} ${Y_BAS}V${Y_HAUT}A${G.r} ${G.r} 0 0 1 ${V[0]} ${V[1]}A${D.r} ${D.r} 0 0 1 ${X1} ${Y_CRETE_D}V${Y_BAS}Z`

export interface HorizonProps {
  /** Retourne l'horizon (le creux passe à droite). */
  retourne?: boolean
  /** Hauteur : classes `h-*` (défaut : 40 / 56 / 80 px selon l'écran). */
  className?: string
}

/**
 * Horizon : les deux collines de l'emblème qui se rejoignent en V sous le soleil, arcs mesurés sur le favicon.
 * Rôle : séparateur de sections (bas d'un en-tête, passage d'un bandeau à la page). À placer à la FIN de la
 * section du dessus ; la forme prend la couleur de la section du dessous (`text-surface`, `text-surface-container-low`…).
 * Étiré en largeur : il garde ses deux crêtes et son creux. Remplace `HorizonDivider` (courbes approchées).
 */
export function Horizon({ retourne = false, className }: HorizonProps) {
  return (
    <svg
      viewBox={VB}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={cn("-mb-px block h-10 w-full sm:h-14 lg:h-20", retourne && "-scale-x-100", className)}
    >
      <path d={TERRE} fill="currentColor" />
    </svg>
  )
}
