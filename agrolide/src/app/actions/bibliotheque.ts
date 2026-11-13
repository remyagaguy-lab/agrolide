'use server'

import { auth } from '@/lib/auth/server'
import { db } from '@/db'
import { documents, documents_favoris, lectures_membres } from '@/db/schema'
import { eq, and, count } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
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

/** Aime / n'aime plus un document. Renvoie le nouvel état. */
export async function basculerFavori(documentId: string): Promise<{ favori?: boolean; error?: string }> {
  const { userId } = await auth()
  if (!userId) return { error: 'Connectez-vous pour aimer un document.' }
  try {
    const [existant] = await db.select({ id: documents_favoris.id }).from(documents_favoris)
      .where(and(eq(documents_favoris.membre_id, userId), eq(documents_favoris.document_id, documentId))).limit(1)
    if (existant) {
      await db.delete(documents_favoris).where(eq(documents_favoris.id, existant.id))
    } else {
      await db.insert(documents_favoris)
        .values({ membre_id: userId, document_id: documentId, created_at: new Date().toISOString() })
        .onConflictDoNothing()
    }
    revalidatePath('/membres/formations')
    return { favori: !existant }
  } catch (e) {
    console.error('basculerFavori :', e)
    return { error: "Impossible d'enregistrer pour le moment." }
  }
}

/** Marque un document comme terminé (ou de nouveau en cours) dans « Mes lectures ». */
export async function basculerLectureTerminee(documentId: string): Promise<{ termine?: boolean; error?: string }> {
  const { userId } = await auth()
  if (!userId) return { error: 'Connectez-vous pour suivre vos lectures.' }
  try {
    const [ligne] = await db.select({ id: lectures_membres.id, termine: lectures_membres.termine }).from(lectures_membres)
      .where(and(eq(lectures_membres.membre_id, userId), eq(lectures_membres.document_id, documentId))).limit(1)
    if (!ligne) return { error: "Ouvrez d'abord le document en lecture." }
    await db.update(lectures_membres).set({ termine: !ligne.termine }).where(eq(lectures_membres.id, ligne.id))
    revalidatePath('/membres/formations')
    return { termine: !ligne.termine }
  } catch (e) {
    console.error('basculerLectureTerminee :', e)
    return { error: "Impossible d'enregistrer pour le moment." }
  }
}
