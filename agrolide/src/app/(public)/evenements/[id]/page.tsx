import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Calendar, Clock, MapPin, Globe, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'

interface EventPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EventPageProps) {
  const p = await params
  const supabase = await createClient()
  const { data: event } = await supabase
    .from('evenements')
    .select('*')
    .eq('id', p.id)
    .single()

  if (!event) return { title: "Événement introuvable" }

  return {
    title: "${event.titre} | Événements Agrolide",
    description: event.description ? event.description.substring(0, 160).replace(/<[^>]+>/g, '') : `Participez à l'événement ${event.titre} organisé par le réseau Agrolide.`,
    openGraph: {
      title: event.titre,
      description: event.description ? event.description.substring(0, 160).replace(/<[^>]+>/g, '') : undefined,
      images: event.image_url ? [event.image_url] : undefined,
    }
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const p = await params
  const supabase = await createClient()
  
  const { data: event, error } = await supabase
    .from('evenements')
    .select('*')
    .eq('id', p.id)
    .single()

  if (error || !event) {
    notFound()
  }

  const dateDebut = new Date(event.date_debut)
  const isPast = dateDebut < new Date()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.titre,
    startDate: event.date_debut,
    endDate: event.date_fin || event.date_debut,
    eventAttendanceMode: event.format === 'en_ligne' ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: event.format === 'en_ligne' ? {
      "@type": "VirtualLocation",
      url: event.lien_inscription || `https://agrolide.org/evenements/${event.id}`
    } : {
      "@type": "Place",
      name: event.lieu || "Lieu à confirmer",
      address: {
        "@type": "PostalAddress",
        streetAddress: event.lieu || "Lieu à confirmer"
      }
    },
    image: event.image_url ? [event.image_url] : [],
    description: event.description ? event.description.replace(/<[^>]+>/g, '') : "",
    organizer: {
      "@type": "Organization",
      name: "Agrolide",
      url: "https://agrolide.org"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb / Back Link */}
        <Link href="/actualites" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Retour aux actualités
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Image */}
          {event.image_url ? (
            <div className="w-full h-[300px] md:h-[400px] relative bg-gray-100">
              <Image 
                src={event.image_url.includes('r2.cloudflarestorage.com') ? `/api/r2-proxy?url=${encodeURIComponent(event.image_url)}` : event.image_url} 
                alt={event.titre} 
                fill 
                className="object-cover" 
                unoptimized={event.image_url.includes('r2.cloudflarestorage.com')}
              />
            </div>
          ) : (
            <div className="w-full h-32 bg-primary-50"></div>
          )}

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold capitalize">
                {event.type_evt.replace('_', ' ')}
              </span>
              {event.en_ligne && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Globe className="w-4 h-4" /> En ligne
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{event.titre}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Date</p>
                  <p className="text-gray-900 font-semibold">{format(dateDebut, "EEEE d MMMM yyyy", { locale: fr })}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Heure</p>
                  <p className="text-gray-900 font-semibold">
                    {format(dateDebut, "HH:mm")} 
                    {event.date_fin && ` - ${format(new Date(event.date_fin), "HH:mm")}`}
                  </p>
                </div>
              </div>

              {!event.en_ligne && event.lieu && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Lieu</p>
                    <p className="text-gray-900 font-semibold">{event.lieu}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="prose prose-green max-w-none text-gray-700 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos de l'événement</h2>
              {event.description ? (
                <div dangerouslySetInnerHTML={{ __html: event.description }} />
              ) : (
                <p className="italic">Aucune description détaillée n'a été fournie pour le moment.</p>
              )}
            </div>

            <div className="flex justify-center border-t border-gray-100 pt-8">
              {isPast ? (
                <button disabled className="px-8 py-3 bg-gray-100 text-gray-500 font-medium rounded-xl">
                  Cet événement est terminé
                </button>
              ) : event.lien_inscription ? (
                <a 
                  href={event.lien_inscription} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
                >
                  S'inscrire à l'événement
                </a>
              ) : (
                <Link href="/auth/login" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                  Connectez-vous pour vous inscrire
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
