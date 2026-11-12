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
        <h1 className="text-xl md:text-2xl font-bold text-on-surface font-heading">Événements</h1>
        <p className="mt-1 text-on-surface-muted text-xs">Participez aux rencontres, conférences et ateliers du réseau Agrolide.</p>
      </div>

      {/* Événements à venir */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-success-container flex items-center justify-center">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-on-surface font-heading">À venir</h2>
        </div>

        {aVenir.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aVenir.map((evt: any) => {
              const evtDate = evt.date_debut ? new Date(evt.date_debut) : null
              const isValid = evtDate && !isNaN(evtDate.getTime())
              return (
                <div key={evt.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm hover:border-primary hover:shadow-md transition-all p-5 flex flex-col group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-primary-container text-primary px-2 py-0.5 rounded text-label-sm font-bold border border-outline-variant uppercase tracking-wider">
                      {evt.type_evt || "Événement"}
                    </span>
                    {isValid && (
                      <div className="flex flex-col items-center bg-surface-container-low border border-outline-variant text-on-surface rounded-lg px-2 py-1 min-w-[40px] group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-colors">
                        <span className="text-sm font-extrabold leading-none">{evtDate.getDate()}</span>
                        <span className="text-label-sm font-bold uppercase mt-0.5">{evtDate.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-on-surface mb-1.5 leading-snug line-clamp-2 group-hover:text-primary transition-colors">{evt.titre}</h3>
                  
                  {evt.description && (
                    <p className="text-xs text-on-surface-muted mb-3 line-clamp-2">{evt.description}</p>
                  )}

                  <div className="mt-auto space-y-1.5 pt-3 border-t border-outline-variant">
                    {isValid && (
                      <div className="flex items-center text-xs text-on-surface-muted">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-on-surface-muted shrink-0" />
                        {evtDate.toLocaleString('fr-FR', {
                          weekday: 'long', day: 'numeric', month: 'long',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    )}
                    {evt.lieu && (
                      <div className="flex items-center text-xs text-on-surface-muted">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-on-surface-muted shrink-0" />
                        {evt.lieu}
                      </div>
                    )}
                  </div>

                  {evt.lien && (
                    <a 
                      href={evt.lien} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-surface-container-low hover:bg-primary-container hover:text-primary text-on-surface-variant font-bold rounded-lg text-label-sm transition-colors flex items-center justify-center gap-1.5 border border-outline-variant uppercase tracking-wider w-full mt-3 py-2"
                    >
                      S'inscrire <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-outline" />
            </div>
            <h3 className="text-sm font-bold text-on-surface mb-1">Aucun événement programmé</h3>
            <p className="text-xs text-on-surface-muted">Revenez bientôt pour découvrir nos prochains événements.</p>
          </div>
        )}
      </div>

      {/* Événements passés */}
      {passes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-center">
              <Clock className="w-4 h-4 text-on-surface-muted" />
            </div>
            <h2 className="text-lg font-bold text-on-surface font-heading">Événements passés</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {passes.map((evt: any) => {
              const evtDate = evt.date_debut ? new Date(evt.date_debut) : null
              const isValid = evtDate && !isNaN(evtDate.getTime())
              return (
                <div key={evt.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-4 opacity-70 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-surface-container-low text-on-surface-variant px-2 py-0.5 rounded text-label-sm font-bold border border-outline-variant uppercase tracking-wider">
                      {evt.type_evt || "Événement"}
                    </span>
                    {isValid && (
                      <span className="text-label-sm font-bold text-on-surface-muted uppercase tracking-wider">
                        {evtDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-on-surface line-clamp-2 leading-snug">{evt.titre}</h3>
                  {evt.lieu && (
                    <div className="flex items-center text-label-sm text-on-surface-muted mt-1.5">
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
