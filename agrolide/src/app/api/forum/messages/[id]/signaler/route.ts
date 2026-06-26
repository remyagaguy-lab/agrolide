import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Mettre à jour le statut du message (pourrait être dans une table de signalements à part dans une appli complexe, mais ici on simplifie)
    const { error } = await supabase
      .from('forum_messages')
      .update({ statut: 'en_revue' })
      .eq('id', id)
      
    if (error) throw error

    return NextResponse.json({ success: true })
    
  } catch (error: any) {
    console.error("Erreur API signalement:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
