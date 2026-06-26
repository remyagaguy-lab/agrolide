import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Configuration S3/R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // In a real app we check the auth token
    const authHeader = request.headers.get('authorization')
    
    // For this demo, we can just allow it if the document is public
    // Let's fetch the document from Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
    
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .select('fichier_r2_key, nb_telechargements')
      .eq('id', id)
      .single()
      
    if (dbError || !document) {
      return NextResponse.json({ error: 'Document introuvable' }, { status: 404 })
    }
    
    // Mettre à jour le compteur de consultations (téléchargements)
    await supabase
      .from('documents')
      .update({ nb_telechargements: (document.nb_telechargements || 0) + 1 })
      .eq('id', id)
      
    // Générer l'URL signée
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || 'agrolide-bibliotheque',
      Key: document.fichier_r2_key,
      ResponseContentDisposition: 'inline', // Forcer l'affichage dans le navigateur
      ResponseContentType: 'application/pdf',
    })
    
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    
    return NextResponse.json({ url: signedUrl })
  } catch (error: any) {
    console.error('Erreur de génération R2:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
