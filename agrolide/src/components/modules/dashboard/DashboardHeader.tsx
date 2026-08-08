import React from "react"
import Link from "next/link"
import { Calendar as CalendarIcon, MapPin, Building2, UserCheck, ArrowUpRight } from "lucide-react"

interface DashboardHeaderProps {
  prenom?: string | null
  nom?: string | null
  categorie?: string | null
  specialite?: string | null
  organisation?: string | null
  pays?: string | null
  ville?: string | null
}

export function DashboardHeader({
  prenom,
  nom,
  categorie,
  specialite,
  organisation,
  pays,
  ville
}: DashboardHeaderProps) {
  const displayName = prenom ? `${prenom}${nom ? ` ${nom}` : ""}` : "Membre"

  const formattedDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  // Mapping category badge styles according to UI Bible
  const getCategoryBadge = (cat?: string | null) => {
    if (!cat) return null
    const lower = cat.toLowerCase()
    if (lower.includes("professionnel")) {
      return {
        label: "Membre Professionnel",
        className: "bg-[#1b5e38] text-white"
      }
    }
    if (lower.includes("junior") || lower.includes("etudiant") || lower.includes("étudiant")) {
      return {
        label: "Membre Junior",
        className: "bg-[#e8f5e9] text-[#1b5e38] border border-[#c8e6c9]"
      }
    }
    if (lower.includes("partenaire")) {
      return {
        label: "Partenaire",
        className: "bg-[#878e2c] text-white"
      }
    }
    if (lower.includes("senior") || lower.includes("expert")) {
      return {
        label: "Membre Senior",
        className: "bg-[#fef3e2] text-[#8a4e00] border border-[#fed7aa]"
      }
    }
    return {
      label: cat,
      className: "bg-[#e8f5e9] text-[#1b5e38]"
    }
  }

  const categoryBadge = getCategoryBadge(categorie)

  const metaItems = [
    specialite,
    organisation,
    ville && pays ? `${ville}, ${pays}` : pays || ville
  ].filter(Boolean)

  return (
    <div className="bg-white rounded-2xl border border-gris-border p-5 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] shrink-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Greeting, Category Badge, and Profile Metadata */}
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 
              className="text-xl sm:text-2xl font-bold text-[#1a1a1a] font-heading tracking-tight leading-tight"
              style={{ textWrap: "balance" }}
            >
              Bonjour, {displayName}
            </h1>

            {categoryBadge && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${categoryBadge.className}`}>
                <UserCheck size={12} strokeWidth={2} />
                <span>{categoryBadge.label}</span>
              </span>
            )}
          </div>

          {/* Subtitle / Metadata row */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-gris-muted font-medium">
            {metaItems.length > 0 ? (
              metaItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-gray-300">•</span>}
                  <span className="truncate">{item}</span>
                </React.Fragment>
              ))
            ) : (
              <span>Espace membre officiel Agrolide • Réseau panafricain des professionnels du secteur agricole</span>
            )}
          </div>
        </div>

        {/* Right: Date Pill & Quick Links */}
        <div className="flex items-center flex-wrap gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gris-border">
          <div className="inline-flex items-center gap-2 bg-[#f8f8f6] border border-gris-border px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 tracking-normal tabular-nums">
            <CalendarIcon size={14} strokeWidth={1.5} className="text-[#1b5e38]" />
            <span>{capitalizedDate}</span>
          </div>

          <Link
            href="/membres/annuaire"
            className="inline-flex items-center gap-1.5 bg-[#f0f7f0] hover:bg-[#e2f3e3] border border-[#c3dec4] text-[#1b5e38] text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-150 active:scale-[0.96]"
          >
            <span>Annuaire des pairs</span>
            <ArrowUpRight size={13} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  )
}
