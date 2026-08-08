import React from "react"
import Link from "next/link"
import { Calendar as CalendarIcon, MapPin, ArrowRight, Video } from "lucide-react"

interface EventData {
  id: string | number
  titre: string
  date_debut: string | Date
  date_fin?: string | Date | null
  lieu?: string | null
  type_evt?: string | null
  type?: string | null
}

interface EventWidgetProps {
  event: EventData | null
}

export function EventWidget({ event }: EventWidgetProps) {
  if (!event) {
    return (
      <div className="bg-[#151c17] border border-[#233526] rounded-2xl shadow-sm p-5 text-white shrink-0 relative overflow-hidden">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <CalendarIcon size={14} strokeWidth={1.5} className="text-[#50a853]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">Événements à venir</span>
        </div>
        <h3 className="text-sm font-bold text-gray-200 font-heading mb-1">Aucun événement planifié</h3>
        <p className="text-[11px] text-gray-400 mb-4">
          Restez connecté pour être informé des prochaines assemblées générales, webinaires techniques et ateliers du réseau.
        </p>
        <Link
          href="/membres/evenements"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all duration-150"
        >
          <span>Consulter le calendrier</span>
          <ArrowRight size={13} strokeWidth={2} />
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

  const isOnline = event.lieu?.toLowerCase().includes("ligne") || 
                   event.lieu?.toLowerCase().includes("webinar") || 
                   event.lieu?.toLowerCase().includes("zoom") || 
                   event.lieu?.toLowerCase().includes("meet")

  return (
    <div className="bg-[#151c17] border border-[#233526] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] p-5 text-white shrink-0 relative overflow-hidden">
      {/* Ambient subtle glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#1b5e38]/25 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header with status badge */}
        <div className="flex justify-between items-center mb-3.5">
          <div className="flex items-center gap-2 text-[#86efac]">
            <CalendarIcon size={14} strokeWidth={1.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Prochain Événement</span>
          </div>
          
          <div className="flex items-center gap-1.5 bg-[#1e2e21] border border-[#2e7d32]/50 px-2.5 py-0.5 rounded-full">
            <span className={`w-1.5 h-1.5 rounded-full ${isUpcoming ? "bg-[#4ade80] animate-pulse" : "bg-amber-400"}`} />
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#bbf7d0]">
              {isUpcoming ? "Bientôt" : "En cours"}
            </span>
          </div>
        </div>

        {/* Event Content with Date Ribbon */}
        <div className="flex items-start gap-3.5 mb-4">
          {/* Detachable Date Badge */}
          <div className="bg-[#1e2e21] border border-[#2d4932] rounded-xl p-2 text-center shrink-0 w-12 flex flex-col items-center justify-center shadow-inner">
            <span className="text-[9px] font-bold text-[#86efac] tracking-wider">{formattedMonth}</span>
            <span className="text-lg font-bold font-heading text-white leading-tight tabular-nums">{formattedDay}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 
              className="text-xs sm:text-sm font-bold font-heading leading-snug line-clamp-2 text-white"
              style={{ textWrap: "balance" }}
            >
              {event.titre}
            </h3>
            
            <p className="text-[11px] text-gray-300 mt-1 capitalize flex items-center gap-1.5 font-medium">
              <span>{formattedFullDate}</span>
              <span className="text-gray-500">•</span>
              <span className="tabular-nums font-semibold text-[#86efac]">{formattedTime}</span>
            </p>

            {event.lieu && (
              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1.5">
                {isOnline ? (
                  <Video size={11} strokeWidth={1.5} className="text-[#4ade80] shrink-0" />
                ) : (
                  <MapPin size={11} strokeWidth={1.5} className="text-[#4ade80] shrink-0" />
                )}
                <span className="truncate">{event.lieu}</span>
              </p>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/membres/evenements/${event.id}`}
          className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#1b5e38] hover:bg-[#154c2d] active:scale-[0.98] text-white rounded-xl text-xs font-bold tracking-wide transition-all duration-150 shadow-sm"
        >
          <span>Participer / Voir les détails</span>
          <ArrowRight size={13} strokeWidth={2} />
        </Link>
      </div>
    </div>
  )
}
