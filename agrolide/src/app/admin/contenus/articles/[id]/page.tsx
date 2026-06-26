import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ArticleEditorForm } from "./DynamicEditorWrapper"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ArticleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) redirect("/login")

  let article = null
  const resolvedParams = await params
  const isNew = resolvedParams.id === "nouveau"

  if (!isNew) {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("id", resolvedParams.id)
      .single()
      
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
        <ArticleEditorForm 
          initialData={article} 
          sessionToken={session.access_token} 
        />
      </div>
    </div>
  )
}
