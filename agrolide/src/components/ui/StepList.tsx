import * as React from 'react'
import { ARCHE } from "@/components/brand/Arche"
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
          {/* Puce : le soleil de l'arche de la marque, numéroté (décoratif : l'ordre est porté par la liste ordonnée). */}
          <span aria-hidden="true" className="relative flex w-20 shrink-0 self-start">
            <svg viewBox="149 131 1671 936" className="block h-auto w-full" focusable="false"><path d={ARCHE.soleil.d} className="fill-accent-sun" /></svg>
            <span className="absolute inset-x-0 bottom-[20%] pl-[4%] text-center text-title-lg leading-none text-on-accent">{i + 1}</span>
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
