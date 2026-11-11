import 'server-only'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { documents } from '@/db/schema'
import { auth } from '@/lib/auth/server'

export type DocumentAccess =
  | { ok: true; document: { fichier_r2_key: string; nb_telechargements: number | null; acces: string }; isPublic: boolean }
  | { ok: false; status: 401 | 404; error: string }

/**
 * Contrôle d'accès commun aux routes de lecture/téléchargement de documents.
 * - document absent ou non publié : 404 (on ne révèle pas son existence)
 * - acces = 'public' : accessible à tous
 * - tout autre niveau : connexion exigée (401 sinon)
 */
export async function checkDocumentAccess(id: string): Promise<DocumentAccess> {
  const document = await db.query.documents.findFirst({
    columns: { fichier_r2_key: true, nb_telechargements: true, acces: true, statut: true },
    where: eq(documents.id, id),
  })

  if (!document || document.statut !== 'publie') {
    return { ok: false, status: 404, error: 'Document introuvable' }
  }

  const isPublic = document.acces === 'public'
  if (!isPublic) {
    const { userId } = await auth()
    if (!userId) return { ok: false, status: 401, error: 'Connexion requise' }
  }

  return { ok: true, document, isPublic }
}
