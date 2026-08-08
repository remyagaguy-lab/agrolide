import React from "react"
import Link from "next/link"
import { ChevronRight, LucideIcon } from "lucide-react"

export type StatCardVariant = "default" | "featured" | "accent"

export interface StatCardProps {
  variant?: StatCardVariant
  label: string
  icon?: LucideIcon
  iconColorClass?: string
  iconBgClass?: string
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

export function StatCard({
  variant = "default",
  label,
  icon: Icon,
  iconColorClass = "text-[#1b5e38]",
  iconBgClass = "bg-[#f0f7f0]",
  badge,
  value,
  subtext,
  action,
  className = ""
}: StatCardProps) {
  const isFeatured = variant === "featured"

  const variantStyles = {
    default: "bg-white border border-gris-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] hover:border-gray-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
    featured: "bg-[#1b5e38] text-white border border-[#164e2e] shadow-[0_2px_8px_rgba(27,94,56,0.2)] hover:shadow-[0_4px_16px_rgba(27,94,56,0.25)]",
    accent: "bg-white border-l-4 border-l-[#1b5e38] border-y border-r border-gris-border shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
  }

  const badgeStyles = {
    success: isFeatured 
      ? "bg-white/20 text-white border border-white/30" 
      : "bg-[#e8f5e9] text-[#1b5e38] border border-[#c8e6c9]",
    warning: isFeatured 
      ? "bg-amber-400/30 text-amber-100 border border-amber-300/30" 
      : "bg-[#fef3e2] text-[#8a4e00] border border-[#fed7aa]",
    neutral: isFeatured 
      ? "bg-white/15 text-white/90 border border-white/20" 
      : "bg-[#f8f8f6] text-gray-600 border border-gris-border",
    error: isFeatured 
      ? "bg-red-500/30 text-red-100 border border-red-300/30" 
      : "bg-red-50 text-red-700 border border-red-200",
  }

  return (
    <div className={`rounded-2xl relative overflow-hidden flex flex-col justify-between p-5 min-h-[128px] transition-all duration-200 ${variantStyles[variant]} ${className}`}>
      {isFeatured && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      )}

      {/* Header: Label + Badge or Icon */}
      <div className="relative z-10 flex justify-between items-start gap-2">
        <div className="flex items-center gap-1.5">
          {Icon && (
            <Icon size={14} strokeWidth={1.5} className={isFeatured ? "text-white/80" : "text-[#1b5e38]"} />
          )}
          <span className={`text-[11px] font-bold uppercase tracking-wider ${isFeatured ? "text-white/90" : "text-gris-muted"}`}>
            {label}
          </span>
        </div>

        {badge ? (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeStyles[badge.variant || "neutral"]}`}>
            {badge.text}
          </span>
        ) : Icon && !isFeatured ? (
          <div className={`w-7 h-7 rounded-xl ${iconBgClass} flex items-center justify-center shrink-0`}>
            <Icon size={14} strokeWidth={1.5} className={iconColorClass} />
          </div>
        ) : null}
      </div>

      {/* Value & Action Row */}
      <div className="relative z-10 flex items-end justify-between mt-3 gap-2">
        <div className="space-y-0.5">
          <div className={`text-2xl sm:text-3xl font-bold font-heading leading-none tracking-tight tabular-nums ${isFeatured ? "text-white" : "text-[#1a1a1a]"}`}>
            {value}
          </div>
          {subtext && (
            <p className={`text-[11px] font-medium leading-normal ${isFeatured ? "text-white/75" : "text-gris-muted"}`}>
              {subtext}
            </p>
          )}
        </div>

        {action && (
          <Link
            href={action.href}
            title={action.label}
            aria-label={action.label || `Voir plus sur ${label}`}
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 active:scale-[0.94] ${
              isFeatured 
                ? "bg-white/20 hover:bg-white/30 text-white" 
                : "bg-[#f8f8f6] hover:bg-[#f0f7f0] border border-gris-border text-gray-600 hover:text-[#1b5e38]"
            }`}
          >
            <ChevronRight size={14} strokeWidth={2} />
          </Link>
        )}
      </div>
    </div>
  )
}
