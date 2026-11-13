import OffreLecture, { chargerOffre } from '@/components/modules/opportunites/OffreLecture'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const offre = await chargerOffre(id)
  return { title: offre?.titre ?? 'Opportunité', alternates: { canonical: `/opportunites/${id}` } }
}

export default async function OffrePubliquePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="container py-10 md:py-14">
      <OffreLecture id={id} espaceMembre={false} />
    </div>
  )
}
