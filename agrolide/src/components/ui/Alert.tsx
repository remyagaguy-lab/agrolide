import * as React from "react"
import { cn } from "@/lib/utils/formatters"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "warning" | "info";
}

export function Alert({ className, variant = "info", ...props }: AlertProps) {
  const variants = {
    info: "bg-[var(--color-gris-clair)] text-[var(--color-gris-texte)] border-[var(--color-gris-moyen)]",
    success: "bg-[#e8f5e9] text-[var(--color-succes)] border-[var(--color-succes)]",
    error: "bg-[#ffebee] text-[var(--color-erreur)] border-[var(--color-erreur)]",
    warning: "bg-[#fff8e1] text-[var(--color-jaune-dore)] border-[var(--color-jaune-dore)]",
  }

  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
