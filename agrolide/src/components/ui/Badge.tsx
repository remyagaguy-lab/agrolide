import * as React from 'react'
import { cn } from '@/lib/utils/formatters'

/**
 * Catégories de membres : junior, professionnel, partenaire, senior.
 * Statuts : actif, expire, nouveau.
 * Tons sémantiques : neutral, brand, success, warning, error, info.
 * `category` : étiquette neutre (thème d'un article, pays…).
 */
export type BadgeVariant =
  | 'junior' | 'professionnel' | 'partenaire' | 'senior'
  | 'actif' | 'expire' | 'nouveau' | 'category'
  | 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'info'

const tones: Record<BadgeVariant, string> = {
  junior: 'bg-primary-container text-on-primary-container',
  professionnel: 'bg-primary text-on-primary',
  partenaire: 'bg-secondary text-on-secondary',
  senior: 'bg-accent-sun text-on-accent',
  actif: 'bg-success-container text-on-success-container',
  expire: 'bg-warning-container text-on-warning-container',
  nouveau: 'bg-info-container text-on-info-container',
  category: 'bg-surface-container-high text-on-surface-variant',
  neutral: 'bg-surface-container-high text-on-surface-variant',
  brand: 'bg-primary-container text-on-primary-container',
  success: 'bg-success-container text-on-success-container',
  warning: 'bg-warning-container text-on-warning-container',
  error: 'bg-error-container text-on-error-container',
  info: 'bg-info-container text-on-info-container',
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children: React.ReactNode
}

export function Badge({ variant = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center gap-1 rounded-tag px-2.5 py-0.5 text-label-sm',
        tones[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
