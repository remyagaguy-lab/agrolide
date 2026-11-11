import { Metadata } from 'next'
import AgendaClient from '@/components/modules/evenements/AgendaClient'

export const metadata: Metadata = {
  title: "Webinaires agricoles",
  description: "Webinaires du réseau agrolide : échangez sur les thématiques agricoles avec producteurs, chercheurs et professionnels.",
  alternates: { canonical: '/webinaires' }
}

export default function WebinairesPage() {
  return <AgendaClient mode="webinaires" />
}
