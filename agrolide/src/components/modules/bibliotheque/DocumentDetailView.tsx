import { notFound } from 'next/navigation'
import type { DocumentType } from '@/components/modules/bibliotheque/DocumentCard'
import { DocumentFiche } from '@/components/modules/bibliotheque/DocumentFiche'
import { estFavori } from '@/lib/bibliotheque/parcours.server'
import { db } from '@/db'
import { documents, users } from '@/db/schema'
import { auth } from '@/lib/auth/server'
import { eq, and, ne } from 'drizzle-orm'

type Espace = 'membre' | 'public'

/**
 * Fiche d'un document de la bibliothèque, partagée par le site public (/bibliotheque/[id]) et l'espace membre
 * (/membres/bibliotheque/[id]). Lit les données ; la présentation est dans DocumentFiche.
 */
export async function DocumentDetailView({ id, mode }: { id: string; mode: Espace }) {
  const document = await db.query.documents.findFirst({
    where: eq(documents.id, id)
  })

  if (!document) notFound()

  // Dans l'espace membre, un document non publié n'est visible que de son déposant et des administrateurs
  // (aperçu avant validation).
  if (mode === 'membre' && document.statut !== 'publie') {
    const { userId } = await auth()
    const profil = userId
      ? await db.query.users.findFirst({ columns: { role_plateforme: true }, where: eq(users.id, userId) })
      : null
    const admin = ['admin', 'admin_content', 'super_admin'].includes(profil?.role_plateforme ?? '')
    if (!userId || (document.depose_par !== userId && !admin)) notFound()
  }

  // Documents similaires : même sujet si on le connaît, sinon même domaine, sinon même thématique
  let similarDocs: DocumentType[] = []
  const memeSujet = document.sous_domaine
    ? eq(documents.sous_domaine, document.sous_domaine)
    : document.domaine
      ? eq(documents.domaine, document.domaine)
      : document.thematique
        ? eq(documents.thematique, document.thematique)
        : null
  if (memeSujet) {
    const data = await db.query.documents.findMany({
      where: and(eq(documents.statut, 'publie'), memeSujet, ne(documents.id, document.id)),
      limit: 3
    })

    if (data) similarDocs = data as DocumentType[]
  }

  // Cœur « favori » : réservé à l'espace membre (alimente Mon parcours).
  const membreId = mode === 'membre' ? (await auth()).userId : null
  const favori = membreId ? await estFavori(membreId, document.id) : false

  return <DocumentFiche document={document} similarDocs={similarDocs} mode={mode} peutMettreEnFavori={Boolean(membreId)} favori={favori} />
}
