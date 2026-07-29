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

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f8f6]">
      {/* Hero */}
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
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Colonne Principale (Dernières publications) */}
            <div className="lg:w-2/3">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {displayArticles.map((article) => (
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
            </div>

            {/* Sidebar (Articles populaires) */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] sticky top-24">
                <h3 className="text-xl font-bold font-heading text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#fcb726]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Articles Populaires
                </h3>
                <div className="space-y-6">
                  {displayArticles.slice(0, 4).map((article) => (
                    <Link href={`/blog/${article.slug}`} key={article.id} className="group block">
                      <div className="flex gap-4 items-center">
                        <div className="w-20 h-20 rounded-2xl relative overflow-hidden shrink-0 bg-gray-100 shadow-sm">
                          <Image 
                            src={article.image_une_url || "https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c0e?q=80&w=2070&auto=format&fit=crop"} 
                            alt={article.titre} 
                            fill 
                            sizes="80px" 
                            className="object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-heading font-bold text-[15px] text-gray-900 group-hover:text-[#1b5e38] transition-colors line-clamp-2 leading-tight mb-1.5">
                            {article.titre}
                          </h4>
                          <span className="text-xs font-medium text-gray-500">
                            {format(new Date(article.published_at), 'dd MMM yyyy', { locale: fr })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {/* Petit bloc promo / abonnement newsletter éventuel */}
                <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-[#f4fdf4] to-[#e8f5e9] border border-[#c8e6c9] text-center">
                  <h4 className="font-heading font-bold text-[#1b5e38] mb-2">Ne manquez rien !</h4>
                  <p className="text-sm text-gray-600 mb-4">Rejoignez notre newsletter pour recevoir les meilleures astuces agricoles.</p>
                  <Link href="/inscription" className="inline-block text-sm font-bold text-white bg-[#1b5e38] hover:bg-green-800 transition-colors px-4 py-2 rounded-xl">
                    S'inscrire
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
