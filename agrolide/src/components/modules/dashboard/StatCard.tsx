import React from "react"
import Link from "next/link"
import { ChevronRight, LucideIcon } from "lucide-react"

export type StatCardVariant = "default" | "featured" | "highlight" | "accent"

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
    default: "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]",
    featured: "bg-[#1b5e38] text-white shadow-[0_2px_8px_rgba(27,94,56,0.25)] hover:shadow-[0_4px_16px_rgba(27,94,56,0.3)]",
    highlight: "bg-[#f0fdf4] border border-[#bbf7d0] shadow-sm hover:shadow-md",
    accent: "bg-white border-l-4 border-[#1b5e38] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md",
  }

  const badgeStyles = {
    success: isFeatured ? "bg-white/20 text-white" : "bg-[#dff0e0] text-[#1b5e38]",
    warning: isFeatured ? "bg-amber-400/30 text-amber-100" : "bg-amber-50 text-amber-700",
    neutral: isFeatured ? "bg-white/15 text-white/90" : "bg-gray-100 text-gray-600",
    error: isFeatured ? "bg-red-500/30 text-red-100" : "bg-red-50 text-red-600",
  }

  return (
    <div className={`rounded-2xl relative overflow-hidden flex flex-col justify-between h-28 p-4 transition-all duration-200 ${variantStyles[variant]} ${className}`}>
      {isFeatured && (
        <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      )}

      {/* Header */}
      <div className="relative z-10 flex justify-between items-start gap-2">
        <div className={`flex items-center gap-1.5 ${isFeatured ? "text-white/85" : "text-gray-500"}`}>
          {Icon && (
            <Icon size={13} strokeWidth={1.5} className={isFeatured ? "text-white/80" : "text-gray-400"} />
          )}
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {label}
          </span>
        </div>

        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeStyles[badge.variant || "neutral"]}`}>
            {badge.text}
          </span>
        )}

        {!badge && Icon && !isFeatured && (
          <div className={`w-7 h-7 rounded-xl ${iconBgClass} flex items-center justify-center shrink-0`}>
            <Icon size={14} strokeWidth={1.5} className={iconColorClass} />
          </div>
        )}
      </div>

      {/* Content / Body */}
      <div className="relative z-10 flex items-end justify-between mt-auto gap-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-bold font-heading leading-none tabular-nums tracking-tight ${isFeatured ? "text-white" : "text-[#1a1a1a]"}`}>
              {value}
            </span>
            {subtext && (
              <span className={`text-[11px] font-medium leading-none ${isFeatured ? "text-white/70" : "text-gray-500"}`}>
                {subtext}
              </span>
            )}
          </div>
        </div>

        {action && (
          <Link
            href={action.href}
            title={action.label}
            aria-label={action.label || "Voir plus"}
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 active:scale-[0.94] ${
              isFeatured 
                ? "bg-white/20 hover:bg-white/35 text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            <ChevronRight size={14} />
          </Link>
        )}
      </div>
    </div>
  )
}
