import { SectionTabs } from "@/components/layout/SectionTabs"

/** Rubrique « Opportunités » : une barre d'onglets partagée par ses pages, sans changer leurs URL. */
export default function OpportunitesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SectionTabs rubrique="opportunites" />
      {children}
    </>
  )
}
