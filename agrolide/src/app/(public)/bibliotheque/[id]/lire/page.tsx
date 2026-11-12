import Breadcrumb from '@/components/ui/Breadcrumb'
import { SecurePDFViewerWrapper } from '@/components/modules/bibliotheque/SecurePDFViewerWrapper'

import { db } from '@/db'
import { documents } from '@/db/schema'
import { eq, and, ne } from 'drizzle-orm'
import { AussiAimerColonne } from '@/components/modules/bibliotheque/AussiAimerColonne'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const data = await db.query.documents.findFirst({
    columns: { titre: true },
    where: eq(documents.id, id)
  })
  
  return { title: data?.titre ? `Lecture : ${data.titre} | Bibliothèque Agrolide` : "Lecture Sécurisée | Agrolide" }
}

export default async function SecureReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const current = await db.query.documents.findFirst({
    columns: { thematique: true },
    where: eq(documents.id, id),
  })
  // Suggestions : même thématique d'abord, sinon les plus récents
  let suggestions = current?.thematique
    ? await db.query.documents.findMany({
        columns: { id: true, titre: true, type_doc: true, thematique: true },
        where: and(eq(documents.statut, 'publie'), eq(documents.thematique, current.thematique), ne(documents.id, id)),
        limit: 5,
      })
    : []
  if (suggestions.length < 3) {
    const more = await db.query.documents.findMany({
      columns: { id: true, titre: true, type_doc: true, thematique: true },
      where: and(eq(documents.statut, 'publie'), ne(documents.id, id)),
      orderBy: (d, { desc }) => [desc(d.published_at)],
      limit: 5,
    })
    const seen = new Set(suggestions.map((d) => d.id))
    suggestions = [...suggestions, ...more.filter((d) => !seen.has(d.id))].slice(0, 5)
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <Breadcrumb items={[{ label: 'Bibliothèque', href: '/bibliotheque' }, { label: 'Document', href: `/bibliotheque/${id}` }, { label: 'Lecture sécurisée' }]} />
      
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-on-surface">Lecture Sécurisée</h1>
        <p className="text-on-surface-muted text-sm">Le téléchargement, la sélection et le clic droit sont désactivés pour protéger ce document.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-6">
        <SecurePDFViewerWrapper documentId={id} />
        <AussiAimerColonne docs={suggestions} />
      </div>
    </div>
  )
}
