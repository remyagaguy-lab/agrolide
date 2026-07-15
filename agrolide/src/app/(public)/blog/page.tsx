import { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ArticleCard } from "@/components/ui/ArticleCard"

export const metadata: Metadata = {
  title: "Blog & Actualités | agrolide",
  description: "Découvrez les dernières actualités, analyses et conseils pour les acteurs de l'agriculture africaine.",
}

export const revalidate = 0 // ISR désactivé temporairement pour les images

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const resolvedParams = await searchParams;
  const categoryParam = resolvedParams.category

  // Build query
  let query = supabase
    .from('articles')
    .select('*')
    .eq('statut', 'publie')
    .order('published_at', { ascending: false })

  if (categoryParam) {
    query = query.eq('categorie', categoryParam)
  }

  const { data: articles, error } = await query

  const categories = [
    "Réseau & communauté",
    "Formation & savoirs",
    "Entrepreneuriat agricole",
    "Recherche & vulgarisation"
  ]

  const fallbackArticles = [
    { id: "1", slug: "pratiques-agroecologiques", titre: "Pratiques agroécologiques pour sols tropicaux", extrait: "Comment adapter les techniques de conservation des sols aux conditions climatiques de l'Afrique subsaharienne.", categorie: "Agronomie", auteur_externe: "Équipe Agrolide", published_at: "2024-10-12T00:00:00Z" },
    { id: "2", slug: "financer-projet-agricole", titre: "Financer son projet agricole : les clés", extrait: "Tour d'horizon des instruments financiers accessibles aux agripreneurs africains en 2024.", categorie: "Agrobusiness", auteur_externe: "Équipe Agrolide", published_at: "2024-10-05T00:00:00Z" },
    { id: "3", slug: "competences-agronomes", titre: "Compétences du futur pour les agronomes", extrait: "Panorama des formations techniques et managériales qui font la différence sur le terrain africain.", categorie: "Formation", auteur_externe: "Équipe Agrolide", published_at: "2024-09-28T00:00:00Z" }
  ]

  const hasArticles = articles && articles.length > 0 && !error
  const displayArticles = hasArticles ? articles : fallbackArticles

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f8f6]">
      {/* Hero */}
      <section className="bg-[#0d3520] pt-10 pb-10 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Blog & Actualités
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-white/80 mb-6">
            Analyses, conseils pratiques et retours d'expérience pour l'agriculture africaine.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-[#f8f8f6]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filtres */}
            <div className="w-full lg:w-1/4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                <h3 className="font-heading font-bold text-lg mb-4 text-[#1a1a1a] border-b border-gray-100 pb-2">Catégories</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/blog"
                      className={`block py-2 px-3 rounded-lg transition-colors text-sm ${!categoryParam ? 'bg-[#fcb726]/10 text-[#fcb726] font-[600]' : 'text-[#666] hover:text-[#1a1a1a] hover:bg-gray-50'}`}
                    >
                      Toutes les catégories
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat}>
                      <Link
                        href={`/blog?category=${encodeURIComponent(cat)}`}
                        className={`block py-2 px-3 rounded-lg transition-colors text-sm ${categoryParam === cat ? 'bg-[#fcb726]/10 text-[#fcb726] font-[600]' : 'text-[#666] hover:text-[#1a1a1a] hover:bg-gray-50'}`}
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Liste Articles */}
            <div className="w-full lg:w-3/4">
              {!displayArticles || displayArticles.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                      <div className="h-48 bg-[#e8f0e9] animate-pulse"></div>
                      <div className="p-5">
                        <div className="h-4 bg-[#e8f0e9] rounded w-1/3 mb-4 animate-pulse"></div>
                        <div className="h-6 bg-[#e8f0e9] rounded w-full mb-2 animate-pulse"></div>
                        <div className="h-6 bg-[#e8f0e9] rounded w-2/3 mb-4 animate-pulse"></div>
                        <div className="h-4 bg-[#e8f0e9] rounded w-full mb-2 animate-pulse"></div>
                        <div className="h-4 bg-[#e8f0e9] rounded w-full mb-2 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-full text-center py-12">
                    <p className="text-xl text-[#666]">Articles bientôt disponibles dans cette catégorie.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      slug={article.slug}
                      title={article.titre}
                      excerpt={article.extrait || ""}
                      category={article.categorie || "Général"}
                      author={article.auteur_externe || "Équipe Agrolide"}
                      date={article.published_at}
                      readTime={"5 min"}
                      imageUrl={article.image_une_url}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
