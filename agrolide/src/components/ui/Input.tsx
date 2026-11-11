'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/formatters'
import { FormField, fieldControlClasses, fieldControlProps, useFieldContext } from './FormField'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Raccourci : enveloppe le champ dans un FormField avec ce libellé. */
  label?: string
  hint?: string
  error?: string
  /** `sm` : 40 px, pour les filtres et tableaux (desktop). */
  density?: 'md' | 'sm'
}

/**
 * Champ de saisie. Deux usages :
 *  - <Input label="E-mail" error={…} />          (raccourci)
 *  - <FormField label="E-mail"><Input /></FormField> (composition)
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, density = 'md', className, required, ...props },
  ref,
) {
  const ctx = useFieldContext()
  const control = (
    <input
      ref={ref}
      required={required}
      className={cn(fieldControlClasses, density === 'sm' ? 'h-10' : 'h-12', className)}
      {...fieldControlProps(ctx)}
      {...props}
    />
  )
  if (label && !ctx) {
    return (
      <FormField label={label} hint={hint} error={error} required={required} id={props.id}>
        {control}
      </FormField>
    )
  }
  return control
})
