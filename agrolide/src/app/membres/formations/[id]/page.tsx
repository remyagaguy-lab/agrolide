import { notFound } from 'next/navigation'
import { db } from '@/db'
import { formations, sessions_formation, avis_formation, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { FormationDetailClient } from '@/components/modules/formations/FormationDetailClient'

export default async function FormationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const formation = await db.query.formations.findFirst({
    where: eq(formations.id, id)
  })
    
  if (!formation) {
    notFound()
  }

  // Fetch relations manually since Drizzle schema might not have all nested relations configured correctly
  const sessions = await db.query.sessions_formation.findMany({
    where: eq(sessions_formation.formation_id, id)
  })

  const avisList = await db.query.avis_formation.findMany({
    where: eq(avis_formation.formation_id, id)
  })

  const avisWithProfiles = await Promise.all(avisList.map(async (avis) => {
    const profile = await db.query.users.findFirst({
      where: eq(users.id, avis.membre_id),
      columns: { prenom: true, nom: true, photo_url: true }
    })
    return { ...avis, profiles: profile }
  }))

  const formationData = {
    ...formation,
    sessions_formation: sessions,
    intervenants: [], // no intervenants table in schema
    avis_formation: avisWithProfiles
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <FormationDetailClient 
        initialFormation={formationData as any} 
      />
    </div>
  )
}
