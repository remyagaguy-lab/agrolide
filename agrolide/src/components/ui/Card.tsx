import * as React from "react"
import { cn } from "@/lib/utils/formatters"

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-[var(--color-blanc)] rounded-[12px] shadow-sm hover:shadow-md transition-shadow border border-[var(--color-gris-moyen)] overflow-hidden",
        className
      )}
      {...props}
    />
  )
}
