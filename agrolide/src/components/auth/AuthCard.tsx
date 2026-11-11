import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

/** Carte commune aux pages de connexion, d'inscription et de mot de passe. */
export function AuthCard({ title, subtitle, children, footer }: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" aria-label="Retour à l'accueil agrolide" className="mb-6 flex justify-center">
          <Image
            src="/images/logo-agrolide.webp"
            alt="agrolide"
            width={480}
            height={135}
            priority
            className="h-[56px] w-auto"
          />
        </Link>
        <h1 className="text-center text-2xl font-heading font-extrabold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>}
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-100 rounded-2xl sm:px-10">{children}</div>
        {footer && <div className="mt-6 text-center text-sm text-gray-500">{footer}</div>}
      </div>
    </div>
  )
}

export const inputClass =
  'block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-[#1b5e38] focus:outline-none focus:ring-1 focus:ring-[#1b5e38]'
export const buttonClass =
  'w-full rounded-lg bg-[#1b5e38] px-4 py-3 text-sm font-semibold text-white hover:bg-[#164d2e] disabled:opacity-60 transition-colors'

export function translateAuthError(message: string) {
  const m = message.toLowerCase()
  if (m.includes('invalid login')) return 'E-mail ou mot de passe incorrect.'
  if (m.includes('not confirmed')) return 'Confirmez d’abord votre adresse e-mail (lien reçu par e-mail).'
  if (m.includes('already registered') || m.includes('already been registered')) return 'Un compte existe déjà avec cet e-mail. Connectez-vous ou réinitialisez votre mot de passe.'
  if (m.includes('password') && m.includes('characters')) return 'Le mot de passe doit contenir au moins 8 caractères.'
  if (m.includes('rate limit') || m.includes('too many')) return 'Trop de tentatives. Réessayez dans quelques minutes.'
  return 'Une erreur est survenue. Réessayez.'
}
