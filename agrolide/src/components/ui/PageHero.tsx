import * as React from 'react'
import { Horizon, Sillons } from '@/components/brand'
import { cn } from '@/lib/utils/formatters'

/** Fond de la section qui suit le héros : l'horizon prend cette couleur. */
export type PageHeroNextTone = 'surface' | 'low' | 'lowest' | 'container'

const nextTones: Record<PageHeroNextTone, string> = {
  surface: 'text-surface',
  low: 'text-surface-container-low',
  lowest: 'text-surface-container-lowest',
  container: 'text-primary-container',
}

export interface PageHeroProps {
  /** Petite étiquette au-dessus du titre (nom de la rubrique). */
  label?: string
  /** Titre de la page : le seul <h1>. */
  title: React.ReactNode
  description?: React.ReactNode
  /** Boutons d'action. Un seul bouton orange par vue : ici, préférer `variant="ghost-dark"`. */
  actions?: React.ReactNode
  nextTone?: PageHeroNextTone
  className?: string
  children?: React.ReactNode
}

/**
 * En-tête de page publique, composé avec la grammaire des formes : bandeau vert profond, sillons de l'emblème en
 * mouvement de coin (haut droite, 10 %), horizon mesuré (les deux collines de l'emblème) vers la section suivante.
 * Titre `headline-md` sur mobile, `display-md` ensuite ; sous-titre plus étroit que le titre (effet de flèche vers les boutons).
 */
export function PageHero({ label, title, description, actions, nextTone = 'surface', className, children }: PageHeroProps) {
  return (
    <section className={cn('relative overflow-hidden bg-surface-brand py-0 text-on-surface-brand', className)}>
      <Sillons coin="haut-droite" opacite={0.1} className="w-[30%] md:w-40 lg:w-80 xl:w-[26rem]" />
      <div className="container relative z-10 pb-12 pt-12 md:pb-16 md:pt-20">
        <div className="max-w-3xl">
          {label && <p className="mb-3 text-label-md uppercase tracking-[0.12em] text-accent-sun">{label}</p>}
          <h1 className="text-headline-md text-balance md:text-display-md">{title}</h1>
          {description && <p className="mt-5 max-w-[28rem] text-body-lg text-balance text-on-surface-brand/85 md:max-w-[30rem]">{description}</p>}
          {actions && <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>}
          {children}
        </div>
      </div>
      <Horizon className={cn('relative z-10', nextTones[nextTone])} />
    </section>
  )
}
