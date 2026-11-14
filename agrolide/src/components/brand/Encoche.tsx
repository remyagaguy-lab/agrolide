import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { ENCOCHE, type EncocheFormatId } from "./encoche-paths"

/**
 * L'« encoche solaire » : forme de cadre de la marque (décision du 14/11/2026, elle remplace l'arche pour les
 * photos, les chiffres et les filigranes). Un rectangle aux coins doux dont le coin bas droit est mordu par un
 * quart de cercle concave, où se loge un quart de soleil : le soleil qui se lève derrière la parcelle.
 * Les deux pointes que laisse la morsure sont légèrement arrondies. Tracés générés par scripts/forme/formes_alternatives.py
 * (aucun tracé à la main) ; le dôme de l'emblème (`Arche`) reste une pièce du logo et de l'emblème éclaté.
 */

export interface EncocheProps extends Omit<React.SVGAttributes<SVGSVGElement>, "viewBox"> {
  /** portrait 4:5, paysage 3:2 (défaut), pastille 1:1, vignette 16:9. */
  format?: EncocheFormatId
  /** Alternative textuelle. Sans elle, la forme est décorative (masquée aux lecteurs d'écran). */
  title?: string
}

/** La forme pleine, à la couleur du texte (`currentColor`) : filigrane, aplat. */
export function Encoche({ format = "paysage", title, className, ...props }: EncocheProps) {
  const F = ENCOCHE[format]
  return (
    <svg
      viewBox={`0 0 ${F.w} ${F.h}`}
      className={cn("block h-auto", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      <path d={F.d} fill="currentColor" />
    </svg>
  )
}

export interface EnchochePhotoProps {
  /** Chemin de l'image (de préférence WebP). */
  src: string
  /** Description de la photo (obligatoire : elle porte l'information). */
  alt: string
  /** Format de la fenêtre : paysage 3:2 (défaut) ou portrait 4:5. */
  format?: "paysage" | "portrait"
  /** Cadrage de l'image dans la fenêtre (`preserveAspectRatio`), ex. `xMaxYMid slice`. */
  cadrage?: string
  /** Quart de soleil jaune logé dans l'encoche (défaut : oui). */
  soleil?: boolean
  className?: string
}

/**
 * Photo vue à travers la FENÊTRE à encoche. À réserver aux visuels forts (terrain, groupe) : une seule par écran.
 * Garder les visages hors du coin bas droit (l'encoche) : pour recadrer, utiliser `cadrage`.
 */
export function EnchochePhoto({ src, alt, format = "paysage", cadrage = "xMidYMid slice", soleil = true, className }: EnchochePhotoProps) {
  const id = React.useId().replace(/:/g, "")
  const F = ENCOCHE[format]
  return (
    <svg viewBox={`0 0 ${F.w} ${F.h}`} role="img" aria-label={alt} className={cn("block h-auto w-full", className)}>
      <defs>
        <clipPath id={`${id}-fenetre`}>
          <path d={F.d} />
        </clipPath>
      </defs>
      <path d={F.d} className="fill-surface-container-high" />
      <image href={src} x={0} y={0} width={F.w} height={F.h} preserveAspectRatio={cadrage} clipPath={`url(#${id}-fenetre)`} />
      {soleil && <circle cx={F.compagnon.cx} cy={F.compagnon.cy} r={F.compagnon.r} className="fill-accent-sun" />}
    </svg>
  )
}

export interface EncocheBadgeProps {
  /** Court texte : jour d'une date, chiffre d'étape (un ou deux caractères). */
  children: React.ReactNode
  /** soleil : forme jaune, contenu vert (sur fond vert ou clair) ; marque : forme verte, contenu blanc. */
  ton?: "soleil" | "marque"
  /** Largeur : classes `w-*` (défaut 64 px ; de 40 à 112 px). */
  className?: string
}

/**
 * Pastille : la forme à encoche porte un chiffre à son centre optique (centre du plus grand cercle inscrit, mesuré
 * par le script). Texte centré sur la hauteur des capitales (text-box), corps de 30 % de la largeur.
 * Rôle : étape d'un parcours, jour d'un événement.
 */
export function EncocheBadge({ children, ton = "soleil", className }: EncocheBadgeProps) {
  const F = ENCOCHE.pastille
  const texte = typeof children === "string" || typeof children === "number"
  return (
    <span aria-hidden={texte ? undefined : true} className={cn("@container relative inline-block w-16 shrink-0", className)}>
      <svg viewBox={`0 0 ${F.w} ${F.h}`} aria-hidden="true" focusable="false" className={cn("block h-auto w-full", ton === "soleil" ? "fill-accent-sun" : "fill-primary")}>
        <path d={F.d} />
      </svg>
      <span
        className={cn(
          "absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-[30cqw] font-extrabold leading-none tabular-nums [text-box:trim-both_cap_alphabetic]",
          ton === "soleil" ? "text-surface-brand" : "text-on-primary",
        )}
        style={{ left: `${F.inscrit[0]}%`, top: `${F.inscrit[1]}%` }}
      >
        {children}
      </span>
    </span>
  )
}
