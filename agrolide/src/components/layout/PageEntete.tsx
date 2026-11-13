import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/formatters'

/**
 * En-tête commun des pages d'onglet de l'espace membre : un seul titre, une seule phrase d'aide, une action
 * éventuelle à droite. Garde la même échelle typographique d'un onglet à l'autre.
 */
export function PageEntete({
  titre,
  description,
  action,
  className,
}: {
  titre: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <header className={cn('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        <h1 className="text-headline-md font-bold text-on-surface">{titre}</h1>
        {description ? <p className="mt-1 max-w-2xl text-body-md text-on-surface-variant">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  )
}
