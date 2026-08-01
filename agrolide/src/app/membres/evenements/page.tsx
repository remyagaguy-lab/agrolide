import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/db'
import { evenements } from '@/db/schema'
import { gte, lte, desc, asc } from 'drizzle-orm'

export const metadata = { title: "Événements" }

export default async function EvenementsPage() {
  const now = new Date().toISOString()
  
  let aVenir: any[] = []
  let passes: any[] = []
  
  try {
    aVenir = await db.select().from(evenements)
      .where(gte(evenements.date_debut, now))
      .orderBy(asc(evenements.date_debut))
      .limit(12)
    
    passes = await db.select().from(evenements)
      .where(lte(evenements.date_debut, now))
      .orderBy(desc(evenements.date_debut))
      .limit(6)
  } catch (e) {
    console.error("Error fetching events:", e)
  }

  return (
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#1a1a1a] font-heading">Événements</h1>
        <p className="mt-1 text-gray-500 text-xs">Participez aux rencontres, conférences et ateliers du réseau Agrolide.</p>
      </div>

      {/* Événements à venir */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#e8f5e9] flex items-center justify-center">
            <Calendar className="w-4 h-4 text-[#1b5e38]" />
          </div>
          <h2 className="text-lg font-bold text-[#1a1a1a] font-heading">À venir</h2>
        </div>

        {aVenir.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aVenir.map((evt: any) => {
              const evtDate = evt.date_debut ? new Date(evt.date_debut) : null
              const isValid = evtDate && !isNaN(evtDate.getTime())
              return (
                <div key={evt.id} className="bg-white border border-[#e8e8e4] rounded-2xl shadow-sm hover:border-[#1b5e38] hover:shadow-md transition-all p-5 flex flex-col group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-[#f0f7f0] text-[#1b5e38] px-2 py-0.5 rounded text-[10px] font-bold border border-[#c3dec4] uppercase tracking-wider">
                      {evt.type_evt || "Événement"}
                    </span>
                    {isValid && (
                      <div className="flex flex-col items-center bg-gray-50 border border-[#e8e8e4] text-[#1a1a1a] rounded-lg px-2 py-1 min-w-[40px] group-hover:bg-[#1b5e38] group-hover:text-white group-hover:border-[#1b5e38] transition-colors">
                        <span className="text-sm font-extrabold leading-none">{evtDate.getDate()}</span>
                        <span className="text-[8px] font-bold uppercase mt-0.5">{evtDate.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-[#1a1a1a] mb-1.5 leading-snug line-clamp-2 group-hover:text-[#1b5e38] transition-colors">{evt.titre}</h3>
                  
                  {evt.description && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{evt.description}</p>
                  )}

                  <div className="mt-auto space-y-1.5 pt-3 border-t border-[#e8e8e4]">
                    {isValid && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400 shrink-0" />
                        {evtDate.toLocaleString('fr-FR', {
                          weekday: 'long', day: 'numeric', month: 'long',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    )}
                    {evt.lieu && (
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400 shrink-0" />
                        {evt.lieu}
                      </div>
                    )}
                  </div>

                  {evt.lien && (
                    <a 
                      href={evt.lien} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-gray-50 hover:bg-[#f0f7f0] hover:text-[#1b5e38] text-gray-600 font-bold rounded-lg text-[11px] transition-colors flex items-center justify-center gap-1.5 border border-[#e8e8e4] uppercase tracking-wider w-full mt-3 py-2"
                    >
                      S'inscrire <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white border border-[#e8e8e4] rounded-2xl shadow-sm p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-gray-300" />
            </div>
            <h3 className="text-sm font-bold text-[#1a1a1a] mb-1">Aucun événement programmé</h3>
            <p className="text-xs text-gray-500">Revenez bientôt pour découvrir nos prochains événements.</p>
          </div>
        )}
      </div>

      {/* Événements passés */}
      {passes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-[#e8e8e4] flex items-center justify-center">
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            <h2 className="text-lg font-bold text-[#1a1a1a] font-heading">Événements passés</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {passes.map((evt: any) => {
              const evtDate = evt.date_debut ? new Date(evt.date_debut) : null
              const isValid = evtDate && !isNaN(evtDate.getTime())
              return (
                <div key={evt.id} className="bg-white border border-[#e8e8e4] rounded-xl shadow-sm p-4 opacity-70 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold border border-[#e8e8e4] uppercase tracking-wider">
                      {evt.type_evt || "Événement"}
                    </span>
                    {isValid && (
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {evtDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">{evt.titre}</h3>
                  {evt.lieu && (
                    <div className="flex items-center text-[11px] text-gray-500 mt-1.5">
                      <MapPin className="w-3 h-3 mr-1" /> {evt.lieu}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
