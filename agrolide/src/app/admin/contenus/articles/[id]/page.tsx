import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { articles } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ArticleEditorForm } from "./DynamicEditorWrapper"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ArticleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  let article = null
  const resolvedParams = await params
  const isNew = resolvedParams.id === "nouveau"

  if (!isNew) {
    const data = await db.select().from(articles).where(eq(articles.id, resolvedParams.id)).limit(1).then(r => r[0])
      
    if (!data) {
      redirect("/admin/contenus/articles")
    }
    article = data
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/contenus/articles"
          className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isNew ? "Nouvel Article" : "Modifier l'article"}
          </h1>
          <p className="text-gray-500 text-sm">Créez du contenu riche pour le blog Agrolide.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <ArticleEditorForm initialData={article} />
      </div>
    </div>
  )
}
