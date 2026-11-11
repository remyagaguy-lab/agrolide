import type { ReactNode } from 'react'
import { Logo } from '@/components/ui/Logo'

/** Page commune aux écrans de connexion, d'inscription, de mot de passe et d'accueil des nouveaux membres. */
export function AuthCard({ title, subtitle, children, footer, wide }: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  /** Carte plus large (formulaires longs comme l'onboarding). */
  wide?: boolean
}) {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-surface-container-low px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo href="/" size="lg" priority />
        </div>
        <h1 className="text-headline-sm text-on-surface">{title}</h1>
        {subtitle && <p className="mt-2 text-body-md text-on-surface-variant">{subtitle}</p>}
      </div>
      <div className={wide ? 'mt-8 sm:mx-auto sm:w-full sm:max-w-xl' : 'mt-8 sm:mx-auto sm:w-full sm:max-w-md'}>
        <div className="rounded-panel border border-outline-variant bg-surface-container-lowest px-6 py-8 sm:px-10">{children}</div>
        {footer && <div className="mt-6 text-center text-body-md text-on-surface-variant">{footer}</div>}
      </div>
    </div>
  )
}

/** Style des liens textuels des pages d'authentification. */
export const authLinkClass =
  'rounded-tag font-semibold text-primary underline-offset-4 hover:underline'

export function translateAuthError(message: string) {
  const m = message.toLowerCase()
  if (m.includes('invalid login')) return 'E-mail ou mot de passe incorrect.'
  if (m.includes('not confirmed')) return 'Confirmez d’abord votre adresse e-mail (lien reçu par e-mail).'
  if (m.includes('already registered') || m.includes('already been registered')) return 'Un compte existe déjà avec cet e-mail. Connectez-vous ou réinitialisez votre mot de passe.'
  if (m.includes('password') && m.includes('characters')) return 'Le mot de passe doit contenir au moins 8 caractères.'
  if (m.includes('rate limit') || m.includes('too many')) return 'Trop de tentatives. Réessayez dans quelques minutes.'
  return 'Une erreur est survenue. Réessayez.'
}
