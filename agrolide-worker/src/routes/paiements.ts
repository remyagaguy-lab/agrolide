import { Hono } from 'hono'
import Stripe from 'stripe'
import { v4 as uuidv4 } from 'uuid'
import { createClient } from '@supabase/supabase-js'

export const paiementsRoute = new Hono()

paiementsRoute.post('/checkout', async (c) => {
  const { methode, categorie } = await c.req.json()
  const profile = c.get('profile')
  const env = c.env as any

  // Montants en FCFA
  const montantsFCFA: Record<string, number> = { junior: 5000, professionnel: 15000, partenaire: 50000 }
  const montantActuelFCFA = montantsFCFA[categorie] || 5000

  if (methode === 'stripe') {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
    
    // Convertir FCFA en EUR pour Stripe (1 EUR ≈ 655 FCFA)
    const montantEurCentimes = Math.round((montantActuelFCFA / 655.957) * 100)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'eur',
      line_items: [{ 
        price_data: { 
          currency: 'eur', 
          unit_amount: montantEurCentimes, 
          product_data: { name: `Cotisation agrolide — ${categorie}` } 
        }, 
        quantity: 1 
      }],
      success_url: `https://agrolide.org/membres/cotisation?success=true`,
      cancel_url: `https://agrolide.org/membres/cotisation?cancelled=true`,
      metadata: { membre_id: profile.id, type: 'cotisation', categorie },
    })

    return c.json({ url: session.url })
  }

  if (methode === 'cinetpay') {
    const transaction_id = uuidv4()
    
    const payload = {
      apikey: env.CINETPAY_APIKEY,
      site_id: env.CINETPAY_SITE_ID,
      transaction_id: transaction_id,
      amount: montantActuelFCFA,
      currency: "XOF",
      channels: "ALL",
      description: `Cotisation agrolide - ${categorie}`,
      return_url: "https://agrolide.org/membres/cotisation?success=true",
      notify_url: "https://api.agrolide.org/api/paiements/cinetpay/webhook",
      customer_id: profile.id,
      customer_name: profile.nom || "Membre",
      customer_surname: profile.prenom || "Agrolide",
      metadata: JSON.stringify({ membre_id: profile.id, type: 'cotisation', categorie })
    }

    try {
      const response = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      
      const data: any = await response.json()
      
      if (data.code === '201') {
        return c.json({ url: data.data.payment_url })
      } else {
        console.error("Erreur CinetPay:", data)
        return c.json({ error: 'Erreur lors de la création du lien CinetPay' }, 400)
      }
    } catch (error) {
      console.error("Erreur réseau CinetPay:", error)
      return c.json({ error: 'Impossible de contacter le service de paiement' }, 500)
    }
  }

  return c.json({ error: 'Méthode non supportée' }, 400)
})

// Webhook Stripe
paiementsRoute.post('/stripe/webhook', async (c) => {
  const env = c.env as any
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  
  const signature = c.req.header('stripe-signature')
  if (!signature) return c.text('No signature', 400)

  const body = await c.req.text()
  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error(`Stripe Webhook Error: ${err.message}`)
    return c.text(`Webhook Error: ${err.message}`, 400)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { membre_id, categorie } = session.metadata || {}
    
    if (membre_id) {
      await validerCotisation(c, membre_id, 'stripe', (session.amount_total || 0) / 100, 'EUR')
    }
  }

  return c.json({ received: true })
})

// Webhook CinetPay
paiementsRoute.post('/cinetpay/webhook', async (c) => {
  const env = c.env as any
  // Note: CinetPay envoie les données en x-www-form-urlencoded
  const body = await c.req.parseBody()
  
  const { cpm_trans_id, cpm_site_id } = body
  
  if (cpm_site_id !== env.CINETPAY_SITE_ID) {
    return c.text('Site ID invalide', 400)
  }
  
  // Pour CinetPay, on doit faire un appel de vérification (Check Transaction Status)
  const payload = {
    apikey: env.CINETPAY_APIKEY,
    site_id: env.CINETPAY_SITE_ID,
    transaction_id: cpm_trans_id
  }
  
  const response = await fetch("https://api-checkout.cinetpay.com/v2/payment/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  
  const data: any = await response.json()
  
  if (data.code === '00' && data.data.status === 'ACCEPTED') {
    // Paiement réussi
    const metadataStr = data.data.metadata
    if (metadataStr) {
      try {
        const metadata = JSON.parse(metadataStr)
        if (metadata.membre_id) {
          await validerCotisation(c, metadata.membre_id, 'cinetpay', data.data.amount, data.data.currency)
        }
      } catch (e) {
        console.error("Erreur parsing metadata CinetPay", e)
      }
    }
  }

  return c.text('OK', 200)
})

async function validerCotisation(c: any, membre_id: string, methode: string, montant: number, devise: string) {
  const env = c.env as any
  // Use Service Role for database admin operations
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)
  
  const date_debut = new Date()
  const date_fin = new Date()
  date_fin.setFullYear(date_fin.getFullYear() + 1) // + 1 an
  
  // 1. Insérer dans la table cotisations
  await supabase.from('cotisations').insert({
    membre_id,
    montant,
    devise,
    methode_paiement: methode,
    statut: 'valide',
    date_debut: date_debut.toISOString(),
    date_fin: date_fin.toISOString()
  })

  // 2. Mettre à jour le statut dans profiles
  const { data: profile } = await supabase
    .from('profiles')
    .update({ statut_adhesion: 'actif' })
    .eq('id', membre_id)
    .select()
    .single()

  // 3. Envoyer Email de confirmation via Resend (HTML brut)
  if (profile && profile.id && env.RESEND_API_KEY) {
    // We need user email, which might be in auth.users, but we don't have it directly in profiles unless we query it or pass it.
    // Let's get email from auth.users using admin api
    const { data: userData } = await supabase.auth.admin.getUserById(membre_id)
    const email = userData?.user?.email
    
    if (email) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1b5e38; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">agrolide</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #333;">Bienvenue dans le réseau agrolide, ${profile.prenom} !</h2>
            <p style="color: #555; line-height: 1.6;">Votre paiement a été traité avec succès et votre adhésion est désormais active.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Catégorie :</strong> ${profile.categorie}</p>
              <p style="margin: 5px 0;"><strong>Montant payé :</strong> ${montant} ${devise}</p>
              <p style="margin: 5px 0;"><strong>Valide jusqu'au :</strong> ${date_fin.toLocaleDateString('fr-FR')}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://agrolide.org/membres/dashboard" style="background-color: #1b5e38; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Accéder à mon tableau de bord
              </a>
            </div>
          </div>
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            <p>© ${new Date().getFullYear()} agrolide. Tous droits réservés.</p>
            <p><a href="#" style="color: #888;">Se désinscrire de la newsletter</a></p>
          </div>
        </div>
      `
      
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'agrolide <contact@agrolide.org>',
          to: email,
          subject: 'Confirmation de votre adhésion agrolide 🎉',
          html: emailHtml
        })
      })
    }
  }
}
