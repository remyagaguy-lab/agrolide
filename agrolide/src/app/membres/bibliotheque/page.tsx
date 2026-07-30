import { BibliothequeClient } from '@/components/modules/bibliotheque/BibliothequeClient'
import { db } from '@/db'
import { documents } from '@/db/schema'
import { eq, like, inArray, and, desc } from 'drizzle-orm'
export const metadata = {
  title: "Bibliothèque",
  description: 'Bibliothèque de documents pour les membres Agrolide',
}

export default async function MembresBibliothequePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // Next 15+ needs await on searchParams
  const params = await searchParams
  
  const search = typeof params.search === 'string' ? params.search : ''
  const type = typeof params.type === 'string' ? params.type : ''
  const thematique = typeof params.thematique === 'string' ? params.thematique : ''
  
  // Drizzle query
  const conditions = [eq(documents.statut, 'publie')]
  if (search) conditions.push(like(documents.titre, `%${search}%`))
  if (type) conditions.push(inArray(documents.type_doc, type.split(',')))
  if (thematique) conditions.push(inArray(documents.thematique, thematique.split(',')))

  const data = await db.select().from(documents).where(and(...conditions)).orderBy(desc(documents.created_at)).limit(20)
  
  const initialData = {
    data: data || [],
    nextCursor: data && data.length === 20 ? data[data.length - 1].created_at : null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bibliothèque</h1>
        <p className="mt-2 text-gray-600">Recherchez et consultez nos ressources documentaires.</p>
      </div>
      
      <BibliothequeClient 
        initialData={initialData} 
      />
    </div>
  )
}
