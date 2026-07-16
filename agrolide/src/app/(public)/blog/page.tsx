import { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ArticleCard } from "@/components/ui/ArticleCard"
import BlogFilter from "./BlogFilter"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

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
    { id: "1", slug: "pratiques-agroecologiques", titre: "Pratiques agroécologiques pour sols tropicaux", extrait: "Comment adapter les techniques de conservation des sols aux conditions climatiques de l'Afrique subsaharienne. Une analyse détaillée des meilleures pratiques pour restaurer la fertilité des sols et garantir une agriculture durable à long terme face aux défis climatiques actuels.", categorie: "Agronomie", auteur_externe: "Équipe Agrolide", published_at: "2024-10-12T00:00:00Z", image_une_url: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c0e?q=80&w=2070&auto=format&fit=crop" },
    { id: "2", slug: "financer-projet-agricole", titre: "Financer son projet agricole : les clés", extrait: "Tour d'horizon des instruments financiers accessibles aux agripreneurs africains en 2024.", categorie: "Agrobusiness", auteur_externe: "Équipe Agrolide", published_at: "2024-10-05T00:00:00Z" },
    { id: "3", slug: "competences-agronomes", titre: "Compétences du futur pour les agronomes", extrait: "Panorama des formations techniques et managériales qui font la différence sur le terrain africain.", categorie: "Formation", auteur_externe: "Équipe Agrolide", published_at: "2024-09-28T00:00:00Z" },
    { id: "4", slug: "innovation-agricole", titre: "Les innovations technologiques qui transforment l'agriculture", extrait: "Découvrez comment l'IA et les drones révolutionnent les rendements agricoles en Afrique de l'Ouest.", categorie: "Recherche & vulgarisation", auteur_externe: "Équipe Agrolide", published_at: "2024-09-15T00:00:00Z" }
  ]

  const hasArticles = articles && articles.length > 0 && !error
  const displayArticles = hasArticles ? articles : fallbackArticles

  const featuredArticle = displayArticles[0]
  const gridArticles = displayArticles.slice(1)

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f8f6]">
      {/* Hero */}
      <section className="bg-[#0d3520] pt-12 pb-16 text-white text-center relative overflow-hidden">
        {/* Motif Background */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
          style={{ backgroundImage: "url('/images/motif-transparent.png')", backgroundSize: "120px", backgroundRepeat: "repeat" }} 
        />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
            Blog & Actualités
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-white/80">
            Découvrez nos récits authentiques, nos analyses approfondies et nos retours d'expérience pour transformer l'agriculture africaine.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Featured Article */}
          {featuredArticle && !categoryParam && (
            <div className="mb-16">
              <Link href={`/blog/${featuredArticle.slug}`} className="group block">
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col lg:flex-row">
                  <div className="lg:w-3/5 h-[300px] lg:h-[450px] relative overflow-hidden bg-gray-100">
                    <img 
                      src={featuredArticle.image_une_url || "https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c0e?q=80&w=2070&auto=format&fit=crop"} 
                      alt={featuredArticle.titre} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-primary-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                        À la Une
                      </span>
                    </div>
                  </div>
                  <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-sm text-primary-600 font-bold mb-4">
                      <span className="uppercase tracking-wider">{featuredArticle.categorie || "Actualité"}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      <span className="text-gray-500 font-medium">{format(new Date(featuredArticle.published_at), 'dd MMM yyyy', { locale: fr })}</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-6 group-hover:text-primary-600 transition-colors line-clamp-3 leading-tight">
                      {featuredArticle.titre}
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 line-clamp-3 leading-relaxed">
                      {featuredArticle.extrait}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold">
                          {featuredArticle.auteur_externe ? featuredArticle.auteur_externe.charAt(0) : "A"}
                        </div>
                        <span className="font-medium text-gray-900">{featuredArticle.auteur_externe || "Équipe Agrolide"}</span>
                      </div>
                      <span className="text-primary-600 font-bold group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-1">
                        Lire l'article
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Grid Articles */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-200 pb-4">
              <h3 className="text-2xl font-bold font-heading text-gray-900">
                {categoryParam ? `Articles : ${categoryParam}` : "Dernières publications"}
              </h3>
              <BlogFilter currentCategory={categoryParam as string} categories={categories} />
            </div>
            
            {!displayArticles || displayArticles.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <p className="text-xl text-gray-500">Aucun article trouvé pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(categoryParam ? displayArticles : gridArticles).map((article) => (
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
      </section>
    </div>
  )
}
