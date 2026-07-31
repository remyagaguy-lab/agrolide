'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function updateProfil(payload: any) {
  const { userId } = await auth();
  const session = userId ? { user: { id: userId } } : null;
  if (!session?.user?.id) {
    throw new Error("Non autorisé")
  }

  await db.update(users).set({
    prenom: payload.prenom,
    nom: payload.nom,
    organisation: payload.entreprise || payload.organisation,
    biographie: payload.bio || payload.biographie,
    updated_at: new Date().toISOString()
  }).where(eq(users.id, session.user.id))

  revalidatePath('/membres/profil')
  revalidatePath('/membres/dashboard')
}

export async function updateAvatarUrl(url: string) {
  const { userId } = await auth();
  const session = userId ? { user: { id: userId } } : null;
  if (!session?.user?.id) {
    throw new Error("Non autorisé")
  }

  await db.update(users).set({
    photo_url: url,
    updated_at: new Date().toISOString()
  }).where(eq(users.id, session.user.id))

  revalidatePath('/membres/profil')
}
