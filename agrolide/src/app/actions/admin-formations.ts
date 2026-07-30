'use server'

import { db } from '@/db'
import { formations, sessions_formation, users } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { auth } from '@/auth'

async function checkAdmin() {
  const session = await auth()
  const user = session?.user

  if (!user || !user.id) throw new Error("Non autorisé")

  const profile = await db.query.users.findFirst({
    columns: { role_plateforme: true },
    where: eq(users.id, user.id)
  })

  if (!profile || (profile.role_plateforme !== 'admin' && profile.role_plateforme !== 'super_admin')) {
    throw new Error("Privilèges insuffisants")
  }
}

export async function getAdminFormations() {
  await checkAdmin()

  const results = await db.query.formations.findMany({
    with: {
      sessions_formation: {
        columns: { id: true } // We just want the count, so getting ids is fine
      }
    },
    orderBy: (formations, { desc }) => [desc(formations.created_at)]
  })
  
  // Transform to match the old format
  return results.map(f => ({
    ...f,
    sessions_formation: [{ count: f.sessions_formation?.length || 0 }]
  }))
}

export async function deleteFormation(id: string) {
  await checkAdmin()
  await db.delete(formations).where(eq(formations.id, id))
}

export async function upsertFormation(id: string | null, payload: any) {
  await checkAdmin()
  
  const mappedPayload = {
    titre: payload.titre,
    description: payload.description,
    thematique: payload.thematique,
    niveau: payload.niveau,
    modalite: payload.modalite,
    prix_fcfa: payload.prix, // Map prix to prix_fcfa as in schema
    statut: payload.statut,
    acces: payload.acces || 'public',
  }
  
  if (id) {
    await db.update(formations).set(mappedPayload).where(eq(formations.id, id))
  } else {
    await db.insert(formations).values({
      ...mappedPayload,
      created_at: new Date().toISOString()
    })
  }
}
