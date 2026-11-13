import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/server"
import { db } from "@/db"
import { articles } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ArticleEditorForm } from "./DynamicEditorWrapper"
import Link from "next/link"
import { ArrowLeft } from "@/components/ui/icons"
export default async function ArticleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) redirect("/login")

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
          className="p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface-muted hover:text-on-surface transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">
            {isNew ? "Nouvel Article" : "Modifier l'article"}
          </h1>
          <p className="text-on-surface-muted text-sm">Créez du contenu riche pour le blog Agrolide.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6">
        <ArticleEditorForm initialData={article} />
      </div>
    </div>
  )
}
