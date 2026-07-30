import React from 'react'
import ActualitesClient from './ActualitesClient'
import { Metadata } from 'next'
import { db } from '@/db'
import { evenements } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Script from 'next/script'

export const metadata: Metadata = {
  title: "Actualités",
  description: 'Découvrez les événements, formations, webinaires et opportunités de la communauté Agrolide.',
}

export const revalidate = 3600 // Revalidate cache every hour

export default async function ActualitesPage() {
  // Fetch only published events for the JSON-LD
  const eventsData = await db.select().from(evenements).where(eq(evenements.publie, true))

  // Construction du JSON-LD pour les événements
  const jsonLdEvents = eventsData.map((evt: any) => {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": evt.titre,
      "description": evt.description || "Événement de la communauté Agrolide",
      "startDate": evt.date_debut,
      "endDate": evt.date_fin || evt.date_debut, // Fallback si pas de date de fin
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": evt.en_ligne 
        ? "https://schema.org/OnlineEventAttendanceMode" 
        : (evt.lieu ? "https://schema.org/OfflineEventAttendanceMode" : "https://schema.org/MixedEventAttendanceMode"),
      "location": evt.en_ligne ? {
        "@type": "VirtualLocation",
        "url": evt.lien_inscription || "https://agrolide.org/actualites"
      } : {
        "@type": "Place",
        "name": evt.lieu || "Lieu à confirmer",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": evt.pays || ""
        }
      },
      "image": evt.image_url ? [evt.image_url] : [],
      "organizer": {
        "@type": "Organization",
        "name": "Agrolide",
        "url": "https://agrolide.org"
      }
    }
  })

  return (
    <>
      {jsonLdEvents.length > 0 && (
        <Script
          id="json-ld-events"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvents) }}
        />
      )}
      <ActualitesClient />
    </>
  )
}
