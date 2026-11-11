import * as React from 'react'
import { cn } from '@/lib/utils/formatters'

export type SectionTone = 'surface' | 'low' | 'lowest' | 'container' | 'brand'

const tones: Record<SectionTone, { box: string; label: string; text: string }> = {
  surface: { box: 'bg-surface text-on-surface', label: 'text-primary', text: 'text-on-surface-variant' },
  low: { box: 'bg-surface-container-low text-on-surface', label: 'text-primary', text: 'text-on-surface-variant' },
  lowest: { box: 'bg-surface-container-lowest text-on-surface', label: 'text-primary', text: 'text-on-surface-variant' },
  container: { box: 'bg-primary-container text-on-primary-container', label: 'text-primary', text: 'text-on-primary-container' },
  brand: { box: 'bg-surface-brand text-on-surface-brand', label: 'text-accent-sun', text: 'text-on-surface-brand/85' },
}

export interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  tone?: SectionTone
  /** Étiquette au-dessus du titre. */
  label?: string
  /** Titre de la section (<h2>). Avec `id`, la section est nommée pour les lecteurs d'écran. */
  title?: React.ReactNode
  description?: React.ReactNode
  /** Centre l'en-tête de section. */
  centered?: boolean
  /** Largeur de lecture réduite (formulaires, textes longs). */
  narrow?: boolean
}

/** Section de page publique : fond par rôle, rythme vertical, en-tête optionnel (étiquette, titre, introduction). */
export function Section({ tone = 'surface', label, title, description, centered, narrow, id, className, children, ...props }: SectionProps) {
  const t = tones[tone]
  const titleId = id && title ? `${id}-titre` : undefined
  return (
    <section id={id} aria-labelledby={titleId} className={cn('scroll-mt-24 py-14 md:py-20', t.box, className)} {...props}>
      <div className={cn('container', narrow && 'max-w-3xl')}>
        {(label || title || description) && (
          <header className={cn('mb-10 max-w-2xl md:mb-12', centered && 'mx-auto text-center')}>
            {label && <p className={cn('mb-2 text-label-md uppercase tracking-[0.1em]', t.label)}>{label}</p>}
            {title && (
              <h2 id={titleId} className="text-headline-md text-balance">
                {title}
              </h2>
            )}
            {description && <p className={cn('mt-3 text-body-lg', t.text)}>{description}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
