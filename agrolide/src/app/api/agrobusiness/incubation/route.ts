import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { z } from 'zod'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy')

// Initialiser Redis et Ratelimit
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://fake-url.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'fake-token',
})
// Limite : 3 requêtes par 24h
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "24 h"),
})

const incubationSchema = z.object({
  prenom: z.string().min(1, "Prénom requis"),
  nom: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(1, "Téléphone requis"),
  pays: z.string().min(1, "Pays requis"),
  titre_projet: z.string().min(1, "Titre du projet requis"),
  description_projet: z.string().min(20, "Description trop courte"),
  secteur: z.string().min(1, "Secteur requis"),
  stade_avancement: z.string().min(1, "Stade d'avancement requis"),
  besoins: z.string().optional(),
  cv_nom: z.string().optional(),
  cv_type: z.string().optional(),
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
    // Rate Limiting (basé sur l'IP)
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1"
    
    // Si on a les vraies variables Upstash, on utilise le ratelimit
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const { success } = await ratelimit.limit(ip)
      if (!success) {
        return NextResponse.json({ error: "Trop de candidatures soumises. Veuillez réessayer plus tard." }, { status: 429 })
      }
    }

    const body = await request.json()
    const result = incubationSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: "Données invalides", details: result.error.flatten() }, { status: 400 })
    }

    const data = result.data

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    let presignedUrl = null
    let objectKey = null

    // Si CV annoncé, on prépare le lien d'upload R2
    if (data.cv_nom && data.cv_type) {
      const ext = data.cv_nom.split('.').pop()
      objectKey = `incubation/cv/${crypto.randomUUID()}.${ext}`
      
      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: objectKey,
        ContentType: data.cv_type,
      })
      
      presignedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 })
    }

    const cv_url = objectKey ? `https://${process.env.R2_BUCKET_NAME}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${objectKey}` : null

    // 1. Insertion BD
    const { data: candidature, error: dbError } = await supabase
      .from('candidatures_incubation')
      .insert({
        prenom: data.prenom,
        nom: data.nom,
        email: data.email,
        telephone: data.telephone,
        pays: data.pays,
        titre_projet: data.titre_projet,
        description_projet: data.description_projet,
        secteur: data.secteur,
        stade_avancement: data.stade_avancement,
        besoins: data.besoins,
        cv_url
      })
      .select()
      .single()

    if (dbError) throw dbError

    // 2. Envoi Emails (Resend)
    // Accusé de réception
    await resend.emails.send({
      from: 'agrolide <contact@agrolide.org>',
      to: data.email,
      subject: 'Accusé de réception - Candidature Incubation',
      html: `<p>Bonjour ${data.prenom},</p><p>Votre candidature pour le programme d'incubation agrolide avec le projet "${data.titre_projet}" a bien été enregistrée.</p><p>L'équipe agrolide</p>`
    })

    // Alerte équipe
    await resend.emails.send({
      from: 'agrolide System <system@agrolide.org>',
      to: 'equipe@agrolide.org',
      subject: `Nouvelle Candidature Incubation : ${data.titre_projet}`,
      html: `<p>Une nouvelle candidature a été soumise.</p>
             <ul>
               <li><strong>Candidat :</strong> ${data.prenom} ${data.nom} (${data.email})</li>
               <li><strong>Projet :</strong> ${data.titre_projet}</li>
               <li><strong>Secteur :</strong> ${data.secteur}</li>
             </ul>
             <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/agrobusiness">Voir la candidature dans l'admin</a></p>`
    })

    return NextResponse.json({ 
      success: true, 
      candidature, 
      presignedUrl
    })

  } catch (error: any) {
    console.error("API Incubation Error:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
