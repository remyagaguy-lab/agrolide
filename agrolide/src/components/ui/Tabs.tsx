'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils/formatters'

/** Onglets (Radix) : navigation aux flèches, rôles ARIA tablist/tab/tabpanel gérés. */
export const Tabs = TabsPrimitive.Root

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('flex gap-1 overflow-x-auto border-b border-outline-variant [scrollbar-width:none]', className)}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'ag-state relative -mb-px inline-flex min-h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-t-control border-b-2 border-transparent px-4 text-label-lg text-on-surface-variant',
      'transition-colors duration-150 ease-standard disabled:pointer-events-none disabled:opacity-40',
      'data-[state=active]:border-primary data-[state=active]:text-primary',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn('mt-6', className)} {...props} />
))
TabsContent.displayName = 'TabsContent'
