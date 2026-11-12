import { DocumentDetailView } from "@/components/modules/bibliotheque/DocumentDetailView"
import { db } from "@/db"
import { documents } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await db.query.documents.findFirst({ columns: { titre: true }, where: eq(documents.id, id) })
  return { title: data?.titre ?? "Document" }
}

export default async function DocumentMembrePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <DocumentDetailView id={id} mode="membre" />
}
