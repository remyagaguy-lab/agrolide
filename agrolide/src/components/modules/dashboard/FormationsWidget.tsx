import React from "react"
import Link from "next/link"
import { BookOpen, ArrowUpRight, GraduationCap } from "lucide-react"

export interface FormationItem {
  id: string
  titre: string
  thematique?: string | null
  niveau?: string | null
  modalite?: string | null
  source_externe?: string | null
  created_at?: string | Date | null
}

export interface FormationsWidgetProps {
  formations: FormationItem[]
  title?: string
  viewAllHref?: string
  className?: string
}

export function FormationsWidget({
  formations,
  title = "Formations & Cours",
  viewAllHref = "/formations",
  className = ""
}: FormationsWidgetProps) {
  return (
    <div className={`bg-white rounded-2xl border border-gris-border shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] flex flex-col flex-1 min-h-0 overflow-hidden ${className}`}>
      {/* Widget Header */}
      <div className="px-5 py-4 border-b border-gris-border flex justify-between items-center shrink-0 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#f99e1d]" />
          <h2 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider font-heading">
            {title}
          </h2>
          {formations.length > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 tabular-nums">
              {formations.length}
            </span>
          )}
        </div>

        {viewAllHref && (
          <Link 
            href={viewAllHref}
            className="text-[11px] px-3 py-1.5 bg-[#f8f8f6] hover:bg-orange-50 border border-gris-border hover:border-orange-200 rounded-lg font-bold text-gray-700 hover:text-orange-700 transition-all duration-150 flex items-center gap-1.5 active:scale-[0.96]"
          >
            <span>Catalogue complet</span>
            <ArrowUpRight size={12} strokeWidth={2} />
          </Link>
        )}
      </div>

      {/* Table Body or Empty State */}
      {formations.length > 0 ? (
        <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1 min-h-0">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f8f8f6] sticky top-0 z-10">
              <tr className="text-[10px] font-bold text-gris-muted uppercase tracking-wider border-b border-gris-border">
                <th className="px-5 py-3 font-semibold">Titre & Source</th>
                <th className="px-4 py-3 font-semibold hidden sm:table-cell">Thématique</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Niveau</th>
                <th className="px-5 py-3 font-semibold text-right">Modalité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-border">
              {formations.map((form) => {
                const displaySource = form.source_externe || "Agrolide"
                const displayTheme = form.thematique || "Général"
                const displayNiveau = form.niveau || "Tous niveaux"
                const displayModalite = form.modalite || "En ligne"

                return (
                  <tr key={form.id} className="hover:bg-[#fcfdfc] transition-colors duration-150 group">
                    {/* Title and Source */}
                    <td className="px-5 py-3.5">
                      <Link href={`/formations/${form.id}`} className="block">
                        <p className="text-xs font-bold text-[#1a1a1a] line-clamp-1 group-hover:text-orange-700 transition-colors">
                          {form.titre}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5 font-medium">
                          Source : {displaySource}
                        </p>
                      </Link>
                    </td>

                    {/* Thematique (Hidden on very small screens) */}
                    <td className="px-4 py-3.5 hidden sm:table-cell align-middle">
                      <span className="text-[11px] font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                        {displayTheme}
                      </span>
                    </td>

                    {/* Niveau (Hidden on mobile) */}
                    <td className="px-4 py-3.5 hidden md:table-cell align-middle">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <GraduationCap size={14} className="text-gray-400" />
                        <span className="text-[11px] font-medium">{displayNiveau}</span>
                      </div>
                    </td>

                    {/* Modalite */}
                    <td className="px-5 py-3.5 text-right align-middle">
                      <span className="inline-block px-2 py-1 rounded bg-[#f8f8f6] text-[#4a4a4a] border border-gris-border text-[10px] font-bold uppercase tracking-wider">
                        {displayModalite}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center flex-1 min-h-[160px]">
          <div className="w-10 h-10 rounded-full bg-[#f8f8f6] flex items-center justify-center mb-3">
            <BookOpen size={18} className="text-gray-400" />
          </div>
          <p className="text-sm font-bold text-gray-900">Aucune formation disponible</p>
          <p className="text-xs text-gray-500 mt-1 max-w-[250px]">
            De nouveaux cours seront publiés prochainement.
          </p>
        </div>
      )}
    </div>
  )
}
