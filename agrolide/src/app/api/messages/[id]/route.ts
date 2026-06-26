import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: correspondantId } = await params
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }
    const token = authHeader.split(' ')[1]

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: "Session invalide." }, { status: 401 })
    }

    // Récupérer l'historique
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(expediteur_id.eq.${user.id},destinataire_id.eq.${correspondantId}),and(expediteur_id.eq.${correspondantId},destinataire_id.eq.${user.id})`)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Marquer les messages reçus comme lus
    const nonLus = messages?.filter(m => m.destinataire_id === user.id && !m.lu).map(m => m.id) || []
    if (nonLus.length > 0) {
      await supabase.from('messages').update({ lu: true }).in('id', nonLus)
    }

    return NextResponse.json(messages || [])

  } catch (error: any) {
    console.error("API Messages Error:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
