import React from 'react'
import NouveauFilClient from '@/components/modules/forum/NouveauFilClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nouveau sujet | Forum Agrolide',
}

export default function NouveauFilPage() {
  return <NouveauFilClient />
}
