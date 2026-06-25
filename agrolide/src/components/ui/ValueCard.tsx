import * as React from "react"
import { cn } from "@/lib/utils/formatters"
import { LucideIcon } from "lucide-react"

export interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function ValueCard({ icon: Icon, title, description, className }: ValueCardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-xl shadow-md border border-[var(--color-gris-clair)] flex flex-col items-center text-center transition-transform hover:-translate-y-1", className)}>
      <div className="w-16 h-16 rounded-full bg-[#E8F3EB] text-[var(--color-vert-principal)] flex items-center justify-center mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-heading font-bold text-[var(--color-vert-principal)] mb-3">
        {title}
      </h3>
      <p className="text-[var(--color-gris-texte)] leading-relaxed">
        {description}
      </p>
    </div>
  )
}
