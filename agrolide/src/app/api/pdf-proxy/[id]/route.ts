import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { documents } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const document = await db.query.documents.findFirst({
      columns: { fichier_r2_key: true },
      where: eq(documents.id, id)
    })
      
    if (!document) {
      return new NextResponse('Document introuvable', { status: 404 })
    }
    
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
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Content-Disposition': 'inline'
      }
    })
  } catch (error: any) {
    console.error('Erreur PDF Proxy:', error)
    return new NextResponse('Erreur serveur', { status: 500 })
  }
}
