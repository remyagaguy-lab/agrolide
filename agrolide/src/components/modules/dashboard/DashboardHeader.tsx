import React from "react"
import { Calendar as CalendarIcon, Sparkles } from "lucide-react"

interface DashboardHeaderProps {
  prenom?: string | null
  nom?: string | null
  categorie?: string | null
  specialite?: string | null
}

export function DashboardHeader({ prenom, nom, categorie, specialite }: DashboardHeaderProps) {
  const displayName = prenom ? `${prenom}` : "Membre"
  const formattedDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  // Capitalize first letter of weekday
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 shrink-0">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <h1 
            className="text-xl md:text-2xl font-bold text-[#1a1a1a] font-heading leading-tight tracking-tight"
            style={{ textWrap: "balance" }}
          >
            Bonjour, {displayName} 👋
          </h1>
          {categorie && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#dff0e0] text-[#1b5e38]">
              <Sparkles size={10} />
              {categorie}
            </span>
          )}
        </div>
        <p className="text-[12px] text-gris-muted font-medium">
          {specialite ? `${specialite} • ` : ""}Aperçu de vos activités et opportunités du réseau Agrolide.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] text-[11px] font-bold text-gray-600 tracking-wide tabular-nums">
          <CalendarIcon size={13} className="text-[#1b5e38]" />
          <span>{capitalizedDate}</span>
        </div>
      </div>
    </div>
  )
}
