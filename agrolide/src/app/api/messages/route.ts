import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { messages, users, notifications, user_connections } from '@/db/schema'
import { eq, or, and } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const { destinataire_id, contenu } = await request.json()
    
    if (!destinataire_id || !contenu) {
      return NextResponse.json({ error: "Champs manquants." }, { status: 400 })
    }
    if (contenu.length > 2000) {
      return NextResponse.json({ error: "Le message ne doit pas dépasser 2000 caractères." }, { status: 400 })
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 })
    }

    // Vérifier si une connexion "accepted" existe entre les deux membres
    const connection = await db.query.user_connections.findFirst({
      where: (connections, { or, and, eq }) => 
        or(
          and(eq(connections.requester_id, userId), eq(connections.receiver_id, destinataire_id)),
          and(eq(connections.receiver_id, userId), eq(connections.requester_id, destinataire_id))
        )
    })

    if (!connection || connection.status !== 'accepted') {
      return NextResponse.json({ error: "Vous devez être connecté(e) avec ce membre pour lui envoyer un message." }, { status: 403 })
    }

    // On retire l'ancienne restriction basée sur la catégorie, car les connexions gèrent la confiance.
    // Le contrôle "ouvert_contact" reste pertinent globalement ou pourrait être fusionné avec la logique des connexions.
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

    // Récupérer le nom de l'expéditeur pour la notification
    const expediteur = await db.query.users.findFirst({
      columns: { prenom: true, nom: true },
      where: eq(users.id, userId)
    })

    // Créer une notification
    const [notif] = await db.insert(notifications).values({
      user_id: destinataire_id,
      contenu: `Nouveau message de ${expediteur?.prenom} ${expediteur?.nom}: ` + contenu.substring(0, 100) + (contenu.length > 100 ? '...' : ''),
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
