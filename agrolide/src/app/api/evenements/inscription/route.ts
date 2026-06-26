import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
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

    const authHeader = request.headers.get('authorization')
    let membre_id = null
    let emailDestinataire = email_externe
    let userPrenom = prenom
    
    // Initialiser Supabase Admin pour l'insertion
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    )

    // Vérifier l'authentification si un token est fourni
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
      
      if (!authError && user) {
        membre_id = user.id
        emailDestinataire = user.email
        
        // Récupérer le prénom/nom du profil
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('prenom, nom')
          .eq('id', user.id)
          .single()
          
        if (profile) {
          userPrenom = profile.prenom || ''
        }
      }
    } else {
      // Pour les visiteurs, vérifier les champs requis
      if (!prenom || !nom || !email_externe) {
        return NextResponse.json({ error: "Tous les champs sont requis pour les visiteurs." }, { status: 400 })
      }
    }

    // Récupérer les détails de l'événement pour l'email
    const { data: event, error: eventError } = await supabaseAdmin
      .from('evenements')
      .select('titre, date_debut, lieu, en_ligne')
      .eq('id', evenement_id)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: "Événement introuvable." }, { status: 404 })
    }

    // Insérer l'inscription
    const { error: insertError } = await supabaseAdmin
      .from('inscriptions_evenement')
      .insert({
        evenement_id,
        membre_id,
        email_externe: membre_id ? null : email_externe,
        prenom: membre_id ? null : prenom,
        nom: membre_id ? null : nom
      })

    if (insertError) {
      // Si c'est une violation de contrainte unique (déjà inscrit)
      if (insertError.code === '23505') {
        return NextResponse.json({ error: "Vous êtes déjà inscrit(e) à cet événement." }, { status: 400 })
      }
      console.error("Erreur d'insertion:", insertError)
      return NextResponse.json({ error: "Erreur lors de l'inscription." }, { status: 500 })
    }

    // Envoyer l'email de confirmation via Resend
    if (resend && emailDestinataire) {
      try {
        const dateStr = new Date(event.date_debut).toLocaleDateString('fr-FR', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })
        
        await resend.emails.send({
          from: 'Agrolide <contact@agrolide.org>', // Remplacer par un domaine vérifié
          to: [emailDestinataire],
          subject: `Confirmation d'inscription : ${event.titre}`,
          html: `
            <div style="font-family: sans-serif; color: #333; max-w-xl mx-auto border border-gray-200 p-6 rounded-lg">
              <h2 style="color: #166534;">Bonjour ${userPrenom},</h2>
              <p>Votre inscription à l'événement <strong>${event.titre}</strong> a bien été confirmée !</p>
              
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>📅 Date :</strong> ${dateStr}</p>
                ${event.en_ligne ? '<p style="margin: 0;"><strong>💻 Format :</strong> En ligne</p>' : ''}
                ${event.lieu && !event.en_ligne ? `<p style="margin: 0;"><strong>📍 Lieu :</strong> ${event.lieu}</p>` : ''}
              </div>
              
              <p>Nous vous enverrons un rappel et les informations de connexion (si événement en ligne) à l'approche de la date.</p>
              
              <p>À très bientôt !<br>L'équipe Agrolide</p>
            </div>
          `
        })
      } catch (emailErr) {
        console.error("Erreur lors de l'envoi de l'email :", emailErr)
        // On ne fait pas échouer l'inscription si l'email rate
      }
    } else {
      console.warn("L'email de confirmation n'a pas été envoyé (Resend non configuré ou email introuvable).")
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("Erreur API inscription:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
