import { Context, Next } from 'hono'
import { createClient } from '@supabase/supabase-js'

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Non authentifié' }, 401)
  }

  const token = authHeader.replace('Bearer ', '')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return c.json({ error: 'Token invalide' }, 401)
  }

  // Charger le profil depuis Supabase (service role pour RLS bypass)
  const supabaseAdmin = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, categorie, statut_adhesion, role_plateforme')
    .eq('id', user.id)
    .single()

  c.set('user', user)
  c.set('profile', profile)
  await next()
}
