import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { GEOMETRIE } from "./geometrie"

/** @deprecated Remplacé par `EnchochePhoto` (décision du 14/11/2026). Conservé jusqu'à la suppression de l'arche. */
export interface ArchPhotoProps {
  /** Chemin de l'image (de préférence WebP, format paysage). */
  src: string
  /** Description de la photo (obligatoire : elle porte l'information). */
  alt: string
  /** Entoure la fenêtre de l'anneau et des collines du dôme (défaut : non ; le cadre au trait est déconseillé). */
  framed?: boolean
  /** Cadrage de l'image dans la fenêtre (`preserveAspectRatio`), ex. `xMidYMin slice`. */
  cadrage?: string
  className?: string
}

/**
 * Photo vue à travers la FENÊTRE : le ciel exact de l'emblème (disque intérieur de l'anneau au-dessus des deux
 * collines, IoU 0,985 avec le favicon) ; son point le plus bas est le creux en V.
 * À réserver aux visuels forts (terrain, groupe) : une seule par écran.
 */
export function ArchPhoto({ src, alt, framed = false, cadrage = "xMidYMid slice", className }: ArchPhotoProps) {
  const id = React.useId().replace(/:/g, "")
  const A = GEOMETRIE.arche
  const [x, y, w, h] = framed ? A.viewBox : A.cielViewBox
  return (
    <svg viewBox={`${x} ${y} ${w} ${h}`} role="img" aria-label={alt} className={cn("block h-auto w-full text-primary", className)}>
      <defs>
        <clipPath id={`${id}-ciel`}>
          <path d={A.ciel} />
        </clipPath>
      </defs>
      <path d={A.ciel} className="fill-surface-container-high" />
      <image href={src} x={x} y={y} width={w} height={h} preserveAspectRatio={cadrage} clipPath={`url(#${id}-ciel)`} />
      {framed && <path d={A.dome + A.ciel} fill="currentColor" fillRule="evenodd" />}
    </svg>
  )
}
