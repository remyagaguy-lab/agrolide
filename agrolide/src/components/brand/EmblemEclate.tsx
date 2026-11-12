import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { GEOMETRIE } from "./geometrie"

const A = GEOMETRIE.arche
const E = GEOMETRIE.eclate
const [x, y, w, h] = E.viewBox

export interface EmblemEclateProps {
  /**
   * plein  : les quatre pièces à la couleur du texte (`currentColor`) ;
   * soleil : le dôme évidé (anneau et collines) avec le soleil jaune dans son ciel, les pièces du bas à la couleur du texte.
   */
  variante?: "plein" | "soleil"
  /** Photo dans le ciel du dôme (remplace le soleil) : grands en-têtes. */
  photo?: { src: string; alt: string; cadrage?: string }
  className?: string
}

/**
 * L'emblème ÉCLATÉ : le dôme et les trois pièces du bas (la colline, le grand sillon, la feuille), détachées de l'anneau.
 * Chaque pièce du bas = son aplat intérieur + un demi-trait autour (le trait vert coupé en son milieu), coins arrondis du même
 * demi-trait comme le bout du grand sillon. Tout est construit avec les cercles mesurés du favicon.
 * Rôle : ILLUSTRATION DE GRAND FORMAT (page 404, en-tête, page d'erreur, écran d'accueil d'application), 240 px et plus.
 */
export function EmblemEclate({ variante = "plein", photo, className }: EmblemEclateProps) {
  const id = React.useId().replace(/:/g, "")
  const bas = E.colline + E.sillon + E.feuille
  return (
    <svg
      viewBox={`${x} ${y} ${w} ${h}`}
      className={cn("block h-auto", className)}
      role={photo ? "img" : undefined}
      aria-label={photo?.alt}
      aria-hidden={photo ? undefined : true}
      focusable="false"
    >
      {photo ? (
        <>
          <defs>
            <clipPath id={`${id}-ciel`}>
              <path d={A.ciel} />
            </clipPath>
          </defs>
          <image href={photo.src} x={A.cielViewBox[0]} y={A.cielViewBox[1]} width={A.cielViewBox[2]} height={A.cielViewBox[3]}
            preserveAspectRatio={photo.cadrage ?? "xMidYMid slice"} clipPath={`url(#${id}-ciel)`} />
          <path d={A.dome + A.ciel + bas} fill="currentColor" fillRule="evenodd" />
        </>
      ) : variante === "soleil" ? (
        <>
          <path d={A.ciel} className="fill-accent-sun" />
          <path d={A.dome + A.ciel + bas} fill="currentColor" fillRule="evenodd" />
        </>
      ) : (
        <path d={A.dome + bas} fill="currentColor" />
      )}
    </svg>
  )
}
