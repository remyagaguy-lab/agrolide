import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { GEOMETRIE } from "./geometrie"

const [cx, cy] = GEOMETRIE.centre
const RE = GEOMETRIE.rayons["anneau-ext"]
const VB = `${cx - RE} ${cy - RE} ${2 * RE} ${2 * RE}`
const { d: ARC, epaisseur } = GEOMETRIE.anneauD

export interface AnneauProps {
  /**
   * chargement  : l'anneau tourne (immobile si l'utilisateur réduit les animations) ;
   * progression : `valeur` (0 à 1) remplit l'anneau depuis son ouverture, sur une piste pâle ;
   * fixe        : simple anneau ouvert (contour d'avatar, repère).
   */
  mode?: "chargement" | "progression" | "fixe"
  valeur?: number
  /** Épaisseur relative au dessin d'origine (1 = l'anneau de l'emblème, 12 % du rayon). */
  epaisseur?: number
  /** Texte lu par les lecteurs d'écran (« Chargement », « Profil complété à 60 % »). `null` : décoratif. */
  label?: string | null
  className?: string
}

/**
 * Anneau : la couronne verte de l'emblème avec son ouverture d'origine (27°, en bas à gauche), mesurées sur le favicon.
 * Rôle : CHARGEMENT et PROGRESSION, contour d'avatar. C'est la seule forme de la marque utilisée en trait,
 * et seulement en petit (16 à 160 px). Couleur : `currentColor`.
 */
export function Anneau({ mode = "fixe", valeur = 0, epaisseur: k = 1, label, className }: AnneauProps) {
  const sw = epaisseur * k
  const v = Math.min(Math.max(valeur, 0), 1)
  const nom = label === undefined ? (mode === "chargement" ? "Chargement" : mode === "progression" ? `${Math.round(v * 100)} %` : null) : label
  return (
    <svg
      viewBox={VB}
      className={cn("block size-8 overflow-visible", mode === "chargement" && "animate-spin [animation-duration:1.4s] motion-reduce:animate-none", className)}
      role={nom ? (mode === "progression" ? "progressbar" : "status") : undefined}
      aria-label={nom ?? undefined}
      aria-hidden={nom ? undefined : true}
      aria-valuenow={mode === "progression" ? Math.round(v * 100) : undefined}
      aria-valuemin={mode === "progression" ? 0 : undefined}
      aria-valuemax={mode === "progression" ? 100 : undefined}
      focusable="false"
    >
      {mode === "progression" && <path d={ARC} fill="none" stroke="currentColor" strokeOpacity={0.18} strokeWidth={sw} strokeLinecap="round" />}
      <path
        d={ARC}
        fill="none"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={mode === "progression" ? `${v} 1` : undefined}
        opacity={mode === "progression" && v === 0 ? 0 : 1}
      />
    </svg>
  )
}
