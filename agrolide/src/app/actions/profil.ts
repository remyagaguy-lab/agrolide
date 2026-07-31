'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function updateProfil(payload: any) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Non autorisé")
  }

  await db.update(users).set({
    prenom: payload.prenom,
    nom: payload.nom,
    organisation: payload.entreprise || payload.organisation,
    biographie: payload.bio || payload.biographie,
    updated_at: new Date().toISOString()
  }).where(eq(users.id, userId))

  revalidatePath('/membres/profil')
  revalidatePath('/membres/dashboard')
}

export async function updateAvatarUrl(url: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Non autorisé")
  }

  await db.update(users).set({
    photo_url: url,
    updated_at: new Date().toISOString()
  }).where(eq(users.id, userId))

  revalidatePath('/membres/profil')
}

export async function getCurrentUserCategory() {
  const { userId } = await auth();
  if (!userId) return null;
  const userRows = await db.select({
    categorie: users.categorie
  })
  .from(users)
  .where(eq(users.id, userId))
  .limit(1);
  return userRows[0]?.categorie || 'professionnel';
}
