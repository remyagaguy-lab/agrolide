import { MetadataRoute } from 'next'
import { db } from '@/db'
import { articles, evenements, formations } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Articles de blog
  const articlesData = await db.query.articles.findMany({
    where: eq(articles.statut, 'publie'),
    columns: { slug: true, updated_at: true }
  })

  // 2. Événements
  const evenementsData = await db.query.evenements.findMany({
    columns: { id: true, created_at: true }
  })

  // 3. Formations
  const formationsData = await db.query.formations.findMany({
    columns: { id: true, created_at: true }
  })

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

  const articleUrls: MetadataRoute.Sitemap = articlesData.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.updated_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const eventUrls: MetadataRoute.Sitemap = evenementsData.map((event) => ({
    url: `${baseUrl}/evenements/${event.id}`,
    lastModified: new Date(event.created_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const formationUrls: MetadataRoute.Sitemap = formationsData.map((formation) => ({
    url: `${baseUrl}/formations/${formation.id}`,
    lastModified: new Date(formation.created_at || new Date()),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticUrls, ...articleUrls, ...eventUrls, ...formationUrls]
}
