'use server'

import { auth } from '@/auth'
import { db } from '@/db'
import { opportunites } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getOpportunites(activeTab: 'toutes' | 'mes_soumissions') {
  const session = await auth()
  const user = session?.user

  if (activeTab === 'mes_soumissions') {
    if (!user || !user.id) return []
    const data = await db.query.opportunites.findMany({
      where: eq(opportunites.poste_par, user.id),
      orderBy: (opportunites, { desc }) => [desc(opportunites.created_at)]
    })
    return data
  }

  const data = await db.query.opportunites.findMany({
    where: eq(opportunites.statut, 'publie'),
    orderBy: (opportunites, { desc }) => [desc(opportunites.created_at)]
  })
  
  return data
}

export async function submitOpportunity(formData: any, isAdmin: boolean) {
  const session = await auth()
  const user = session?.user

  if (!user || !user.id) throw new Error("Vous devez être connecté pour soumettre une opportunité.")

  const payload = {
    ...formData,
    id: crypto.randomUUID(),
    publie_par: user.id,
    statut: isAdmin ? 'publie' : 'en_attente',
    date_limite: formData.date_limite ? new Date(formData.date_limite).toISOString() : null
  }

  await db.insert(opportunites).values(payload)

  return { success: true }
}
