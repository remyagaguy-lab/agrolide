import React from "react"
import Link from "next/link"
import { BookOpen, ArrowUpRight, FileText } from "lucide-react"

export interface ResourceItem {
  id: string | number
  titre: string
  categorie?: string | null
  slug?: string | null
  published_at?: string | Date | null
}

export interface ResourcesWidgetProps {
  resources: ResourceItem[]
  title?: string
  viewAllHref?: string
  className?: string
}

export function ResourcesWidget({
  resources,
  title = "Fiches Techniques & Bibliothèque",
  viewAllHref = "/membres/bibliotheque",
  className = ""
}: ResourcesWidgetProps) {
  return (
    <div className={`bg-white rounded-2xl border border-gris-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] flex flex-col shrink-0 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-gris-border flex justify-between items-center shrink-0 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#1b5e38]" />
          <h3 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider font-heading">
            {title}
          </h3>
        </div>
        
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-[11px] font-bold text-[#1b5e38] hover:underline flex items-center gap-1"
          >
            <span>Bibliothèque</span>
            <ArrowUpRight size={11} strokeWidth={2} />
          </Link>
        )}
      </div>

      {/* Resource Items */}
      <div className="p-3 flex flex-col gap-1.5">
        {resources && resources.length > 0 ? (
          resources.map((res) => (
            <Link
              key={res.id}
              href={`/membres/bibliotheque/${res.slug || res.id}`}
              className="flex items-center gap-3 p-2.5 hover:bg-[#f8fbf8] rounded-xl transition-all duration-150 group border border-transparent hover:border-[#e2f3e3]"
            >
              <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] border border-[#dcfce7] flex items-center justify-center shrink-0 group-hover:bg-[#dcfce7] transition-colors">
                <BookOpen size={14} strokeWidth={1.5} className="text-[#1b5e38]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#1a1a1a] truncate group-hover:text-[#1b5e38] transition-colors">
                  {res.titre}
                </p>
                <p className="text-[10px] text-gris-muted uppercase tracking-wider font-bold mt-0.5">
                  {res.categorie || "Guide Technique"}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex items-center justify-center py-4 text-center">
            <p className="text-xs text-gris-muted">Aucune publication récente dans la bibliothèque.</p>
          </div>
        )}
      </div>
    </div>
  )
}
