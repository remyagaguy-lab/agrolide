import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { Feuille } from "./Feuille"

export interface PuceProps {
  className?: string
}

/**
 * Puce de liste : la feuille de l'emblème, alignée optiquement sur la PREMIÈRE ligne du texte.
 * Elle occupe exactement la hauteur d'une ligne (`1lh`) et se centre sur la hauteur d'x d'Urbanist (et non sur la
 * boîte de ligne, qui est plus haute que les minuscules) : décalage de `--puce-dy` = (ascendante − descendante − hauteur d’x) / 2 = (0,95 − 0,25 − 0,51) / 2 = 0,095 em, mesuré sur la police.
 * Taille : 0,9 em de large (la feuille fait alors la hauteur d'x). Usage : `<li className="flex gap-2.5"><Puce />Texte</li>`.
 */
export function Puce({ className }: PuceProps) {
  return (
    <span aria-hidden="true" className={cn("flex h-[1lh] shrink-0 items-center", className)}>
      <Feuille className="w-[0.9em] translate-y-[var(--puce-dy,0.095em)] text-accent-leaf" />
    </span>
  )
}
