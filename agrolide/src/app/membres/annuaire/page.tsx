import React from 'react'
import AnnuaireClient from '@/components/modules/annuaire/AnnuaireClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Annuaire | Agrolide',
  description: 'Recherchez et connectez-vous avec les membres du réseau.',
}

export default function AnnuairePage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Annuaire des Membres</h1>
        <p className="text-gray-600 mt-2">Découvrez les experts de la communauté et développez votre réseau.</p>
      </div>

      <AnnuaireClient />
    </div>
  )
}
