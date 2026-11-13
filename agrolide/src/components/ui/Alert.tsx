import * as React from 'react'
import { cn } from '@/lib/utils/formatters'

import { AlertTriangle, CheckCircle2, Info } from "@/components/ui/icons"
export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

const tones: Record<AlertVariant, { box: string; Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }> }> = {
  info: { box: 'border-info/30 bg-info-container text-on-info-container', Icon: Info },
  success: { box: 'border-success/30 bg-success-container text-on-success-container', Icon: CheckCircle2 },
  warning: { box: 'border-warning/30 bg-warning-container text-on-warning-container', Icon: AlertTriangle },
  error: { box: 'border-error/30 bg-error-container text-on-error-container', Icon: AlertTriangle },
}

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant
  title?: React.ReactNode
  /** Masque l'icône (l'information ne doit jamais reposer sur la couleur seule : gardez l'icône ou un titre). */
  hideIcon?: boolean
}

/**
 * Message en ligne. `error` et `warning` sont annoncés immédiatement (role="alert"),
 * `info` et `success` poliment (role="status").
 */
export function Alert({ variant = 'info', title, hideIcon, className, children, ...props }: AlertProps) {
  const { box, Icon } = tones[variant]
  return (
    <div
      role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'}
      className={cn('flex w-full items-start gap-3 rounded-card border p-4', box, className)}
      {...props}
    >
      {!hideIcon && <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />}
      <div className="min-w-0 flex-1 text-body-md">
        {title && <p className="text-title-sm">{title}</p>}
        {children && <div className={cn(title && 'mt-0.5')}>{children}</div>}
      </div>
    </div>
  )
}
