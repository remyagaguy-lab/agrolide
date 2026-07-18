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
    .select('id, date_debut')
    .eq('publie', true)
    
  if (!evenements) evenements = []

  // 3. Formations
  // Hypothèse : la table s'appelle 'formations' et a un champ 'id'. 
  // On ne filtre pas s'il n'y a pas de champ 'publie' pour être sûr que ça fonctionne,
  // ou on peut essayer eq('statut', 'publie') si ça plante on corrigera.
  let { data: formations } = await supabase
    .from('formations')
    .select('id')
    
  if (!formations) formations = []

  const baseUrl = 'https://agrolide.org'

  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/qui-sommes-nous`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/rejoindre`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/evenements`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/formations`, changeFrequency: 'daily', priority: 0.7 },
  ]

  const articleUrls: MetadataRoute.Sitemap = (articles || []).map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.updated_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const evenementUrls: MetadataRoute.Sitemap = (evenements || []).map((ev) => ({
    url: `${baseUrl}/evenements/${ev.id}`,
    lastModified: ev.date_debut ? new Date(ev.date_debut) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const formationUrls: MetadataRoute.Sitemap = (formations || []).map((form) => ({
    url: `${baseUrl}/formations/${form.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticUrls, ...articleUrls, ...evenementUrls, ...formationUrls]
}
