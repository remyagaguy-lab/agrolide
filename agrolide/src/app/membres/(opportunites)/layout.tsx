import { SectionTabs } from "@/components/layout/SectionTabs"

/** Rubrique « Opportunités » : Offres et Entreprendre, en onglets, sans changer leurs URL. */
export default function OpportunitesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SectionTabs rubrique="opportunites" />
      {children}
    </>
  )
}
