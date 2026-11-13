import { Suspense, cache } from 'react'
import { after } from 'next/server'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { SecurePDFViewerWrapper } from '@/components/modules/bibliotheque/SecurePDFViewerWrapper'
import { db } from '@/db'
import { documents } from '@/db/schema'
import { eq, and, ne } from 'drizzle-orm'
import { AussiAimerColonne } from '@/components/modules/bibliotheque/AussiAimerColonne'
import { auth } from '@/lib/auth/server'
import { noterLecture } from '@/lib/bibliotheque/parcours.server'
import { Lock } from '@/components/ui/icons'

/** Le document lu : une seule requête partagée entre le titre de l'onglet, l'en-tête et les suggestions. */
export const getDocumentLecture = cache((id: string) =>
  db.query.documents.findFirst({
    columns: { titre: true, thematique: true, domaine: true, sous_domaine: true },
    where: eq(documents.id, id),
  }),
)

/** Suggestions (même sujet, sinon même domaine, sinon les plus récentes) : chargées à part, elles ne retardent pas le lecteur. */
async function Suggestions({ id, mode }: { id: string; mode: 'membre' | 'public' }) {
  const current = await getDocumentLecture(id)
  const memeSujet = current?.sous_domaine
    ? eq(documents.sous_domaine, current.sous_domaine)
    : current?.domaine
      ? eq(documents.domaine, current.domaine)
      : current?.thematique
        ? eq(documents.thematique, current.thematique)
        : null
  const colonnes = { id: true, titre: true, type_doc: true, thematique: true, domaine: true } as const
  let suggestions = memeSujet
    ? await db.query.documents.findMany({
        columns: colonnes,
        where: and(eq(documents.statut, 'publie'), memeSujet, ne(documents.id, id)),
        limit: 5,
      })
    : []
  if (suggestions.length < 3) {
    const more = await db.query.documents.findMany({
      columns: colonnes,
      where: and(eq(documents.statut, 'publie'), ne(documents.id, id)),
      orderBy: (d, { desc }) => [desc(d.published_at)],
      limit: 5,
    })
    const seen = new Set(suggestions.map((d) => d.id))
    suggestions = [...suggestions, ...more.filter((d) => !seen.has(d.id))].slice(0, 5)
  }
  return <AussiAimerColonne docs={suggestions} mode={mode} />
}

/** Lecteur sécurisé d'un document, partagé par le site public et l'espace membre (seuls les liens changent). */
export async function LectureDocumentView({ id, mode }: { id: string; mode: 'membre' | 'public' }) {
  const racine = mode === 'membre' ? '/membres/bibliotheque' : '/bibliotheque'
  // Dans l'espace membre, l'ouverture est gardée pour « Mes lectures » (Mon parcours) : après l'envoi de la page, sans la retarder.
  if (mode === 'membre') {
    after(async () => {
      const { userId } = await auth()
      if (userId) await noterLecture(userId, id)
    })
  }
  const document = await getDocumentLecture(id)

  return (
    <div className={mode === 'public' ? 'container pb-16 pt-8 md:pt-12' : 'pt-6'}>
      <Breadcrumb jsonLd={mode === 'public'} items={[{ label: 'Bibliothèque', href: racine }, { label: 'Document', href: `${racine}/${id}` }, { label: 'Lecture sécurisée' }]} />

      <header className="mb-4">
        <h1 className="line-clamp-2 text-title-lg font-bold text-on-surface md:text-headline-sm">{document?.titre ?? 'Lecture sécurisée'}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-label-md text-on-surface-variant">
          <Lock className="size-4 shrink-0" aria-hidden />
          Lecture sécurisée : téléchargement, sélection et clic droit désactivés.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-8">
        <SecurePDFViewerWrapper documentId={id} titre={mode === 'membre' ? document?.titre : undefined} />
        <Suspense fallback={null}>
          <Suggestions id={id} mode={mode} />
        </Suspense>
      </div>
    </div>
  )
}
