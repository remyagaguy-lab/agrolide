import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { FORME_PATHS } from "./forme-paths"
import { GEOMETRIE } from "./geometrie"

/**
 * L'« arche » agrolide : le dôme du soleil levant posé sur les collines, avec la bande du sillon.
 *
 * Deux tracés :
 *  - `embleme` : reconstruit avec les cercles MESURÉS de l'emblème (`scripts/forme/primitives.py`) : le dôme est la
 *    silhouette de l'emblème au-dessus de sa première ligne blanche, la bande est le grand sillon (épaisseur constante,
 *    bout rond d'origine). IoU 0,991 (dôme) et 0,977 (bande) avec les pixels du favicon.
 *  - `marqueur` : tracé depuis les marqueurs dessinés à part (`Branding/Identité/Marqueurs`), défaut actuel des pages.
 *    Il ne coïncide qu'à 85 % avec l'emblème (dôme plus bas à gauche, bande plus épaisse).
 */
export const ARCHE = {
  plein: FORME_PATHS["arche-plein"],
  creux: FORME_PATHS["arche-creux"],
  /** Ouverture de l'arche (même repère que `creux`) : le « soleil », fenêtre exacte des photos. */
  soleil: FORME_PATHS["arche-soleil"],
} as const

const A = GEOMETRIE.arche
const [ax, ay, aw, ah] = A.viewBox
/** Arche déduite de l'emblème (repère du favicon). `centre` : centre optique du dôme, en % du cadre. */
export const ARCHE_EMBLEME = {
  dome: A.dome,
  bande: A.bande,
  ciel: A.ciel,
  viewBox: A.viewBox,
  centre: { x: ((A.domeCentre[0] - ax) / aw) * 100, y: ((A.domeCentre[1] - ay) / ah) * 100 },
  /** Diamètre du cercle inscrit dans le dôme, en % de la largeur du cadre. */
  inscrit: ((2 * A.domeInscrit.r) / aw) * 100,
} as const

export type ArcheSource = "embleme" | "marqueur"

/** `frame` et `solid` sont les anciens noms de `creux` et `plein` (conservés pour compatibilité). */
export type ArcheVariant = "creux" | "plein" | "soleil" | "frame" | "solid" | "sun"

export interface ArcheProps extends Omit<React.SVGAttributes<SVGSVGElement>, "viewBox"> {
  /**
   * creux : arche + bande en contour, avec le soleil jaune dans l'ouverture (`sun`).
   * plein : silhouette pleine unie (filigrane, grande forme décorative, masque).
   * soleil : l'ouverture de l'arche seule, en jaune de marque.
   */
  variant?: ArcheVariant
  /** Tracé : `embleme` (déduit de l'emblème) ou `marqueur` (défaut, en attente de validation du passage à `embleme`). */
  source?: ArcheSource
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
export function Arche({ variant = "creux", source = "marqueur", sun = true, title, className, ...props }: ArcheProps) {
  const v = canonical(variant)
  const a11y = { role: title ? "img" : undefined, "aria-label": title, "aria-hidden": title ? undefined : true, focusable: "false" as const }
  if (source === "embleme") {
    return (
      <svg viewBox={`${ax} ${ay} ${aw} ${ah}`} className={cn("block h-auto", className)} {...a11y} {...props}>
        {v === "soleil" && <path d={A.ciel} className="fill-accent-sun" />}
        {v === "plein" && <path d={A.dome + A.bande} fill="currentColor" />}
        {v === "creux" && (
          <>
            {sun && <path d={A.ciel} className="fill-accent-sun" />}
            <path d={A.dome + A.ciel + A.bande} fill="currentColor" fillRule="evenodd" />
          </>
        )}
      </svg>
    )
  }
  const geo = v === "plein" ? ARCHE.plein : ARCHE.creux
  const [, , w, h] = geo.viewBox
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("block h-auto", className)} {...a11y} {...props}>
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
