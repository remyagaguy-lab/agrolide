import * as React from 'react'
import { HorizonDivider, Motif } from '@/components/brand'
import { cn } from '@/lib/utils/formatters'

/** Fond de la section qui suit le héros : la courbe d'horizon prend cette couleur. */
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
 * En-tête de page publique : bandeau vert profond, motif plante discret, courbe d'horizon vers la section suivante.
 * Sans dégradé ni effet de flou. Le contenu de la page commence juste après.
 */
export function PageHero({ label, title, description, actions, nextTone = 'surface', className, children }: PageHeroProps) {
  return (
    <section className={cn('relative overflow-hidden bg-surface-brand pb-0 pt-12 text-on-surface-brand md:pt-16 lg:pt-20', className)}>
      <Motif size={800} opacity={0.05} className="text-on-surface-brand" />
      <div className="container relative z-10 pb-12 md:pb-16">
        <div className="max-w-3xl">
          {label && <p className="mb-3 text-label-md uppercase tracking-[0.12em] text-accent-sun">{label}</p>}
          <h1 className="text-display-md text-balance">{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-body-lg text-on-surface-brand/85">{description}</p>}
          {actions && <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>}
          {children}
        </div>
      </div>
      <HorizonDivider className={cn('relative z-10', nextTones[nextTone])} />
    </section>
  )
}
