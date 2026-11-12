import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { GEOMETRIE } from "./geometrie"

/**
 * L'« arche » agrolide : le DÔME de l'emblème, c'est-à-dire sa silhouette au-dessus de la première ligne blanche
 * (l'anneau, le ciel et les collines), reconstruite avec les cercles mesurés du favicon (IoU 0,991).
 * Décision du 12/11/2026 : le sillon autrefois accolé sous le dôme est retiré ; les pièces du bas vivent
 * dans `EmblemEclate` (grands formats).
 */
const A = GEOMETRIE.arche
const [ax, ay, aw, ah] = A.viewBox
export const ARCHE = {
  dome: A.dome,
  /** Ouverture (le ciel de l'emblème) : fenêtre exacte des photos. */
  ciel: A.ciel,
  viewBox: A.viewBox,
  /** Centre optique du dôme, en % du cadre (axe de symétrie, mi-hauteur de la corde verticale). */
  centre: { x: ((A.domeCentre[0] - ax) / aw) * 100, y: ((A.domeCentre[1] - ay) / ah) * 100 },
  /** Diamètre du cercle inscrit dans le dôme, en % de la largeur du cadre. */
  inscrit: ((2 * A.domeInscrit.r) / aw) * 100,
} as const

/** `frame`, `solid`, `sun` : anciens noms de `creux`, `plein`, `soleil` (conservés pour compatibilité). */
export type ArcheVariant = "creux" | "plein" | "soleil" | "frame" | "solid" | "sun"

export interface ArcheProps extends Omit<React.SVGAttributes<SVGSVGElement>, "viewBox"> {
  /**
   * plein  : le dôme plein (badge, carte, filigrane) ;
   * creux  : le dôme évidé de son ciel (l'anneau et les collines), avec le soleil jaune dans l'ouverture (`sun`) ;
   * soleil : le ciel seul, en jaune de marque.
   */
  variant?: ArcheVariant
  /** Dessine le soleil (jaune de marque) dans l'ouverture du dôme creux. */
  sun?: boolean
  /** Alternative textuelle. Sans elle, la forme est décorative (masquée aux lecteurs d'écran). */
  title?: string
}

function canonical(v: ArcheVariant): "creux" | "plein" | "soleil" {
  return v === "frame" ? "creux" : v === "solid" ? "plein" : v === "sun" ? "soleil" : v
}

/** Forme de marque en SVG en ligne, à la couleur du texte (`currentColor`). */
export function Arche({ variant = "creux", sun = true, title, className, ...props }: ArcheProps) {
  const v = canonical(variant)
  return (
    <svg
      viewBox={`${ax} ${ay} ${aw} ${ah}`}
      className={cn("block h-auto", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {v === "soleil" && <path d={A.ciel} className="fill-accent-sun" />}
      {v === "plein" && <path d={A.dome} fill="currentColor" />}
      {v === "creux" && (
        <>
          {sun && <path d={A.ciel} className="fill-accent-sun" />}
          <path d={A.dome + A.ciel} fill="currentColor" fillRule="evenodd" />
        </>
      )}
    </svg>
  )
}
