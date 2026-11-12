'use server'

import { auth } from '@/lib/auth/server'
import { db } from '@/db'
import { documents } from '@/db/schema'
import { eq, and, count } from 'drizzle-orm'
import { conditionsBibliotheque, TAILLE_PAGE, type FiltresBibliotheque } from '@/lib/bibliotheque/filtres'

export async function checkTrocEligibility() {
  const { userId } = await auth();
  const session = userId ? { user: { id: userId } } : null;
  
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

export async function fetchDocuments(filtres: FiltresBibliotheque) {
  try {
    const { desc } = await import('drizzle-orm')
    const data = await db.select().from(documents)
      .where(conditionsBibliotheque(filtres))
      .orderBy(desc(documents.created_at))
      .limit(TAILLE_PAGE)

    return {
      data: data as any[],
      nextCursor: data.length === TAILLE_PAGE ? data[TAILLE_PAGE - 1].created_at : null
    }
  } catch (error) {
    console.error("Erreur lors du fetch des documents:", error)
    throw new Error('Erreur de chargement')
  }
}
