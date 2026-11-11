'use client'

import * as React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils/formatters'

interface FieldContextValue {
  id: string
  hintId: string
  errorId: string
  hasHint: boolean
  invalid: boolean
  required?: boolean
}

const FieldContext = React.createContext<FieldContextValue | null>(null)

/** Lit le contexte d'un FormField (id, aria-describedby, état d'erreur). Renvoie null hors FormField. */
export function useFieldContext() {
  return React.useContext(FieldContext)
}

/** Propriétés ARIA à poser sur le contrôle (input, select, textarea) quand il est dans un FormField. */
export function fieldControlProps(ctx: FieldContextValue | null) {
  if (!ctx) return {}
  const describedBy = [ctx.hasHint ? ctx.hintId : null, ctx.invalid ? ctx.errorId : null].filter(Boolean).join(' ')
  return {
    id: ctx.id,
    'aria-invalid': ctx.invalid || undefined,
    'aria-describedby': describedBy || undefined,
    'aria-required': ctx.required || undefined,
  }
}

export function Label({ className, children, required, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label className={cn('mb-1.5 block text-label-lg text-on-surface', className)} {...props}>
      {children}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-error">
          *
        </span>
      )}
    </label>
  )
}

export interface FormFieldProps {
  /** Libellé TOUJOURS visible (un placeholder n'est pas un libellé). */
  label: string
  /** Aide sous le champ (format attendu, exemple). */
  hint?: string
  /** Message d'erreur : le champ passe en erreur et le message est annoncé aux lecteurs d'écran. */
  error?: string
  required?: boolean
  id?: string
  className?: string
  children: React.ReactNode
}

/**
 * Associe libellé, champ, aide et erreur.
 * Le contrôle enfant (Input, Textarea, NativeSelect) récupère automatiquement id et attributs ARIA.
 */
export function FormField({ label, hint, error, required, id, className, children }: FormFieldProps) {
  const auto = React.useId()
  const fieldId = id ?? `f${auto.replace(/:/g, '')}`
  const ctx: FieldContextValue = {
    id: fieldId,
    hintId: `${fieldId}-hint`,
    errorId: `${fieldId}-error`,
    hasHint: Boolean(hint),
    invalid: Boolean(error),
    required,
  }
  return (
    <FieldContext.Provider value={ctx}>
      <div className={cn('w-full', className)}>
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
        {children}
        {hint && (
          <p id={ctx.hintId} className="mt-1.5 text-body-sm text-on-surface-muted">
            {hint}
          </p>
        )}
        {error && (
          <p id={ctx.errorId} role="alert" className="mt-1.5 flex items-start gap-1.5 text-body-sm text-error">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>
    </FieldContext.Provider>
  )
}

/** Classes communes aux champs de saisie. */
export const fieldControlClasses =
  'block w-full rounded-control border border-outline bg-surface-container-lowest px-4 text-body-md text-on-surface ' +
  'placeholder:text-on-surface-muted transition-[border-color,box-shadow] duration-150 ease-standard ' +
  'hover:border-on-surface focus-visible:border-primary ' +
  'disabled:cursor-not-allowed disabled:border-on-surface/12 disabled:bg-on-surface/4 disabled:text-on-surface/38 ' +
  'aria-[invalid=true]:border-error aria-[invalid=true]:hover:border-error'
