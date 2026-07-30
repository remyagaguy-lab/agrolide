import { db } from "@/db"
import { pages_statiques } from "@/db/schema"
import { asc } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { FileEdit, Globe } from "lucide-react"

export const metadata = { title: "Pages statiques" }
export const dynamic = 'force-dynamic'

const PAGE_LABELS: Record<string, string> = {
  accueil: "Page d'accueil",
  "qui-sommes-nous": "Qui sommes-nous",
  agrobusiness: "Agrobusiness",
  formations: "Formations",
  "nous-soutenir": "Nous soutenir",
  rejoindre: "Rejoindre",
}

export default async function AdminPagesPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  let pages: any[] = []
  try {
    pages = await db.select({ id: pages_statiques.id, slug: pages_statiques.slug, titre: pages_statiques.titre, updated_at: pages_statiques.updated_at })
      .from(pages_statiques).orderBy(asc(pages_statiques.slug))
  } catch (e) {}

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center">
          <Globe size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages statiques</h1>
          <p className="text-sm text-gray-500">Modifiez le contenu des pages sans toucher au code</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map(page => (
          <Link
            key={page.id}
            href={`/admin/pages/${page.slug}`}
            className="group bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                  {page.titre || PAGE_LABELS[page.slug] || page.slug}
                </p>
                <p className="text-xs text-gray-400 mt-1">/{page.slug}</p>
              </div>
              <div className="w-8 h-8 bg-gray-50 group-hover:bg-indigo-50 text-gray-400 group-hover:text-indigo-600 rounded-lg flex items-center justify-center transition-colors">
                <FileEdit size={16} />
              </div>
            </div>
            {page.updated_at && (
              <p className="text-xs text-gray-400 mt-3">
                Dernière édition : {new Date(page.updated_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            )}
          </Link>
        ))}

        {pages.length === 0 && (
          <div className="col-span-3 py-12 text-center text-gray-400 italic">
            Aucune page statique trouvée dans D1.
          </div>
        )}
      </div>
    </div>
  )
}
