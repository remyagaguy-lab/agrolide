'use client'

import React from 'react'
import { Briefcase, MapPin, Calendar, DollarSign, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface OpportunityCardProps {
  opp: any
}

export default function OpportunityCard({ opp }: OpportunityCardProps) {
  const getIcon = (type: string) => {
    switch(type) {
      case 'emploi': return '💼'
      case 'financement': return '💰'
      case 'partenariat': return '🤝'
      default: return '📌'
    }
  }

  const isExpired = opp.date_limite && new Date(opp.date_limite) < new Date()

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full ${isExpired ? 'opacity-70' : ''}`}>
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 capitalize">
            {getIcon(opp.type_opp)} {opp.type_opp}
          </span>
          {isExpired && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
              Expiré
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {opp.titre}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {opp.description}
        </p>
        
        <div className="space-y-2 text-sm text-gray-600">
          {opp.lieu && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
              <span className="line-clamp-1">{opp.lieu}</span>
            </div>
          )}
          
          {opp.montant && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary-500 shrink-0" />
              <span className="font-medium text-gray-900">{opp.montant}</span>
            </div>
          )}
          
          {opp.date_limite && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-500 shrink-0" />
              <span>Expire le {format(new Date(opp.date_limite), "dd MMMM yyyy", { locale: fr })}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 pt-0 mt-auto">
        {opp.lien_externe ? (
          <a 
            href={opp.lien_externe}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-gray-50 hover:bg-primary-50 text-primary-700 font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2 border border-gray-100 hover:border-primary-100"
          >
            Voir l'offre <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <div className="bg-gray-50 py-2.5 text-center rounded-xl text-sm text-gray-500 font-medium border border-gray-100">
            Contactez l'auteur pour plus d'infos
          </div>
        )}
      </div>
    </div>
  )
}
