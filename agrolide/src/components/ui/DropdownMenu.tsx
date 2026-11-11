'use client'

import * as React from 'react'
import * as MenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils/formatters'

/** Menu déroulant (Radix) : flèches, Échap, recherche par lettre, focus rendu au déclencheur. */
export const DropdownMenu = MenuPrimitive.Root
export const DropdownMenuTrigger = MenuPrimitive.Trigger

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>
>(({ className, sideOffset = 8, align = 'end', ...props }, ref) => (
  <MenuPrimitive.Portal>
    <MenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      align={align}
      className={cn(
        'z-50 w-64 overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest p-1.5 text-on-surface shadow-elev-3',
        'data-[state=open]:animate-[ag-fade-in_150ms_var(--ag-sys-motion-easing-decelerate)]',
        className,
      )}
      {...props}
    />
  </MenuPrimitive.Portal>
))
DropdownMenuContent.displayName = 'DropdownMenuContent'

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item> & { destructive?: boolean }
>(({ className, destructive, ...props }, ref) => (
  <MenuPrimitive.Item
    ref={ref}
    className={cn(
      'flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-control px-3 py-2 text-body-md outline-none',
      'data-[highlighted]:bg-surface-container-high data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
      destructive ? 'text-error data-[highlighted]:bg-error-container data-[highlighted]:text-on-error-container' : 'text-on-surface',
      className,
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = 'DropdownMenuItem'

export const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Label ref={ref} className={cn('px-3 py-2', className)} {...props} />
))
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

export const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Separator ref={ref} className={cn('-mx-1.5 my-1.5 h-px bg-outline-variant', className)} {...props} />
))
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'
