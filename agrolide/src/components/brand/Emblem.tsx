import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { FORME_PATHS } from "./forme-paths"
import { GEOMETRIE } from "./geometrie"

/**
 * couleur : l'emblème du favicon, aplats de marque (vert, soleil, feuilles) ;
 * noir    : le même dessin en une couleur, noir ;
 * blanc   : le même dessin en une couleur, blanc (sur vert profond, sur photo, en mode sombre) ;
 * mono    : le même dessin à la couleur du texte (`currentColor`), pour un ton de marque ;
 * creux   : le contour de ce dessin (`currentColor`), trait constant à l'écran.
 * En une couleur, le soleil est détaché des collines par un filet blanc d'un demi-trait (31 px du favicon) :
 * sans lui, le dessin se refermerait en silhouette pleine. L'emblème « plein » (silhouette) n'existe plus.
 */
export type EmblemVariant = "couleur" | "noir" | "blanc" | "mono" | "creux"

export interface EmblemProps extends Omit<React.SVGAttributes<SVGSVGElement>, "viewBox"> {
  variant?: EmblemVariant
  /** Épaisseur du contour de la variante `creux`, en pixels d'écran (défaut 1,5). */
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

const MONO = GEOMETRIE.emblemeMono
const MONO_D = MONO.reseau + MONO.soleil
const MONO_FILL: Record<"noir" | "blanc" | "mono", string> = {
  noir: "var(--ag-ref-neutral-0)",
  blanc: "var(--ag-ref-neutral-100)",
  mono: "currentColor",
}

/**
 * Emblème rond du logo (soleil, collines, feuille) en vecteur exact, tracé depuis `Favicon agrolide.png`
 * (`scripts/forme/vectorize.py` pour la couleur, `scripts/forme/primitives.py` pour le soleil détaché).
 * Ne pas recolorer la version `couleur`.
 */
export function Emblem({ variant = "couleur", strokeWidth = 1.5, title, className, ...props }: EmblemProps) {
  const geo = FORME_PATHS["emblem-couleur"]
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
        geo.layers?.map((l) => <path key={l.id} d={l.d} fillRule="evenodd" style={{ fill: LAYER_FILL[l.id] ?? l.fill }} />)}
      {(variant === "noir" || variant === "blanc" || variant === "mono") && <path d={MONO_D} fillRule="evenodd" style={{ fill: MONO_FILL[variant] }} />}
      {variant === "creux" && (
        <path d={MONO_D} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      )}
    </svg>
  )
}
