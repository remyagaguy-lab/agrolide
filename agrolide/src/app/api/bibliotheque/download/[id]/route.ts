import { NextRequest, NextResponse } from 'next/server'
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
    // Let's fetch the document from Drizzle
    const { db } = await import('@/db')
    const { documents } = await import('@/db/schema')
    const { eq } = await import('drizzle-orm')
    
    const document = await db.query.documents.findFirst({
      columns: { fichier_r2_key: true, nb_telechargements: true },
      where: eq(documents.id, id)
    })
      
    if (!document) {
      return NextResponse.json({ error: 'Document introuvable' }, { status: 404 })
    }
    
    // Mettre à jour le compteur de consultations (téléchargements)
    await db.update(documents)
      .set({ nb_telechargements: (document.nb_telechargements || 0) + 1 })
      .where(eq(documents.id, id))
      
    // Utiliser le client S3 pour récupérer directement le flux depuis le bucket privé
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || 'agrolide-biblio',
      Key: document.fichier_r2_key,
    })
    
    const s3Response = await s3Client.send(command)
    
    // Extraire les octets (Buffer) pour que Next.js puisse le renvoyer
    const bytes = await s3Response.Body?.transformToByteArray()
    if (!bytes) {
      throw new Error("Impossible de lire le fichier depuis le stockage")
    }
    
    const isDownload = request.nextUrl.searchParams.get('download') === 'true'
    const contentDisposition = isDownload 
      ? `attachment; filename="Document-${id}.pdf"` 
      : 'inline'

    // Retourner le flux directement (Proxy bytes) pour éviter les erreurs CORS de react-pdf
    return new NextResponse(Buffer.from(bytes), {
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
