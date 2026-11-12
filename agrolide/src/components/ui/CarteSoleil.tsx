import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PlanSoleil } from '@/components/brand'
import { cn } from '@/lib/utils/formatters'

export interface CarteSoleilProps {
  /** Photo de la carte (le sujet ne doit pas être sous le soleil). */
  image: { src: string; alt: string }
  /** Petite ligne au-dessus du titre (catégorie · durée). */
  categorie: string
  titre: string
  /** coin : quart de soleil en bas à gauche, texte à gauche (sujet à droite) ; centre : le soleil monte du bord bas, texte centré (sujet en haut). */
  placement?: 'coin' | 'centre'
  href?: string
  className?: string
}

/**
 * Carte « titre dans le soleil » : une photo, et le soleil clair de la marque (`PlanSoleil ton="clair"`) qui porte le titre.
 * Pour les formations à la une, pas pour les listes denses. 3 échos translucides en thème clair, aucun en sombre
 * (un voile sombre éteindrait la photo, qui ne change pas avec le thème). Tailles en `cqw` : la composition suit la largeur de la carte.
 */
export function CarteSoleil({ image, categorie, titre, placement = 'coin', href, className }: CarteSoleilProps) {
  const coin = placement === 'coin'
  const contenu = (
    <>
      <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
      <PlanSoleil
        ton="clair"
        x={coin ? '-4cqw' : '50%'}
        y={coin ? 'calc(100% + 4cqw)' : 'calc(100% + 7cqw)'}
        rayon={coin ? '80cqw' : '65cqw'}
        pas={14}
      />
      <div className={cn('absolute', coin ? 'bottom-[8cqw] left-[7cqw] max-w-[56cqw]' : 'inset-x-0 bottom-[9cqw] px-8 text-center')}>
        <p className="text-label-sm uppercase tracking-[0.1em] text-primary">{categorie}</p>
        <h3 className={cn('mt-1.5 text-title-lg text-on-surface', !coin && 'mx-auto max-w-[15rem]')}>{titre}</h3>
      </div>
    </>
  )
  const classes = cn('@container relative block aspect-[4/5] overflow-hidden rounded-card bg-surface-container shadow-elev-1', className)
  return href ? (
    <Link href={href} className={cn(classes, 'ag-state')}>{contenu}</Link>
  ) : (
    <article className={classes}>{contenu}</article>
  )
}
