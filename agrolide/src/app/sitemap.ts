import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  let { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('status', 'published')
    
  if (!articles) articles = []

  const baseUrl = 'https://agrolide.org'

  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/qui-sommes-nous`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/rejoindre`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: 'daily', priority: 0.7 },
  ]

  const articleUrls: MetadataRoute.Sitemap = (articles || []).map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.updated_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticUrls, ...articleUrls]
}
