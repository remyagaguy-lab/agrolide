import * as React from 'react'
import { cn } from '@/lib/utils/formatters'

/** Bloc de chargement. Décoratif : masqué aux lecteurs d'écran ; annoncer le chargement ailleurs (Spinner, aria-busy). */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-control bg-surface-container-highest motion-reduce:animate-none', className)}
      {...props}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="flex h-full flex-col rounded-card border border-outline-variant bg-surface-container-lowest p-6" aria-hidden="true">
      <div className="mb-4 flex items-start justify-between">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="mb-4 h-40 w-full rounded-card" />
      <Skeleton className="mb-2 h-6 w-3/4" />
      <Skeleton className="mb-4 h-4 w-full" />
      <div className="mt-auto space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" role="status" aria-busy="true" aria-label="Chargement">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="w-full space-y-4" role="status" aria-busy="true" aria-label="Chargement">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-card border border-outline-variant bg-surface-container-lowest p-4">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="flex-1 space-y-3 py-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
