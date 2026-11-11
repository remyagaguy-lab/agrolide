import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { FORME_PATHS } from "./forme-paths"

/**
 * L'« arche » agrolide : le dôme du soleil levant posé sur les collines, avec la bande du sillon.
 * Tracés issus des pixels des marqueurs de la marque (`Branding/Identité/Marqueurs`) par
 * `scripts/forme/vectorize.py` : aucun point n'est dessiné à la main (voir scripts/forme/README.md).
 *
 * Deux styles, même dessin :
 *  - `plein` : dôme et bande pleins (« forme plein agrolide ») ;
 *  - `creux` : arche épaisse et bande en contour (« Forme agrolide »).
 */
export const ARCHE = {
  plein: FORME_PATHS["arche-plein"],
  creux: FORME_PATHS["arche-creux"],
  /** Ouverture de l'arche (même repère que `creux`) : le « soleil », fenêtre exacte des photos. */
  soleil: FORME_PATHS["arche-soleil"],
} as const

/** `frame` et `solid` sont les anciens noms de `creux` et `plein` (conservés pour compatibilité). */
export type ArcheVariant = "creux" | "plein" | "soleil" | "frame" | "solid" | "sun"

export interface ArcheProps extends Omit<React.SVGAttributes<SVGSVGElement>, "viewBox"> {
  /**
   * creux : arche + bande en contour, avec le soleil jaune dans l'ouverture (`sun`).
   * plein : silhouette pleine unie (filigrane, grande forme décorative, masque).
   * soleil : l'ouverture de l'arche seule, en jaune de marque.
   */
  variant?: ArcheVariant
  /** Dessine le soleil (jaune de marque) dans l'ouverture de l'arche creuse. */
  sun?: boolean
  /** Alternative textuelle. Sans elle, la forme est décorative (masquée aux lecteurs d'écran). */
  title?: string
}

function canonical(v: ArcheVariant): "creux" | "plein" | "soleil" {
  return v === "frame" ? "creux" : v === "solid" ? "plein" : v === "sun" ? "soleil" : v
}

/**
 * Forme de marque en SVG en ligne. Elle prend la couleur du texte (`currentColor`) :
 * `text-primary` (vert), `text-on-surface-brand` (blanc sur vert)…
 */
export function Arche({ variant = "creux", sun = true, title, className, ...props }: ArcheProps) {
  const v = canonical(variant)
  const geo = v === "plein" ? ARCHE.plein : ARCHE.creux
  const [, , w, h] = geo.viewBox
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("block h-auto", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {v === "soleil" && <path d={ARCHE.soleil.d} className="fill-accent-sun" />}
      {v === "plein" && <path d={ARCHE.plein.d} fill="currentColor" fillRule="evenodd" />}
      {v === "creux" && (
        <>
          {sun && <path d={ARCHE.soleil.d} className="fill-accent-sun" />}
          <path d={ARCHE.creux.d} fill="currentColor" fillRule="evenodd" />
        </>
      )}
    </svg>
  )
}
