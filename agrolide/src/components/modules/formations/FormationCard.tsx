import Link from 'next/link'
import { Calendar, Clock, MapPin, Users, ChevronRight } from 'lucide-react'

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
    <div className="bg-white rounded-2xl border border-[#e8e8e4] shadow-sm overflow-hidden flex flex-col h-full hover:border-[#1b5e38] hover:shadow-md transition-all group">
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3 gap-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#f0f7f0] text-[#1b5e38] border border-[#c3dec4] uppercase tracking-wider">
              {formation.thematique}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-50 text-gray-600 border border-[#e8e8e4] uppercase tracking-wider">
              {formation.modalite}
            </span>
          </div>
          
          {isGratuit ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 uppercase tracking-wider">
              Gratuit
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200 uppercase tracking-wider">
              {formation.prix} FCFA
            </span>
          )}
        </div>
        
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-1.5 line-clamp-2 group-hover:text-[#1b5e38] transition-colors leading-snug">
          {formation.titre}
        </h3>
        
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">
          {formation.description}
        </p>
        
        <div className="space-y-2 mt-auto pt-3 border-t border-[#e8e8e4]">
          <div className="flex items-center text-[11px] text-gray-500 font-medium">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400 shrink-0" />
            <span className="truncate">
              {nextSession 
                ? `Prochaine : ${new Date(nextSession.date_debut).toLocaleDateString('fr-FR')}` 
                : 'Aucune session'}
            </span>
          </div>
          {nextSession && (
            <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium">
              <div className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400 shrink-0" />
                <span className="truncate max-w-[100px]">{nextSession.lieu}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-3.5 h-3.5 mr-1.5 text-gray-400 shrink-0" />
                <span className={nextSession.places_restantes <= 0 ? "text-red-600" : ""}>
                  {nextSession.places_restantes} place{nextSession.places_restantes > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t border-[#e8e8e4] mt-auto">
        <Link 
          href={`/membres/formations/${formation.id}`}
          className="flex items-center justify-center w-full gap-1.5 text-[11px] font-bold text-[#1b5e38] uppercase tracking-wider hover:text-[#144a2c] transition-colors"
        >
          En savoir plus
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
