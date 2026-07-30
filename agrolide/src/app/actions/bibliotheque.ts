'use server'

import { auth } from '@/auth'
import { db } from '@/db'
import { documents } from '@/db/schema'
import { eq, and, count } from 'drizzle-orm'

export async function checkTrocEligibility() {
  const session = await auth()
  
  if (!session?.user) {
    return { authorized: false, reason: 'unauthenticated', count: 0 }
  }

  // Count the number of published documents uploaded by the user
  try {
    const result = await db.select({ value: count() })
      .from(documents)
      .where(and(eq(documents.depose_par, session.user.id as string), eq(documents.statut, 'publie')))
    
    const uploadedCount = result[0].value
    
    // Le système de troc est temporairement désactivé. Toute personne connectée peut télécharger.
    return { authorized: true, count: uploadedCount }
  } catch (error) {
    console.error("Error checking troc eligibility:", error)
    return { authorized: false, reason: 'error', count: 0 }
  }
}

export async function getDocumentUrl(documentId: string) {
  try {
    const doc = await db.query.documents.findFirst({
      columns: { fichier_r2_key: true },
      where: eq(documents.id, documentId)
    })
      
    if (doc?.fichier_r2_key) {
      // Generate the API proxy url to download
      return { url: `/api/bibliotheque/download/${documentId}?download=true` }
    }
  } catch (e) {
    //
  }
  return { error: 'Document non trouvé' }
}

export async function fetchDocuments({
  search = '',
  type = '',
  thematique = '',
  cursor = null
}: {
  search?: string
  type?: string
  thematique?: string
  cursor?: string | null
}) {
  try {
    const { like, inArray, and, desc, lt } = await import('drizzle-orm')
    const conditions = [eq(documents.statut, 'publie')]
    
    if (search) conditions.push(like(documents.titre, `%${search}%`))
    if (type) conditions.push(inArray(documents.type_doc, type.split(',')))
    if (thematique) conditions.push(inArray(documents.thematique, thematique.split(',')))
    if (cursor) conditions.push(lt(documents.created_at, cursor))

    const data = await db.select().from(documents).where(and(...conditions)).orderBy(desc(documents.created_at)).limit(20)
    
    return {
      data: data as any[],
      nextCursor: data.length === 20 ? data[19].created_at : null
    }
  } catch (error) {
    console.error("Erreur lors du fetch des documents:", error)
    throw new Error('Erreur de chargement')
  }
}
