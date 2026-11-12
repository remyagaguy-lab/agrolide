import { Metadata } from 'next'
import { PageHero } from "@/components/ui/PageHero"
import { CatalogueFormations } from '@/components/modules/formations/CatalogueFormations'

export const metadata: Metadata = {
  title: "Formations Agricoles",
  description: "Développez vos compétences avec les programmes de formation de notre réseau agricole. Des cursus certifiants adaptés aux réalités de l'agriculture en Afrique.",
  alternates: { canonical: '/formations' }
}

export default async function FormationsPage(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const searchParams = await props.searchParams;

  return (
    <div className="bg-surface-container-low min-h-screen pb-20 flex flex-col">
      <PageHero
        nextTone="low"
        label="Formations"
        title="Développez vos compétences agricoles"
        description="Des formations pratiques et certifiantes animées par des experts de terrain pour lancer ou propulser votre exploitation."
      />

      <CatalogueFormations searchParams={searchParams} mode="public" />
    </div>
  )
}
