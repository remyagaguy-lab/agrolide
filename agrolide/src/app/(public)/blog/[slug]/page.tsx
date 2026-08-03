import { Metadata, ResolvingMetadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { articles, users } from "@/db/schema"
import { eq, ne, and } from "drizzle-orm"
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
  
  const article = await db.query.articles.findFirst({
    where: eq(articles.slug, slug),
    with: { auteur: true }
  })

  if (!article) {
    return {
      title: "Article non trouvé",
    }
  }

  const authorName = article.auteur ? `${article.auteur.prenom} ${article.auteur.nom}` : (article.auteur_externe || "Équipe Agrolide")

  return {
    title: article.titre,
    description: article.extrait || `Lisez cet article sur ${article.categorie || 'l\'agriculture africaine'}.`,
    openGraph: {
      type: 'article',
      publishedTime: article.published_at || undefined,
      authors: [authorName],
      title: article.titre,
      description: article.extrait || undefined,
      images: article.image_une_url ? [{ url: article.image_une_url, width: 1200, height: 630 }] : [],
    },
    alternates: {
      canonical: `/blog/${slug}`
    }
  }
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  
  let article: any = null
  let error = false
  try {
    article = await db.query.articles.findFirst({
      where: eq(articles.slug, slug),
      with: { auteur: true }
    })
  } catch (e) {
    error = true
  }

  const fallbackArticles = [
    { id: "1", slug: "pratiques-agroecologiques", titre: "Pratiques agroécologiques pour sols tropicaux", extrait: "Comment adapter les techniques de conservation des sols aux conditions climatiques de l'Afrique subsaharienne.", categorie: "Production Végétal", auteur_externe: "Équipe Agrolide", published_at: "2024-10-12T00:00:00Z" },
    { id: "2", slug: "financer-projet-agricole", titre: "Financer son projet agricole : les clés", extrait: "Tour d'horizon des instruments financiers accessibles aux agripreneurs africains en 2024.", categorie: "Agrobusiness", auteur_externe: "Équipe Agrolide", published_at: "2024-10-05T00:00:00Z" },
    { id: "3", slug: "competences-agronomes", titre: "Compétences du futur pour les agronomes", extrait: "Panorama des formations techniques et managériales qui font la différence sur le terrain africain.", categorie: "Agroeconomie", auteur_externe: "Équipe Agrolide", published_at: "2024-09-28T00:00:00Z" }
  ]

  if (error || !article) {
    const fallback = fallbackArticles.find(a => a.slug === slug)
    if (fallback) {
      article = { ...fallback, contenu_json: `<p>${fallback.extrait}</p><p><em>(Cet article est un exemple de démonstration. Le contenu complet sera ajouté ultérieurement.)</em></p>` }
    } else {
      notFound()
    }
  }

  // Fetch similar articles
  let similarArticles: any[] = []
  try {
    similarArticles = await db.query.articles.findMany({
      where: and(
        eq(articles.categorie, article.categorie),
        ne(articles.id, article.id),
        eq(articles.statut, 'publie')
      ),
      limit: 3,
      with: { auteur: true }
    })
  } catch (e) {
    console.error(e)
  }

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

  const authorName = article.auteur ? `${article.auteur.prenom} ${article.auteur.nom}` : (article.auteur_externe || "Équipe Agrolide")

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.titre,
    image: article.image_une_url ? [article.image_une_url] : [],
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: [{
        "@type": "Person",
        name: authorName,
        url: article.auteur_id ? `https://agrolide.org/annuaire/${article.auteur_id}` : "https://agrolide.org",
      }],
    publisher: {
      "@type": "Organization",
      name: "Agrolide",
      logo: {
        "@type": "ImageObject",
        url: "https://agrolide.org/icon.png"
      }
    },
    description: article.extrait
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl py-8 md:py-16">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center xl:gap-14">
            {/* Colonne Gauche : Contenu */}
            <div className="lg:pr-4 xl:pr-8">
              <div className="mb-4">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-vert-principal)]">
                  {article.categorie || "Général"}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-gray-900 leading-[1.2] tracking-tight mb-5">
                {article.titre}
              </h1>
              {article.extrait && (
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
                  {article.extrait}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                  {article.auteur?.photo_url ? (
                    <Image src={article.auteur.photo_url} alt={authorName} width={24} height={24} className="rounded-full" />
                  ) : (
                    <User size={16} />
                  )}
                  {article.auteur_id ? (
                    <Link href={`/annuaire/${article.auteur_id}`} className="hover:text-[var(--color-vert-principal)] transition-colors">
                      {authorName}
                    </Link>
                  ) : (
                    <span>{authorName}</span>
                  )}
                </div>
                <span aria-hidden="true"> · </span>
                <span>
                  {new Date(article.published_at || '').toLocaleDateString('fr-FR', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
                <span aria-hidden="true"> · </span>
                <span>5 min de lecture</span>
              </div>
              
              {/* Tags éventuels (optionnels, on peut mettre la catégorie ici aussi ou des tags si on en a) */}
              <ul className="flex flex-wrap gap-2">
                <li>
                  <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                    {article.categorie || "Général"}
                  </span>
                </li>
              </ul>
            </div>
            
            {/* Colonne Droite : Image */}
            <div className="w-full">
              {article.image_une_url ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                  <Image 
                    src={article.image_une_url} 
                    alt={article.titre}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-video rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Image indisponible</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] xl:gap-x-12">
            
            {/* Sidebar (TOC + Share) - Ordre 1 sur desktop, mais order-2 sur mobile */}
            <div className="w-full order-2 lg:order-1 lg:border-r lg:border-gray-100 lg:pr-8">
              <div className="sticky top-24 space-y-8">
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-4">
                    Dans cet article
                  </p>
                  <TableOfContents />
                </div>
                
                <div className="pt-6 border-t border-gray-100 hidden lg:block">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-4">
                    Partager
                  </p>
                  <div className="flex gap-2">
                    <a 
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                      in
                    </a>
                    <a 
                      href={`https://wa.me/?text=${encodedTitle} ${encodedUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors"
                    >
                      <MessageCircle size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Content - Ordre 1 sur mobile */}
            <div className="w-full order-1 lg:order-2">
              <div 
                className="prose prose-lg max-w-none 
                  prose-headings:font-heading prose-headings:font-bold prose-headings:text-gray-900 prose-headings:scroll-mt-28
                  prose-h2:text-[1.75rem] prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-[1.0625rem] prose-p:leading-[1.8] prose-p:text-gray-700 prose-p:mb-6
                  prose-a:text-[var(--color-vert-principal)] prose-a:no-underline prose-a:font-medium hover:prose-a:underline
                  prose-strong:text-gray-900
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:text-gray-700 prose-ul:mb-6
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:text-gray-700 prose-ol:mb-6
                  prose-li:mb-2
                  prose-blockquote:border-l-4 prose-blockquote:border-[var(--color-vert-principal)] prose-blockquote:bg-gray-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-800 prose-blockquote:italic"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {/* Partage Mobile */}
              <div className="mt-12 lg:hidden flex flex-col items-start gap-4 border-t border-gray-100 pt-8">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-gray-400">
                  Partager cet article
                </p>
                <div className="flex gap-3">
                  <a 
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    in
                  </a>
                  <a 
                    href={`https://wa.me/?text=${encodedTitle} ${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    <MessageCircle size={18} />
                  </a>
                </div>
              </div>

              {/* CTA Fin d'article */}
              {!htmlContent.includes('class="custom-cta"') && (
                <div className="mt-16 p-8 bg-[#f8faf8] rounded-2xl border border-[var(--color-vert-clair)]">
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-gray-900 mb-3">
                    Besoin de développer votre réseau agricole ?
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm md:text-base">
                    Rejoignez des milliers de professionnels sur agrolide et accédez à des ressources exclusives pour développer votre projet.
                  </p>
                  <Link href="/rejoindre">
                    <Button variant="primary" className="text-sm md:text-base px-6">
                      Découvrir les avantages membres →
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
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-10">
              Articles similaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarArticles.map((simArticle) => (
                <ArticleCard
                  key={simArticle.id}
                  slug={simArticle.slug}
                  title={simArticle.titre}
                  excerpt={simArticle.extrait || ""}
                  category={simArticle.categorie || "Général"}
                  author={simArticle.auteur ? `${simArticle.auteur.prenom} ${simArticle.auteur.nom}` : (simArticle.auteur_externe || "Équipe Agrolide")}
                  date={simArticle.published_at || ''}
                  readTime={"5 min"}
                  imageUrl={simArticle.image_une_url || undefined}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
