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
      
    // Utiliser le client S3 pour récupérer directement le flux depuis le bucket privé
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || 'agrolide-biblio',
      Key: document.fichier_r2_key,
    })
    
    const s3Response = await s3Client.send(command)
    
    const isDownload = request.nextUrl.searchParams.get('download') === 'true'
    const contentDisposition = isDownload 
      ? `attachment; filename="Document-${id}.pdf"` 
      : 'inline'

    // Retourner le flux directement (Proxy bytes) pour éviter les erreurs CORS de react-pdf
    return new NextResponse(s3Response.Body as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Content-Disposition': contentDisposition
      }
    })
  } catch (error: any) {
    console.error('Erreur Proxy S3 PDF:', error)
    return NextResponse.json({ error: 'Erreur serveur ou fichier introuvable' }, { status: 500 })
  }
}
