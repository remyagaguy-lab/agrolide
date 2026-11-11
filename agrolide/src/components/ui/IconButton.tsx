import * as React from 'react'
import { cn } from '@/lib/utils/formatters'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Nom accessible OBLIGATOIRE : un bouton sans texte visible doit être nommé. */
  label: string
  variant?: 'standard' | 'tonal' | 'outline'
  children: React.ReactNode
}

/** Bouton icône seule. Cible tactile de 44 px minimum. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = 'standard', className, children, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'ag-state inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-150 ease-standard',
        'disabled:cursor-not-allowed disabled:text-on-surface/38',
        variant === 'standard' && 'text-on-surface-variant',
        variant === 'tonal' && 'bg-primary-container text-on-primary-container',
        variant === 'outline' && 'border border-outline text-on-surface-variant',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
})
