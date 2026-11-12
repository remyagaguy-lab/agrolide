import * as React from 'react'
import { Arche } from '@/components/brand'
import { cn } from '@/lib/utils/formatters'

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Icône décorative (lucide-react). */
  icon?: React.ReactNode
  /** Pose l'arche de la marque (le soleil levant) au-dessus du texte : pour les pages et grandes sections vides. */
  arche?: boolean
  title: React.ReactNode
  /** Explique pourquoi c'est vide et ce que la personne peut faire. */
  description?: React.ReactNode
  /** Action principale (Button). */
  action?: React.ReactNode
}

/** État vide : liste sans résultat, section pas encore alimentée. Toujours proposer une suite logique. */
export function EmptyState({ icon, arche, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-card border border-dashed border-outline-variant bg-surface-container-low px-6 py-12 text-center',
        className,
      )}
      {...props}
    >
      {arche ? <Arche variant="creux" className="mb-5 w-28 text-primary/70" /> : null}
      {!arche && icon && (
        <span aria-hidden="true" className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-primary-container text-on-primary-container [&>svg]:size-6">
          {icon}
        </span>
      )}
      <h3 className="text-title-lg text-on-surface">{title}</h3>
      {description && <p className="mt-1.5 max-w-md text-body-md text-on-surface-variant">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
