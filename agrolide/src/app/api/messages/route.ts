import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/server'
import { db } from '@/db'
import { messages, user_blocks } from '@/db/schema'
import { eq, or, and } from 'drizzle-orm'
import { nettoyerTextes } from "@/lib/utils/sans-emoji"

export async function POST(request: NextRequest) {
  try {
    const { destinataire_id, contenu } = nettoyerTextes(await request.json())
    
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

    // Blocage (dans un sens ou dans l'autre) : même réponse que l'absence de relation, on ne révèle pas le blocage.
    const [blocage] = await db
      .select({ id: user_blocks.id })
      .from(user_blocks)
      .where(
        or(
          and(eq(user_blocks.blocker_id, userId), eq(user_blocks.blocked_id, destinataire_id)),
          and(eq(user_blocks.blocker_id, destinataire_id), eq(user_blocks.blocked_id, userId)),
        ),
      )
      .limit(1)
    if (blocage) {
      return NextResponse.json({ error: "Vous devez être connecté(e) avec ce membre pour lui envoyer un message." }, { status: 403 })
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

    // ouvert_contact ne bloque que les NOUVELLES invitations : entre relations déjà acceptées,
    // seule la connexion « accepted » (vérifiée ci-dessus) est exigée.

    // Insérer le message
    const [msg] = await db.insert(messages).values({
      expediteur_id: userId,
      destinataire_id,
      contenu
    }).returning()

    // Pas de ligne `notifications` pour un message : la pastille « Messages » de la barre de navigation
    // (messages non lus) joue ce rôle, et la cloche ne doit pas compter deux fois la même chose.

    // Diffuser via le WebSocket Server (Durable Object), seulement s'il est configuré.
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL
    if (wsUrl) {
      fetch(`${wsUrl.replace(/^ws/, 'http')}/broadcast/msg_${destinataire_id}`, {
        method: 'POST',
        body: JSON.stringify({ type: 'NEW_MESSAGE', message: msg }),
        signal: AbortSignal.timeout(5000),
      }).catch(console.error)
    }

    return NextResponse.json({ success: true, message: msg })

  } catch (error: any) {
    console.error("API Send Message Error:", error)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
