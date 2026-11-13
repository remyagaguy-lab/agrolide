'use client'

import React from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

import { Briefcase, MapPin, CalendarDays, Coins, ExternalLink, Award, Megaphone, Telescope } from "@/components/ui/icons"
interface OpportunityCardProps {
  opp: any
}

const ICONES_TYPE_OPPORTUNITE = { emploi: Briefcase, bourse: Award, appel: Megaphone } as const

/** Pictogramme du type d'opportunité (Telescope par défaut). */
function IconeType({ type }: { type: string }) {
  const Icone = ICONES_TYPE_OPPORTUNITE[type as keyof typeof ICONES_TYPE_OPPORTUNITE] ?? Telescope
  return <Icone className="inline size-4 align-text-bottom" aria-hidden />
}

export default function OpportunityCard({ opp }: OpportunityCardProps) {

  const isExpired = opp.date_limite && new Date(opp.date_limite) < new Date()

  return (
    <div className={`group bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm hover:border-primary hover:shadow-md transition-all flex flex-col h-full overflow-hidden ${isExpired ? 'opacity-60 grayscale-[0.3]' : ''}`}>
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <span className="bg-primary-container text-primary border border-outline-variant px-2 py-0.5 rounded text-label-sm font-bold uppercase tracking-wider">
            <IconeType type={opp.type_opp} /> {opp.type_opp}
          </span>
          {isExpired && (
            <span className="bg-error-container text-error px-2 py-0.5 rounded text-label-sm font-bold uppercase tracking-wider">
              Expiré
            </span>
          )}
        </div>
        
        <h3 className="text-sm font-bold text-on-surface mb-2 group-hover:text-primary transition-colors leading-snug">
          {opp.titre}
        </h3>
        
        <p className="text-xs text-on-surface-muted line-clamp-2 mb-4">
          {opp.description}
        </p>
        
        <div className="space-y-1.5 text-xs text-on-surface-muted">
          {opp.lieu && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-on-surface-muted shrink-0" />
              <span className="line-clamp-1">{opp.lieu}</span>
            </div>
          )}
          
          {opp.montant && (
            <div className="flex items-center gap-2">
              <Coins className="size-4 text-on-surface-muted shrink-0" />
              <span className="font-bold text-on-surface-variant">{opp.montant}</span>
            </div>
          )}
          
          {opp.date_limite && (
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-on-surface-muted shrink-0" />
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
            className="w-full py-2 bg-surface-container-low hover:bg-primary-container hover:text-primary text-on-surface-variant font-bold rounded-lg text-label-sm transition-colors flex items-center justify-center gap-1.5 border border-outline-variant uppercase tracking-wider"
          >
            Voir l'offre <ExternalLink className="size-4" />
          </a>
        ) : (
          <div className="bg-surface-container-low py-2 text-center rounded-lg text-label-sm text-on-surface-muted font-bold border border-outline-variant uppercase tracking-wider">
            Contactez l'auteur
          </div>
        )}
      </div>
    </div>
  )
}
