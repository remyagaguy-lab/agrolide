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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4 gap-2">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700">
              {formation.thematique}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
              {formation.modalite}
            </span>
          </div>
          
          {isGratuit ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800">
              Gratuit
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-800">
              {formation.prix} FCFA
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {formation.titre}
        </h3>
        
        <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1">
          {formation.description}
        </p>
        
        <div className="space-y-3 mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              {nextSession 
                ? `Prochaine session : ${new Date(nextSession.date_debut).toLocaleDateString('fr-FR')}` 
                : 'Aucune session programmée'}
            </span>
          </div>
          {nextSession && (
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span className="truncate max-w-[120px]">{nextSession.lieu}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-400" />
                <span className={nextSession.places_restantes <= 0 ? "text-red-600 font-medium" : ""}>
                  {nextSession.places_restantes} place{nextSession.places_restantes > 1 ? 's' : ''} libre{nextSession.places_restantes > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-auto">
        <Link 
          href={`/membres/formations/${formation.id}`}
          className="flex items-center justify-center w-full gap-2 text-sm font-medium text-green-700 hover:text-green-800"
        >
          En savoir plus
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
