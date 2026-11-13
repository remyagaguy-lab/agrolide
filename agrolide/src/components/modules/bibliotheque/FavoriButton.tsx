'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { basculerFavori } from '@/app/actions/bibliotheque'
import { cn } from '@/lib/utils/formatters'

/** Cœur « J'aime » d'un document : alimente la section Favoris de « Mon parcours ». */
export function FavoriButton({ documentId, initial, className }: { documentId: string; initial: boolean; className?: string }) {
  const [favori, setFavori] = useState(initial)
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, demarrer] = useTransition()

  const basculer = () => {
    setErreur(null)
    const precedent = favori
    setFavori(!precedent)
    demarrer(async () => {
      const res = await basculerFavori(documentId)
      if (res.error) {
        setFavori(precedent)
        setErreur(res.error)
      } else if (typeof res.favori === 'boolean') {
        setFavori(res.favori)
      }
    })
  }

  return (
    <span className={cn('inline-flex flex-col items-start', className)}>
      <button
        type="button"
        onClick={basculer}
        disabled={enCours}
        aria-pressed={favori}
        className={cn(
          'ag-state inline-flex min-h-11 items-center gap-2 rounded-control border px-4 text-label-lg transition-colors duration-150',
          favori
            ? 'border-primary bg-primary-container text-on-primary-container'
            : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-on-surface',
        )}
      >
        <Heart className={cn('size-4', favori && 'fill-current')} aria-hidden />
        {favori ? 'Dans mes favoris' : 'Ajouter aux favoris'}
      </button>
      {erreur ? <span role="alert" className="mt-1 text-label-md text-error">{erreur}</span> : null}
    </span>
  )
}
