"use client"

import React from "react"
import Link from "next/link"
import { ChevronRight, LucideIcon } from "lucide-react"

// --- Context for Compound Component ---
type CardVariant = "default" | "featured" | "highlight" | "accent"

interface StatCardContextValue {
  variant: CardVariant
}

const StatCardContext = React.createContext<StatCardContextValue>({ variant: "default" })

function useStatCard() {
  return React.useContext(StatCardContext)
}

// --- Root ---
interface StatCardRootProps {
  children: React.ReactNode
  variant?: CardVariant
  className?: string
}

function StatCardRoot({ children, variant = "default", className = "" }: StatCardRootProps) {
  const baseStyles = "rounded-2xl relative overflow-hidden flex flex-col justify-between h-28 transition-all duration-200"
  
  const variantStyles = {
    default: "bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]",
    featured: "bg-[#1b5e38] p-4 text-white shadow-[0_2px_8px_rgba(27,94,56,0.25)] hover:shadow-[0_4px_16px_rgba(27,94,56,0.3)]",
    highlight: "bg-[#f0fdf4] p-4 border border-[#bbf7d0] shadow-sm hover:shadow-md",
    accent: "bg-white p-4 border-l-4 border-[#1b5e38] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md",
  }

  return (
    <StatCardContext.Provider value={{ variant }}>
      <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
        {variant === "featured" && (
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        )}
        {children}
      </div>
    </StatCardContext.Provider>
  )
}

// --- Header ---
function StatCardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative z-10 flex justify-between items-start gap-2 ${className}`}>
      {children}
    </div>
  )
}

// --- Label ---
interface StatCardLabelProps {
  children: React.ReactNode
  icon?: LucideIcon
  className?: string
}

function StatCardLabel({ children, icon: Icon, className = "" }: StatCardLabelProps) {
  const { variant } = useStatCard()
  const isFeatured = variant === "featured"

  return (
    <div className={`flex items-center gap-1.5 ${isFeatured ? "text-white/85" : "text-gray-500"} ${className}`}>
      {Icon && <Icon size={13} strokeWidth={1.5} className={isFeatured ? "text-white/80" : "text-gray-400"} />}
      <span className="text-[11px] font-bold uppercase tracking-wider">
        {children}
      </span>
    </div>
  )
}

// --- Badge ---
interface StatCardBadgeProps {
  children: React.ReactNode
  variant?: "success" | "warning" | "neutral" | "error"
  className?: string
}

function StatCardBadge({ children, variant = "neutral", className = "" }: StatCardBadgeProps) {
  const { variant: cardVariant } = useStatCard()
  const isFeatured = cardVariant === "featured"

  if (isFeatured) {
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
        variant === "success" ? "bg-white/20 text-white" : "bg-red-500/30 text-red-100"
      } ${className}`}>
        {children}
      </span>
    )
  }

  const badgeStyles = {
    success: "bg-[#dff0e0] text-[#1b5e38]",
    warning: "bg-amber-50 text-amber-700",
    neutral: "bg-gray-100 text-gray-600",
    error: "bg-red-50 text-red-600",
  }

  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}

// --- Icon Container ---
interface StatCardIconProps {
  icon: LucideIcon
  colorClass?: string
  bgClass?: string
}

function StatCardIcon({ icon: Icon, colorClass = "text-[#1b5e38]", bgClass = "bg-[#f0f7f0]" }: StatCardIconProps) {
  return (
    <div className={`w-7 h-7 rounded-xl ${bgClass} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
      <Icon size={14} strokeWidth={1.5} className={colorClass} />
    </div>
  )
}

// --- Content / Body ---
function StatCardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative z-10 flex items-end justify-between mt-auto gap-2 ${className}`}>
      {children}
    </div>
  )
}

// --- Value ---
function StatCardValue({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { variant } = useStatCard()
  const isFeatured = variant === "featured"

  return (
    <span className={`text-2xl font-bold font-heading leading-none tabular-nums tracking-tight ${
      isFeatured ? "text-white" : "text-[#1a1a1a]"
    } ${className}`}>
      {children}
    </span>
  )
}

// --- Subtext ---
function StatCardSubtext({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { variant } = useStatCard()
  const isFeatured = variant === "featured"

  return (
    <span className={`text-[11px] font-medium leading-none ${
      isFeatured ? "text-white/70" : "text-gray-500"
    } ${className}`}>
      {children}
    </span>
  )
}

// --- Action Button ---
interface StatCardActionProps {
  href: string
  label?: string
  className?: string
}

function StatCardAction({ href, label, className = "" }: StatCardActionProps) {
  const { variant } = useStatCard()
  const isFeatured = variant === "featured"

  return (
    <Link 
      href={href}
      title={label}
      aria-label={label || "Voir plus"}
      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 active:scale-[0.94] ${
        isFeatured 
          ? "bg-white/20 hover:bg-white/35 text-white" 
          : "bg-gray-100 hover:bg-gray-200 text-gray-600"
      } ${className}`}
    >
      <ChevronRight size={14} />
    </Link>
  )
}

// --- Compound Export ---
export const StatCard = {
  Root: StatCardRoot,
  Header: StatCardHeader,
  Label: StatCardLabel,
  Badge: StatCardBadge,
  Icon: StatCardIcon,
  Content: StatCardContent,
  Value: StatCardValue,
  Subtext: StatCardSubtext,
  Action: StatCardAction,
}
