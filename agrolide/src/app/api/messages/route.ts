import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { destinataire_id, contenu } = await request.json()
    
    if (!destinataire_id || !contenu) {
      return NextResponse.json({ error: "Champs manquants." }, { status: 400 })
    }
    if (contenu.length > 2000) {
      return NextResponse.json({ error: "Le message ne doit pas dépasser 2000 caractères." }, { status: 400 })
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

    // Vérifier le rôle de l'expéditeur (RG-033)
    const { data: expediteur } = await supabase.from('profiles').select('prenom, nom, categorie').eq('id', user.id).single()
    const allowedCategories = ['professionnel', 'partenaire', 'senior']
    if (!expediteur || !allowedCategories.includes(expediteur.categorie?.toLowerCase())) {
      return NextResponse.json({ error: "Seuls les membres Professionnels, Partenaires et Séniors peuvent initier des messages." }, { status: 403 })
    }

    // Vérifier si le destinataire accepte les messages
    const { data: destinataire } = await supabase.from('profiles').select('ouvert_contact').eq('id', destinataire_id).single()
    if (!destinataire?.ouvert_contact) {
      return NextResponse.json({ error: "Ce membre n'accepte pas les messages." }, { status: 403 })
    }

    // Insérer le message
    const { data: msg, error: msgError } = await supabase
      .from('messages')
      .insert({
        expediteur_id: user.id,
        destinataire_id,
        contenu
      })
      .select()
      .single()

    if (msgError) throw msgError

    // Créer une notification
    await supabase.from('notifications').insert({
      user_id: destinataire_id,
      titre: `Nouveau message de ${expediteur.prenom} ${expediteur.nom}`,
      contenu: contenu.substring(0, 100) + (contenu.length > 100 ? '...' : ''),
      lien: `/membres/messages?conv=${user.id}`
    })

    return NextResponse.json({ success: true, message: msg })

  } catch (error: any) {
    console.error("API Send Message Error:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
