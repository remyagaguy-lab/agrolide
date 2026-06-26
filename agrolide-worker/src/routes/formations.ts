import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'
import { authMiddleware } from '../middleware/auth'
import { requireRole } from '../middleware/rbac'

export const formationsRoute = new Hono<{
  Bindings: {
    SUPABASE_URL: string
    SUPABASE_SERVICE_KEY: string
    RESEND_API_KEY: string
  }
}>()

// ==========================================
// ROUTES PUBLIQUES
// ==========================================

// Obtenir le catalogue public
formationsRoute.get('/', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)
  const { data, error } = await supabase
    .from('formations')
    .select('*, sessions_formation(*)')
    .eq('statut', 'publie')
    .order('created_at', { ascending: false })

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})

// Obtenir une formation spécifique (public)
formationsRoute.get('/:id', async (c) => {
  const id = c.req.param('id')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)
  
  const { data, error } = await supabase
    .from('formations')
    .select('*, sessions_formation(*), intervenants(*)')
    .eq('id', id)
    .single()
    
  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})


// ==========================================
// ROUTES MEMBRES
// ==========================================
formationsRoute.use('/*', authMiddleware)

// S'inscrire à une session
formationsRoute.post('/sessions/:session_id/inscrire', async (c) => {
  const session_id = c.req.param('session_id')
  const profile = c.get('profile') as any
  const user = c.get('user') as any
  
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)

  // 1. Vérifier si la session existe et a des places
  const { data: sessionData, error: sessionError } = await supabase
    .from('sessions_formation')
    .select('*, formations(titre, prix)')
    .eq('id', session_id)
    .single()

  if (sessionError || !sessionData) {
    return c.json({ error: 'Session introuvable' }, 404)
  }

  if (sessionData.places_restantes <= 0) {
    return c.json({ error: 'Il n\'y a plus de places disponibles pour cette session' }, 400)
  }

  // 2. Vérifier si l'utilisateur est déjà inscrit
  const { data: existing } = await supabase
    .from('inscriptions_formation')
    .select('id')
    .eq('session_id', session_id)
    .eq('membre_id', profile.id)
    .single()

  if (existing) {
    return c.json({ error: 'Vous êtes déjà inscrit à cette session' }, 400)
  }

  // 3. Déterminer le statut de l'inscription (gratuit vs payant)
  const isPayant = sessionData.formations.prix && sessionData.formations.prix > 0
  const statut = isPayant ? 'en_attente_paiement' : 'inscrit'

  // 4. Insérer l'inscription (le trigger Supabase devrait décrémenter places_restantes)
  const { data: inscription, error: insertError } = await supabase
    .from('inscriptions_formation')
    .insert({
      session_id,
      membre_id: profile.id,
      statut,
      date_inscription: new Date().toISOString()
    })
    .select()
    .single()

  if (insertError) {
    return c.json({ error: insertError.message }, 500)
  }

  // 5. Envoyer l'email de confirmation via Resend (simplifié)
  if (!isPayant && c.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Agrolide <contact@agrolide.org>',
          to: user.email,
          subject: `Confirmation d'inscription : ${sessionData.formations.titre}`,
          html: `<p>Bonjour,</p><p>Votre inscription à la formation <strong>${sessionData.formations.titre}</strong> est confirmée.</p>`
        })
      })
    } catch (e) {
      console.error('Erreur envoi email', e)
    }
  }

  return c.json({ 
    success: true, 
    statut,
    message: isPayant 
      ? 'Inscription pré-réservée. Veuillez procéder au paiement sous 48h.'
      : 'Inscription confirmée'
  })
})

// Mes inscriptions
formationsRoute.get('/mes-inscriptions', async (c) => {
  const profile = c.get('profile') as any
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY)
  
  const { data, error } = await supabase
    .from('inscriptions_formation')
    .select('*, sessions_formation(*, formations(*))')
    .eq('membre_id', profile.id)
    .order('created_at', { ascending: false })
    
  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data })
})
