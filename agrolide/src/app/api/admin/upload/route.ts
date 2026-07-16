import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

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
    // Vérification de l'admin
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { filename, contentType, folder } = await request.json()

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    const ext = filename.split('.').pop()
    const objectKey = `${folder || 'uploads'}/${crypto.randomUUID()}.${ext}`

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_R2_PUBLIC_BUCKET || process.env.R2_BUCKET_NAME,
      Key: objectKey,
      ContentType: contentType,
    })

    const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 })
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${objectKey}`

    return NextResponse.json({ presignedUrl, objectKey, publicUrl })
  } catch (error) {
    console.error('Upload Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
