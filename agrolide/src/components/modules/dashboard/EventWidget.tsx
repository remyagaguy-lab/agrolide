import React from "react"
import Link from "next/link"
import { Calendar as CalendarIcon, MapPin, ArrowRight } from "lucide-react"

interface EventData {
  id: string | number
  titre: string
  date_debut: string | Date
  date_fin?: string | Date | null
  lieu?: string | null
  type?: string | null
}

interface EventWidgetProps {
  event: EventData | null
}

export function EventWidget({ event }: EventWidgetProps) {
  if (!event) {
    return (
      <div className="bg-[#1a1a1a] rounded-2xl shadow-sm p-5 text-white shrink-0 relative overflow-hidden">
        <div className="flex items-center gap-2 text-gray-400 mb-3">
          <CalendarIcon size={14} className="text-[#1b5e38]" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Événement à venir</span>
        </div>
        <h4 className="text-sm font-bold text-gray-200 mb-1">Aucun événement planifié</h4>
        <p className="text-[11px] text-gray-400 mb-4">Restez connecté pour être informé des prochaines rencontres et webinaires.</p>
        <Link
          href="/membres/evenements"
          className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-[11px] font-bold transition-colors"
        >
          <span>Voir le calendrier complet</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    )
  }

  const startDate = new Date(event.date_debut)
  const isUpcoming = startDate.getTime() > Date.now()
  
  const formattedDay = startDate.getDate()
  const formattedMonth = startDate.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase()
  const formattedTime = startDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  const formattedFullDate = startDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })

  return (
    <div className="bg-[#151c17] border border-[#233526] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-5 text-white shrink-0 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#1b5e38]/30 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header with status badge */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-[#a3e635]">
            <CalendarIcon size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Prochain Événement</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#1b5e38]/60 border border-[#2e7d32]/50 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#bbf7d0]">
              {isUpcoming ? "Bientôt" : "En cours"}
            </span>
          </div>
        </div>

        {/* Event Content with Date Ribbon */}
        <div className="flex items-start gap-3.5 mb-4">
          {/* Date Badge */}
          <div className="bg-[#1e2e21] border border-[#2d4932] rounded-xl p-2 text-center shrink-0 w-12 flex flex-col items-center justify-center">
            <span className="text-[9px] font-bold text-[#86efac] tracking-wider">{formattedMonth}</span>
            <span className="text-lg font-bold font-heading text-white leading-tight tabular-nums">{formattedDay}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold font-heading leading-snug line-clamp-2 text-white">
              {event.titre}
            </h4>
            <p className="text-[11px] text-gray-300 mt-1 capitalize flex items-center gap-1">
              <span>{formattedFullDate}</span>
              <span>•</span>
              <span className="tabular-nums">{formattedTime}</span>
            </p>
            {event.lieu && (
              <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                <MapPin size={10} className="text-[#4ade80]" />
                <span className="truncate">{event.lieu}</span>
              </p>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/membres/evenements/${event.id}`}
          className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#1b5e38] hover:bg-[#154c2d] active:scale-[0.98] text-white rounded-xl text-[11px] font-bold tracking-wide transition-all shadow-sm"
        >
          <span>Participer / Voir les détails</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
