import { LectureDocumentView } from '@/components/modules/bibliotheque/LectureDocumentView'
import { db } from '@/db'
import { documents } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const data = await db.query.documents.findFirst({
    columns: { titre: true },
    where: eq(documents.id, id)
  })
  
  return { title: data?.titre ? `Lecture : ${data.titre} | Bibliothèque Agrolide` : "Lecture Sécurisée | Agrolide" }
}

// Un membre connecté qui ouvre cette URL est redirigé vers /membres/bibliotheque/[id]/lire par le middleware.
export default async function SecureReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <LectureDocumentView id={id} mode="public" />
}
