import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { ArticleCard } from "@/components/ui/ArticleCard"
import BlogFilter from "./BlogFilter"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export const metadata: Metadata = {
  title: "Blog & Actualités | agrolide",
  description: "Découvrez les dernières actualités, analyses et conseils pour les acteurs de l'agriculture africaine.",
}

export const revalidate = 3600

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  try {
    const supabase = await createClient()
    const resolvedParams = await searchParams;
    const categoryParam = resolvedParams.category

    // Build query
    let query = supabase
      .from('articles')
      .select('*, profiles(prenom, nom, photo_url)')
      .eq('statut', 'publie')
      .order('published_at', { ascending: false })

    if (categoryParam) {
      query = query.eq('categorie', categoryParam)
    }

    const searchParam = resolvedParams.search
    if (searchParam && typeof searchParam === 'string') {
      query = query.ilike('titre', `%${searchParam}%`)
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

    const featuredMain = displayArticles[0];
    const featuredSecondary = displayArticles.slice(1, 3);
    const gridArticles = displayArticles.slice(3);

    return (
      <div className="flex flex-col min-h-screen bg-[#f9f9f9]">
        {/* Hero Section (Original) */}
        <section className="bg-[#0d3520] pt-12 pb-16 text-white text-center relative overflow-hidden">
          {/* Motif Background */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
            style={{ backgroundImage: "url('/images/motif-transparent.png')", backgroundSize: "800px", backgroundRepeat: "repeat" }} 
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
            {/* Featured Articles Section (Brevo style) */}
            {displayArticles.length > 0 && !searchParam && !categoryParam && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
                {/* Main Featured Article (2/3 width) */}
                {featuredMain && (
                  <div className="lg:col-span-2">
                    <Link 
                      href={`/blog/${featuredMain.slug}`} 
                      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-transparent hover:border-gray-100"
                    >
                      <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                        {featuredMain.image_une_url ? (
                          <Image 
                            src={featuredMain.image_une_url} 
                            alt={featuredMain.titre} 
                            fill 
                            priority
                            className="object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">Sans image</div>
                        )}
                      </div>
                      <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 text-sm mb-4">
                          <span className="font-bold text-[#1b5e38] uppercase tracking-wider text-xs">
                            {featuredMain.categorie || "Général"}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500 font-medium text-xs">
                            {format(new Date(featuredMain.published_at), 'dd MMMM yyyy', { locale: fr })}
                          </span>
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4 group-hover:text-[#1b5e38] transition-colors leading-tight">
                          {featuredMain.titre}
                        </h2>
                        <p className="text-gray-600 text-base line-clamp-3 mb-6">
                          {featuredMain.extrait}
                        </p>
                        <div className="mt-auto flex items-center text-sm font-bold text-[#1b5e38] group-hover:translate-x-1 transition-transform duration-300">
                          Lire l'article 
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Secondary Featured Articles (1/3 width, stacked) */}
                <div className="flex flex-col gap-6">
                  {featuredSecondary.map((article) => (
                    <Link 
                      href={`/blog/${article.slug}`} 
                      key={article.id} 
                      className="group flex flex-col flex-1 bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-transparent hover:border-gray-100"
                    >
                      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                        {article.image_une_url ? (
                          <Image 
                            src={article.image_une_url} 
                            alt={article.titre} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">Sans image</div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 text-sm mb-3">
                          <span className="font-bold text-[#1b5e38] uppercase tracking-wider text-xs">
                            {article.categorie || "Général"}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500 font-medium text-xs">
                            {format(new Date(article.published_at), 'dd MMM yyyy', { locale: fr })}
                          </span>
                        </div>
                        <h3 className="text-xl font-heading font-bold text-gray-900 group-hover:text-[#1b5e38] transition-colors leading-tight line-clamp-3">
                          {article.titre}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 py-6 border-y border-gray-200">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider hidden md:block">Filtrer :</span>
                <BlogFilter currentCategory={categoryParam as string} categories={categories} />
              </div>
              <form action="/blog" method="GET" className="relative w-full md:w-72">
                {categoryParam && <input type="hidden" name="category" value={categoryParam} />}
                <input 
                  type="text" 
                  name="search" 
                  defaultValue={searchParam as string || ''}
                  placeholder="Rechercher un article..." 
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#1b5e38] focus:ring-1 focus:ring-[#1b5e38] transition-shadow" 
                />
                <svg className="w-4 h-4 absolute left-4 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </form>
            </div>

            {/* Main Article Grid */}
            {!displayArticles || displayArticles.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-xl text-gray-500">Aucun article ne correspond à votre recherche.</p>
                {(categoryParam || searchParam) && (
                  <Link href="/blog" className="inline-block mt-4 text-[#1b5e38] font-bold hover:underline">
                    Réinitialiser les filtres
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* If searching or filtering, show all in grid. If normal view, show remaining articles after featured. */}
                {((categoryParam || searchParam) ? displayArticles : gridArticles).map((article) => (
                  <ArticleCard
                    key={article.id}
                    slug={article.slug}
                    title={article.titre}
                    excerpt={article.extrait || ""}
                    category={article.categorie || "Général"}
                    author={article.profiles ? `${article.profiles.prenom} ${article.profiles.nom}` : (article.auteur_externe || "Équipe Agrolide")}
                    authorId={article.auteur_id}
                    date={article.published_at}
                    readTime={"5 min"}
                    imageUrl={article.image_une_url}
                  />
                ))}
              </div>
            )}

            {/* Newsletter CTA Footer */}
            <div className="mt-20 p-10 md:p-16 rounded-3xl bg-gradient-to-br from-[#1b5e38] to-[#0d3520] text-center text-white relative overflow-hidden shadow-xl">
              <div 
                className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
                style={{ backgroundImage: "url('/images/motif-transparent.png')", backgroundSize: "400px", backgroundRepeat: "repeat" }} 
              />
              <div className="relative z-10 max-w-2xl mx-auto">
                <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4">Rejoignez la communauté</h3>
                <p className="text-lg text-white/80 mb-8">
                  Recevez directement dans votre boîte mail les meilleures analyses, conseils agronomiques et opportunités de financement pour développer votre activité.
                </p>
                <Link href="/inscription" className="inline-block font-bold text-[#1b5e38] bg-white hover:bg-gray-50 transition-colors px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  S'inscrire à la newsletter
                </Link>
              </div>
            </div>

          </div>
        </section>
      </div>
    )
  } catch (err: any) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-red-50 text-red-900">
        <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold mb-4">Erreur de rendu Serveur !</h1>
          <p className="mb-4 text-sm font-mono whitespace-pre-wrap">{err.message}</p>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">{err.stack}</pre>
        </div>
      </div>
    )
  }
}
