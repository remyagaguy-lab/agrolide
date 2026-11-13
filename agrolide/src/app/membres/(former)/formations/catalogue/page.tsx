import { CatalogueFormations } from "@/components/modules/formations/CatalogueFormations"
import { PageEntete } from "@/components/layout/PageEntete"

export const metadata = { title: "Formations" }

export default async function CatalogueMembrePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams

  return (
    <div className="space-y-6 pt-6">
      <div className="mx-auto max-w-[1200px] px-2 md:px-4">
        <PageEntete
          titre="Formations"
          description="Parcours en ligne et formations de nos partenaires : inscrivez-vous en un clic."
        />
      </div>
      <CatalogueFormations searchParams={searchParams} mode="membre" />
    </div>
  )
}
