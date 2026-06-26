import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { z } from 'zod'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy')

const demandeSchema = z.object({
  prenom: z.string().min(1, "Prénom requis"),
  nom: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  telephone: z.string().optional(),
  organisation: z.string().optional(),
  pays: z.string().min(1, "Pays requis"),
  type_service: z.string().min(1, "Type de service requis"),
  description: z.string().min(10, "La description doit faire au moins 10 caractères"),
  fichier_nom: z.string().optional(),
  fichier_type: z.string().optional(),
})

// Configuration S3 (R2)
const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = demandeSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: "Données invalides", details: result.error.flatten() }, { status: 400 })
    }

    const { prenom, nom, email, telephone, organisation, pays, type_service, description, fichier_nom, fichier_type } = result.data

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    let presignedUrl = null
    let objectKey = null

    // Si un fichier est annoncé, on prépare le lien d'upload R2
    if (fichier_nom && fichier_type) {
      const ext = fichier_nom.split('.').pop()
      objectKey = `demandes/${crypto.randomUUID()}.${ext}`
      
      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME, // ou un bucket spécifique si agrolide-demandes existe
        Key: objectKey,
        ContentType: fichier_type,
      })
      
      presignedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 })
    }

    const fichier_url = objectKey ? `https://${process.env.R2_BUCKET_NAME}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${objectKey}` : null

    // 1. Insertion BD
    const { data: demande, error: dbError } = await supabase
      .from('demandes_service')
      .insert({
        prenom, nom, email, telephone, organisation, pays, type_service, description, fichier_url
      })
      .select()
      .single()

    if (dbError) throw dbError

    // 2. Envoi Emails (Resend)
    // Accusé de réception
    await resend.emails.send({
      from: 'agrolide <contact@agrolide.org>',
      to: email,
      subject: 'Accusé de réception - Votre demande de service agrolide',
      html: `<p>Bonjour ${prenom},</p><p>Nous avons bien reçu votre demande concernant "${type_service}". Notre équipe l'étudie et vous recontactera sous peu.</p><p>L'équipe agrolide</p>`
    })

    // Alerte équipe
    await resend.emails.send({
      from: 'agrolide System <system@agrolide.org>',
      to: 'equipe@agrolide.org', // Email de l'équipe
      subject: `Nouvelle demande de service : ${type_service} par ${prenom} ${nom}`,
      html: `<p>Une nouvelle demande de service a été soumise.</p>
             <ul>
               <li><strong>Demandeur :</strong> ${prenom} ${nom} (${email})</li>
               <li><strong>Pays :</strong> ${pays}</li>
               <li><strong>Service :</strong> ${type_service}</li>
               <li><strong>Description :</strong> ${description}</li>
             </ul>
             <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/agrobusiness">Voir la demande dans l'admin</a></p>`
    })

    return NextResponse.json({ 
      success: true, 
      demande, 
      presignedUrl // Le client devra uploader le fichier à cette URL avec un PUT s'il y a un fichier
    })

  } catch (error: any) {
    console.error("API Demande Service Error:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
