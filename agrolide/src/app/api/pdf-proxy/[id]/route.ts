import { NextRequest, NextResponse } from 'next/server'
import { checkDocumentAccess } from '@/lib/documents/access'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const access = await checkDocumentAccess(id)
    if (!access.ok) {
      return new NextResponse(access.error, { status: access.status })
    }
    const { document, isPublic } = access

    // Récupérer le fichier depuis l'URL publique de R2
    const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
    if (!r2PublicUrl) {
       return new NextResponse('Configuration R2 manquante', { status: 500 })
    }

    const pdfUrl = `${r2PublicUrl}/${document.fichier_r2_key}`
    const pdfResponse = await fetch(pdfUrl)

    if (!pdfResponse.ok) {
      return new NextResponse('Erreur lors du téléchargement du PDF depuis R2', { status: 502 })
    }

    // Retourner le flux directement (Proxy bytes) pour éviter les erreurs CORS de react-pdf
    return new NextResponse(pdfResponse.body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': isPublic ? 'public, max-age=3600, stale-while-revalidate=86400' : 'private, no-store',
        'Content-Disposition': 'inline'
      }
    })
  } catch (error: any) {
    console.error('Erreur PDF Proxy:', error)
    return new NextResponse('Erreur serveur', { status: 500 })
  }
}
