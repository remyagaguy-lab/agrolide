import { Suspense, cache } from 'react'
import { after } from 'next/server'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { SecurePDFViewerWrapper } from '@/components/modules/bibliotheque/SecurePDFViewerWrapper'
import { db } from '@/db'
import { documents } from '@/db/schema'
import { eq, and, ne, or } from 'drizzle-orm'
import { choisirSimilaires } from '@/lib/bibliotheque/lecteur'
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

/** Documents similaires (même sous-domaine, domaine ou thématique, jamais le document lu) : chargés à part, ils ne retardent pas le lecteur. */
async function Suggestions({ id, mode }: { id: string; mode: 'membre' | 'public' }) {
  const current = await getDocumentLecture(id)
  const criteres = [
    current?.sous_domaine ? eq(documents.sous_domaine, current.sous_domaine) : undefined,
    current?.domaine ? eq(documents.domaine, current.domaine) : undefined,
    current?.thematique ? eq(documents.thematique, current.thematique) : undefined,
  ].filter((c) => c !== undefined)
  const colonnes = { id: true, titre: true, type_doc: true, thematique: true, domaine: true, sous_domaine: true, published_at: true } as const
  const [proches, recents] = await Promise.all([
    criteres.length
      ? db.query.documents.findMany({ columns: colonnes, where: and(eq(documents.statut, 'publie'), ne(documents.id, id), or(...criteres)), limit: 40 })
      : Promise.resolve([]),
    db.query.documents.findMany({ columns: colonnes, where: and(eq(documents.statut, 'publie'), ne(documents.id, id)), orderBy: (d, { desc }) => [desc(d.published_at)], limit: 10 }),
  ])
  const similaires = choisirSimilaires({ id, thematique: current?.thematique ?? '', domaine: current?.domaine, sous_domaine: current?.sous_domaine }, [...proches, ...recents])
  return <AussiAimerColonne docs={similaires} mode={mode} />
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

  // Chargement direct de la page : la requête du PDF part tout de suite, sans attendre le code de la liseuse (lourd).
  // Seulement pour un membre (pas de quota à compter) et si le document n'est pas déjà gardé sur l'appareil.
  const amorce = `(function(){try{var id=${JSON.stringify(id).replace(/</g, '\u003c')};if(localStorage.getItem('ag-hl:'+id))return;var w=window;w.__agPdf=w.__agPdf||{};w.__agPdf[id]=fetch('/api/bibliotheque/download/'+id,{credentials:'same-origin'});w.__agPdf[id].catch(function(){});fetch('/pdf.worker.min.js').catch(function(){})}catch(e){}})()`

  return (
    <div className={mode === 'public' ? 'container pb-16 pt-8 md:pt-12' : 'pt-6'}>
      {mode === 'membre' && /^[\w-]+$/.test(id) && <script dangerouslySetInnerHTML={{ __html: amorce }} />}
      <Breadcrumb jsonLd={mode === 'public'} items={[{ label: 'Bibliothèque', href: racine }, { label: 'Document', href: `${racine}/${id}` }, { label: 'Lecture sécurisée' }]} />

      <header className="mb-4">
        <h1 className="line-clamp-2 text-title-lg font-bold text-on-surface md:text-headline-sm">{document?.titre ?? 'Lecture sécurisée'}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-label-md text-on-surface-variant">
          <Lock className="size-4 shrink-0" aria-hidden />
          Lecture sécurisée : téléchargement, sélection et clic droit désactivés.
        </p>
      </header>

      <SecurePDFViewerWrapper documentId={id} titre={mode === 'membre' ? document?.titre : undefined} />
      {/* En fin de lecture : rangée de documents similaires, à faire défiler au doigt. */}
      <div className="mt-8 pb-6">
        <Suspense fallback={null}>
          <Suggestions id={id} mode={mode} />
        </Suspense>
      </div>
    </div>
  )
}
