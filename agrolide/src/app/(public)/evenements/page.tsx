import React from 'react'
import EventsClient from '@/components/modules/evenements/EventsClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Événements | Agrolide',
  description: 'Découvrez les événements, formations, webinaires et rencontres de la communauté Agrolide.',
}

export default function EvenementsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <EventsClient />
    </div>
  )
}
