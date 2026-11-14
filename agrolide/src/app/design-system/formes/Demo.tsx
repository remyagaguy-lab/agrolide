import * as React from 'react'
import { cn } from '@/lib/utils/formatters'
import { FORMES_ALTERNATIVES, type FormatId, type FormeId } from './formes-alternatives'

/**
 * Pièces de démonstration des formes alternatives à l'arche (page /design-system/formes).
 * Les tracés viennent de scripts/forme/formes_alternatives.py (fichier généré) ; les couleurs sont des rôles du
 * design system. Rien ici n'est utilisé ailleurs sur le site.
 */

export const PHOTOS = {
  portrait: { src: '/hero-accueil-hd.webp', alt: 'Une agricultrice souriante accroupie devant un chou géant dans un champ', cadrage: 'xMaxYMid slice' },
  paysage: { src: '/hero-background.webp', alt: 'Une agricultrice souriante porte une caisse de salades dans une serre', cadrage: 'xMidYMid slice' },
  vignette: {
    src: '/images/articles/transformer-localement-7-opportunites-agrobusiness-autour-du-manioc.jpg',
    alt: 'Racines de manioc dans une tranchée de terre rouge',
    cadrage: 'xMidYMid slice',
  },
} as const

/** Fenêtre d'image : la photo vue à travers la forme (portrait ou paysage). */
export function FenetreForme({
  forme,
  format,
  photo,
  soleil = false,
  className,
}: {
  forme: FormeId
  format: 'portrait' | 'paysage'
  photo: { src: string; alt: string; cadrage: string }
  /** Quart de soleil logé dans l'encoche (forme « encoche » seulement). */
  soleil?: boolean
  className?: string
}) {
  const id = React.useId().replace(/:/g, '')
  const F = FORMES_ALTERNATIVES[forme][format]
  return (
    <svg viewBox={`0 0 ${F.w} ${F.h}`} role="img" aria-label={photo.alt} className={cn('block h-auto w-full', className)}>
      <defs>
        <clipPath id={`${id}-f`}>
          <path d={F.d} />
        </clipPath>
      </defs>
      <path d={F.d} className="fill-surface-container-high" />
      <image href={photo.src} x={0} y={0} width={F.w} height={F.h} preserveAspectRatio={photo.cadrage} clipPath={`url(#${id}-f)`} />
      {soleil && F.compagnon && <circle cx={F.compagnon.cx} cy={F.compagnon.cy} r={F.compagnon.r} className="fill-accent-sun" />}
    </svg>
  )
}

/** Pastille de chiffre : la forme porte un chiffre ou un jour, à son centre optique (plus grand cercle inscrit). */
export function PastilleForme({
  forme,
  ton = 'soleil',
  children,
  className,
}: {
  forme: FormeId
  ton?: 'soleil' | 'marque'
  children: React.ReactNode
  className?: string
}) {
  const F = FORMES_ALTERNATIVES[forme].pastille
  return (
    <span className={cn('@container relative inline-block w-16 shrink-0', className)}>
      <svg viewBox={`0 0 ${F.w} ${F.h}`} aria-hidden="true" focusable="false" className={cn('block h-auto w-full', ton === 'soleil' ? 'fill-accent-sun' : 'fill-primary')}>
        <path d={F.d} />
      </svg>
      <span
        className={cn(
          'absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-[30cqw] font-extrabold leading-none tabular-nums [text-box:trim-both_cap_alphabetic]',
          ton === 'soleil' ? 'text-surface-brand' : 'text-on-primary',
        )}
        style={{ left: `${F.inscrit[0]}%`, top: `${F.inscrit[1]}%` }}
      >
        {children}
      </span>
    </span>
  )
}

/** Grande vignette : photo dans la forme, dégradé de base et titre posé dans la plage sûre mesurée par le script. */
export function VignetteForme({
  forme,
  photo,
  etiquette,
  titre,
  className,
}: {
  forme: FormeId
  photo: { src: string; alt: string; cadrage: string }
  etiquette: string
  titre: string
  className?: string
}) {
  const id = React.useId().replace(/:/g, '')
  const F = FORMES_ALTERNATIVES[forme].vignette
  const [x0, x1] = F.texte ?? [6, 94]
  return (
    <div className={cn('relative', className)}>
      <svg viewBox={`0 0 ${F.w} ${F.h}`} role="img" aria-label={photo.alt} className="block h-auto w-full">
        <defs>
          <clipPath id={`${id}-f`}>
            <path d={F.d} />
          </clipPath>
          <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--ag-sys-color-surface-brand)', stopOpacity: 0 }} />
            <stop offset="1" style={{ stopColor: 'var(--ag-sys-color-surface-brand)', stopOpacity: 0.92 }} />
          </linearGradient>
        </defs>
        <path d={F.d} className="fill-surface-container-high" />
        <g clipPath={`url(#${id}-f)`}>
          <image href={photo.src} x={0} y={0} width={F.w} height={F.h} preserveAspectRatio={photo.cadrage} />
          <rect x={0} y={F.h * 0.38} width={F.w} height={F.h * 0.62} fill={`url(#${id}-g)`} />
        </g>
      </svg>
      <div className="absolute text-on-surface-brand" style={{ left: `${x0}%`, width: `${x1 - x0}%`, bottom: '9%' }}>
        <p className="text-label-sm uppercase tracking-[0.12em] text-accent-sun">{etiquette}</p>
        <p className="mt-1 text-title-md text-balance">{titre}</p>
      </div>
    </div>
  )
}

export type { FormatId, FormeId }
