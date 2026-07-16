'use client'

import React from 'react'
import { Calendar, MapPin, Globe, Users, Clock, FileText, Download } from 'lucide-react'
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
  image_url?: string | null
  presentation_url?: string | null
  ressources_url?: string | null
  [key: string]: any
}

interface EventCardProps {
  event: Evenement
  onInscrireClick: (event: Evenement) => void
  onDetailsClick?: (event: Evenement) => void
}

export default function EventCard({ event, onInscrireClick, onDetailsClick }: EventCardProps) {
  
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
    <div className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full ${isPast ? 'opacity-90' : ''}`}>
      {event.image_url && (
        <div 
          className="w-full h-48 bg-gray-100 relative cursor-pointer"
          onClick={() => onDetailsClick?.(event)}
        >
          <img src={event.image_url} alt={`Affiche ${event.titre}`} className="w-full h-full object-cover" />
          
          {/* Badge statut */}
          <div className="absolute top-4 right-4">
            {isPast ? (
              <span className="px-3 py-1 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-gray-700/50 shadow-sm">
                Passé
              </span>
            ) : (
              <span className="px-3 py-1 bg-green-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-green-500/50 shadow-sm">
                À venir
              </span>
            )}
          </div>
        </div>
      )}
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
        
        <h3 
          className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-primary-600 transition-colors"
          onClick={() => onDetailsClick?.(event)}
        >
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
          <div className="space-y-2">
            {(event.presentation_url || event.ressources_url) ? (
              <div className="flex flex-col gap-2">
                {event.presentation_url && (
                  <a href={event.presentation_url.includes('r2.cloudflarestorage.com') ? `/api/r2-proxy?url=${encodeURIComponent(event.presentation_url)}` : event.presentation_url} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" /> Voir la présentation
                  </a>
                )}
                {event.ressources_url && (
                  <a href={event.ressources_url.includes('r2.cloudflarestorage.com') ? `/api/r2-proxy?url=${encodeURIComponent(event.ressources_url)}` : event.ressources_url} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Accéder aux ressources
                  </a>
                )}
              </div>
            ) : (
              <button disabled className="w-full py-2.5 bg-gray-100 text-gray-500 font-medium rounded-xl text-sm">
                Événement terminé
              </button>
            )}
          </div>
        ) : (
          event.lien_inscription ? (
            <a 
              href={event.lien_inscription} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full py-2.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" /> S'inscrire
            </a>
          ) : (
            <button 
              onClick={() => onInscrireClick(event)}
              className="w-full py-2.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              S'inscrire
            </button>
          )
        )}
      </div>
    </div>
  )
}
