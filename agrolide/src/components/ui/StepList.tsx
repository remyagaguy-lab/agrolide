import * as React from 'react'
import { EncocheBadge } from "@/components/brand/Encoche"
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
          {/* Puce : l'encoche solaire de la marque, numérotée au centre optique (décoratif : l'ordre est porté par la liste ordonnée). */}
          <span aria-hidden="true" className="flex shrink-0 self-start">
            <EncocheBadge className="w-20">{i + 1}</EncocheBadge>
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
