"use client"

import * as React from "react"
import { Check, Monitor, Moon, Sun } from "lucide-react"
import { applyThemePreference, DARK_MODE_ENABLED, readThemePreference, type ThemePreference } from "@/lib/theme"
import { DropdownMenuItem } from "./DropdownMenu"
import { cn } from "@/lib/utils/formatters"

const OPTIONS: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Clair", Icon: Sun },
  { value: "dark", label: "Sombre", Icon: Moon },
  { value: "system", label: "Système", Icon: Monitor },
]

/** Préférence de thème mémorisée (localStorage), appliquée tout de suite ; « Système » suit l'appareil en direct. */
export function useThemePreference() {
  const [pref, setPref] = React.useState<ThemePreference>("system")

  React.useEffect(() => { setPref(readThemePreference()) }, [])

  React.useEffect(() => {
    if (pref !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => applyThemePreference("system")
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [pref])

  const choose = React.useCallback((next: ThemePreference) => {
    applyThemePreference(next)
    setPref(next)
  }, [])

  return [pref, choose] as const
}

export interface ThemeToggleProps {
  /** Affiche les libellés (menu mobile) ; sinon icônes seules, noms accessibles conservés. */
  showLabels?: boolean
  className?: string
}

/**
 * Bascule Clair / Sombre / Système : groupe de boutons radio (flèches ← → pour changer, Tab pour entrer/sortir).
 */
export function ThemeToggle({ showLabels = false, className }: ThemeToggleProps) {
  const [pref, choose] = useThemePreference()
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])
  if (!DARK_MODE_ENABLED) return null // bascule masquée tant que le mode sombre est désactivé (src/lib/theme.ts)

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (index + delta + OPTIONS.length) % OPTIONS.length
    choose(OPTIONS[next].value)
    refs.current[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label="Thème d'affichage"
      className={cn("inline-flex rounded-full border border-outline-variant bg-surface-container-low p-0.5", className)}
    >
      {OPTIONS.map(({ value, label, Icon }, i) => {
        const checked = pref === value
        return (
          <button
            key={value}
            ref={(el) => { refs.current[i] = el }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={showLabels ? undefined : label}
            title={label}
            tabIndex={checked ? 0 : -1}
            onClick={() => choose(value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-3 text-label-md transition-colors duration-150 ease-standard",
              checked ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-high",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {showLabels && <span>{label}</span>}
          </button>
        )
      })}
    </div>
  )
}

/** Les trois choix sous forme d'entrées de menu déroulant (navigation au clavier du menu conservée). */
export function ThemeMenuItems() {
  const [pref, choose] = useThemePreference()
  if (!DARK_MODE_ENABLED) return null
  return (
    <>
      {OPTIONS.map(({ value, label, Icon }) => (
        <DropdownMenuItem
          key={value}
          role="menuitemradio"
          aria-checked={pref === value}
          onSelect={(e) => { e.preventDefault(); choose(value) }}
        >
          <Icon className="size-4 text-on-surface-muted" aria-hidden="true" />
          <span className="flex-1">Thème {label.toLowerCase()}</span>
          {pref === value && <Check className="size-4 text-primary" aria-hidden="true" />}
        </DropdownMenuItem>
      ))}
    </>
  )
}
