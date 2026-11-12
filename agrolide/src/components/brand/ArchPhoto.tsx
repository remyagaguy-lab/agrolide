import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { ARCHE, type ArcheSource } from "./Arche"
import { GEOMETRIE } from "./geometrie"

export interface ArchPhotoProps {
  /** Chemin de l'image (de préférence WebP, format paysage). */
  src: string
  /** Description de la photo (obligatoire : elle porte l'information). */
  alt: string
  /** Affiche l'arche et la bande autour de la fenêtre (défaut : oui). */
  framed?: boolean
  /** Tracé : `embleme` (fenêtre = le ciel de l'emblème) ou `marqueur` (défaut actuel). */
  source?: ArcheSource
  /** Cadrage de l'image dans la fenêtre (`preserveAspectRatio`), ex. `xMidYMin slice`. */
  cadrage?: string
  className?: string
}

/**
 * Photo vue « à travers l'arche ». Avec `source="embleme"`, la fenêtre est exactement le ciel de l'emblème
 * (disque intérieur de l'anneau au-dessus des deux collines : IoU 0,985 avec le favicon).
 * À réserver aux visuels forts (terrain, groupe) : une seule par écran.
 */
export function ArchPhoto({ src, alt, framed = true, source = "marqueur", cadrage = "xMidYMid slice", className }: ArchPhotoProps) {
  const id = React.useId().replace(/:/g, "")
  if (source === "embleme") {
    const A = GEOMETRIE.arche
    // sans cadre, la fenêtre seule : cadre serré sur le ciel (son point le plus bas est le creux des collines)
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
        {framed && <path d={A.dome + A.ciel + A.bande} fill="currentColor" fillRule="evenodd" />}
      </svg>
    )
  }
  const [, , w, h] = ARCHE.creux.viewBox
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={alt} className={cn("block h-auto w-full text-primary", className)}>
      <defs>
        <clipPath id={`${id}-sun`}>
          <path d={ARCHE.soleil.d} />
        </clipPath>
      </defs>
      <path d={ARCHE.soleil.d} className="fill-surface-container-high" />
      <image href={src} x="0" y="0" width={w} height={h} preserveAspectRatio={cadrage} clipPath={`url(#${id}-sun)`} />
      {framed && <path d={ARCHE.creux.d} fill="currentColor" fillRule="evenodd" />}
    </svg>
  )
}
