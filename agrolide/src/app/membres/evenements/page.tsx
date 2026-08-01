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
    <div className="max-w-[1600px] mx-auto px-2 md:px-4 py-4 space-y-8">
      <div>
        <h1 className="dash-page-title">Événements</h1>
        <p className="mt-2 text-gray-500 text-sm">Participez aux rencontres, conférences et ateliers du réseau Agrolide.</p>
      </div>

      {/* Événements à venir */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="icon-circle bg-[#e8f5e9]">
            <Calendar className="w-5 h-5 text-[#1b5e38]" />
          </div>
          <h2 className="dash-title">À venir</h2>
        </div>

        {aVenir.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aVenir.map((evt: any) => {
              const evtDate = evt.date_debut ? new Date(evt.date_debut) : null
              const isValid = evtDate && !isNaN(evtDate.getTime())
              return (
                <div key={evt.id} className="card-glass-hover p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="badge-glass bg-[#50a853]/10 text-[#1b5e38]">
                      {evt.type_evt || "Événement"}
                    </span>
                    {isValid && (
                      <div className="flex flex-col items-center bg-[#1b5e38] text-white rounded-2xl px-3 py-2 min-w-[52px]">
                        <span className="text-lg font-extrabold leading-none">{evtDate.getDate()}</span>
                        <span className="text-[9px] font-bold uppercase mt-0.5">{evtDate.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2">{evt.titre}</h3>
                  
                  {evt.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{evt.description}</p>
                  )}

                  <div className="mt-auto space-y-2 pt-4 border-t border-gray-100/50">
                    {isValid && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                        {evtDate.toLocaleString('fr-FR', {
                          weekday: 'long', day: 'numeric', month: 'long',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    )}
                    {evt.lieu && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
                        {evt.lieu}
                      </div>
                    )}
                  </div>

                  {evt.lien && (
                    <a 
                      href={evt.lien} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn-dash w-full mt-4 text-center"
                    >
                      S'inscrire <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card-glass p-12 text-center flex flex-col items-center">
            <div className="icon-circle-lg bg-gray-50 mb-4">
              <Calendar className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun événement programmé</h3>
            <p className="text-gray-500 text-sm">Revenez bientôt pour découvrir nos prochains événements.</p>
          </div>
        )}
      </div>

      {/* Événements passés */}
      {passes.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-circle bg-gray-100">
              <Clock className="w-5 h-5 text-gray-500" />
            </div>
            <h2 className="dash-title">Événements passés</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {passes.map((evt: any) => {
              const evtDate = evt.date_debut ? new Date(evt.date_debut) : null
              const isValid = evtDate && !isNaN(evtDate.getTime())
              return (
                <div key={evt.id} className="card-glass p-6 opacity-70">
                  <div className="flex justify-between items-start mb-3">
                    <span className="badge-glass bg-gray-100 text-gray-600">
                      {evt.type_evt || "Événement"}
                    </span>
                    {isValid && (
                      <span className="text-xs font-bold text-gray-400">
                        {evtDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 line-clamp-2">{evt.titre}</h3>
                  {evt.lieu && (
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <MapPin className="w-3 h-3 mr-1.5" /> {evt.lieu}
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
