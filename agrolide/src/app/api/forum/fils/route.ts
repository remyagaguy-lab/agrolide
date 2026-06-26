import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { categorie_id, titre, contenu } = await request.json()
    
    if (!categorie_id || !titre || !contenu) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 })
    }

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

    // 1. Créer le fil
    const { data: fil, error: filError } = await supabase
      .from('forum_fils')
      .insert({
        categorie_id,
        titre,
        auteur_id: user.id,
        statut: 'ouvert',
        nb_reponses: 0
      })
      .select('id')
      .single()
      
    if (filError || !fil) {
      throw new Error("Erreur création fil")
    }
    
    // 2. Créer le premier message
    const { error: msgError } = await supabase
      .from('forum_messages')
      .insert({
        fil_id: fil.id,
        auteur_id: user.id,
        contenu
      })
      
    if (msgError) {
      // Nettoyage si erreur
      await supabase.from('forum_fils').delete().eq('id', fil.id)
      throw new Error("Erreur création message")
    }

    return NextResponse.json({ success: true, fil_id: fil.id })
    
  } catch (error: any) {
    console.error("Erreur API forum fils:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
