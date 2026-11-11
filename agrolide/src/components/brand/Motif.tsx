import * as React from "react"
import { cn } from "@/lib/utils/formatters"

export interface MotifProps {
  /**
   * Largeur d'une planche de 8 plants, en px (800 = grand et discret, 400 = dense, 200 = petit encart).
   * Même sens qu'avant la vectorisation : la densité visuelle ne change pas.
   */
  size?: number
  /** Opacité du motif. Reste très faible : il habille, il ne doit jamais gêner la lecture. */
  opacity?: number
  /**
   * mono   : ton sur ton, à la couleur du texte (`currentColor`), trois niveaux (collines, feuilles, contour) ;
   * couleur : verts de marque d'origine (à réserver aux fonds noirs ou très sombres).
   */
  tone?: "mono" | "couleur"
  /**
   * plantes : les plantes seules, sans les collines en sillons (défaut : plus aéré, convient partout, y compris
   *           derrière du texte et dans les petits encarts) ;
   * complet : plantes + collines en sillons (plus riche, pour les grands aplats sans texte dense).
   */
  variant?: "plantes" | "complet"
  className?: string
}

/** Tuile du motif : 204 × 417,5 unités (deux rangées de plants décalées d'une demi-période). */
const TILE = { w: 204, h: 417.5 }

/**
 * Motif de marque (plante qui pousse sur des collines en sillons) en calque décoratif.
 * Tuile vectorielle parfaitement raccordable, tracée depuis `Motif agrolide transparent.png` par
 * `scripts/forme/vectorize_motif.py` (`public/design-assets/motif-plantes-masque.svg`, 14 Ko ; `motif-masque.svg` 27 Ko pour la variante complète ; fichiers mis en cache).
 * En `mono`, le SVG sert de MASQUE : il prend la couleur du texte sur n'importe quelle surface :
 *   - sur vert profond : `text-on-surface-brand` (blanc) ;
 *   - sur fond clair   : `text-primary` (vert).
 * La tuile est dimensionnée en pixels entiers : pas de couture visible entre deux tuiles.
 * À placer dans un parent `relative overflow-hidden` ; le contenu reste au-dessus (`relative z-10`).
 */
export function Motif({ size = 800, opacity = 0.07, tone = "mono", variant = "plantes", className }: MotifProps) {
  const w = Math.max(Math.round(size / 8), 8)
  const h = Math.round((w * TILE.h) / TILE.w)
  const tile = `${w}px ${h}px`
  const base = variant === "complet" ? "/design-assets/motif" : "/design-assets/motif-plantes"
  const couleurUrl = `url('${base}-couleur.svg')`
  const masqueUrl = `url('${base}-masque.svg')`
  if (tone === "couleur") {
    return (
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 z-0", className)}
        style={{ opacity, backgroundImage: couleurUrl, backgroundSize: tile, backgroundRepeat: "repeat" }}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-0 bg-current", className)}
      style={{
        opacity,
        WebkitMaskImage: masqueUrl,
        maskImage: masqueUrl,
        WebkitMaskSize: tile,
        maskSize: tile,
        WebkitMaskRepeat: "repeat",
        maskRepeat: "repeat",
      }}
    />
  )
}
