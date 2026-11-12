'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import EventCard from './EventCard'
import InscriptionModal from './InscriptionModal'

/** Liste des événements de l'espace membre : fiches et inscription restent dans /membres. */
export function EvenementsMembreClient({
  evenements,
  inscritsIds,
}: {
  evenements: any[]
  inscritsIds: string[]
}) {
  const router = useRouter()
  const [selection, setSelection] = useState<any | null>(null)
  const inscrits = new Set(inscritsIds)

  return (
    <>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {evenements.map((evt) => (
          <li key={evt.id}>
            <EventCard event={evt} mode="membre" inscrit={inscrits.has(evt.id)} onInscrireClick={setSelection} />
          </li>
        ))}
      </ul>
      <InscriptionModal
        isOpen={!!selection}
        onClose={() => {
          setSelection(null)
          router.refresh()
        }}
        event={selection}
      />
    </>
  )
}
