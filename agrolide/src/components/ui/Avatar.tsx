'use client'

import * as React from 'react'
import Image from 'next/image'
import { Emblem } from '@/components/brand'
import { cn } from '@/lib/utils/formatters'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

const sizes: Record<AvatarSize, { box: string; px: number }> = {
  sm: { box: 'size-8 text-label-sm', px: 32 },
  md: { box: 'size-10 text-label-lg', px: 40 },
  lg: { box: 'size-14 text-title-lg', px: 56 },
  xl: { box: 'size-20 text-headline-sm', px: 80 },
}

function initialsOf(name?: string, initials?: string) {
  if (initials) return initials.slice(0, 2).toUpperCase()
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

export interface AvatarProps {
  src?: string | null
  /** Nom de la personne : sert d'alternative textuelle et de source des initiales. */
  name?: string
  /** Alias historique de `name`. */
  alt?: string
  initials?: string
  size?: AvatarSize
  className?: string
}

/**
 * Photo de profil. Sans photo (ou si elle ne se charge pas), l'avatar par défaut est l'emblème de la marque
 * (règle du design system) ; aux petites tailles, où l'emblème serait illisible, on garde les initiales.
 */
export function Avatar({ src, name, alt, initials, size = 'md', className }: AvatarProps) {
  const { box, px } = sizes[size]
  const label = name || alt || undefined
  const [echec, setEchec] = React.useState(false)
  React.useEffect(() => setEchec(false), [src])
  const photo = src && !echec
  const lettres = initialsOf(name || alt, initials)
  const emblemme = !photo && (size === 'lg' || size === 'xl' || !lettres)
  return (
    <span
      role="img"
      aria-label={label ?? 'Photo de profil'}
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-container font-bold text-on-primary-container',
        box,
        className,
      )}
    >
      {photo ? (
        <Image
          src={src}
          alt=""
          width={px * 2}
          height={px * 2}
          sizes={`${px}px`}
          className="size-full object-cover"
          onError={() => setEchec(true)}
          ref={(img) => {
            // L'erreur peut survenir avant l'hydratation : on revérifie à la mise en place.
            if (img && img.complete && img.naturalWidth === 0) setEchec(true)
          }}
        />
      ) : emblemme ? (
        <Emblem variant="couleur" aria-hidden="true" className="w-3/5" />
      ) : (
        <span aria-hidden="true">{lettres}</span>
      )}
    </span>
  )
}

/** Pile d'avatars qui se chevauchent, avec compteur du reste. */
export function AvatarGroup({
  avatars,
  max = 4,
  size = 'md',
}: {
  avatars: Array<Pick<AvatarProps, 'src' | 'name' | 'initials'>>
  max?: number
  size?: AvatarSize
}) {
  const shown = avatars.slice(0, max)
  const rest = avatars.length - shown.length
  return (
    <div className="flex -space-x-2">
      {shown.map((a, i) => (
        <Avatar key={i} {...a} size={size} className="ring-2 ring-surface-container-lowest" />
      ))}
      {rest > 0 && (
        <span
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-full bg-surface-container-high font-bold text-on-surface-variant ring-2 ring-surface-container-lowest',
            sizes[size].box,
          )}
        >
          +{rest}
        </span>
      )}
    </div>
  )
}
