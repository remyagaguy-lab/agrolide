import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Edit2 } from "lucide-react"
import { ArticleDeleteButton } from "./ArticleDeleteButton"

export default async function ArticlesListPage() {
  const supabase = await createClient()

  let { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })
  
  if (!articles) articles = []
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles (Blog)</h1>
          <p className="text-gray-500 text-sm">Gérez les articles du blog Agrolide.</p>
        </div>
        <Link 
          href="/admin/contenus/articles/nouveau" 
          className="flex items-center gap-2 bg-[var(--color-vert-principal)] text-white px-4 py-2 rounded-lg font-medium hover:bg-green-800 transition-colors"
        >
          <Plus size={18} /> Nouvel article
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Titre</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium">Catégorie</th>
                <th className="px-6 py-4 font-medium">Auteur</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles && articles.length > 0 ? (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                      {article.title || article.titre}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        article.status === 'published' ? 'bg-green-100 text-green-700' :
                        article.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {article.status === 'published' ? 'Publié' : 
                         article.status === 'draft' ? 'Brouillon' : 
                         'Planifié'}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize">{article.category}</td>
                    <td className="px-6 py-4 text-gray-600">{article.author_name}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/contenus/articles/${article.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 italic">
                    Aucun article trouvé. Cliquez sur "Nouvel article" pour commencer.
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
