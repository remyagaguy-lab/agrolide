import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { auth } from "@/lib/auth/server"
import { FicheView } from "@/components/modules/reseau/FicheView"
import { fetchFiche } from "@/lib/reseau/fiche"

// Le titre ne révèle jamais le nom du membre consulté.
export const metadata: Metadata = { title: "Profil membre", robots: { index: false, follow: false } }

export default async function FicheMembrePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) redirect(`/login?next=${encodeURIComponent(`/membres/annuaire/${id}`)}`)

  const fiche = await fetchFiche(userId, id)
  if (!fiche) notFound()

  return <FicheView fiche={fiche} />
}
