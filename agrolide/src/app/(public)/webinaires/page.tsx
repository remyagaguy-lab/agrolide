import { Metadata } from 'next'
import AgendaClient from '@/components/modules/evenements/AgendaClient'
import { chargerActualites } from '@/lib/actualites.server'

export const metadata: Metadata = {
  title: "Webinaires agricoles",
  description: "Webinaires du réseau agrolide : échangez sur les thématiques agricoles avec producteurs, chercheurs et professionnels.",
  alternates: { canonical: '/webinaires' }
}

// Page prérendue (renouvelée toutes les heures, ou tout de suite quand l'admin modifie un événement).
export const revalidate = 3600

export default async function WebinairesPage() {
  // Si la lecture échoue, la page se charge comme avant : le navigateur redemande la liste.
  const initialItems = await chargerActualites('evenements').catch(() => undefined)
  return <AgendaClient mode="webinaires" initialItems={initialItems} />
}
