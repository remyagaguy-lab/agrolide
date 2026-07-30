import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/db'
import { messages, users, notifications } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const { destinataire_id, contenu } = await request.json()
    
    if (!destinataire_id || !contenu) {
      return NextResponse.json({ error: "Champs manquants." }, { status: 400 })
    }
    if (contenu.length > 2000) {
      return NextResponse.json({ error: "Le message ne doit pas dépasser 2000 caractères." }, { status: 400 })
    }

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }
    const userId = session.user.id

    // Vérifier le rôle de l'expéditeur (RG-033)
    const expediteur = await db.query.users.findFirst({
      columns: { prenom: true, nom: true, categorie: true, id: true },
      where: eq(users.id, userId)
    })
    
    const allowedCategories = ['professionnel', 'partenaire', 'senior']
    if (!expediteur || !expediteur.categorie || !allowedCategories.includes(expediteur.categorie.toLowerCase())) {
      return NextResponse.json({ error: "Seuls les membres Professionnels, Partenaires et Séniors peuvent initier des messages." }, { status: 403 })
    }

    // Vérifier si le destinataire accepte les messages
    const destinataire = await db.query.users.findFirst({
      columns: { ouvert_contact: true },
      where: eq(users.id, destinataire_id)
    })
    
    if (!destinataire?.ouvert_contact) {
      return NextResponse.json({ error: "Ce membre n'accepte pas les messages." }, { status: 403 })
    }

    // Insérer le message
    const [msg] = await db.insert(messages).values({
      expediteur_id: userId,
      destinataire_id,
      contenu
    }).returning()

    // Créer une notification
    const [notif] = await db.insert(notifications).values({
      user_id: destinataire_id,
      contenu: `Nouveau message de ${expediteur.prenom} ${expediteur.nom}: ` + contenu.substring(0, 100) + (contenu.length > 100 ? '...' : ''),
      type: 'message',
      lien: `/membres/messages/${userId}`
    }).returning()

    // Diffuser via le WebSocket Server (Durable Object)
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8787';
    
    // Pour le message
    fetch(`${wsUrl}/broadcast/msg_${destinataire_id}`, {
      method: 'POST',
      body: JSON.stringify({ type: 'NEW_MESSAGE', message: msg })
    }).catch(console.error);

    // Pour la notification
    fetch(`${wsUrl}/broadcast/notif_${destinataire_id}`, {
      method: 'POST',
      body: JSON.stringify({ type: 'NEW_NOTIFICATION', notification: notif })
    }).catch(console.error);

    return NextResponse.json({ success: true, message: msg })

  } catch (error: any) {
    console.error("API Send Message Error:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
