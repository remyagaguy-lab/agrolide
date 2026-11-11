import * as React from "react"
import { cn } from "@/lib/utils/formatters"

export interface MotifProps {
  /**
   * Taille d'une tuile en px (800 = grand et discret, 400 = dense, 200 = petit encart).
   */
  size?: number
  /** Opacité du motif. Reste très faible : il habille, il ne doit jamais gêner la lecture. */
  opacity?: number
  className?: string
}

/**
 * Motif de marque (plante : tige et deux feuilles) en calque décoratif.
 * Dessiné à partir de l'image `public/images/motif-transparent.webp` utilisée comme MASQUE : il prend donc
 * la couleur du texte (`currentColor`), sur n'importe quelle surface :
 *   - sur vert profond : `text-on-surface-brand` (blanc) ;
 *   - sur fond clair   : `text-primary` (vert).
 * À placer dans un parent `relative overflow-hidden` ; le contenu reste au-dessus (`relative z-10`).
 */
export function Motif({ size = 800, opacity = 0.07, className }: MotifProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-0 bg-current", className)}
      style={{
        opacity,
        WebkitMaskImage: "url('/images/motif-transparent.webp')",
        maskImage: "url('/images/motif-transparent.webp')",
        WebkitMaskSize: `${size}px`,
        maskSize: `${size}px`,
        WebkitMaskRepeat: "repeat",
        maskRepeat: "repeat",
      }}
    />
  )
}
