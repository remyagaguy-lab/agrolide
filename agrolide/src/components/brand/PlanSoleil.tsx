import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { GEOMETRIE } from "./geometrie"

const R = GEOMETRIE.rayons
/**
 * Rapports des échos, mesurés sur l'emblème : le soleil clair (le plan) est entouré de trois cercles
 * concentriques, le soleil orange (×1,16), le blanc (×1,34) et l'anneau (×1,52).
 */
export const RAPPORTS_ECHOS = [R.soleil / R["soleil-clair"], R["anneau-int"] / R["soleil-clair"], R["anneau-ext"] / R["soleil-clair"]] as const

export type PlanSoleilTon = "marque" | "soleil" | "pale"
export type PlanSoleilFond = "surface" | "surface-container-low" | "surface-container-lowest" | "surface-brand" | "primary-container" | "photo"

export interface PlanSoleilProps {
  /** Centre du disque, en longueur CSS relative au parent (ex. `"8%"`, `"calc(100% - 4rem)"`). */
  x: string
  y: string
  /** Rayon du plan, en longueur CSS (ex. `"min(58vw, 820px)"`). */
  rayon: string
  /**
   * Nombre d'échos autour du plan (0 à 3). Défaut : 3, comme l'emblème. En ton `soleil`, le premier écho est
   * l'anneau orange du soleil de l'emblème ; sur fond vert ou sombre, s'en tenir à ce seul écho.
   */
  echos?: 0 | 1 | 2 | 3
  /** Couleur du plan : vert profond (défaut), jaune soleil, ou vert pâle. */
  ton?: PlanSoleilTon
  /**
   * Fond vers lequel les échos s'éclaircissent : le rôle de la surface du parent. `photo` : les échos passent
   * sur une photo, qui ne change pas avec le thème ; ils s'éclaircissent alors vers le blanc, en clair comme en sombre.
   */
  fond?: PlanSoleilFond
  /**
   * Pas des échos. `embleme` (défaut) : rapports exacts de l'emblème (×1,16, ×1,34, ×1,52), pour un plan
   * de taille moyenne. Un nombre (px) : pas constant, pour un très grand plan dont les échos sortiraient de la vue.
   */
  pas?: "embleme" | number
  className?: string
}

const TON: Record<PlanSoleilTon, string> = {
  marque: "var(--color-surface-brand)",
  soleil: "var(--color-accent-sun)",
  pale: "var(--color-primary-container)",
}
/** Part de la couleur du plan dans chaque écho, du plus proche au plus lointain. */
const MELANGE = [0.34, 0.17, 0.07]

/**
 * LE PLAN de la marque : le soleil de l'emblème agrandi en aplat plein, coupé par un ou deux bords de la vue,
 * entouré d'au plus trois échos concentriques qui s'éclaircissent vers le fond (jamais de trait).
 * Une seule grande forme par vue. Le titre se pose DANS le plan. Calque décoratif : placer dans un parent
 * `relative overflow-hidden`, le contenu au-dessus (`relative z-10`).
 */
export function PlanSoleil({ x, y, rayon, echos = 3, ton = "marque", fond = "surface", pas = "embleme", className }: PlanSoleilProps) {
  const plan = TON[ton]
  const fondVar = fond === "photo" ? "var(--ag-ref-neutral-100)" : `var(--color-${fond})`
  const cercles = Array.from({ length: echos }, (_, i) => {
    const k = echos - i // du plus grand au plus petit
    const r = pas === "embleme" ? `calc(${rayon} * ${RAPPORTS_ECHOS[k - 1].toFixed(4)})` : `calc(${rayon} + ${k * pas}px)`
    // ton soleil : le premier écho est l'anneau orange du soleil de l'emblème (soleil clair -> soleil)
    const bg = ton === "soleil" && k === 1 ? "var(--ag-ref-orange-70)" : `color-mix(in oklab, ${plan} ${Math.round(MELANGE[k - 1] * 100)}%, ${fondVar})`
    return { r, bg }
  })
  cercles.push({ r: rayon, bg: plan })
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {cercles.map((c, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{ left: x, top: y, width: `calc(${c.r} * 2)`, height: `calc(${c.r} * 2)`, translate: "-50% -50%", background: c.bg }}
        />
      ))}
    </div>
  )
}
