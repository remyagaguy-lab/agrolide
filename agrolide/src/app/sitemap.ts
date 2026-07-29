import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // 1. Articles de blog
  let { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('statut', 'publie')
    
  if (!articles) articles = []

  // 2. Événements
  let { data: evenements } = await supabase
    .from('evenements')
    .select('id, date_creation')
    .eq('statut', 'publie')

  if (!evenements) evenements = []

  // 3. Formations
  let { data: formations } = await supabase
    .from('formations')
    .select('id, date_creation')
    .eq('statut', 'publie')

  if (!formations) formations = []

  const baseUrl = 'https://agrolide.org'

  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/qui-sommes-nous`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/rejoindre`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/actualites`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/formations`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/evenements`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/annuaire`, changeFrequency: 'daily', priority: 0.8 },
  ]

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.updated_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const eventUrls: MetadataRoute.Sitemap = evenements.map((event) => ({
    url: `${baseUrl}/evenements/${event.id}`,
    lastModified: new Date(event.date_creation || new Date()),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const formationUrls: MetadataRoute.Sitemap = formations.map((formation) => ({
    url: `${baseUrl}/formations/${formation.id}`,
    lastModified: new Date(formation.date_creation || new Date()),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticUrls, ...articleUrls, ...eventUrls, ...formationUrls]
}
