import "server-only"
import { and, desc, eq } from "drizzle-orm"
import { db } from "@/db"
import { documents, documents_favoris, lectures_membres } from "@/db/schema"

/** Un document tel qu'il apparaît dans « Mon parcours » (carte compacte). */
export interface DocumentParcours {
  id: string
  titre: string
  auteurs: string
  type_doc: string
  domaine: string | null
  /** Dernière ouverture (lectures) ou date du favori. */
  date: string
  termine: boolean
}

const colonnes = {
  id: documents.id,
  titre: documents.titre,
  auteurs: documents.auteurs,
  type_doc: documents.type_doc,
  domaine: documents.domaine,
}

/**
 * Documents que le membre a ouverts, du plus récent au plus ancien.
 * Les listes restent vides (sans erreur) tant que la migration 0009 n'est pas appliquée.
 */
export async function lecturesDuMembre(membreId: string): Promise<DocumentParcours[]> {
  try {
    return await db
      .select({ ...colonnes, date: lectures_membres.derniere_lecture, termine: lectures_membres.termine })
      .from(lectures_membres)
      .innerJoin(documents, eq(lectures_membres.document_id, documents.id))
      .where(and(eq(lectures_membres.membre_id, membreId), eq(documents.statut, "publie")))
      .orderBy(desc(lectures_membres.derniere_lecture))
      .limit(24)
  } catch (e) {
    console.error("lecturesDuMembre :", e)
    return []
  }
}

export async function favorisDuMembre(membreId: string): Promise<DocumentParcours[]> {
  try {
    const rows = await db
      .select({ ...colonnes, date: documents_favoris.created_at })
      .from(documents_favoris)
      .innerJoin(documents, eq(documents_favoris.document_id, documents.id))
      .where(and(eq(documents_favoris.membre_id, membreId), eq(documents.statut, "publie")))
      .orderBy(desc(documents_favoris.created_at))
      .limit(24)
    return rows.map((r) => ({ ...r, termine: false }))
  } catch (e) {
    console.error("favorisDuMembre :", e)
    return []
  }
}

export async function estFavori(membreId: string, documentId: string): Promise<boolean> {
  try {
    const [row] = await db
      .select({ id: documents_favoris.id })
      .from(documents_favoris)
      .where(and(eq(documents_favoris.membre_id, membreId), eq(documents_favoris.document_id, documentId)))
      .limit(1)
    return !!row
  } catch {
    return false
  }
}

/** Note l'ouverture d'un document en lecture (première fois : création ; ensuite : date et compteur). */
export async function noterLecture(membreId: string, documentId: string): Promise<void> {
  try {
    const maintenant = new Date().toISOString()
    const [existante] = await db
      .select({ id: lectures_membres.id, nb: lectures_membres.nb_ouvertures })
      .from(lectures_membres)
      .where(and(eq(lectures_membres.membre_id, membreId), eq(lectures_membres.document_id, documentId)))
      .limit(1)
    if (existante) {
      await db
        .update(lectures_membres)
        .set({ derniere_lecture: maintenant, nb_ouvertures: existante.nb + 1 })
        .where(eq(lectures_membres.id, existante.id))
    } else {
      await db
        .insert(lectures_membres)
        .values({ membre_id: membreId, document_id: documentId, premiere_lecture: maintenant, derniere_lecture: maintenant })
        .onConflictDoNothing()
    }
  } catch (e) {
    console.error("noterLecture :", e)
  }
}
