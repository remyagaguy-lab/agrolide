import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

// Ce webhook est appelé par Clerk chaque fois qu'un utilisateur crée un compte
// ou met à jour son profil. Il synchronise les données Clerk avec Cloudflare D1.
export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET manquant dans .env.local')
  }

  // Vérification de la signature Svix
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Entêtes Svix manquants', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: any
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    console.error('Erreur de vérification webhook Clerk:', err)
    return new Response('Signature invalide', { status: 400 })
  }

  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data
    const primaryEmail = email_addresses?.[0]?.email_address

    if (!primaryEmail) {
      return new Response('Email manquant', { status: 400 })
    }

    try {
      await db.insert(users).values({
        id,                           // On utilise l'ID Clerk directement
        email: primaryEmail,
        name: `${first_name || ''} ${last_name || ''}`.trim() || null,
        prenom: first_name || null,
        nom: last_name || null,
        image: image_url || null,
        photo_url: image_url || null,
        role_plateforme: 'membre',
        statut_adhesion: 'gratuit',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).onConflictDoNothing()

      console.log(`✅ Utilisateur Clerk synchronisé dans D1: ${primaryEmail}`)
    } catch (err) {
      console.error('Erreur insertion D1:', err)
      return new Response('Erreur base de données', { status: 500 })
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data
    const primaryEmail = email_addresses?.[0]?.email_address

    try {
      await db.update(users)
        .set({
          email: primaryEmail,
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          prenom: first_name || null,
          nom: last_name || null,
          image: image_url || null,
          photo_url: image_url || null,
          updated_at: new Date().toISOString(),
        })
        .where(eq(users.id, id))
    } catch (err) {
      console.error('Erreur mise à jour D1:', err)
    }
  }

  return new Response('OK', { status: 200 })
}
