import * as React from 'react'
import { cn } from '@/lib/utils/formatters'

export interface StepListItem {
  title: string
  description: React.ReactNode
}

export interface StepListProps {
  items: StepListItem[]
  className?: string
}

/** Étapes numérotées d'un parcours (liste ordonnée : l'ordre est lu par les lecteurs d'écran). */
export function StepList({ items, className }: StepListProps) {
  return (
    <ol className={cn('grid gap-8 md:gap-6', items.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3', className)}>
      {items.map((item, i) => (
        <li key={item.title} className="flex gap-4 md:flex-col">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-title-md text-on-primary"
          >
            {i + 1}
          </span>
          <div>
            <h3 className="text-title-lg text-on-surface">{item.title}</h3>
            <p className="mt-1.5 text-body-md text-on-surface-variant">{item.description}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
