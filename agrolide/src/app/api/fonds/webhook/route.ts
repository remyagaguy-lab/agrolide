import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fake', {
  apiVersion: '2026-06-24.dahlia',
})
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy')

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const sig = request.headers.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    if (!endpointSecret) {
      console.warn("Pas de STRIPE_WEBHOOK_SECRET, on skip la vérification de signature pour le test local.")
      event = JSON.parse(payload) as Stripe.Event
    } else {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
    }
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    // Récupération des données depuis les metadata ou la DB
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Mettre à jour la contribution
    const { data: contribution, error } = await supabase
      .from('contributions')
      .update({ statut: 'valide' })
      .eq('stripe_session_id', session.id)
      .select()
      .single()

    if (error) {
      console.error("Erreur màj contribution:", error)
      return NextResponse.json({ error: "Erreur BDD" }, { status: 500 })
    }

    if (contribution) {
      // Envoyer un email de remerciement
      try {
        await resend.emails.send({
          from: 'agrolide <contact@agrolide.org>',
          to: contribution.email,
          subject: 'Merci pour votre soutien !',
          html: `
            <p>Bonjour ${contribution.prenom},</p>
            <p>Nous vous confirmons la bonne réception de votre don de ${contribution.montant_fcfa} FCFA.</p>
            <p>Votre générosité est un moteur essentiel pour la souveraineté alimentaire en Afrique. Grâce à vous, nous pouvons continuer à accompagner les acteurs du changement.</p>
            <p>L'équipe agrolide</p>
          `
        })
      } catch (emailError) {
        console.error("Erreur d'envoi d'email de remerciement:", emailError)
      }
    }
  }

  return NextResponse.json({ received: true })
}
