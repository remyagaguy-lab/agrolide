import { LectureDocumentView } from "@/components/modules/bibliotheque/LectureDocumentView"
import { db } from "@/db"
import { documents } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await db.query.documents.findFirst({ columns: { titre: true }, where: eq(documents.id, id) })
  return { title: data?.titre ? `Lecture : ${data.titre}` : "Lecture sécurisée" }
}

export default async function LectureMembrePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <LectureDocumentView id={id} mode="membre" />
}
