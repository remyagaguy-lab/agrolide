import { Metadata } from 'next'
import AgendaClient from '@/components/modules/evenements/AgendaClient'
import { chargerActualites } from '@/lib/actualites.server'

export const metadata: Metadata = {
  title: "Opportunités : bourses, appels à projets et emplois",
  description: "Bourses d'études, appels à projets et offres d'emploi partagés par le réseau agrolide pour les acteurs de l'agriculture en Afrique.",
  alternates: { canonical: '/opportunites' }
}

// Page prérendue (renouvelée toutes les heures, ou tout de suite quand l'admin modifie une opportunité).
export const revalidate = 3600

export default async function OpportunitesPage() {
  // Si la lecture échoue, la page se charge comme avant : le navigateur redemande la liste.
  const initialItems = await chargerActualites('opportunites').catch(() => undefined)
  return <AgendaClient mode="opportunites" initialItems={initialItems} />
}
