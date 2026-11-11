import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/formatters'

export type LogoVariant = 'horizontal' | 'symbol'
export type LogoSize = 'sm' | 'md' | 'lg' | 'xl'
/** auto : suit le thème (version blanche en mode sombre). on-dark : toujours la version blanche (sur fond vert profond). on-light : toujours la version couleur. */
export type LogoTone = 'auto' | 'on-light' | 'on-dark'

const heights: Record<LogoSize, string> = { sm: 'h-7', md: 'h-10', lg: 'h-14', xl: 'h-20' }

export interface LogoProps {
  variant?: LogoVariant
  size?: LogoSize
  tone?: LogoTone
  /** Si présent, le logo est un lien (généralement "/"). */
  href?: string
  /** À activer pour le logo visible au chargement (en-tête) : préchargement. */
  priority?: boolean
  className?: string
}

export function Logo({ variant = 'horizontal', size = 'md', tone = 'auto', href, priority, className }: LogoProps) {
  const h = heights[size]
  const cls = cn(h, 'w-auto', className)

  let content: React.ReactNode
  if (variant === 'symbol') {
    content = (
      <Image src="/images/logo-agrolide-symbole.webp" alt="agrolide" width={256} height={259} priority={priority} className={cls} />
    )
  } else if (tone === 'on-dark') {
    content = (
      <Image src="/images/logo-agrolide-blanc.webp" alt="agrolide" width={480} height={135} priority={priority} className={cls} />
    )
  } else if (tone === 'on-light') {
    content = (
      <Image src="/images/logo-agrolide.webp" alt="agrolide" width={480} height={135} priority={priority} className={cls} />
    )
  } else {
    content = (
      <>
        <Image src="/images/logo-agrolide.webp" alt="agrolide" width={480} height={135} priority={priority} className={cn(cls, 'dark:hidden')} />
        <Image
          src="/images/logo-agrolide-blanc.webp"
          alt="agrolide"
          width={480}
          height={135}
          loading="lazy"
          className={cn(cls, 'hidden dark:block')}
        />
      </>
    )
  }

  if (href) {
    return (
      <Link href={href} aria-label="agrolide : retour à l'accueil" className="inline-flex rounded-control">
        {content}
      </Link>
    )
  }
  return <span className="inline-flex">{content}</span>
}
