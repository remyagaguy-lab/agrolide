import * as React from "react"
import { cn } from "@/lib/utils/formatters"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "junior" | "professionnel" | "partenaire" | "senior" | "actif" | "expire" | "en_attente" | "default";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-[var(--color-gris-clair)] text-[var(--color-gris-texte)]",
    junior: "bg-[var(--color-vert-olive)] text-white",
    professionnel: "bg-[var(--color-vert-principal)] text-white",
    partenaire: "bg-[var(--color-jaune-dore)] text-white",
    senior: "bg-[var(--color-vert-profond)] text-white",
    actif: "bg-[var(--color-succes)] text-white",
    expire: "bg-[var(--color-erreur)] text-white",
    en_attente: "bg-[var(--color-orange-accent)] text-white",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-vert-principal)]",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
