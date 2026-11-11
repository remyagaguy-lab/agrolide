import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { FORME_PATHS } from "./forme-paths"

export type EmblemVariant = "couleur" | "plein" | "creux"

export interface EmblemProps extends Omit<React.SVGAttributes<SVGSVGElement>, "viewBox"> {
  /**
   * couleur : l'emblème du favicon, aplats de marque (vert, soleil, feuilles) ;
   * plein   : silhouette monochrome (`currentColor`) ;
   * creux   : contour monochrome (`currentColor`), trait de 3 unités sur 1044 comme `favicon-contour-*`.
   */
  variant?: EmblemVariant
  /** Épaisseur du trait de la variante `creux`, en unités du dessin (1044 de large). Défaut : 3 (tracé d'origine). */
  strokeWidth?: number
  /** Alternative textuelle. Sans elle, l'emblème est décoratif. */
  title?: string
}

/** Couleurs de marque par référence aux jetons (les tons de feuille viennent du tracé : mesurés sur la source). */
const LAYER_FILL: Record<string, string | undefined> = {
  vert: "var(--ag-ref-green-35)",
  soleil: "var(--ag-ref-orange-70)",
  "soleil-clair": "var(--ag-ref-sun-60)",
}

/**
 * Emblème rond du logo (soleil, collines, feuille) en vecteur exact, tracé depuis `Favicon agrolide.png`
 * par `scripts/forme/vectorize.py`. Ne pas recolorer la version `couleur`.
 */
export function Emblem({ variant = "couleur", strokeWidth, title, className, ...props }: EmblemProps) {
  const geo = variant === "couleur" ? FORME_PATHS["emblem-couleur"] : variant === "plein" ? FORME_PATHS["emblem-plein"] : FORME_PATHS["emblem-creux"]
  const [, , w, h] = geo.viewBox
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("block h-auto", variant === "creux" && "overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {variant === "couleur" &&
        geo.layers?.map((l) => (
          <path key={l.id} d={l.d} fillRule="evenodd" style={{ fill: LAYER_FILL[l.id] ?? l.fill }} />
        ))}
      {variant === "plein" && <path d={geo.d} fill="currentColor" fillRule="evenodd" />}
      {variant === "creux" && (
        <path d={geo.d} fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? geo.stroke ?? 3} strokeLinejoin="round" />
      )}
    </svg>
  )
}
