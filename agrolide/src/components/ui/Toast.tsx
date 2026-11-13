'use client'

import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { cn } from '@/lib/utils/formatters'

import { AlertTriangle, CheckCircle2, Info, X } from "@/components/ui/icons"
export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

export interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
  /** Durée d'affichage en ms (défaut 6 s ; 10 s pour une erreur). `0` = reste jusqu'à fermeture. */
  duration?: number
}

interface ToastItem extends ToastOptions {
  id: number
}

const ToastContext = React.createContext<{ toast: (options: ToastOptions) => void } | null>(null)

/** Affiche un message éphémère : `const { toast } = useToast(); toast({ title: 'Profil enregistré', variant: 'success' })` */
export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast doit être utilisé dans <ToastProvider>.')
  return ctx
}

const icons = { info: Info, success: CheckCircle2, warning: AlertTriangle, error: AlertTriangle }
const iconTone: Record<ToastVariant, string> = {
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
}

/** À placer une fois dans la mise en page. Les messages sont annoncés par les lecteurs d'écran (aria-live). */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([])
  const counter = React.useRef(0)

  const toast = React.useCallback((options: ToastOptions) => {
    counter.current += 1
    const id = counter.current
    setItems((prev) => [...prev.slice(-3), { ...options, id }])
  }, [])

  const remove = (id: number) => setItems((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider label="Notification" swipeDirection="right">
        {children}
        {items.map(({ id, title, description, variant = 'info', duration }) => {
          const Icon = icons[variant]
          return (
            <ToastPrimitive.Root
              key={id}
              type={variant === 'error' ? 'foreground' : 'background'}
              duration={duration === 0 ? Infinity : (duration ?? (variant === 'error' ? 10000 : 6000))}
              onOpenChange={(open) => {
                if (!open) remove(id)
              }}
              className={cn(
                'flex items-start gap-3 rounded-card border border-outline-variant bg-inverse-surface p-4 text-inverse-on-surface shadow-elev-3',
                'data-[state=open]:animate-[ag-slide-in_250ms_var(--ag-sys-motion-easing-decelerate)]',
              )}
            >
              <Icon className={cn('mt-0.5 size-5 shrink-0', iconTone[variant])} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <ToastPrimitive.Title className="text-title-sm">{title}</ToastPrimitive.Title>
                {description && (
                  <ToastPrimitive.Description className="mt-0.5 text-body-sm opacity-90">{description}</ToastPrimitive.Description>
                )}
              </div>
              <ToastPrimitive.Close
                aria-label="Fermer la notification"
                className="ag-state -m-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full"
              >
                <X className="size-4" aria-hidden="true" />
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          )
        })}
        <ToastPrimitive.Viewport className="fixed inset-x-0 bottom-0 z-[100] m-0 flex w-full list-none flex-col gap-2 p-4 outline-none sm:inset-x-auto sm:right-0 sm:max-w-sm" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}
