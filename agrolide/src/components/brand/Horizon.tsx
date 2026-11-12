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
/** Ciel au-dessus de l'horizon (même ligne), avec une marge haute pour qu'il ait une épaisseur à la crête gauche. */
const MARGE = 28
const VB_CIEL = `${X0} ${Y_HAUT - MARGE} ${X1 - X0} ${Y_BAS - Y_HAUT + MARGE}`
const CIEL = `M${X0} ${Y_HAUT - MARGE}V${Y_HAUT}A${G.r} ${G.r} 0 0 1 ${V[0]} ${V[1]}A${D.r} ${D.r} 0 0 1 ${X1} ${Y_CRETE_D}V${Y_HAUT - MARGE}Z`
/**
 * Masque CSS de la TERRE dans le cadre `ciel` (même cadre, même creux) : à appliquer à une photo pour la découper selon
 * l'horizon. Contrairement à `<Horizon partie="ciel">`, qui peint un aplat par-dessus la photo, le masque laisse voir
 * le fond de la section au-dessus de la ligne : un motif ou une texture continue alors sans rupture jusqu'à l'horizon.
 * Usage : `maskImage: \`${HORIZON_MASQUE_TERRE}, linear-gradient(black, black)\``, tailles `100% h` et `100% calc(100% - h + 1px)`.
 */
export const HORIZON_MASQUE_TERRE = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${VB_CIEL}' preserveAspectRatio='none'><path d='${TERRE}' fill='black'/></svg>`,
)}")`
/**
 * Masque CSS de la TERRE dans le cadre `terre` (celui de `<Horizon>` par défaut, crête gauche au bord haut) : pour un calque
 * (motif, texture) qui remonte sous un `<Horizon>` et doit s'arrêter exactement sur sa ligne. Mêmes tailles que ci-dessus.
 */
export const HORIZON_MASQUE_TERRE_BORD = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${VB}' preserveAspectRatio='none'><path d='${TERRE}' fill='black'/></svg>`,
)}")`
/** Position du creux en V dans le cadre `ciel`, en % (pour y poser le sceau). */
export const HORIZON_CREUX = { x: ((V[0] - X0) / (X1 - X0)) * 100, y: ((V[1] - (Y_HAUT - MARGE)) / (Y_BAS - Y_HAUT + MARGE)) * 100 }

export interface HorizonProps {
  /** Retourne l'horizon (le creux passe à droite). */
  retourne?: boolean
  /**
   * terre (défaut) : remplit sous la ligne (la section du dessous monte en collines) ;
   * ciel : remplit au-dessus (la section du dessus descend sur une photo ou un fond, qui devient la terre).
   */
  partie?: "terre" | "ciel"
  /** Hauteur : classes `h-*` (défaut : 40 / 56 / 80 px selon l'écran). */
  className?: string
}

/**
 * Horizon : les deux collines de l'emblème qui se rejoignent en V sous le soleil, arcs mesurés sur le favicon.
 * Rôle : séparateur de sections (bas d'un en-tête, passage d'un bandeau à la page). À placer à la FIN de la
 * section du dessus ; la forme prend la couleur de la section du dessous (`text-surface`, `text-surface-container-low`…).
 * Étiré en largeur : il garde ses deux crêtes et son creux. Remplace `HorizonDivider` (courbes approchées).
 */
export function Horizon({ retourne = false, partie = "terre", className }: HorizonProps) {
  return (
    <svg
      viewBox={partie === "ciel" ? VB_CIEL : VB}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={cn("-mb-px block h-10 w-full sm:h-14 lg:h-20", retourne && "-scale-x-100", className)}
    >
      <path d={partie === "ciel" ? CIEL : TERRE} fill="currentColor" />
    </svg>
  )
}
