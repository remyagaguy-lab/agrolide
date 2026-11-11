'use client'

import * as React from 'react'
import { cn } from '@/lib/utils/formatters'
import { FormField, fieldControlClasses, fieldControlProps, useFieldContext } from './FormField'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, required, ...props },
  ref,
) {
  const ctx = useFieldContext()
  const control = (
    <textarea
      ref={ref}
      required={required}
      className={cn(fieldControlClasses, 'min-h-32 resize-y py-3', className)}
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
