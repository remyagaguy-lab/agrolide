import * as React from 'react'
import Image from 'next/image'
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

export function Avatar({ src, name, alt, initials, size = 'md', className }: AvatarProps) {
  const { box, px } = sizes[size]
  const label = name || alt || undefined
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
      {src ? (
        <Image src={src} alt="" width={px * 2} height={px * 2} sizes={`${px}px`} className="size-full object-cover" />
      ) : (
        <span aria-hidden="true">{initialsOf(name || alt, initials)}</span>
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
