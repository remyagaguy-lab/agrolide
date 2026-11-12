import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/server'
import { db } from '@/db'
import { messages, users } from '@/db/schema'
import { desc, eq, inArray, or } from 'drizzle-orm'

/** Fenêtre de lecture : borne la mémoire ; au-delà, les plus anciens messages ne comptent plus dans « non lus ». */
const MAX_MESSAGES = 500
/** Un `IN (…)` sur D1 est limité en paramètres : 50 correspondants au plus. */
const MAX_CORRESPONDANTS = 50

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

    const rows = await db
      .select()
      .from(messages)
      .where(or(eq(messages.expediteur_id, userId), eq(messages.destinataire_id, userId)))
      .orderBy(desc(messages.created_at))
      .limit(MAX_MESSAGES)

    // Du plus récent au plus ancien : le premier message rencontré d'un correspondant est le dernier échangé.
    const parCorrespondant = new Map<string, { dernier_message: (typeof rows)[number]; non_lus: number }>()
    for (const m of rows) {
      const autre = m.expediteur_id === userId ? m.destinataire_id : m.expediteur_id
      const conv = parCorrespondant.get(autre) ?? { dernier_message: m, non_lus: 0 }
      if (m.destinataire_id === userId && !m.lu) conv.non_lus += 1
      parCorrespondant.set(autre, conv)
    }

    const ids = [...parCorrespondant.keys()].slice(0, MAX_CORRESPONDANTS)
    const profils = ids.length
      ? await db
          .select({ id: users.id, prenom: users.prenom, nom: users.nom, photo_url: users.photo_url })
          .from(users)
          .where(inArray(users.id, ids))
      : []
    const parId = new Map(profils.map((p) => [p.id, p]))

    // Un correspondant dont le compte n'existe plus est ignoré (le client lit prenom/nom/photo_url).
    const conversations = ids
      .filter((id) => parId.has(id))
      .map((id) => ({ correspondant: parId.get(id)!, ...parCorrespondant.get(id)! }))

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('API Conversations Error:', error)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
