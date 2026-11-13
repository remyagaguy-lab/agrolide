import React from 'react'
import { Metadata } from 'next'
import Script from 'next/script'
import AgendaClient from '@/components/modules/evenements/AgendaClient'
import { chargerActualites } from '@/lib/actualites.server'

export const metadata: Metadata = {
  title: "Événements du réseau agricole",
  description: "Ateliers, conférences, webinaires et rencontres du réseau agrolide pour les acteurs de l'agriculture en Afrique.",
  alternates: { canonical: '/evenements' }
}

export const revalidate = 3600

export default async function EvenementsPage() {
  // Une seule lecture : elle alimente à la fois les données structurées (JSON-LD) et la liste affichée.
  // Si elle échoue, la page se charge comme avant : le navigateur redemande la liste.
  const initialItems = await chargerActualites('evenements').catch(() => undefined)
  const eventsData = (initialItems ?? []).filter((i) => i._itemType === 'evenement')

  const jsonLdEvents = eventsData.map((evt) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: evt.titre,
    description: evt.description || "Événement de la communauté agrolide",
    startDate: evt.date_debut,
    endDate: evt.date_fin || evt.date_debut,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: evt.en_ligne
      ? "https://schema.org/OnlineEventAttendanceMode"
      : evt.lieu ? "https://schema.org/OfflineEventAttendanceMode" : "https://schema.org/MixedEventAttendanceMode",
    location: evt.en_ligne
      ? { "@type": "VirtualLocation", url: `https://agrolide.org/evenements/${evt.id}` }
      : { "@type": "Place", name: evt.lieu || "Lieu à confirmer", address: { "@type": "PostalAddress", addressCountry: evt.pays || "" } },
    image: evt.image_url ? [evt.image_url] : [],
    organizer: { "@type": "Organization", name: "agrolide", url: "https://agrolide.org" },
  }))

  return (
    <>
      {jsonLdEvents.length > 0 && (
        <Script id="json-ld-events" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvents) }} />
      )}
      <AgendaClient mode="evenements" initialItems={initialItems} />
    </>
  )
}
