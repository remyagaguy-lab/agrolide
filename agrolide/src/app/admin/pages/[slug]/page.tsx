import { redirect, notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { pages_statiques } from "@/db/schema"
import { eq } from "drizzle-orm"
import { PageEditor } from "./PageEditor"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return { title: `Éditer ${slug}` }
}

export default async function AdminPageEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const page = await db.select().from(pages_statiques).where(eq(pages_statiques.slug, slug)).limit(1).then(r => r[0])

  if (!page) notFound()

  return (
    <div className="space-y-4 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{page.titre || slug}</h1>
        <p className="text-sm text-gray-500 mt-1">Éditeur de contenu — /{slug}</p>
      </div>
      <PageEditor
        slug={slug}
        titre={page.titre}
        contenuJson={page.contenu_json}
      />
    </div>
  )
}
