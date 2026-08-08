import React from "react"
import Link from "next/link"
import { Briefcase, MapPin, ArrowUpRight, FolderOpen } from "lucide-react"

export interface OpportunityItem {
  id: string | number
  titre: string
  organisation?: string | null
  entreprise?: string | null
  pays?: string | null
  localisation?: string | null
  type_opp?: string | null
  type?: string | null
  created_at?: string | Date | null
}

export interface OpportunitiesWidgetProps {
  opportunities: OpportunityItem[]
  title?: string
  viewAllHref?: string
  className?: string
}

export function OpportunitiesWidget({
  opportunities,
  title = "Dernières Opportunités & Missions",
  viewAllHref = "/membres/opportunites",
  className = ""
}: OpportunitiesWidgetProps) {
  const getContractBadge = (contractType?: string | null) => {
    const lower = (contractType || "").toLowerCase()
    if (lower.includes("cdi")) {
      return "bg-[#e8f5e9] text-[#1b5e38] border-[#c8e6c9]"
    }
    if (lower.includes("stage") || lower.includes("internship")) {
      return "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]"
    }
    if (lower.includes("mission") || lower.includes("consultant") || lower.includes("consultation") || lower.includes("freelance")) {
      return "bg-[#fef3e2] text-[#8a4e00] border-[#fed7aa]"
    }
    return "bg-[#f8f8f6] text-[#4a4a4a] border-gris-border"
  }

  return (
    <div className={`bg-white rounded-2xl border border-gris-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] flex flex-col flex-1 min-h-0 overflow-hidden ${className}`}>
      {/* Widget Header */}
      <div className="px-5 py-4 border-b border-gris-border flex justify-between items-center shrink-0 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#1b5e38]" />
          <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider font-heading">
            {title}
          </h2>
          {opportunities.length > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#1b5e38] tabular-nums">
              {opportunities.length}
            </span>
          )}
        </div>

        {viewAllHref && (
          <Link 
            href={viewAllHref}
            className="text-[11px] px-3 py-1.5 bg-[#f8f8f6] hover:bg-[#f0f7f0] border border-gris-border hover:border-[#c3dec4] rounded-lg font-bold text-gray-700 hover:text-[#1b5e38] transition-all duration-150 flex items-center gap-1.5 active:scale-[0.96]"
          >
            <span>Toutes les offres</span>
            <ArrowUpRight size={12} strokeWidth={2} />
          </Link>
        )}
      </div>

      {/* Table Body or Empty State */}
      {opportunities.length > 0 ? (
        <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1 min-h-0">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f8f8f6] sticky top-0 z-10">
              <tr className="text-[10px] font-bold text-gris-muted uppercase tracking-wider border-b border-gris-border">
                <th className="px-5 py-3 font-semibold">Poste / Mission & Organisation</th>
                <th className="px-4 py-3 font-semibold hidden sm:table-cell">Localisation</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Date</th>
                <th className="px-5 py-3 font-semibold text-right">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-border">
              {opportunities.map((opp) => {
                const displayCompany = opp.organisation || opp.entreprise || "Agrolide"
                const displayLocation = opp.pays || opp.localisation || "Afrique (Multi-pays)"
                const displayType = opp.type_opp || opp.type || "Offre"
                const formattedDate = opp.created_at
                  ? new Date(opp.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short"
                    })
                  : "—"

                return (
                  <tr key={opp.id} className="hover:bg-[#fcfdfc] transition-colors duration-150 group">
                    {/* Title and Organisation */}
                    <td className="px-5 py-3.5">
                      <Link href={`/membres/opportunites`} className="block">
                        <p className="text-xs font-bold text-[#1a1a1a] line-clamp-1 group-hover:text-[#1b5e38] transition-colors">
                          {opp.titre}
                        </p>
                        <p className="text-[11px] text-gris-muted mt-0.5 flex items-center gap-1.5 font-medium">
                          <Briefcase size={11} strokeWidth={1.5} className="text-gray-400 shrink-0" />
                          <span className="truncate">{displayCompany}</span>
                        </p>
                      </Link>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5 text-[11px] text-gray-600 font-medium hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={11} strokeWidth={1.5} className="text-gray-400 shrink-0" />
                        <span className="truncate">{displayLocation}</span>
                      </div>
                    </td>

                    {/* Published Date */}
                    <td className="px-4 py-3.5 text-[11px] text-gris-muted font-medium hidden md:table-cell tabular-nums">
                      {formattedDate}
                    </td>

                    {/* Contract Type Badge */}
                    <td className="px-5 py-3.5 text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getContractBadge(displayType)}`}>
                        {displayType}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center my-auto">
          <div className="w-10 h-10 rounded-2xl bg-[#f0f7f0] border border-[#c3dec4] flex items-center justify-center text-[#1b5e38] mb-3">
            <FolderOpen size={20} strokeWidth={1.5} />
          </div>
          <p className="text-xs font-semibold text-gray-700">Aucune opportunité récente</p>
          <p className="text-[11px] text-gris-muted mt-1 max-w-xs">
            Les nouvelles offres d'emploi, de stages et d'appels à projets agricoles apparaîtront ici.
          </p>
          <Link 
            href="/membres/opportunites"
            className="mt-3 text-xs font-bold text-[#1b5e38] hover:underline inline-flex items-center gap-1"
          >
            <span>Consulter les opportunités archivées</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>
      )}
    </div>
  )
}
