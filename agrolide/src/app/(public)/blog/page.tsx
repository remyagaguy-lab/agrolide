import { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ArticleCard } from "@/components/ui/ArticleCard"

export const metadata: Metadata = {
  title: "Blog & Actualités | agrolide",
  description: "Découvrez les dernières actualités, analyses et conseils pour les acteurs de l'agriculture africaine.",
}

export const revalidate = 86400 // ISR 24h

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const supabase = await createClient()
  const categoryParam = searchParams.category

  // Build query
  let query = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (categoryParam) {
    query = query.eq('category', categoryParam)
  }

  const { data: articles, error } = await query

  const categories = [
    "Réseau & communauté",
    "Formation & savoirs",
    "Entrepreneuriat agricole",
    "Recherche & vulgarisation"
  ]

  const hasArticles = articles && articles.length > 0 && !error

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f8f6]">
      {/* Hero */}
      <section className="bg-[#0d3520] pt-32 pb-24 text-white text-center">
        <div className="container mx-auto px-4">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#fcb726]/20 text-[#fcb726] text-sm font-semibold tracking-wide uppercase">
            Blog & Actualités
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Blog & Actualités
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white/80">
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
              {!hasArticles ? (
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
                  {articles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      slug={article.slug}
                      title={article.title}
                      excerpt={article.excerpt || ""}
                      category={article.category || "Général"}
                      author={article.author_name || "Équipe Agrolide"}
                      date={article.published_at}
                      readTime={article.read_time ? `${article.read_time} min` : "5 min"}
                      imageUrl={article.image_url}
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
