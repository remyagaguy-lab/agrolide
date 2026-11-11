import * as React from 'react'
import { cn } from '@/lib/utils/formatters'

/**
 * outlined : bordure fine, fond clair (défaut).
 * filled   : fond teinté, sans bordure.
 * elevated : ombre douce (à réserver aux éléments flottants ou mis en avant).
 * dark     : sur fond vert profond (héros, bandeau final).
 * Alias historiques : standard = outlined ; feature = outlined plus aéré ; membre = outlined interactive ; blog = outlined sans padding (image en tête).
 */
export type CardVariant = 'outlined' | 'filled' | 'elevated' | 'dark' | 'standard' | 'feature' | 'membre' | 'blog'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  /** Met en évidence le survol (carte cliquable ou contenant un lien étendu). */
  interactive?: boolean
  children: React.ReactNode
}

const variants: Record<CardVariant, string> = {
  outlined: 'border border-outline-variant bg-surface-container-lowest p-6',
  standard: 'border border-outline-variant bg-surface-container-lowest p-6',
  feature: 'border border-outline-variant bg-surface-container-lowest p-7',
  membre: 'border border-outline-variant bg-surface-container-lowest p-5',
  blog: 'overflow-hidden border border-outline-variant bg-surface-container-lowest',
  filled: 'bg-surface-container p-6',
  elevated: 'bg-surface-container-lowest p-6 shadow-elev-2',
  dark: 'border border-on-surface-brand/10 bg-on-surface-brand/8 p-6 text-on-surface-brand',
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'outlined', interactive, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-card transition-[border-color,box-shadow] duration-150 ease-standard',
        variants[variant],
        (interactive || variant === 'membre') && 'cursor-pointer hover:border-primary hover:shadow-elev-1',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-title-lg text-on-surface', className)} {...props} />
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-body-md text-on-surface-variant', className)} {...props} />
}
