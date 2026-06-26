import React from 'react'
import OpportunitesClient from '@/components/modules/opportunites/OpportunitesClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Opportunités | Agrolide',
  description: 'Bourse aux opportunités : Emplois, financements et partenariats.',
}

export default function OpportunitesPage() {
  return <OpportunitesClient />
}
