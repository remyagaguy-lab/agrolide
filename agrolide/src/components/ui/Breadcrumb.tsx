import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/formatters'

import { ChevronRight, Home } from "@/components/ui/icons"
export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  /** `dark` : sur le fond vert profond d'un héros (texte clair). */
  tone?: 'default' | 'dark'
  /** Données structurées schema.org (désactiver dans l'espace membre : pages non indexées). */
  jsonLd?: boolean
  className?: string
}

const tones = {
  default: { nav: 'text-on-surface-variant', link: 'hover:text-primary', current: 'text-on-surface', chevron: 'text-outline' },
  dark: { nav: 'text-on-surface-brand/75', link: 'hover:text-on-surface-brand', current: 'text-on-surface-brand', chevron: 'text-on-surface-brand/50' },
} as const

/** Fil d'Ariane (avec données structurées schema.org). Chaque ancêtre est un lien ; la page courante porte aria-current. */
export default function Breadcrumb({ items, tone = 'default', jsonLd: withJsonLd = true, className }: BreadcrumbProps) {
  const t = tones[tone]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://agrolide.org/'
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href ? `https://agrolide.org${item.href}` : undefined
      }))
    ]
  }

  return (
    <>
      {withJsonLd && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      )}
      <nav aria-label="Fil d'Ariane" className={cn('mb-6 flex text-body-sm', t.nav, className)}>
        <ol className="flex flex-wrap items-center gap-y-1">
          <li>
            <Link href="/" className={cn('flex min-h-6 items-center transition-colors', t.link)}>
              <Home aria-hidden="true" className="size-4" />
              <span className="sr-only">Accueil</span>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight aria-hidden="true" className={cn('mx-1 size-4 shrink-0', t.chevron)} />
              {item.href ? (
                <Link href={item.href} className={cn('transition-colors', t.link)}>
                  {item.label}
                </Link>
              ) : (
                <span className={cn('line-clamp-1 font-semibold', t.current)} aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
