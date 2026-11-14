import { LectureDocumentView, getDocumentLecture } from '@/components/modules/bibliotheque/LectureDocumentView'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const data = await getDocumentLecture(id)
  
  return { title: data?.titre ? `Lecture : ${data.titre} | Bibliothèque agrolide` : "Lecture Sécurisée | agrolide" }
}

// Un membre connecté qui ouvre cette URL est redirigé vers /membres/bibliotheque/[id]/lire par le middleware.
export default async function SecureReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <LectureDocumentView id={id} mode="public" />
}
