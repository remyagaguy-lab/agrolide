import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { ARCHE } from "./Arche"

export interface ArchPhotoProps {
  /** Chemin de l'image (de préférence WebP, format paysage). */
  src: string
  /** Description de la photo (obligatoire : elle porte l'information). */
  alt: string
  /** Affiche l'arche et la bande autour de la fenêtre (défaut : oui). */
  framed?: boolean
  className?: string
}

/**
 * Photo vue « à travers l'arche » : l'image est découpée par l'ouverture exacte de l'arche de la marque
 * (le même tracé que `Arche variant="creux"`), cerclée de l'arche et de la bande.
 * À réserver aux visuels forts (équipe, terrain, héros de section) : une seule par écran.
 */
export function ArchPhoto({ src, alt, framed = true, className }: ArchPhotoProps) {
  const id = React.useId().replace(/:/g, "")
  const [, , w, h] = ARCHE.creux.viewBox
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={alt} className={cn("block h-auto w-full text-primary", className)}>
      <defs>
        <clipPath id={`${id}-sun`}>
          <path d={ARCHE.soleil.d} />
        </clipPath>
      </defs>
      <path d={ARCHE.soleil.d} className="fill-surface-container-high" />
      <image href={src} x="0" y="0" width={w} height={h} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id}-sun)`} />
      {framed && <path d={ARCHE.creux.d} fill="currentColor" fillRule="evenodd" />}
    </svg>
  )
}
