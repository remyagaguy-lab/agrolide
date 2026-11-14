'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { EncocheBadge } from '@/components/brand'

import { CalendarDays, MapPin, Globe, Users, Clock, FileText, Download, CheckCircle2, Video, Wrench, Mic } from "@/components/ui/icons"
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
  /** « membre » : les liens restent dans l'espace membre ; « public » (défaut) : fiches du site public. */
  mode?: 'membre' | 'public'
  /** Le membre connecté est déjà inscrit à cet événement. */
  inscrit?: boolean
}

const ICONES_TYPE_EVENEMENT = { webinaire: Video, atelier: Wrench, conference: Mic, rencontre_locale: MapPin } as const

/** Pictogramme du type d'événement (une icône par type, CalendarDays par défaut). */
function IconeType({ type }: { type: string }) {
  const Icone = ICONES_TYPE_EVENEMENT[type as keyof typeof ICONES_TYPE_EVENEMENT] ?? CalendarDays
  return <Icone className="inline size-4 align-text-bottom" aria-hidden />
}

export default function EventCard({ event, onInscrireClick, onDetailsClick, mode = 'public', inscrit = false }: EventCardProps) {
  const lienFiche = `${mode === 'membre' ? '/membres' : ''}/evenements/${event.id}`
  
  // Formatage des dates
  const dateDebut = new Date(event.date_debut)
  const isPast = dateDebut < new Date()
  

  const formatType = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  return (
    <div className={`group bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${isPast ? 'opacity-90' : ''}`}>
      {event.image_url && (
        <Link 
          href={lienFiche}
          className="w-full h-40 bg-surface-container relative cursor-pointer block"
        >
          <Image 
            src={event.image_url.includes('r2.cloudflarestorage.com') ? `/api/r2-proxy?url=${encodeURIComponent(event.image_url)}` : event.image_url} 
            alt={`Affiche ${event.titre}`} 
            fill 
            sizes="(max-width: 768px) 100vw, 33vw" 
            className="object-cover object-top" 
            unoptimized={event.image_url.includes('r2.cloudflarestorage.com')}
          />
          
          {/* Badge statut */}
          <div className="absolute top-4 right-4">
            {isPast ? (
              <span className="px-3 py-1 bg-inverse-surface/80 backdrop-blur-sm text-inverse-on-surface text-xs font-semibold rounded-full border border-outline/50 shadow-sm">
                Passé
              </span>
            ) : (
              <span className="px-3 py-1 bg-success/90 backdrop-blur-sm text-on-success text-xs font-semibold rounded-full border border-success/50 shadow-sm">
                À venir
              </span>
            )}
          </div>
        </Link>
      )}
      <div className="p-6 flex-grow">
        <div className="flex items-start gap-4 mb-4">
          {/* Date : le jour au centre optique de l'encoche solaire de la marque, le mois dessous. */}
          <div className="w-14 shrink-0 text-center">
            <EncocheBadge ton={isPast ? 'marque' : 'soleil'} className="w-14">{format(dateDebut, 'd')}</EncocheBadge>
            <p className="mt-1 text-label-sm uppercase text-on-surface-variant">{format(dateDebut, 'MMM', { locale: fr })}</p>
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-container text-primary">
            <IconeType type={event.type_evt} /> {formatType(event.type_evt)}
          </span>
          {event.en_ligne && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-info-container text-info border border-info/30">
              <Globe className="size-4" /> En ligne
            </span>
          )}
          </div>
        </div>
        
        <Link href={lienFiche}>
          <h3 className="text-xl font-bold text-on-surface mb-2 line-clamp-2 hover:text-primary transition-colors">
            {event.titre}
          </h3>
        </Link>
        
        <div className="space-y-2 mt-4 text-sm text-on-surface-variant">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary shrink-0" />
            <span>{format(dateDebut, "EEEE d MMMM yyyy", { locale: fr })}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary shrink-0" />
            <span>{format(dateDebut, "HH:mm")} {event.date_fin && `- ${format(new Date(event.date_fin), "HH:mm")}`}</span>
          </div>
          
          {!event.en_ligne && event.lieu && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary shrink-0" />
              <span className="line-clamp-1">{event.lieu}</span>
            </div>
          )}
          
          {event.places_max && (
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary shrink-0" />
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
                  <a href={event.presentation_url.includes('r2.cloudflarestorage.com') ? `/api/r2-proxy?url=${encodeURIComponent(event.presentation_url)}` : event.presentation_url} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-success-container hover:bg-success-container text-success border border-success/30 font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                    <FileText className="size-4" /> Voir la présentation
                  </a>
                )}
                {event.ressources_url && (
                  <a href={event.ressources_url.includes('r2.cloudflarestorage.com') ? `/api/r2-proxy?url=${encodeURIComponent(event.ressources_url)}` : event.ressources_url} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-info-container hover:bg-info-container text-info border border-info/30 font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                    <Download className="size-4" /> Accéder aux ressources
                  </a>
                )}
              </div>
            ) : (
              <button disabled className="w-full py-2.5 bg-surface-container text-on-surface-muted font-medium rounded-xl text-sm">
                Événement passé
              </button>
            )}
          </div>
        ) : event.inscription_requise === false ? (
          <p className="w-full py-2.5 text-center text-sm text-on-surface-muted">Entrée libre, sans inscription</p>
        ) : (
          inscrit ? (
            <p className="w-full py-2.5 bg-success-container text-on-success-container border border-success/30 font-medium rounded-xl text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="size-4" aria-hidden="true" /> Vous êtes inscrit(e)
            </p>
          ) : event.lien_inscription ? (
            <a 
              href={event.lien_inscription} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full py-2.5 bg-success-container hover:bg-success-container text-success border border-success/30 font-medium rounded-xl text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Globe className="size-4" /> S'inscrire
            </a>
          ) : (
            <button 
              onClick={() => onInscrireClick(event)}
              className="w-full py-2.5 bg-success-container hover:bg-success-container text-success border border-success/30 font-medium rounded-xl text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              S'inscrire
            </button>
          )
        )}
      </div>
    </div>
  )
}
