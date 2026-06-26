import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy')

const partenariatSchema = z.object({
  raison_sociale: z.string().min(1, "Raison sociale requise"),
  secteur: z.string().min(1, "Secteur requis"),
  nature_collaboration: z.string().min(1, "Nature de la collaboration requise"),
  budget: z.string().optional(),
  email: z.string().email("Email invalide"),
  message: z.string().min(10, "Message trop court"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = partenariatSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: "Données invalides", details: result.error.flatten() }, { status: 400 })
    }

    const data = result.data

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Insertion en base
    const { data: contact, error: dbError } = await supabase
      .from('contacts_partenariat')
      .insert({
        raison_sociale: data.raison_sociale,
        secteur: data.secteur,
        nature_collaboration: data.nature_collaboration,
        budget: data.budget,
        email: data.email,
        message: data.message
      })
      .select()
      .single()

    if (dbError) throw dbError

    // Accusé de réception
    await resend.emails.send({
      from: 'agrolide Partenariats <partenaires@agrolide.org>',
      to: data.email,
      subject: 'Accusé de réception - Demande de partenariat agrolide',
      html: `<p>Bonjour,</p><p>Nous avons bien reçu votre demande de partenariat pour ${data.raison_sociale}.</p><p>Notre équipe en charge des relations institutionnelles prendra contact avec vous dans les plus brefs délais.</p><p>L'équipe agrolide</p>`
    })

    // Alerte interne
    await resend.emails.send({
      from: 'agrolide System <system@agrolide.org>',
      to: 'partenaires@agrolide.org',
      subject: `Nouveau Contact Partenariat : ${data.raison_sociale}`,
      html: `
        <p>Nouvelle demande de partenariat reçue :</p>
        <ul>
          <li><strong>Organisation :</strong> ${data.raison_sociale}</li>
          <li><strong>Secteur :</strong> ${data.secteur}</li>
          <li><strong>Nature :</strong> ${data.nature_collaboration}</li>
          <li><strong>Email :</strong> ${data.email}</li>
          <li><strong>Budget :</strong> ${data.budget || 'Non spécifié'}</li>
        </ul>
        <p><strong>Message :</strong><br/>${data.message}</p>
      `
    })

    return NextResponse.json({ success: true, contact })

  } catch (error: any) {
    console.error("API Partenariat Error:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
