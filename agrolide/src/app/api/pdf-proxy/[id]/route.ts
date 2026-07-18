import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Initialiser Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
    
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .select('fichier_r2_key')
      .eq('id', id)
      .single()
      
    if (dbError || !document) {
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
