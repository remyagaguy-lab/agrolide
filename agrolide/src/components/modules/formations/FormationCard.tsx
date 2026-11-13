import Link from 'next/link'
import { CalendarDays, Clock, MapPin, Users, ChevronRight } from "@/components/ui/icons"
export type SessionType = {
  id: string
  date_debut: string
  date_fin: string
  lieu: string
  places_totales: number
  places_restantes: number
}

export type FormationType = {
  id: string
  titre: string
  description: string
  modalite: 'En ligne' | 'Présentiel' | 'Hybride'
  niveau: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Tous niveaux'
  thematique: string
  prix: number | null
  sessions_formation?: SessionType[]
}

interface FormationCardProps {
  formation: FormationType
}

export function FormationCard({ formation }: FormationCardProps) {
  // Trouver la prochaine session à venir
  const now = new Date()
  const upcomingSessions = formation.sessions_formation
    ?.filter(s => new Date(s.date_debut) > now)
    .sort((a, b) => new Date(a.date_debut).getTime() - new Date(b.date_debut).getTime()) || []
    
  const nextSession = upcomingSessions[0]
  
  const isGratuit = !formation.prix || formation.prix === 0

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col h-full hover:border-primary hover:shadow-md transition-all group">
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3 gap-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-label-sm font-bold bg-primary-container text-primary border border-outline-variant uppercase tracking-wider">
              {formation.thematique}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-label-sm font-bold bg-surface-container-low text-on-surface-variant border border-outline-variant uppercase tracking-wider">
              {formation.modalite}
            </span>
          </div>
          
          {isGratuit ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-label-sm font-bold bg-success-container text-success border border-success/30 uppercase tracking-wider">
              Gratuit
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-label-sm font-bold bg-tertiary-container text-on-warning-container border border-warning/40 uppercase tracking-wider">
              {formation.prix} FCFA
            </span>
          )}
        </div>
        
        <h3 className="text-sm font-bold text-on-surface mb-1.5 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {formation.titre}
        </h3>
        
        <p className="text-xs text-on-surface-muted line-clamp-2 mb-4 flex-1">
          {formation.description}
        </p>
        
        <div className="space-y-2 mt-auto pt-3 border-t border-outline-variant">
          <div className="flex items-center text-label-sm text-on-surface-muted font-medium">
            <CalendarDays className="size-4 mr-1.5 text-on-surface-muted shrink-0" />
            <span className="truncate">
              {nextSession 
                ? `Prochaine : ${new Date(nextSession.date_debut).toLocaleDateString('fr-FR')}` 
                : 'Aucune session'}
            </span>
          </div>
          {nextSession && (
            <div className="flex justify-between items-center text-label-sm text-on-surface-muted font-medium">
              <div className="flex items-center">
                <MapPin className="size-4 mr-1.5 text-on-surface-muted shrink-0" />
                <span className="truncate max-w-[100px]">{nextSession.lieu}</span>
              </div>
              <div className="flex items-center">
                <Users className="size-4 mr-1.5 text-on-surface-muted shrink-0" />
                <span className={nextSession.places_restantes <= 0 ? "text-error" : ""}>
                  {nextSession.places_restantes} place{nextSession.places_restantes > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 py-3 bg-surface-container-low border-t border-outline-variant mt-auto">
        <Link 
          href={`/membres/formations/${formation.id}`}
          className="flex items-center justify-center w-full gap-1.5 text-label-sm font-bold text-primary uppercase tracking-wider hover:text-primary transition-colors"
        >
          En savoir plus
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}
