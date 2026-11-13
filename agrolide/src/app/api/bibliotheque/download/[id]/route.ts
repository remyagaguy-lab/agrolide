import { NextRequest, NextResponse, after } from 'next/server'
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

    // Le compteur de consultations est mis à jour après l'envoi de la réponse : il ne retarde pas la lecture.
    if (userId || quotaCookie) {
      const compteur = (document.nb_telechargements || 0) + 1
      after(async () => {
        const { db } = await import('@/db')
        const { documents } = await import('@/db/schema')
        const { eq } = await import('drizzle-orm')
        await db.update(documents).set({ nb_telechargements: compteur }).where(eq(documents.id, id))
      })
    }

    // Le flux part directement du bucket privé vers le navigateur (pas de copie complète en mémoire d'abord).
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || 'agrolide-biblio',
      Key: document.fichier_r2_key,
    })
    const s3Response = await s3Client.send(command)
    const corps = s3Response.Body?.transformToWebStream()
    if (!corps) {
      throw new Error("Impossible de lire le fichier depuis le stockage")
    }

    const contentDisposition = isDownload
      ? `attachment; filename="Document-${id}.pdf"`
      : 'inline'

    // Retourner le flux directement (Proxy bytes) pour éviter les erreurs CORS de react-pdf
    const res = new NextResponse(corps, {
      headers: {
        'Content-Type': 'application/pdf',
        ...(s3Response.ContentLength ? { 'Content-Length': String(s3Response.ContentLength) } : {}),
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
