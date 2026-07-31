'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { opportunites } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getOpportunites(activeTab: 'toutes' | 'mes_soumissions') {
  const { userId } = await auth();
  const user = userId ? { id: userId } : null;
  const session = userId ? { user: { id: userId } } : null;

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
  const { userId } = await auth();
  const user = userId ? { id: userId } : null;
  const session = userId ? { user: { id: userId } } : null;

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
