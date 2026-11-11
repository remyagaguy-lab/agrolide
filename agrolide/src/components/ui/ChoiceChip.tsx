import * as React from 'react'
import { cn } from '@/lib/utils/formatters'

export interface ChoiceChipProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  type?: 'radio' | 'checkbox'
  children: React.ReactNode
}

/**
 * Choix présenté en pastille (montants, modes de paiement, types). Le contrôle natif (radio ou case à cocher)
 * reste dans le DOM : clavier (flèches), lecteurs d'écran et formulaires fonctionnent d'origine.
 * Cible tactile de 48 px minimum. À regrouper dans un <fieldset> avec une <legend>.
 */
export const ChoiceChip = React.forwardRef<HTMLInputElement, ChoiceChipProps>(function ChoiceChip(
  { type = 'radio', className, children, disabled, ...props },
  ref,
) {
  return (
    <label className={cn('relative block', disabled ? 'cursor-not-allowed' : 'cursor-pointer', className)}>
      <input ref={ref} type={type} disabled={disabled} className="peer sr-only" {...props} />
      <span
        className={cn(
          'flex min-h-12 items-center justify-center gap-2 rounded-control border border-outline bg-surface-container-lowest px-4 py-2 text-center text-label-lg text-on-surface',
          'transition-[background-color,border-color,box-shadow] duration-150 ease-standard hover:border-on-surface',
          'peer-checked:border-primary peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:shadow-[inset_0_0_0_1px_var(--ag-sys-color-primary)]',
          'peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring',
          'peer-disabled:border-on-surface/12 peer-disabled:bg-on-surface/4 peer-disabled:text-on-surface/38 peer-disabled:hover:border-on-surface/12',
        )}
      >
        {children}
      </span>
    </label>
  )
})
