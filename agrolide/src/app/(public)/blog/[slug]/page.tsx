import { Metadata, ResolvingMetadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ArticleCard } from "@/components/ui/ArticleCard"
import { Button } from "@/components/ui/Button"
import { TableOfContents } from "@/components/modules/TableOfContents"
import { Clock, User, Calendar, Share2, MessageCircle } from "lucide-react"
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'

export const revalidate = 86400 // ISR 24h

// Dynamic metadata
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = await createClient()
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!article) {
    return {
      title: "Article non trouvé | agrolide",
    }
  }

  return {
    title: `${article.titre || article.title} | agrolide Blog`,
    description: article.excerpt || article.extrait || `Lisez cet article sur ${article.category || 'l\'agriculture africaine'}.`,
    openGraph: {
      type: 'article',
      publishedTime: article.published_at,
      authors: [article.author_name],
      title: article.titre || article.title,
      description: article.excerpt || article.extrait,
      images: article.image_une_url ? [{ url: article.image_une_url, width: 1200, height: 630 }] : [],
    },
  }
}

export default async function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  const supabase = await createClient()
  
  // Fetch article
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !article) {
    notFound()
  }

  // Fetch similar articles
  const { data: similarArticles } = await supabase
    .from('articles')
    .select('*')
    .eq('category', article.category)
    .neq('id', article.id)
    .eq('status', 'published')
    .limit(3)

  // Parse Content: check if JSON for Tiptap
  let htmlContent = ""
  try {
    const jsonContent = JSON.parse(article.content)
    htmlContent = generateHTML(jsonContent, [
      StarterKit,
      LinkExtension,
      ImageExtension
    ])
  } catch (e) {
    // If it's already HTML or plain string
    htmlContent = article.content || ""
  }

  const articleUrl = `https://agrolide.org/blog/${article.slug}`
  const encodedTitle = encodeURIComponent(article.title)
  const encodedUrl = encodeURIComponent(articleUrl)

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Article Header */}
      <section className="bg-gray-50 py-16 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-green-100 text-[var(--color-vert-principal)] text-sm font-semibold rounded-full">
              {article.category || "Général"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6 leading-tight">
            {article.titre || article.title}
          </h1>
          {article.excerpt && (
            <p className="text-xl text-[var(--color-gris-texte)] mb-8">
              {article.excerpt}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User size={18} className="text-[var(--color-vert-principal)]" />
              <span className="font-medium">{article.author_name || "Équipe Agrolide"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[var(--color-vert-principal)]" />
              <span>{new Date(article.published_at).toLocaleDateString('fr-FR', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[var(--color-vert-principal)]" />
              <span>{article.read_time ? `${article.read_time} min de lecture` : "5 min de lecture"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {(article.image_une_url || article.image_url) && (
        <section className="container mx-auto px-4 max-w-5xl -mt-8 relative z-10">
          <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
            <Image 
              src={article.image_une_url || article.image_url} 
              alt={article.titre || article.title}
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
            <div className="w-full lg:w-1/4 order-2 lg:order-1 hidden lg:block">
              <TableOfContents />
              
              <div className="mt-8">
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

            {/* Content */}
            <div className="w-full lg:w-3/4 order-1 lg:order-2">
              <div 
                className="article-content prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-[var(--color-vert-principal)] prose-a:text-[var(--color-orange-accent)]"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {/* CTA Fin d'article */}
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
                  title={simArticle.title}
                  excerpt={simArticle.excerpt || ""}
                  category={simArticle.category || "Général"}
                  author={simArticle.author_name || "Équipe Agrolide"}
                  date={simArticle.published_at}
                  readTime={simArticle.read_time ? `${simArticle.read_time} min` : "5 min"}
                  imageUrl={simArticle.image_url}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
