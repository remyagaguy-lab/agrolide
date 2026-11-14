'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

import { Briefcase, MapPin, CalendarDays, Coins, ArrowRight, Award, Megaphone, Telescope } from "@/components/ui/icons"
interface OpportunityCardProps {
  opp: any
}

const ICONES_TYPE_OPPORTUNITE = { emploi: Briefcase, bourse: Award, appel: Megaphone } as const

/** Pictogramme du type d'opportunité (Telescope par défaut). */
function IconeType({ type }: { type: string }) {
  const Icone = ICONES_TYPE_OPPORTUNITE[type as keyof typeof ICONES_TYPE_OPPORTUNITE] ?? Telescope
  return <Icone className="inline size-4 align-text-bottom" aria-hidden />
}

/** Aperçu de la carte : premier paragraphe, sans la mise en forme (gras, listes) de la page de lecture. */
function apercu(texte: string | null | undefined): string {
  const premier = (texte ?? '').split(/\n\s*\n/)[0] ?? ''
  return premier.replace(/[*_#>]/g, '').replace(/^\s*[-•]\s+/gm, '').replace(/\s+/g, ' ').trim()
}

export default function OpportunityCard({ opp }: OpportunityCardProps) {

  // Même carte dans l'espace membre et sur le site public : la page de lecture se trouve au même endroit logique.
  const base = (usePathname() ?? '').startsWith('/membres') ? '/membres/opportunites' : '/opportunites'
  const isExpired = opp.date_limite && new Date(opp.date_limite) < new Date()

  return (
    <div className={`group relative bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm hover:border-primary hover:shadow-md transition-all flex flex-col h-full overflow-hidden ${isExpired ? 'opacity-60 grayscale-[0.3]' : ''}`}>
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
          {/* Lien étiré : toute la carte est cliquable et mène à la page de lecture. */}
          <Link href={`${base}/${opp.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {opp.titre}
          </Link>
        </h3>
        
        <p className="text-xs text-on-surface-muted line-clamp-2 mb-4">
          {apercu(opp.description)}
        </p>
        
        <div className="space-y-1.5 text-xs text-on-surface-muted">
          {opp.organisation && (
            <div className="flex items-center gap-2">
              <Briefcase className="size-4 text-on-surface-muted shrink-0" />
              <span className="line-clamp-1 font-medium text-on-surface-variant">{opp.organisation}</span>
            </div>
          )}

          {(opp.lieu || opp.pays) && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-on-surface-muted shrink-0" />
              <span className="line-clamp-1">{opp.lieu || opp.pays}</span>
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
        <Link
          href={`${base}/${opp.id}`}
          className="w-full py-2 bg-surface-container-low hover:bg-primary-container hover:text-primary text-on-surface-variant font-bold rounded-lg text-label-sm transition-colors flex items-center justify-center gap-1.5 border border-outline-variant uppercase tracking-wider"
        >
          Lire l'offre <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
