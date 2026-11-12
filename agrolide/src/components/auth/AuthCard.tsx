import type { ReactNode } from 'react'
import { Logo } from '@/components/ui/Logo'
import { Arche, Emblem, Motif } from '@/components/brand'

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
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-surface-container-low px-4 py-12 sm:px-6 lg:px-8">
      {/* Décor de marque : motif discret, emblème en contour en haut à gauche, arche pleine en filigrane en bas à droite. */}
      <Motif size={800} opacity={0.04} className="text-primary" />
      <Emblem variant="creux" aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 z-0 hidden w-72 text-primary/15 md:block" />
      <Arche variant="plein" className="pointer-events-none absolute -bottom-20 -right-20 z-0 hidden w-[28rem] text-primary/[0.07] md:block" />
      <div className="relative z-10 text-center sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo href="/" size="lg" priority />
        </div>
        <h1 className="text-headline-sm text-on-surface">{title}</h1>
        {subtitle && <p className="mt-2 text-body-md text-on-surface-variant">{subtitle}</p>}
      </div>
      <div className={wide ? 'relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-xl' : 'relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md'}>
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
