import * as React from 'react'
import { Anneau } from '@/components/brand'
import { cn } from '@/lib/utils/formatters'

export interface SpinnerProps {
  /** Texte lu par les lecteurs d'écran. Mettre `null` si le spinner est purement décoratif (ex. dans un bouton déjà nommé). */
  label?: string | null
  className?: string
}

/**
 * Indicateur de chargement : l'anneau de l'emblème (avec son ouverture) qui tourne. Hérite de la couleur du texte (`currentColor`).
 * Immobile si l'utilisateur réduit les animations. Trait épaissi (x1,8) pour rester lisible en petit.
 */
export function Spinner({ className, label = 'Chargement' }: SpinnerProps) {
  return <Anneau mode="chargement" epaisseur={1.8} label={label} className={cn('size-4', className)} />
}
