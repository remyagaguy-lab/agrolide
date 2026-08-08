import React from "react"
import Link from "next/link"
import { Briefcase, MapPin, Calendar, ArrowUpRight, FolderOpen } from "lucide-react"

// --- Root ---
function OpportunitiesWidgetRoot({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] flex flex-col flex-1 min-h-0 overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

// --- Header ---
interface OpportunitiesWidgetHeaderProps {
  title?: string
  viewAllHref?: string
  count?: number
}

function OpportunitiesWidgetHeader({ 
  title = "Dernières Opportunités", 
  viewAllHref = "/membres/opportunites",
  count
}: OpportunitiesWidgetHeaderProps) {
  return (
    <div className="p-4 border-b border-gris-border flex justify-between items-center shrink-0 bg-white">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#1b5e38]" />
        <h3 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
          {title}
        </h3>
        {count !== undefined && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#f0fdf4] text-[#1b5e38] tabular-nums">
            {count}
          </span>
        )}
      </div>
      {viewAllHref && (
        <Link 
          href={viewAllHref}
          className="text-[11px] px-2.5 py-1 bg-[#f8f9fa] hover:bg-[#f0f7f0] border border-gris-border hover:border-[#bbf7d0] rounded-lg font-bold text-gray-600 hover:text-[#1b5e38] transition-colors flex items-center gap-1 active:scale-[0.97]"
        >
          <span>Tout voir</span>
          <ArrowUpRight size={12} />
        </Link>
      )}
    </div>
  )
}

// --- Table Container ---
function OpportunitiesWidgetTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-y-auto custom-scrollbar p-2 flex-1 min-h-0">
      <table className="w-full text-left">
        <thead className="bg-[#fcfdfc] sticky top-0 z-10">
          <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <th className="px-4 py-3 border-b border-gris-border">Titre & Entreprise</th>
            <th className="px-4 py-3 border-b border-gris-border hidden sm:table-cell">Localisation</th>
            <th className="px-4 py-3 border-b border-gris-border hidden md:table-cell">Date</th>
            <th className="px-4 py-3 border-b border-gris-border text-right">Contrat</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gris-border">
          {children}
        </tbody>
      </table>
    </div>
  )
}

// --- Row ---
interface OpportunitiesWidgetRowProps {
  id: string | number
  titre: string
  entreprise: string
  localisation?: string | null
  type?: string | null
  createdAt: string | Date
  href?: string
}

function OpportunitiesWidgetRow({
  titre,
  entreprise,
  localisation,
  type,
  createdAt,
  href = "/membres/opportunites"
}: OpportunitiesWidgetRowProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short"
  })

  const getContractColor = (contractType?: string | null) => {
    const lower = (contractType || "").toLowerCase()
    if (lower.includes("cdi")) return "bg-emerald-50 text-emerald-700 border-emerald-200"
    if (lower.includes("stage")) return "bg-blue-50 text-blue-700 border-blue-200"
    if (lower.includes("mission") || lower.includes("freelance")) return "bg-amber-50 text-amber-700 border-amber-200"
    return "bg-[#dff0e0] text-[#1b5e38] border-[#c3dec4]"
  }

  return (
    <tr className="hover:bg-[#f8fbf8] transition-colors group">
      <td className="px-4 py-3">
        <Link href={href} className="block">
          <p className="text-xs font-bold text-[#1a1a1a] line-clamp-1 group-hover:text-[#1b5e38] transition-colors">
            {titre}
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1 font-medium">
            <Briefcase size={11} className="text-gray-400" />
            <span>{entreprise}</span>
          </p>
        </Link>
      </td>
      <td className="px-4 py-3 text-[11px] text-gray-500 font-medium hidden sm:table-cell">
        <div className="flex items-center gap-1">
          <MapPin size={11} className="text-gray-400" />
          <span>{localisation || "Non précisé"}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-[10px] text-gray-400 font-bold uppercase hidden md:table-cell tabular-nums">
        {formattedDate}
      </td>
      <td className="px-4 py-3 text-right">
        <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getContractColor(type)}`}>
          {type || "Offre"}
        </span>
      </td>
    </tr>
  )
}

// --- Empty State ---
function OpportunitiesWidgetEmptyState({ message = "Aucune opportunité pour le moment." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center my-auto">
      <div className="w-10 h-10 rounded-2xl bg-[#f0f7f0] flex items-center justify-center text-[#1b5e38] mb-2">
        <FolderOpen size={20} strokeWidth={1.5} />
      </div>
      <p className="text-xs font-medium text-gray-500">{message}</p>
      <Link 
        href="/membres/opportunites"
        className="mt-3 text-[11px] font-bold text-[#1b5e38] hover:underline"
      >
        Explorer toutes les offres →
      </Link>
    </div>
  )
}

// --- Compound Export ---
export const OpportunitiesWidget = {
  Root: OpportunitiesWidgetRoot,
  Header: OpportunitiesWidgetHeader,
  Table: OpportunitiesWidgetTable,
  Row: OpportunitiesWidgetRow,
  EmptyState: OpportunitiesWidgetEmptyState,
}
