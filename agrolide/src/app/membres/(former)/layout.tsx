import { SectionTabs } from "@/components/layout/SectionTabs"

/** Rubrique « Se former » : une barre d'onglets partagée par ses pages, sans changer leurs URL. */
export default function FormerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SectionTabs rubrique="former" />
      {children}
    </>
  )
}
