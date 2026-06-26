import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
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

    // On récupère tous les messages envoyés ou reçus par l'utilisateur
    // En production avec beaucoup de messages, on ferait une vue SQL ou RPC. Ici on fait le traitement côté worker.
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        expediteur:profiles!messages_expediteur_id_fkey(id, prenom, nom, avatar_url),
        destinataire:profiles!messages_destinataire_id_fkey(id, prenom, nom, avatar_url)
      `)
      .or(`expediteur_id.eq.${user.id},destinataire_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Grouper par correspondant
    const conversationsMap = new Map()

    messages?.forEach((msg: any) => {
      const isExpediteur = msg.expediteur_id === user.id
      const correspondantId = isExpediteur ? msg.destinataire_id : msg.expediteur_id
      const correspondant = isExpediteur ? msg.destinataire : msg.expediteur

      if (!conversationsMap.has(correspondantId)) {
        conversationsMap.set(correspondantId, {
          correspondant,
          dernier_message: msg,
          non_lus: isExpediteur ? 0 : (msg.lu ? 0 : 1) // simpliste: compte juste le dernier s'il est non lu
        })
      } else {
        const conv = conversationsMap.get(correspondantId)
        if (!isExpediteur && !msg.lu) {
          conv.non_lus += 1
        }
      }
    })

    const conversations = Array.from(conversationsMap.values())

    return NextResponse.json(conversations)

  } catch (error: any) {
    console.error("API Conversations Error:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
