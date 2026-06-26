'use client'

import React from 'react'
import { Calendar, MapPin, Globe, Users, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type Evenement = {
  id: string
  titre: string
  type_evt: string
  date_debut: string
  date_fin: string | null
  lieu: string | null
  en_ligne: boolean | null
  places_max: number | null
  [key: string]: any
}

interface EventCardProps {
  event: Evenement
  onInscrireClick: (event: Evenement) => void
}

export default function EventCard({ event, onInscrireClick }: EventCardProps) {
  
  // Formatage des dates
  const dateDebut = new Date(event.date_debut)
  const isPast = dateDebut < new Date()
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'webinaire': return '💻'
      case 'atelier': return '🛠️'
      case 'conference': return '🎤'
      case 'rencontre_locale': return '🤝'
      default: return '📅'
    }
  }

  const formatType = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full ${isPast ? 'opacity-70' : ''}`}>
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
            {getEventIcon(event.type_evt)} {formatType(event.type_evt)}
          </span>
          {event.en_ligne && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              <Globe className="w-3 h-3" /> En ligne
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {event.titre}
        </h3>
        
        <div className="space-y-2 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-500 shrink-0" />
            <span>{format(dateDebut, "EEEE d MMMM yyyy", { locale: fr })}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-500 shrink-0" />
            <span>{format(dateDebut, "HH:mm")} {event.date_fin && `- ${format(new Date(event.date_fin), "HH:mm")}`}</span>
          </div>
          
          {!event.en_ligne && event.lieu && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
              <span className="line-clamp-1">{event.lieu}</span>
            </div>
          )}
          
          {event.places_max && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-500 shrink-0" />
              <span>Places limitées ({event.places_max})</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 pt-0 mt-auto">
        {isPast ? (
          <button disabled className="w-full py-2.5 bg-gray-100 text-gray-500 font-medium rounded-xl text-sm">
            Événement terminé
          </button>
        ) : (
          <button 
            onClick={() => onInscrireClick(event)}
            className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl text-sm transition-colors"
          >
            S'inscrire
          </button>
        )}
      </div>
    </div>
  )
}
