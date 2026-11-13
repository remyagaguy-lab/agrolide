import { LectureDocumentView, getDocumentLecture } from "@/components/modules/bibliotheque/LectureDocumentView"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getDocumentLecture(id)
  return { title: data?.titre ? `Lecture : ${data.titre}` : "Lecture sécurisée" }
}

export default async function LectureMembrePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <LectureDocumentView id={id} mode="membre" />
}
