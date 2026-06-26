import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'
import { authMiddleware } from '../middleware/auth'

export const webinairesRoute = new Hono<{
  Bindings: {
    SUPABASE_URL: string
    SUPABASE_SERVICE_KEY: string
  }
}>()

// ==========================================
// ROUTES PUBLIQUES
// ==========================================

// Obtenir la liste des webinaires (à venir + replays)
webinairesRoute.get('/', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)
  const { data, error } = await supabase
    .from('webinaires')
    .select('*')
    .order('date_prevue', { ascending: false })

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// Obtenir un webinaire spécifique
webinairesRoute.get('/:id', async (c) => {
  const id = c.req.param('id')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)
  
  const { data, error } = await supabase
    .from('webinaires')
    .select('*')
    .eq('id', id)
    .single()
    
  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})
