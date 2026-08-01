import React from 'react'
import AnnuaireClient from '@/components/modules/annuaire/AnnuaireClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Annuaire",
  description: 'Recherchez et connectez-vous avec les membres du réseau.',
}

export default function AnnuairePage() {
  return (
    <div className="max-w-[1600px] mx-auto px-2 md:px-4 py-4">
      <AnnuaireClient />
    </div>
  )
}
