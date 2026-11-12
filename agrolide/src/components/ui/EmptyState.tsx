import * as React from 'react'
import { PlanSoleil } from '@/components/brand'
import { cn } from '@/lib/utils/formatters'

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Icône décorative (lucide-react). */
  icon?: React.ReactNode
  /** Pose le soleil pâle de la marque, qui descend du bord haut (le plan en petit, avec 2 échos) : pour les pages et grandes sections vides. */
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
        'relative flex flex-col items-center overflow-hidden rounded-card border border-dashed border-outline-variant bg-surface-container-low px-6 py-12 text-center',
        className,
      )}
      {...props}
    >
      {arche ? <PlanSoleil x="50%" y="0%" rayon="3.5rem" echos={2} ton="pale" fond="surface-container-low" /> : null}
      {arche ? <span aria-hidden="true" className="block h-16" /> : null}
      {!arche && icon && (
        <span aria-hidden="true" className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-primary-container text-on-primary-container [&>svg]:size-6">
          {icon}
        </span>
      )}
      <h3 className="relative text-title-lg text-on-surface">{title}</h3>
      {description && <p className="relative mt-1.5 max-w-md text-body-md text-on-surface-variant">{description}</p>}
      {action && <div className="relative mt-6">{action}</div>}
    </div>
  )
}
