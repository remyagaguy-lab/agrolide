'use server'

import { db } from '@/db'
import { evenements } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getEvenements() {
  const data = await db.query.evenements.findMany({
    where: eq(evenements.publie, true),
    orderBy: (evenements, { asc }) => [asc(evenements.date_debut)]
  })
  
  return data
}
