import { db } from "@/db"
import { pages_statiques } from "@/db/schema"
import { asc } from "drizzle-orm"
import { auth } from "@/lib/auth/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Pencil, Globe } from "@/components/ui/icons"
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
  if (!userId) redirect("/login")

  let pages: any[] = []
  try {
    pages = await db.select({ id: pages_statiques.id, slug: pages_statiques.slug, titre: pages_statiques.titre, updated_at: pages_statiques.updated_at })
      .from(pages_statiques).orderBy(asc(pages_statiques.slug))
  } catch (e) {}

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-info-container text-on-info-container rounded-xl flex items-center justify-center">
          <Globe size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Pages statiques</h1>
          <p className="text-sm text-on-surface-muted">Modifiez le contenu des pages sans toucher au code</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map(page => (
          <Link
            key={page.id}
            href={`/admin/pages/${page.slug}`}
            className="group bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm hover:shadow-md hover:border-info/40 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-on-surface group-hover:text-on-info-container transition-colors">
                  {page.titre || PAGE_LABELS[page.slug] || page.slug}
                </p>
                <p className="text-xs text-on-surface-muted mt-1">/{page.slug}</p>
              </div>
              <div className="w-8 h-8 bg-surface-container-low group-hover:bg-info-container text-on-surface-muted group-hover:text-info rounded-lg flex items-center justify-center transition-colors">
                <Pencil size={16} />
              </div>
            </div>
            {page.updated_at && (
              <p className="text-xs text-on-surface-muted mt-3">
                Dernière édition : {new Date(page.updated_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            )}
          </Link>
        ))}

        {pages.length === 0 && (
          <div className="col-span-3 py-12 text-center text-on-surface-muted italic">
            Aucune page statique trouvée dans D1.
          </div>
        )}
      </div>
    </div>
  )
}
