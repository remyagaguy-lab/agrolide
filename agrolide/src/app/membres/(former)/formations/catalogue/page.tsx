import { CatalogueFormations } from "@/components/modules/formations/CatalogueFormations"

export const metadata = { title: "Catalogue des formations" }

export default async function CatalogueMembrePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams

  return (
    <div className="space-y-4 pt-6">
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl md:text-2xl font-bold text-on-surface font-heading">Catalogue des formations</h1>
        <p className="mt-1 text-xs text-on-surface-muted">Parcours en ligne et formations de nos partenaires : inscrivez-vous en un clic.</p>
      </header>
      <CatalogueFormations searchParams={searchParams} mode="membre" />
    </div>
  )
}
