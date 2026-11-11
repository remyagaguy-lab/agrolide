import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/formatters'
import { Spinner } from './Spinner'

/**
 * primary     : orange, l'appel à l'action UNIQUE de la vue (règle UI Bible).
 * secondary   : vert plein, action principale de l'interface (formulaires, espace membre).
 * tonal       : vert pâle, action secondaire importante.
 * outline     : contour, action tertiaire.
 * text        : sans fond, lien d'action.
 * danger      : action destructive.
 * ghost-dark  : sur fond vert profond (héros, pied de page, bandeau final).
 */
export type ButtonVariant = 'primary' | 'secondary' | 'tonal' | 'outline' | 'text' | 'danger' | 'ghost-dark'
export type ButtonSize = 'md' | 'sm'

const base =
  'ag-state inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap font-sans text-label-lg ' +
  'transition-[background-color,box-shadow,color] duration-150 ease-standard ' +
  'disabled:cursor-not-allowed aria-disabled:cursor-not-allowed'

const variants: Record<ButtonVariant, string> = {
  primary:
    'rounded-control bg-tertiary text-on-tertiary font-extrabold hover:bg-tertiary-hover ' +
    'disabled:bg-on-surface/12 disabled:text-on-surface/38 aria-disabled:bg-on-surface/12 aria-disabled:text-on-surface/38',
  secondary:
    'rounded-control bg-primary text-on-primary ' +
    'disabled:bg-on-surface/12 disabled:text-on-surface/38 aria-disabled:bg-on-surface/12 aria-disabled:text-on-surface/38',
  tonal:
    'rounded-control bg-primary-container text-on-primary-container ' +
    'disabled:bg-on-surface/12 disabled:text-on-surface/38 aria-disabled:bg-on-surface/12 aria-disabled:text-on-surface/38',
  outline:
    'rounded-control border border-outline bg-transparent text-primary ' +
    'disabled:border-on-surface/12 disabled:text-on-surface/38 aria-disabled:border-on-surface/12 aria-disabled:text-on-surface/38',
  text: 'rounded-control bg-transparent text-primary disabled:text-on-surface/38 aria-disabled:text-on-surface/38',
  danger:
    'rounded-control bg-error text-on-error ' +
    'disabled:bg-on-surface/12 disabled:text-on-surface/38 aria-disabled:bg-on-surface/12 aria-disabled:text-on-surface/38',
  'ghost-dark':
    'rounded-control border border-on-surface-brand/30 bg-on-surface-brand/10 text-on-surface-brand ' +
    'disabled:opacity-50',
}

const sizes: Record<ButtonSize, string> = {
  md: 'min-h-12 px-7 py-2.5',
  sm: 'min-h-10 px-5 py-2 text-label-md',
}

/** Classes d'un bouton, pour styler un <Link> ou un <a> comme un bouton sans passer par le composant. */
export function buttonVariants({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; fullWidth?: boolean; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], variant === 'text' && 'px-3', fullWidth && 'w-full', className)
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Affiche un spinner, bloque le clic et annonce l'état occupé. */
  loading?: boolean
  fullWidth?: boolean
  /** Si présent, rend un lien Next.js stylé comme un bouton. */
  href?: string
  children: React.ReactNode
}

/**
 * Note : sans `type`, le navigateur applique « submit » dans un formulaire ; les formulaires existants s'appuient dessus.
 * Pour un bouton qui ne soumet pas, passer type="button".
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, fullWidth, href, className, children, disabled, ...props },
  ref,
) {
  const classes = buttonVariants({ variant, size, fullWidth, className })

  if (href) {
    return (
      <Link href={href} className={classes} aria-disabled={disabled || undefined}>
        {children}
      </Link>
    )
  }

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner label={null} />}
      {children}
    </button>
  )
})
