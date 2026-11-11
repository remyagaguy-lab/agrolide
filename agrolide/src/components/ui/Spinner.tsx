import * as React from 'react'
import { cn } from '@/lib/utils/formatters'

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  /** Texte lu par les lecteurs d'écran. Mettre `null` si le spinner est purement décoratif (ex. dans un bouton déjà nommé). */
  label?: string | null
}

/** Indicateur de chargement. Hérite de la couleur du texte (`currentColor`). Immobile si l'utilisateur réduit les animations. */
export function Spinner({ className, label = 'Chargement', ...props }: SpinnerProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn('size-4 animate-spin motion-reduce:animate-none', className)}
      role={label ? 'status' : undefined}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
