import { DocumentDetailView } from '@/components/modules/bibliotheque/DocumentDetailView'
import { db } from '@/db'
import { documents } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const data = await db.query.documents.findFirst({
    columns: { titre: true },
    where: eq(documents.id, id)
  })
  
  return { title: data?.titre ? `${data.titre} | Bibliothèque agrolide` : "Document | Bibliothèque agrolide" }
}

// Un membre connecté qui ouvre cette URL est redirigé vers /membres/bibliotheque/[id] par le middleware.
export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <DocumentDetailView id={id} mode="public" />
}
