'use server'

import { db } from '@/db'
import { evenements, opportunites } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getActualites() {
  const eventsData = await db.query.evenements.findMany({
    where: eq(evenements.publie, true)
  })

  const oppsData = await db.query.opportunites.findMany({
    where: eq(opportunites.statut, 'publie')
  })

  const events = eventsData.map(e => ({ ...e, _itemType: 'evenement' }))
  const opps = oppsData.map(o => ({ ...o, _itemType: 'opportunite' }))

  const combined = [...events, ...opps]
  
  combined.sort((a, b) => {
    const dateA = a._itemType === 'evenement' ? new Date((a as any).date_debut).getTime() : new Date((a as any).created_at).getTime()
    const dateB = b._itemType === 'evenement' ? new Date((b as any).date_debut).getTime() : new Date((b as any).created_at).getTime()
    return dateB - dateA
  })

  return combined
}
