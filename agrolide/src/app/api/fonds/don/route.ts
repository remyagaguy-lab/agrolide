import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fake', {
  apiVersion: '2026-06-24.dahlia', // ou la version la plus récente supportée
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campagneId, montant_fcfa, prenom, nom, email, anonyme } = body

    if (!campagneId || !montant_fcfa || !email || !prenom) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    // Si on a pas de clé Stripe réelle, on simule un succès pour le test de développement
    if (!process.env.STRIPE_SECRET_KEY) {
      const { db } = await import('@/db')
      const { contributions } = await import('@/db/schema')

      // Simulation : Insérer directement le don en base comme validé (pour test)
      await db.insert(contributions).values({
        prenom: nom ? `${prenom} ${nom}` : prenom,
        email,
        montant_fcfa,
        methode: 'simulation',
        anonyme: !!anonyme,
        statut: 'valide'
      })

      return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_SITE_URL}/nous-soutenir?merci=true` })
    }

    // 1. Convertir FCFA en XOF pour Stripe, ou utiliser EUR si Stripe ne supporte pas XOF sur votre compte (Stripe supporte XOF en général)
    // Stripe attend les montants en centimes pour les devises à décimales, mais XOF n'a pas de centimes.
    // XOF est une monnaie "zéro décimale" pour Stripe, on passe donc le montant tel quel.
    const amount = parseInt(montant_fcfa, 10)

    // 2. Créer une session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'xof',
            product_data: {
              name: 'Donation pour la souveraineté alimentaire',
              description: `Campagne Agrolide`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/nous-soutenir?merci=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/nous-soutenir`,
      customer_email: email,
      metadata: {
        campagneId,
        prenom,
        nom: nom || '',
        email,
        anonyme: anonyme ? 'true' : 'false'
      }
    })

    // On pourrait créer la contribution en statut 'en_attente' ici, 
    // mais le webhook est plus sûr pour la créer directement validée (ou mettre à jour).
    // Faisons la création en_attente pour lier le session_id :
    
    const { db } = await import('@/db')
    const { contributions } = await import('@/db/schema')

    await db.insert(contributions).values({
      prenom: nom ? `${prenom} ${nom}` : prenom,
      email,
      montant_fcfa: amount,
      methode: 'stripe',
      provider_ref: session.id,
      anonyme: !!anonyme,
      statut: 'en_attente'
    })

    return NextResponse.json({ url: session.url })

  } catch (error: any) {
    console.error("Stripe Checkout Error:", error)
    return NextResponse.json({ error: "Erreur lors de l'initialisation du paiement." }, { status: 500 })
  }
}
