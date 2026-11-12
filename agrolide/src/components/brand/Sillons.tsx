import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { GEOMETRIE } from "./geometrie"

/**
 * Les six bords de la famille droite de l'emblème, du plus extérieur au plus intérieur :
 * colline de droite, sillon 1 (haut, bas), sillon 2 (haut, bas), haut de la feuille.
 * Ce sont des cercles emboîtés, de centres légèrement décalés : d'où les bandes qui s'affinent.
 */
const S = GEOMETRIE.sillons

/** Cadre carré de 900 unités dont le coin bas-droit est le foyer des arcs (sous la feuille). */
const COIN = { x: 1360, y: 1800 }
const COTE = 900
const VB = `${COIN.x - COTE} ${COIN.y - COTE} ${COTE} ${COTE}`

const cercle = (i: number) => {
  const { c, r } = S[i]
  return `M${c[0] - r} ${c[1]}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`
}

export type SillonsCoin = "bas-droite" | "bas-gauche" | "haut-droite" | "haut-gauche"

export interface SillonsProps {
  /** Coin d'où partent les sillons : la forme y est coupée par deux bords. */
  coin?: SillonsCoin
  /**
   * traits  : les trois sillons de l'emblème (bandes pleines, le fond passe entre elles) ;
   * paliers : trois aplats emboîtés, de plus en plus soutenus vers le coin (effet d'onde).
   */
  variante?: "traits" | "paliers"
  /** Opacité globale (la couleur est celle du texte, `currentColor`). */
  opacite?: number
  /** Taille : classes de largeur (`w-[38rem]`, `w-1/2`…) ; le cadre reste carré. */
  className?: string
}

/**
 * Sillons : les arcs des collines de l'emblème, mesurés sur le favicon, qui rayonnent depuis un coin.
 * Rôle : mouvement et texture de bord (pied de page, bandeau d'appel, section « plateforme », coin de carte large).
 * Toujours ancrés dans un coin et coupés par deux bords ; jamais au milieu, jamais derrière un paragraphe.
 * Calque décoratif : parent `relative overflow-hidden`, contenu au-dessus (`relative z-10`).
 */
export function Sillons({ coin = "bas-droite", variante = "traits", opacite = 1, className }: SillonsProps) {
  const [v, h] = coin.split("-") as ["bas" | "haut", "droite" | "gauche"]
  return (
    <svg
      viewBox={VB}
      aria-hidden="true"
      focusable="false"
      className={cn(
        "pointer-events-none absolute block aspect-square",
        v === "bas" ? "bottom-0" : "top-0",
        h === "droite" ? "right-0" : "left-0",
        h === "gauche" && v === "bas" && "-scale-x-100",
        h === "droite" && v === "haut" && "-scale-y-100",
        h === "gauche" && v === "haut" && "rotate-180",
        className,
      )}
      style={{ opacity: opacite }}
    >
      {variante === "traits" ? (
        <path d={[0, 1, 2, 3, 4, 5].map(cercle).join("")} fill="currentColor" fillRule="evenodd" />
      ) : (
        <>
          <path d={cercle(0)} fill="currentColor" opacity={0.35} />
          <path d={cercle(2)} fill="currentColor" opacity={0.55} />
          <path d={cercle(4)} fill="currentColor" />
        </>
      )}
    </svg>
  )
}
