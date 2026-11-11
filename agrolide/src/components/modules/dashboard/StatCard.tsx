import React from "react"
import Link from "next/link"
import { ChevronRight, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils/formatters"

export type StatCardVariant = "default" | "featured" | "accent"
export type StatTone = "brand" | "leaf" | "olive" | "info" | "warning"

export interface StatCardProps {
  variant?: StatCardVariant
  label: string
  icon?: LucideIcon
  /** Teinte de la pastille d'icône (remplace les anciennes classes de couleur en dur). */
  tone?: StatTone
  badge?: {
    text: string
    variant?: "success" | "warning" | "neutral" | "error"
  }
  value: string | number
  subtext?: string
  action?: {
    href: string
    label?: string
  }
  className?: string
}

const tones: Record<StatTone, string> = {
  brand: "bg-primary-container text-on-primary-container",
  leaf: "bg-success-container text-on-success-container",
  olive: "bg-secondary-container text-on-secondary-container",
  info: "bg-info-container text-on-info-container",
  warning: "bg-warning-container text-on-warning-container",
}

const badgeTones = {
  success: "bg-success-container text-on-success-container",
  warning: "bg-warning-container text-on-warning-container",
  neutral: "bg-surface-container-high text-on-surface-variant",
  error: "bg-error-container text-on-error-container",
}

export function StatCard({
  variant = "default",
  label,
  icon: Icon,
  tone = "brand",
  badge,
  value,
  subtext,
  action,
  className,
}: StatCardProps) {
  const featured = variant === "featured"

  return (
    <div
      className={cn(
        "relative flex min-h-32 flex-col justify-between overflow-hidden rounded-card p-5",
        featured
          ? "bg-surface-brand text-on-surface-brand"
          : "border border-outline-variant bg-surface-container-lowest shadow-elev-1",
        variant === "accent" && "border-l-4 border-l-primary",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={cn("truncate text-label-sm uppercase tracking-wider", featured ? "text-on-surface-brand" : "text-on-surface-muted")}>
          {label}
        </span>
        {badge ? (
          <span className={cn("shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-label-sm", badgeTones[badge.variant ?? "neutral"])}>
            {badge.text}
          </span>
        ) : Icon && !featured ? (
          <span aria-hidden="true" className={cn("flex size-9 shrink-0 items-center justify-center rounded-control", tones[tone])}>
            <Icon className="size-[18px]" strokeWidth={1.75} />
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <div className={cn("text-headline-md tabular-nums", featured ? "text-on-surface-brand" : "text-on-surface")}>{value}</div>
          {subtext && (
            <p className={cn("mt-0.5 text-body-sm", featured ? "text-on-surface-brand/85" : "text-on-surface-muted")}>{subtext}</p>
          )}
        </div>

        {action && (
          <Link
            href={action.href}
            title={action.label}
            aria-label={action.label || `Voir plus sur ${label}`}
            className={cn(
              "ag-state flex size-11 shrink-0 items-center justify-center rounded-full",
              featured ? "bg-on-surface-brand/20 text-on-surface-brand" : "bg-surface-container text-on-surface-variant",
            )}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  )
}
