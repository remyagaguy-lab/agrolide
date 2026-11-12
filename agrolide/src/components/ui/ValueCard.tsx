import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Card } from './Card'
import { cn } from '@/lib/utils/formatters'

export interface ValueCardProps {
  /** Icône lucide-react (décorative). */
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

/**
 * Carte « une valeur » : version centrée de `FeatureCard`, pour une rangée de 3 à 5 principes (valeurs, engagements).
 * La pastille passe au vert plein au survol de la carte.
 */
export function ValueCard({ icon: Icon, title, description, className }: ValueCardProps) {
  return (
    <Card className={cn('group h-full text-center hover:border-primary', className)}>
      <span
        aria-hidden="true"
        className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-control bg-primary-container text-on-primary-container transition-colors duration-150 ease-standard group-hover:bg-primary group-hover:text-on-primary"
      >
        <Icon className="size-6" />
      </span>
      <h3 className="text-title-lg text-on-surface">{title}</h3>
      <p className="mt-2 text-body-sm text-on-surface-variant">{description}</p>
    </Card>
  )
}
