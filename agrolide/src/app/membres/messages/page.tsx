import React from 'react'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { and, eq, or } from 'drizzle-orm'
import { auth } from '@/lib/auth/server'
import { db } from '@/db'
import { user_connections, users } from '@/db/schema'
import MessagesClient, { type ContactMessagerie, type MessagesClientProps } from '@/components/modules/messages/MessagesClient'

export const metadata: Metadata = {
  title: 'Messagerie',
  description: 'Vos conversations privées avec les membres du réseau.',
  robots: { index: false, follow: false },
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>
const premier = (v: string | string[] | undefined) => ((Array.isArray(v) ? v[0] : v) ?? '').trim()

/**
 * Charge côté serveur le contact demandé (`?user=`, ou `?conv=` / `?nouveau=` des anciens liens) :
 * nom, photo et spécialité, et vérifie que la relation est acceptée. Aucun e-mail ni téléphone n'est lu.
 */
async function chargerContact(viewerId: string, id: string): Promise<Pick<MessagesClientProps, 'contact' | 'refus'>> {
  if (!id || id === viewerId || id.length > 64) return { contact: null, refus: null }

  const [membre] = await db
    .select({ id: users.id, prenom: users.prenom, nom: users.nom, photo_url: users.photo_url, specialite: users.specialite })
    .from(users)
    .where(eq(users.id, id))
    .limit(1)
  if (!membre) return { contact: null, refus: { raison: 'introuvable', id } }

  const [lien] = await db
    .select({ id: user_connections.id })
    .from(user_connections)
    .where(
      and(
        eq(user_connections.status, 'accepted'),
        or(
          and(eq(user_connections.requester_id, viewerId), eq(user_connections.receiver_id, id)),
          and(eq(user_connections.requester_id, id), eq(user_connections.receiver_id, viewerId)),
        ),
      ),
    )
    .limit(1)
  if (!lien) return { contact: null, refus: { raison: 'pas-de-relation', id } }

  const contact: ContactMessagerie = membre
  return { contact, refus: null }
}

export default async function MessagesPage({ searchParams }: { searchParams: SearchParams }) {
  const { userId } = await auth()
  if (!userId) redirect(`/login?next=${encodeURIComponent('/membres/messages')}`)

  const brut = await searchParams
  const demande = premier(brut.user) || premier(brut.conv) || premier(brut.nouveau)
  const { contact, refus } = await chargerContact(userId, demande)

  return (
    <div className="mx-auto max-w-[1600px] space-y-4">
      <h1 className="sr-only">Messagerie</h1>
      {/* `key` : un nouveau contact demandé réinitialise la conversation ouverte. */}
      <MessagesClient key={demande} contact={contact} refus={refus} />
    </div>
  )
}
