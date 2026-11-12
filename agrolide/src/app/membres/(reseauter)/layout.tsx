import { SectionTabs } from "@/components/layout/SectionTabs"

/** Rubrique « Réseauter » : une barre d'onglets partagée par ses pages, sans changer leurs URL. */
export default function ReseauterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SectionTabs rubrique="reseauter" />
      {children}
    </>
  )
}
