import Breadcrumb from '@/components/ui/Breadcrumb'
import { SecurePDFViewerWrapper } from '@/components/modules/bibliotheque/SecurePDFViewerWrapper'
import { db } from '@/db'
import { documents } from '@/db/schema'
import { eq, and, ne } from 'drizzle-orm'
import { AussiAimerColonne } from '@/components/modules/bibliotheque/AussiAimerColonne'
import { auth } from '@/lib/auth/server'
import { noterLecture } from '@/lib/bibliotheque/parcours.server'

/** Lecteur sécurisé d'un document, partagé par le site public et l'espace membre (seuls les liens changent). */
export async function LectureDocumentView({ id, mode }: { id: string; mode: 'membre' | 'public' }) {
  const racine = mode === 'membre' ? '/membres/bibliotheque' : '/bibliotheque'
  // Dans l'espace membre, l'ouverture est gardée pour « Mes lectures » (Mon parcours).
  if (mode === 'membre') {
    const { userId } = await auth()
    if (userId) await noterLecture(userId, id)
  }
  const current = await db.query.documents.findFirst({
    columns: { thematique: true, domaine: true, sous_domaine: true },
    where: eq(documents.id, id),
  })
  // Suggestions : même sujet, sinon même domaine, d'abord ; sinon les plus récents
  const memeSujet = current?.sous_domaine
    ? eq(documents.sous_domaine, current.sous_domaine)
    : current?.domaine
      ? eq(documents.domaine, current.domaine)
      : current?.thematique
        ? eq(documents.thematique, current.thematique)
        : null
  let suggestions = memeSujet
    ? await db.query.documents.findMany({
        columns: { id: true, titre: true, type_doc: true, thematique: true, domaine: true },
        where: and(eq(documents.statut, 'publie'), memeSujet, ne(documents.id, id)),
        limit: 5,
      })
    : []
  if (suggestions.length < 3) {
    const more = await db.query.documents.findMany({
      columns: { id: true, titre: true, type_doc: true, thematique: true, domaine: true },
      where: and(eq(documents.statut, 'publie'), ne(documents.id, id)),
      orderBy: (d, { desc }) => [desc(d.published_at)],
      limit: 5,
    })
    const seen = new Set(suggestions.map((d) => d.id))
    suggestions = [...suggestions, ...more.filter((d) => !seen.has(d.id))].slice(0, 5)
  }

  return (
    <div className={mode === 'public' ? 'container pb-16 pt-8 md:pt-12' : 'pt-6'}>
      <Breadcrumb jsonLd={mode === 'public'} items={[{ label: 'Bibliothèque', href: racine }, { label: 'Document', href: `${racine}/${id}` }, { label: 'Lecture sécurisée' }]} />

      <header className="mb-6">
        <h1 className="text-headline-sm font-bold text-on-surface md:text-headline-md">Lecture sécurisée</h1>
        <p className="mt-1 max-w-2xl text-body-md text-on-surface-variant">
          Le téléchargement, la sélection et le clic droit sont désactivés pour protéger ce document.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-8">
        <SecurePDFViewerWrapper documentId={id} />
        <AussiAimerColonne docs={suggestions} mode={mode} />
      </div>
    </div>
  )
}
