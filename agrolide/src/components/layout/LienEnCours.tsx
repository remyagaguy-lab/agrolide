"use client"

import { useLinkStatus } from "next/link"
import { cn } from "@/lib/utils/formatters"

/**
 * À placer DANS un <Link> : dès le clic, tant que la page demandée se charge, une barre pulsante apparaît sur
 * le lien. Sans elle, l'interface paraît figée entre le clic et l'arrivée de la page (le lien actif ne change
 * qu'à la fin de la navigation). Le lien parent doit être positionné (`relative`).
 */
export function LienEnCours({ className }: { className?: string }) {
  const { pending } = useLinkStatus()
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary transition-opacity duration-150",
        pending ? "animate-pulse opacity-100" : "opacity-0",
        className,
      )}
    />
  )
}
