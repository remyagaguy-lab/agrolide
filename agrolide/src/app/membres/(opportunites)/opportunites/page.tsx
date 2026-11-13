import React from 'react'
import OpportunitesClient from '@/components/modules/opportunites/OpportunitesClient'
import { Metadata } from 'next'
import { db } from '@/db'
import { opportunites } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const metadata: Metadata = {
  title: "Opportunités",
  description: 'Bourse aux opportunités : Emplois, financements et partenariats.',
}

export default async function OpportunitesPage() {
  // Liste lue côté serveur : elle arrive avec la page, au lieu d'être demandée après coup par le navigateur
  // (une Server Action lancée au chargement faisait aussi attendre les clics suivants).
  let initial: Awaited<ReturnType<typeof db.query.opportunites.findMany>> | undefined
  try {
    initial = await db.query.opportunites.findMany({
      where: eq(opportunites.statut, 'publie'),
      orderBy: (o, { desc }) => [desc(o.created_at)],
    })
  } catch (e) {
    console.error('Lecture des opportunités :', e)
  }
  return <OpportunitesClient initial={initial} />
}
