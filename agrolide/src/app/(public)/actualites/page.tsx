import React from 'react'
import ActualitesClient from './ActualitesClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Actualités | Agrolide',
  description: 'Découvrez les événements, formations, webinaires et opportunités de la communauté Agrolide.',
}

export default function ActualitesPage() {
  return <ActualitesClient />
}
