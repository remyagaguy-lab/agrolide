import { Metadata } from 'next'
import AgendaClient from '@/components/modules/evenements/AgendaClient'

export const metadata: Metadata = {
  title: "Opportunités : bourses, appels à projets et emplois",
  description: "Bourses d'études, appels à projets et offres d'emploi partagés par le réseau agrolide pour les acteurs de l'agriculture en Afrique.",
  alternates: { canonical: '/opportunites' }
}

export default function OpportunitesPage() {
  return <AgendaClient mode="opportunites" />
}
