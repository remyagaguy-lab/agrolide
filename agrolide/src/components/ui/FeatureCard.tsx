import * as React from 'react'
import { Card } from './Card'
import { cn } from '@/lib/utils/formatters'

export interface FeatureCardProps {
  /** Icône lucide-react (décorative). */
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  className?: string
}

/** Carte « un argument » : pastille d'icône, titre, une à deux phrases. À poser dans une grille sous un <h2>. */
export function FeatureCard({ icon, title, children, className }: FeatureCardProps) {
  return (
    <Card className={cn('h-full', className)}>
      <span
        aria-hidden="true"
        className="mb-4 inline-flex size-12 items-center justify-center rounded-control bg-primary-container text-on-primary-container [&>svg]:size-6"
      >
        {icon}
      </span>
      <h3 className="text-title-lg text-on-surface">{title}</h3>
      <p className="mt-2 text-body-md text-on-surface-variant">{children}</p>
    </Card>
  )
}
