'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/formatters'

/**
 * Boîte de dialogue (Radix) : focus piégé, Échap pour fermer, retour du focus au déclencheur.
 * Sur mobile elle se présente comme une feuille ancrée en bas ; à partir de 640 px, centrée.
 * Toujours fournir <ModalTitle> (nom accessible) ; <ModalDescription> pour le contexte.
 */
export const Modal = DialogPrimitive.Root
export const ModalTrigger = DialogPrimitive.Trigger
export const ModalPortal = DialogPrimitive.Portal
export const ModalClose = DialogPrimitive.Close

export const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-[var(--ag-sys-scrim)] data-[state=open]:animate-[ag-fade-in_250ms_var(--ag-sys-motion-easing-standard)]',
      className,
    )}
    {...props}
  />
))
ModalOverlay.displayName = 'ModalOverlay'

export const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 flex max-h-[90dvh] w-full flex-col gap-4 overflow-y-auto border border-outline-variant bg-surface-container-lowest p-6 text-on-surface shadow-elev-4',
        'inset-x-0 bottom-0 rounded-t-sheet',
        'sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-panel',
        'data-[state=open]:animate-[ag-rise-in_250ms_var(--ag-sys-motion-easing-decelerate)]',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        aria-label="Fermer"
        className="ag-state absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-full text-on-surface-variant"
      >
        <X className="size-5" aria-hidden="true" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </ModalPortal>
))
ModalContent.displayName = 'ModalContent'

export function ModalHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 pr-10', className)} {...props} />
}

export function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />
}

export const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn('text-headline-sm text-on-surface', className)} {...props} />
))
ModalTitle.displayName = 'ModalTitle'

export const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-body-md text-on-surface-variant', className)} {...props} />
))
ModalDescription.displayName = 'ModalDescription'
