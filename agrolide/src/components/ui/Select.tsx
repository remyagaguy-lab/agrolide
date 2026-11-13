'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cn } from '@/lib/utils/formatters'
import { fieldControlClasses, fieldControlProps, useFieldContext } from './FormField'

import { Check, ChevronDown } from "@/components/ui/icons"
/**
 * NativeSelect : <select> natif stylé. À préférer (mobile : sélecteur du système, accessible d'office).
 * Select (Radix) : liste personnalisée, pour les cas riches (icônes, groupes, recherche).
 */
export const NativeSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function NativeSelect({ className, children, ...props }, ref) {
    const ctx = useFieldContext()
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(fieldControlClasses, 'h-12 appearance-none pr-11', className)}
          {...fieldControlProps(ctx)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-on-surface-variant" aria-hidden="true" />
      </div>
    )
  },
)

export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const ctx = useFieldContext()
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        fieldControlClasses,
        'flex h-12 items-center justify-between gap-2 text-left data-[placeholder]:text-on-surface-muted',
        className,
      )}
      {...fieldControlProps(ctx)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-5 shrink-0 text-on-surface-variant" aria-hidden="true" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = 'SelectTrigger'

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        'relative z-50 max-h-72 min-w-32 overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest text-on-surface shadow-elev-3',
        'data-[state=open]:animate-[ag-fade-in_150ms_var(--ag-sys-motion-easing-decelerate)]',
        position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn('p-1', position === 'popper' && 'w-full min-w-[var(--radix-select-trigger-width)]')}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = 'SelectContent'

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex min-h-11 w-full cursor-pointer select-none items-center rounded-control py-2 pl-9 pr-3 text-body-md outline-none',
      'data-[highlighted]:bg-primary-container data-[highlighted]:text-on-primary-container data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2.5 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4" aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = 'SelectItem'
