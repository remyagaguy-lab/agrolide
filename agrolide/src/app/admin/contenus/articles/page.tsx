import Link from "next/link"
import { Plus, Edit2 } from "lucide-react"
import { db } from "@/db"
import { articles } from "@/db/schema"
import { desc } from "drizzle-orm"
import { ArticleDeleteButton } from "./ArticleDeleteButton"

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ArticlesListPage() {
  let articlesList: any[] = []
  try {
    articlesList = await db.select().from(articles).orderBy(desc(articles.created_at))
  } catch (e) {
    console.error('Erreur fetch articles:', e)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Articles (Blog)</h1>
          <p className="text-on-surface-muted text-sm">Gérez les articles du blog Agrolide.</p>
        </div>
        <Link 
          href="/admin/contenus/articles/nouveau" 
          className="flex items-center gap-2 bg-[var(--color-vert-principal)] text-white px-4 py-2 rounded-lg font-medium hover:bg-green-800 transition-colors"
        >
          <Plus size={18} /> Nouvel article
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low text-on-surface-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Titre</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium">Catégorie</th>
                <th className="px-6 py-4 font-medium">Auteur</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {articlesList && articlesList.length > 0 ? (
                articlesList.map((article) => (
                  <tr key={article.id} className="hover:bg-surface-container-low">
                    <td className="px-6 py-4 font-medium text-on-surface max-w-xs truncate">
                      {article.titre}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        article.statut === 'publie' ? 'bg-success-container text-success' :
                        article.statut === 'brouillon' ? 'bg-surface-container text-on-surface-variant' :
                        'bg-info-container text-info'
                      }`}>
                        {article.statut === 'publie' ? 'Publié' : 
                         article.statut === 'brouillon' ? 'Brouillon' : 
                         'Planifié'}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize">{article.categorie}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{article.auteur_externe || "Admin"}</td>
                    <td className="px-6 py-4 text-on-surface-muted">
                      {article.created_at ? new Date(article.created_at).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/contenus/articles/${article.id}`}
                          className="p-2 text-info hover:bg-info-container rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <ArticleDeleteButton articleId={article.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-on-surface-muted italic">
                    Aucun article trouvé. Cliquez sur &quot;Nouvel article&quot; pour commencer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
