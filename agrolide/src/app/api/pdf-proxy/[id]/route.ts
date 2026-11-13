import { NextRequest, NextResponse } from 'next/server'
import { checkDocumentAccess } from '@/lib/documents/access'
import { auth } from '@/lib/auth/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Réservé aux membres : la lecture des visiteurs passe par /api/bibliotheque/download (quota)
    const { userId } = await auth()
    if (!userId) return new NextResponse('Connexion requise', { status: 401 })

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
    // Délai maximum de 15 s pour que R2 commence à répondre. Il est levé dès l'arrivée de la réponse :
    // le téléchargement d'un gros PDF sur une connexion lente n'est jamais coupé.
    const controleur = new AbortController()
    const minuteur = setTimeout(() => controleur.abort(), 15_000)
    let pdfResponse: Response
    try {
      pdfResponse = await fetch(pdfUrl, { signal: controleur.signal })
    } catch (e) {
      if (controleur.signal.aborted) return new NextResponse('Le stockage des fichiers ne répond pas. Réessayez dans un instant.', { status: 504 })
      throw e
    } finally {
      clearTimeout(minuteur)
    }

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
