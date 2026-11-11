import * as React from "react"
import { cn } from "@/lib/utils/formatters"

/**
 * L'« arche » agrolide : le soleil levant au-dessus de collines/sillons, tirée du marqueur de la marque
 * (`Branding/Identité/Marqueurs`) et des vecteurs `public/design-assets/*.svg`.
 * Géométrie unique (viewBox 200×120) partagée par Arche, ArchPhoto et les séparateurs.
 */
export const ARCHE_PATHS = {
  /** Anneau en arc (le « cadre » du soleil). */
  ring: "M 12 90 A 90 90 0 0 1 185 80 Q 175 75 165 72 A 75 75 0 0 0 25 80 Q 18 85 12 90 Z",
  /** Première colline (bande épaisse). */
  hill: "M 5 95 Q 80 60 195 85 Q 185 92 175 92 Q 80 72 15 105 Z",
  /** Seconde colline (bande fine, en bas). */
  furrow: "M 40 115 Q 90 90 190 98 Q 185 103 175 104 Q 90 98 45 120 Z",
  /** Disque solaire posé sur la colline. */
  sun: "M 35 77 A 63 63 0 0 1 155 70 Q 110 50 35 77 Z",
  /** Silhouette pleine, sans trous (filigrane, puce, masque). */
  silhouette: "M 12 90 A 90 90 0 0 1 185 80 Q 190 85 190 98 Q 90 98 45 120 Q 20 110 12 90 Z",
} as const

export type ArcheVariant = "frame" | "solid" | "sun"

export interface ArcheProps extends Omit<React.SVGAttributes<SVGSVGElement>, "viewBox"> {
  /**
   * frame : arc + collines en contour (couleur du texte courant) ; avec `sun` le soleil jaune est dessiné dedans.
   * solid : silhouette pleine unie (filigrane, grande forme décorative).
   * sun   : le disque solaire seul.
   */
  variant?: ArcheVariant
  /** Dessine le soleil (couleur de marque jaune) dans le cadre. */
  sun?: boolean
  /** Alternative textuelle. Sans elle, la forme est décorative (masquée aux lecteurs d'écran). */
  title?: string
}

/**
 * Forme de marque en SVG en ligne. Elle prend la couleur du texte (`currentColor`) :
 * `text-primary` (vert), `text-on-surface-brand` (blanc sur vert), `text-accent-sun` (jaune)…
 */
export function Arche({ variant = "frame", sun = true, title, className, ...props }: ArcheProps) {
  return (
    <svg
      viewBox="0 0 200 120"
      className={cn("block h-auto", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {variant === "sun" && <path d={ARCHE_PATHS.sun} className="fill-accent-sun" />}
      {variant === "solid" && <path d={ARCHE_PATHS.silhouette} fill="currentColor" />}
      {variant === "frame" && (
        <>
          {sun && <path d={ARCHE_PATHS.sun} className="fill-accent-sun" />}
          <path d={ARCHE_PATHS.ring} fill="currentColor" />
          <path d={ARCHE_PATHS.hill} fill="currentColor" />
          <path d={ARCHE_PATHS.furrow} fill="currentColor" />
        </>
      )}
    </svg>
  )
}
