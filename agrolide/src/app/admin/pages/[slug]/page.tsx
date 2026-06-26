import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { PageEditor } from "./PageEditor"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return { title: `Éditer "${slug}" | Admin agrolide` }
}

export default async function AdminPageEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect("/login")

  const { data: page } = await supabase.from("pages_statiques")
    .select("*")
    .eq("slug", slug)
    .single()

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
        sessionToken={session.access_token}
      />
    </div>
  )
}
