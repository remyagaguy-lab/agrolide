import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { checkDocumentAccess } from '@/lib/documents/access'
import { auth } from '@/lib/auth/server'
import { admitAnonymous, applyQuotaCookie, FREE_READS } from '@/lib/bibliotheque/quota'

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
    
    const access = await checkDocumentAccess(id)
    if (!access.ok) {
      return NextResponse.json({ error: access.error }, { status: access.status })
    }
    const { document } = access
    const isDownload = request.nextUrl.searchParams.get('download') === 'true'

    // Visiteur non connecté : téléchargement réservé aux membres, lecture limitée à FREE_READS documents
    const { userId } = await auth()
    let quotaCookie: string | undefined
    let used: number | undefined
    if (!userId) {
      if (isDownload) {
        return NextResponse.json({ error: 'login_required' }, { status: 401 })
      }
      const admission = await admitAnonymous(request, id)
      if (!admission.ok) {
        return NextResponse.json({ error: 'quota', limit: FREE_READS, used: admission.used }, { status: 402 })
      }
      quotaCookie = admission.setCookie
      used = admission.used
    }

    const { db } = await import('@/db')
    const { documents } = await import('@/db/schema')
    const { eq } = await import('drizzle-orm')

    // Compteur de consultations (uniquement pour un accès autorisé, une fois par admission)
    if (userId || quotaCookie) await db.update(documents)
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
    
    const contentDisposition = isDownload
      ? `attachment; filename="Document-${id}.pdf"`
      : 'inline'

    // Retourner le flux directement (Proxy bytes) pour éviter les erreurs CORS de react-pdf
    const res = new NextResponse(Buffer.from(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        // Jamais de cache partagé : le quota se décide à chaque requête
        'Cache-Control': 'private, no-store',
        'Content-Disposition': contentDisposition,
        ...(used !== undefined ? { 'X-Quota-Used': String(used), 'X-Quota-Limit': String(FREE_READS) } : {}),
      }
    })
    if (quotaCookie) applyQuotaCookie(res, quotaCookie)
    return res
  } catch (error: any) {
    console.error('Erreur Proxy S3 PDF:', error)
    return NextResponse.json({ error: 'Erreur serveur ou fichier introuvable' }, { status: 500 })
  }
}
