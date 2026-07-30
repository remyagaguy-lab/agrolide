import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import { evenements, inscriptions_evenement, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { Resend } from 'resend'

// Initialiser Resend seulement si la clé est présente
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { evenement_id, prenom, nom, email_externe } = body

    if (!evenement_id) {
      return NextResponse.json({ error: "L'identifiant de l'événement est requis." }, { status: 400 })
    }

    const session = await auth()
    const user = session?.user

    let membre_id = null
    let emailDestinataire = email_externe
    let userPrenom = prenom
    
    if (user && user.id) {
      membre_id = user.id
      emailDestinataire = user.email
      
      const profile = await db.query.users.findFirst({
        columns: { prenom: true, nom: true },
        where: eq(users.id, user.id)
      })
      
      if (profile) {
        userPrenom = profile.prenom || ''
      }
    } else {
      if (!prenom || !nom || !email_externe) {
        return NextResponse.json({ error: "Tous les champs sont requis pour les visiteurs." }, { status: 400 })
      }
    }

    const event = await db.query.evenements.findFirst({
      columns: { titre: true, date_debut: true, lieu: true, en_ligne: true },
      where: eq(evenements.id, evenement_id)
    })

    if (!event) {
      return NextResponse.json({ error: "Événement introuvable." }, { status: 404 })
    }

    try {
      await db.insert(inscriptions_evenement).values({
        id: crypto.randomUUID(),
        evenement_id,
        membre_id,
        email_externe: membre_id ? null : email_externe,
        prenom: membre_id ? null : prenom,
        nom: membre_id ? null : nom
      })
    } catch (insertError: any) {
      if (insertError.code === '23505' || insertError.message.includes('unique constraint')) {
        return NextResponse.json({ error: "Vous êtes déjà inscrit(e) à cet événement." }, { status: 400 })
      }
      console.error("Erreur d'insertion:", insertError)
      return NextResponse.json({ error: "Erreur lors de l'inscription." }, { status: 500 })
    }

    if (resend && emailDestinataire) {
      try {
        const dateStr = new Date(event.date_debut).toLocaleDateString('fr-FR', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })
        
        await resend.emails.send({
          from: 'Agrolide <contact@agrolide.org>', 
          to: [emailDestinataire],
          subject: `Confirmation d'inscription : ${event.titre}`,
          html: `
            <div style="font-family: sans-serif; color: #333; max-w-xl mx-auto border border-gray-200 p-6 rounded-lg">
              <h2 style="color: #166534;">Bonjour ${userPrenom},</h2>
              <p>Votre inscription à l'événement <strong>${event.titre}</strong> a bien été confirmée !</p>
              
              <div style="background-color: #f0fdf4; padding: 16px; border-left: 4px solid #166534; margin: 24px 0;">
                <p style="margin: 0 0 8px 0;"><strong>Date :</strong> ${dateStr}</p>
                <p style="margin: 0;"><strong>Lieu / Format :</strong> ${event.en_ligne ? 'En ligne' : (event.lieu || 'À confirmer')}</p>
              </div>
              
              <p>Un email de rappel vous sera envoyé à l'approche de l'événement.</p>
              <br>
              <p>À très bientôt,<br>L'équipe Agrolide</p>
            </div>
          `
        })
      } catch (emailErr) {
        console.error("Erreur envoi email:", emailErr)
      }
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error("Erreur inscription:", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
