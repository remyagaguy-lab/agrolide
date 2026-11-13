import React from 'react'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Button, buttonVariants } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DetailHero } from '@/components/ui/DetailHero'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'
import { marked } from 'marked'
import { db } from '@/db'
import { evenements } from '@/db/schema'
import { eq } from 'drizzle-orm'

import { CalendarDays, Clock, MapPin, Globe } from "@/components/ui/icons"
interface EventPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EventPageProps) {
  const p = await params
  const event = await db.query.evenements.findFirst({
    where: eq(evenements.id, p.id)
  })

  if (!event || !event.publie) return { title: "Événement introuvable", robots: { index: false } }

  return {
    title: event.titre,
    alternates: { canonical: `/evenements/${event.id}` },
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
  
  const event = await db.query.evenements.findFirst({
    where: eq(evenements.id, p.id)
  })

  // Un événement non publié (brouillon) ne doit pas être visible publiquement
  if (!event || !event.publie) {
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
    eventAttendanceMode: event.en_ligne ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: event.en_ligne ? {
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

  const imageSrc = event.image_url
    ? event.image_url.includes('r2.cloudflarestorage.com')
      ? `/api/r2-proxy?url=${encodeURIComponent(event.image_url)}`
      : event.image_url
    : null

  return (
    <div className="min-h-screen bg-surface-container-low">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <DetailHero
        label="Événement"
        title={event.titre}
        image={imageSrc ? { src: imageSrc, alt: `Visuel de l'événement « ${event.titre} »` } : null}
        breadcrumb={[{ label: "Événements", href: "/evenements" }, { label: event.titre }]}
      >
        <Badge variant="neutral" className="capitalize">{event.type_evt.replace('_', ' ')}</Badge>
        {event.en_ligne && (
          <Badge variant="info">
            <Globe className="size-4" aria-hidden="true" /> En ligne
          </Badge>
        )}
      </DetailHero>

      <div className="container max-w-4xl py-10 md:py-14">
        <Card variant="filled" className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div>
              <p className="text-body-sm text-on-surface-variant">Date</p>
              <p className="text-title-md text-on-surface">{format(dateDebut, "EEEE d MMMM yyyy", { locale: fr })}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div>
              <p className="text-body-sm text-on-surface-variant">Heure</p>
              <p className="text-title-md text-on-surface">
                {format(dateDebut, "HH:mm")}
                {event.date_fin && ` - ${format(new Date(event.date_fin), "HH:mm")}`}
              </p>
            </div>
          </div>

          {!event.en_ligne && event.lieu && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 text-primary" aria-hidden="true" />
              <div>
                <p className="text-body-sm text-on-surface-variant">Lieu</p>
                <p className="text-title-md text-on-surface">{event.lieu}</p>
              </div>
            </div>
          )}
        </Card>

        <div className="prose prose-green max-w-none text-on-surface-variant mb-12">
          <h2 className="text-headline-sm text-on-surface mb-4">À propos de l'événement</h2>
          {event.description ? (
            <div dangerouslySetInnerHTML={{ __html: marked.parse(event.description, { async: false }) as string }} />
          ) : (
            <p className="italic">Aucune description détaillée n'a été fournie pour le moment.</p>
          )}
        </div>

        <div className="flex justify-center border-t border-outline-variant pt-8">
          {isPast ? (
            event.lien_replay ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-body-md text-on-surface-variant">Le replay est réservé aux membres : l'inscription au site est gratuite.</p>
                <Link href="/inscription" className={buttonVariants({ variant: 'primary' })}>
                  S'inscrire pour revoir le replay
                </Link>
              </div>
            ) : (
              <Button variant="tonal" disabled>
                Cet événement est terminé
              </Button>
            )
          ) : event.inscription_requise === false ? (
            <p className="text-body-md text-on-surface-variant">Entrée libre : aucune inscription n'est nécessaire.</p>
          ) : event.lien_inscription ? (
            <a
              href={event.lien_inscription}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'primary' })}
            >
              S'inscrire à l'événement
            </a>
          ) : (
            <Link href={`/login?next=${encodeURIComponent(`/evenements/${event.id}`)}`} className={buttonVariants({ variant: 'primary' })}>
              Connectez-vous pour vous inscrire
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
