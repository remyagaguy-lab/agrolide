import { Metadata, ResolvingMetadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ArticleCard } from "@/components/ui/ArticleCard"
import { Button } from "@/components/ui/Button"
import Breadcrumb from "@/components/ui/Breadcrumb"
import { TableOfContents } from "@/components/modules/TableOfContents"
import { Clock, User, Calendar, Share2, MessageCircle } from "lucide-react"
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'

export const revalidate = 3600

// Dynamic metadata
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient()
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!article) {
    return {
      title: "Article non trouvé | agrolide",
    }
  }

  return {
    title: `${article.titre} | agrolide Blog`,
    description: article.extrait || `Lisez cet article sur ${article.categorie || 'l\'agriculture africaine'}.`,
    openGraph: {
      type: 'article',
      publishedTime: article.published_at,
      authors: [article.auteur_externe],
      title: article.titre,
      description: article.extrait,
      images: article.image_une_url ? [{ url: article.image_une_url, width: 1200, height: 630 }] : [],
    },
  }
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const supabase = await createClient()
  
  // Fetch article
  const { data: dbArticle, error } = await supabase
    .from('articles')
    .select('*, profiles(prenom, nom, photo_url)')
    .eq('slug', slug)
    .single()

  const fallbackArticles = [
    { id: "1", slug: "pratiques-agroecologiques", titre: "Pratiques agroécologiques pour sols tropicaux", extrait: "Comment adapter les techniques de conservation des sols aux conditions climatiques de l'Afrique subsaharienne.", categorie: "Agronomie", auteur_externe: "Équipe Agrolide", published_at: "2024-10-12T00:00:00Z" },
    { id: "2", slug: "financer-projet-agricole", titre: "Financer son projet agricole : les clés", extrait: "Tour d'horizon des instruments financiers accessibles aux agripreneurs africains en 2024.", categorie: "Agrobusiness", auteur_externe: "Équipe Agrolide", published_at: "2024-10-05T00:00:00Z" },
    { id: "3", slug: "competences-agronomes", titre: "Compétences du futur pour les agronomes", extrait: "Panorama des formations techniques et managériales qui font la différence sur le terrain africain.", categorie: "Formation", auteur_externe: "Équipe Agrolide", published_at: "2024-09-28T00:00:00Z" }
  ]

  let article = dbArticle
  if (error || !article) {
    const fallback = fallbackArticles.find(a => a.slug === slug)
    if (fallback) {
      article = { ...fallback, contenu_json: `<p>${fallback.extrait}</p><p><em>(Cet article est un exemple de démonstration. Le contenu complet sera ajouté ultérieurement.)</em></p>` }
    } else {
      notFound()
    }
  }

  // Fetch similar articles
  const { data: similarArticles } = await supabase
    .from('articles')
    .select('*')
    .eq('categorie', article.categorie)
    .neq('id', article.id)
    .eq('statut', 'publie')
    .limit(3)

  // Parse Content: check if JSON for Tiptap
  let htmlContent = ""
  try {
    const jsonContent = typeof article.contenu_json === 'string' ? JSON.parse(article.contenu_json) : article.contenu_json
    htmlContent = generateHTML(jsonContent, [
      StarterKit,
      LinkExtension,
      ImageExtension
    ])
  } catch (e) {
    // If it's already HTML or plain string
    htmlContent = article.contenu_json || ""
  }

  const articleUrl = `https://agrolide.org/blog/${article.slug}`
  const encodedTitle = encodeURIComponent(article.titre)
  const encodedUrl = encodeURIComponent(articleUrl)

  const breadcrumbItems = [
    { label: "Blog", href: "/blog" },
    { label: article.categorie || "Général", href: `/blog?category=${encodeURIComponent(article.categorie || "Général")}` },
    { label: article.titre }
  ]

  const authorName = article.profiles ? `${article.profiles.prenom} ${article.profiles.nom}` : (article.auteur_externe || "Équipe Agrolide")

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Article Header */}
      <section className="bg-gray-50 py-16 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-green-100 text-[var(--color-vert-principal)] text-sm font-semibold rounded-full">
              {article.categorie || "Général"}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6 leading-tight">
            {article.titre}
          </h1>
          {article.extrait && (
            <p className="text-xl text-[var(--color-gris-texte)] mb-8">
              {article.extrait}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              {article.auteur_id ? (
                <Link href={`/annuaire/${article.auteur_id}`} className="flex items-center gap-2 hover:text-[var(--color-vert-principal)] transition-colors group">
                  {article.profiles?.photo_url ? (
                    <Image src={article.profiles.photo_url} alt={authorName} width={24} height={24} className="rounded-full" />
                  ) : (
                    <User size={18} className="text-[var(--color-vert-principal)]" />
                  )}
                  <span className="font-medium group-hover:underline">{authorName}</span>
                </Link>
              ) : (
                <>
                  {article.profiles?.photo_url ? (
                    <Image src={article.profiles.photo_url} alt={authorName} width={24} height={24} className="rounded-full" />
                  ) : (
                    <User size={18} className="text-[var(--color-vert-principal)]" />
                  )}
                  <span className="font-medium">{authorName}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[var(--color-vert-principal)]" />
              <span>{new Date(article.published_at).toLocaleDateString('fr-FR', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[var(--color-vert-principal)]" />
              <span>5 min de lecture</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {article.image_une_url && (
        <section className="container mx-auto px-4 max-w-5xl -mt-8 relative z-10">
          <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
            <Image 
              src={article.image_une_url} 
              alt={article.titre}
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>
      )}

      {/* Article Body */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar (TOC + Share) */}
            <div className="w-full lg:w-1/4 order-1">
              <div className="sticky top-24 space-y-6">
                <TableOfContents />
                
                {/* Partager - fixe sous le sommaire */}
                <div className="bg-gray-50 p-6 rounded-xl border border-[var(--color-gris-clair)] hidden lg:block">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Share2 size={18} />
                    Partager
                  </h4>
                  <div className="flex gap-3">
                    <a 
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors font-bold"
                    >
                      in
                    </a>
                    <a 
                      href={`https://wa.me/?text=${encodedTitle} ${encodedUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
                    >
                      <MessageCircle size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="w-full lg:w-3/4 order-2">
              <div 
                className="article-content prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-[var(--color-vert-principal)] prose-a:text-[var(--color-orange-accent)]"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {/* Partage Mobile */}
              <div className="mt-12 lg:hidden flex flex-col items-center justify-center gap-4 border-t border-gray-200 pt-8">
                <span className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                  <Share2 size={20} />
                  Partager cet article
                </span>
                <div className="flex gap-4">
                  <a 
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors font-bold text-lg"
                  >
                    in
                  </a>
                  <a 
                    href={`https://wa.me/?text=${encodedTitle} ${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
                  >
                    <MessageCircle size={24} />
                  </a>
                </div>
              </div>

              {/* CTA Fin d'article (affiché uniquement si l'article n'a pas son propre CTA) */}
              {!htmlContent.includes('class="custom-cta"') && (
                <div className="mt-16 p-8 bg-[#E8F3EB] rounded-2xl border border-green-200 text-center">
                  <h3 className="text-2xl font-heading font-bold text-[var(--color-vert-principal)] mb-4">
                    Vous souhaitez aller plus loin ?
                  </h3>
                  <p className="text-[var(--color-gris-texte)] mb-6 max-w-xl mx-auto">
                    Rejoignez des milliers de professionnels sur agrolide et accédez à des ressources exclusives pour développer votre projet agricole.
                  </p>
                  <Link href="/rejoindre">
                    <Button variant="primary" className="text-lg px-8">
                      Découvrir les adhésions
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Articles similaires */}
      {similarArticles && similarArticles.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8">
              Articles similaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarArticles.map((simArticle) => (
                <ArticleCard
                  key={simArticle.id}
                  slug={simArticle.slug}
                  title={simArticle.titre}
                  excerpt={simArticle.extrait || ""}
                  category={simArticle.categorie || "Général"}
                  author={simArticle.profiles ? `${simArticle.profiles.prenom} ${simArticle.profiles.nom}` : (simArticle.auteur_externe || "Équipe Agrolide")}
                  date={simArticle.published_at}
                  readTime={"5 min"}
                  imageUrl={simArticle.image_une_url}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
