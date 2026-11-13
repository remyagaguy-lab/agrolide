import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/server'
import OffreLecture, { chargerOffre } from '@/components/modules/opportunites/OffreLecture'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()
  const offre = await chargerOffre(id, userId)
  return { title: offre?.titre ?? 'Opportunité' }
}

export default async function OffreMembrePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) redirect(`/login?next=${encodeURIComponent(`/membres/opportunites/${id}`)}`)
  return <OffreLecture id={id} userId={userId} espaceMembre />
}
