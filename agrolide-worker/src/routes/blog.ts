import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'

export const blogRoute = new Hono()

// Helper pour initialiser Supabase
const getSupabase = (env: any) => {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)
}

// ==========================================
// ROUTES PUBLIQUES (Lecture)
// ==========================================

// Liste des articles (avec filtres optionnels)
blogRoute.get('/articles', async (c) => {
  const supabase = getSupabase(c.env)
  
  const status = c.req.query('status')
  const category = c.req.query('category')
  const limit = parseInt(c.req.query('limit') || '10', 10)
  
  let query = supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(limit)
  
  if (status) query = query.eq('status', status)
  if (category) query = query.eq('category', category)
    
  const { data, error } = await query
  
  if (error) return c.json({ error: error.message }, 500)
  return c.json({ articles: data })
})

// Article par slug
blogRoute.get('/articles/:slug', async (c) => {
  const supabase = getSupabase(c.env)
  const slug = c.req.param('slug')
  
  const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single()
  
  if (error) return c.json({ error: 'Article introuvable' }, 404)
  return c.json({ article: data })
})


// ==========================================
// ROUTES PROTEGEES (Création / Modification / Médias)
// Ces routes doivent être placées derrière authMiddleware et rbacMiddleware dans index.ts
// ==========================================

// Upload d'image (R2)
blogRoute.post('/media', async (c) => {
  try {
    const body = await c.req.parseBody()
    const file = body['file'] as File

    if (!file) {
      return c.json({ error: 'Aucun fichier fourni' }, 400)
    }

    const extension = file.name.split('.').pop()
    const filename = `blog-${crypto.randomUUID()}.${extension}`
    
    const bucket = (c.env as any).R2_MEDIA
    if (!bucket) {
      return c.json({ error: 'Bucket R2 non configuré' }, 500)
    }
    
    await bucket.put(filename, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type }
    })

    // URL publique (Placeholder à adapter avec le vrai domaine CDN Cloudflare)
    const publicUrl = `https://pub-agrolide-media.r2.dev/${filename}`
    
    return c.json({ url: publicUrl })
  } catch (error: any) {
    console.error('Erreur upload media blog:', error)
    return c.json({ error: 'Erreur lors de l\'upload' }, 500)
  }
})

// Créer un article
blogRoute.post('/articles', async (c) => {
  const supabase = getSupabase(c.env)
  const profile = c.get('profile') // Injecté par authMiddleware
  const payload = await c.req.json()

  // On enrichit le payload avec l'auteur
  const articleData = {
    ...payload,
    author_id: profile.id,
    author_name: `${profile.prenom} ${profile.nom}`
  }

  const { data, error } = await supabase.from('articles').insert(articleData).select().single()

  if (error) {
    console.error("Erreur création article", error)
    return c.json({ error: error.message }, 500)
  }
  
  return c.json({ article: data }, 201)
})

// Modifier un article
blogRoute.put('/articles/:id', async (c) => {
  const supabase = getSupabase(c.env)
  const id = c.req.param('id')
  const payload = await c.req.json()

  // On retire l'id du payload s'il est présent pour éviter l'erreur de mise à jour PK
  const { id: _, author_id, author_name, created_at, ...updateData } = payload

  // Pour "published_at", si on passe le statut à published on set la date.
  if (updateData.status === 'published' && !payload.published_at) {
    updateData.published_at = new Date().toISOString()
  }

  const { data, error } = await supabase.from('articles').update(updateData).eq('id', id).select().single()

  if (error) {
    console.error("Erreur modification article", error)
    return c.json({ error: error.message }, 500)
  }
  
  return c.json({ article: data })
})
