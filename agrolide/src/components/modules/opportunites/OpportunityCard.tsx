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
      case 'bourse': return '🎓'
      case 'appel': return '📢'
      default: return '📌'
    }
  }

  const isExpired = opp.date_limite && new Date(opp.date_limite) < new Date()

  return (
    <div className={`group bg-white border border-[#e8e8e4] rounded-2xl shadow-sm hover:border-[#1b5e38] hover:shadow-md transition-all flex flex-col h-full overflow-hidden ${isExpired ? 'opacity-60 grayscale-[0.3]' : ''}`}>
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <span className="bg-[#f0f7f0] text-[#1b5e38] border border-[#c3dec4] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            {getIcon(opp.type_opp)} {opp.type_opp}
          </span>
          {isExpired && (
            <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Expiré
            </span>
          )}
        </div>
        
        <h3 className="text-sm font-bold text-[#1a1a1a] mb-2 group-hover:text-[#1b5e38] transition-colors leading-snug">
          {opp.titre}
        </h3>
        
        <p className="text-xs text-gray-500 line-clamp-2 mb-4">
          {opp.description}
        </p>
        
        <div className="space-y-1.5 text-xs text-gray-500">
          {opp.lieu && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="line-clamp-1">{opp.lieu}</span>
            </div>
          )}
          
          {opp.montant && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="font-bold text-gray-700">{opp.montant}</span>
            </div>
          )}
          
          {opp.date_limite && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>Expire le {format(new Date(opp.date_limite), "dd MMM yyyy", { locale: fr })}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 pt-0 mt-auto">
        {opp.lien_externe ? (
          <a 
            href={opp.lien_externe}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-gray-50 hover:bg-[#f0f7f0] hover:text-[#1b5e38] text-gray-600 font-bold rounded-lg text-[11px] transition-colors flex items-center justify-center gap-1.5 border border-[#e8e8e4] uppercase tracking-wider"
          >
            Voir l'offre <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <div className="bg-gray-50 py-2 text-center rounded-lg text-[11px] text-gray-500 font-bold border border-[#e8e8e4] uppercase tracking-wider">
            Contactez l'auteur
          </div>
        )}
      </div>
    </div>
  )
}
