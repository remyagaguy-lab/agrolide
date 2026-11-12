import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { GEOMETRIE } from "./geometrie"

/**
 * Les trois sillons de l'emblème, MESURÉS sur le favicon : trois traits de même épaisseur (61,8 à 62,7 px, comme
 * l'anneau), d'axes circulaires aux centres décalés sous la feuille (d'où les bandes blanches qui s'affinent de 68 à 45 px).
 * Cadre = coin bas-droit de l'emblème : à droite, le bord intérieur de l'anneau ; en bas, la pointe de la feuille.
 * Bouts ronds : celui du grand sillon est celui de l'emblème ; le premier trait s'arrête à l'aplomb du creux des collines.
 */
const T = GEOMETRIE.traits
const [vx, vy, vw, vh] = T.viewBox

export type SillonsCoin = "bas-droite" | "bas-gauche" | "haut-droite" | "haut-gauche"

export interface SillonsProps {
  /** Coin d'où partent les sillons : la forme y est coupée par deux bords. */
  coin?: SillonsCoin
  /** Opacité globale (la couleur est celle du texte, `currentColor`). */
  opacite?: number
  /** Taille : classes de largeur (`w-72`, `w-[30%]`…) ; la hauteur suit les proportions de l'emblème (726 × 490). */
  className?: string
}

/**
 * Sillons : rôle MOUVEMENT DE COIN (bandeau de chiffres, en-tête vert, coin d'un bandeau large).
 * Toujours ancrés dans un coin et coupés par deux bords ; jamais au milieu, jamais derrière un texte ou un chiffre.
 * Calque décoratif : parent `relative overflow-hidden`, contenu au-dessus (`relative z-10`).
 */
export function Sillons({ coin = "bas-droite", opacite = 1, className }: SillonsProps) {
  const [v, h] = coin.split("-") as ["bas" | "haut", "droite" | "gauche"]
  return (
    <svg
      viewBox={`${vx} ${vy} ${vw} ${vh}`}
      aria-hidden="true"
      focusable="false"
      className={cn(
        "pointer-events-none absolute block h-auto",
        v === "bas" ? "bottom-0" : "top-0",
        h === "droite" ? "right-0" : "left-0",
        h === "gauche" && v === "bas" && "-scale-x-100",
        h === "droite" && v === "haut" && "-scale-y-100",
        h === "gauche" && v === "haut" && "rotate-180",
        className,
      )}
      style={{ opacity: opacite }}
    >
      {T.liste.map((t, i) => (
        <path key={i} d={t.d} fill="none" stroke="currentColor" strokeWidth={t.epaisseur} strokeLinecap={t.boutRond ? "round" : "butt"} />
      ))}
    </svg>
  )
}
