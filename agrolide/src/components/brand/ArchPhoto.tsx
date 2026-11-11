import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { ARCHE_PATHS } from "./Arche"

export interface ArchPhotoProps {
  /** Chemin de l'image (de préférence WebP, format paysage). */
  src: string
  /** Description de la photo (obligatoire : elle porte l'information). */
  alt: string
  /** Affiche l'arche et les collines autour de la fenêtre (défaut : oui). */
  framed?: boolean
  className?: string
}

/**
 * Photo vue « à travers le soleil » : l'image est découpée par le disque solaire de la marque
 * (principe du « passe-partout » de `design-assets/3_Passe_Partout_Fenetre.svg`), cerclée de l'arche et des collines.
 * À réserver aux visuels forts (équipe, terrain, héros de section) : une seule par écran.
 */
export function ArchPhoto({ src, alt, framed = true, className }: ArchPhotoProps) {
  const id = React.useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 200 120" role="img" aria-label={alt} className={cn("block h-auto w-full text-primary", className)}>
      <defs>
        <clipPath id={`${id}-sun`}>
          <path d={ARCHE_PATHS.sun} />
        </clipPath>
      </defs>
      <path d={ARCHE_PATHS.sun} className="fill-surface-container-high" />
      <image href={src} x="30" y="26" width="130" height="56" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id}-sun)`} />
      {framed && (
        <>
          <path d={ARCHE_PATHS.ring} fill="currentColor" />
          <path d={ARCHE_PATHS.hill} fill="currentColor" />
          <path d={ARCHE_PATHS.furrow} fill="currentColor" />
        </>
      )}
    </svg>
  )
}
