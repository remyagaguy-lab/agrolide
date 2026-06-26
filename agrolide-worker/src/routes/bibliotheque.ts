import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'
import { authMiddleware } from '../middleware/auth'
import { requireRole } from '../middleware/rbac'
import { Redis } from '@upstash/redis/cloudflare'
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const bibliothequeRoute = new Hono<{
  Bindings: {
    SUPABASE_URL: string
    SUPABASE_SERVICE_KEY: string
    UPSTASH_REDIS_URL: string
    UPSTASH_REDIS_TOKEN: string
    R2_ACCOUNT_ID?: string
    R2_ACCESS_KEY_ID?: string
    R2_SECRET_ACCESS_KEY?: string
    R2_BIBLIOTHEQUE: R2Bucket
  }
}>()

// Helper pour générer une URL signée R2
async function generateR2SignedUrl(
  env: any,
  bucketName: string,
  key: string,
  expiresIn: number,
  method: 'GET' | 'PUT' = 'GET'
) {
  // S'il manque les credentials AWS, on fallback sur une URL publique ou proxy
  // Note: Pour un vrai support des URL signées R2, il faut les clés S3 dans l'env.
  if (!env.R2_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
    throw new Error('Variables d\'environnement R2 manquantes pour S3 presigner')
  }

  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  })

  const command = method === 'GET' 
    ? new GetObjectCommand({ Bucket: bucketName, Key: key })
    : new PutObjectCommand({ Bucket: bucketName, Key: key })

  return await getSignedUrl(s3Client, command, { expiresIn })
}

// ==========================================
// ROUTES PUBLIQUES
// ==========================================

// Obtenir le nombre total de documents publiés
bibliothequeRoute.get('/count', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)
  const { count, error } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('statut', 'publie')

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ count: count || 0 })
})

// Obtenir 6 documents pour l'aperçu public
bibliothequeRoute.get('/public-preview', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('statut', 'publie')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})


// ==========================================
// ROUTES MEMBRES (Nécessite authentification)
// ==========================================
bibliothequeRoute.use('/*', authMiddleware)

// Liste des documents avec filtres
bibliothequeRoute.get('/', async (c) => {
  const search = c.req.query('search')
  const type = c.req.query('type')
  const thematique = c.req.query('thematique')
  const pays = c.req.query('pays')
  const filiere = c.req.query('filiere')
  const langue = c.req.query('langue')
  const acces = c.req.query('acces')
  
  // Pagination cursor
  const cursor = c.req.query('cursor')
  const limit = parseInt(c.req.query('limit') || '20', 10)

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)
  
  let query = supabase
    .from('documents')
    .select('*')
    .eq('statut', 'publie')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (search) query = query.ilike('titre', `%${search}%`)
  if (type) query = query.in('type', type.split(','))
  if (thematique) query = query.in('thematique', thematique.split(','))
  if (pays) query = query.eq('pays', pays)
  if (filiere) query = query.eq('filiere', filiere)
  if (langue) query = query.eq('langue', langue)
  if (acces) query = query.eq('acces', acces)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  const { data, error } = await query
  
  if (error) return c.json({ error: error.message }, 500)
  
  const nextCursor = data && data.length === limit ? data[data.length - 1].created_at : null

  return c.json({ data, nextCursor })
})

// Générer une URL d'upload (Professionnel, Partenaire, Sénior)
// On utilise une approche simplifiée avec R2Bucket direct ou Presigned si keys dispo
bibliothequeRoute.get('/upload-url', requireRole('professionnel', 'partenaire', 'senior', 'admin_content', 'super_admin'), async (c) => {
  const filename = c.req.query('filename')
  if (!filename) return c.json({ error: 'filename requis' }, 400)
  
  const key = `uploads/${crypto.randomUUID()}-${filename}`
  
  try {
    const url = await generateR2SignedUrl(c.env, 'agrolide-bibliotheque', key, 900, 'PUT')
    return c.json({ url, key })
  } catch (err: any) {
    // Fallback: Si pas de AWS credentials configurés, on utilise un custom upload
    // On retourne une route custom du worker pour uploader via FormData
    const url = `/api/bibliotheque/direct-upload?key=${encodeURIComponent(key)}`
    return c.json({ url, key, useDirect: true })
  }
})

// Fallback upload (si pas d'URL présignée dispo)
bibliothequeRoute.put('/direct-upload', requireRole('professionnel', 'partenaire', 'senior', 'admin_content', 'super_admin'), async (c) => {
  const key = c.req.query('key')
  if (!key) return c.json({ error: 'key requise' }, 400)
  
  const body = await c.req.arrayBuffer()
  const contentType = c.req.header('content-type') || 'application/pdf'
  
  await c.env.R2_BIBLIOTHEQUE.put(key, body, { httpMetadata: { contentType } })
  return c.json({ success: true, key })
})

// Télécharger un document (avec vérification quota)
bibliothequeRoute.get('/download/:id', requireRole('junior', 'professionnel', 'partenaire', 'senior', 'admin_content', 'super_admin'), async (c) => {
  const id = c.req.param('id')
  const profile = c.get('profile') as any

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)
  
  // 1. Vérifier quota Junior (Upstash Redis)
  if (profile.categorie === 'junior') {
    const redis = new Redis({ url: c.env.UPSTASH_REDIS_URL, token: c.env.UPSTASH_REDIS_TOKEN })
    const key = `dl:user:${profile.id}:month:${new Date().toISOString().slice(0, 7)}`
    
    const count = await redis.incr(key)
    if (count === 1) await redis.expire(key, 2678400) // 31 jours
    
    if (count > 20) return c.json({ error: 'Quota mensuel atteint (20 docs/mois)' }, 429)
  }

  // 2. Récupérer le document
  const { data: doc } = await supabase.from('documents').select('*').eq('id', id).single()
  if (!doc) return c.json({ error: 'Document introuvable' }, 404)
  if (doc.statut !== 'publie') return c.json({ error: 'Document non publié' }, 403)

  // 3. Vérifier accès si "membres" uniquement
  if (doc.acces === 'membres' && !['actif'].includes(profile.statut_adhesion)) {
    return c.json({ error: 'Accès réservé aux membres actifs' }, 403)
  }

  // 4. Logger le téléchargement + incrémenter compteur
  await supabase.from('telechargements').insert({ document_id: id, membre_id: profile.id })
  await supabase.from('documents').update({ nb_telechargements: (doc.nb_telechargements || 0) + 1 }).eq('id', id)

  // 5. Générer URL signée R2
  try {
    const signedUrl = await generateR2SignedUrl(c.env, 'agrolide-bibliotheque', doc.fichier_r2_key, 900, 'GET')
    return c.json({ url: signedUrl, nom_fichier: `${doc.titre}.pdf` })
  } catch (err) {
    // Fallback: proxy download si clés S3 non configurées
    const object = await c.env.R2_BIBLIOTHEQUE.get(doc.fichier_r2_key)
    if (!object) return c.json({ error: 'Fichier physique introuvable' }, 404)
    
    c.header('Content-Type', object.httpMetadata?.contentType || 'application/pdf')
    c.header('Content-Disposition', `attachment; filename="${encodeURIComponent(doc.titre)}.pdf"`)
    return c.body(object.body as any)
  }
})

// Créer la fiche document (Statut en_attente_validation)
bibliothequeRoute.post('/', requireRole('professionnel', 'partenaire', 'senior', 'admin_content', 'super_admin'), async (c) => {
  const profile = c.get('profile') as any
  const body = await c.req.json()
  
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)
  
  const { data, error } = await supabase.from('documents').insert({
    ...body,
    statut: 'en_attente_validation',
    auteur_id: profile.id
  }).select().single()

  if (error) return c.json({ error: error.message }, 500)

  // Envoyer un email à l'admin (Optionnel)
  // TODO: Implémenter Resend avec c.env.RESEND_API_KEY
  
  return c.json({ data })
})

// Obtenir un document par ID
bibliothequeRoute.get('/:id', async (c) => {
  const id = c.req.param('id')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)
  
  const { data: doc, error } = await supabase.from('documents').select('*').eq('id', id).single()
  
  if (error) return c.json({ error: error.message }, 500)
  if (!doc || doc.statut !== 'publie') return c.json({ error: 'Introuvable' }, 404)

  return c.json({ data: doc })
})

// ==========================================
// ROUTES ADMIN
// ==========================================

// Mettre à jour le statut d'un document (Valider / Rejeter)
bibliothequeRoute.put('/:id/status', requireRole('admin_content', 'super_admin'), async (c) => {
  const id = c.req.param('id')
  const { statut } = await c.req.json()
  
  if (!['publie', 'rejete'].includes(statut)) {
    return c.json({ error: 'Statut invalide' }, 400)
  }

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)
  
  const { data, error } = await supabase.from('documents').update({ statut }).eq('id', id).select().single()
  
  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})
