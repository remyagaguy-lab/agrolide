import Link from 'next/link'
import { DocumentCard, DocumentType } from '@/components/modules/bibliotheque/DocumentCard'
import { ArrowRight, BookOpen } from 'lucide-react'

export const revalidate = 3600 // ISR 1 heure

async function getBibliothequeData() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'

  try {
    const [countRes, previewRes] = await Promise.all([
      fetch(`${API_URL}/api/bibliotheque/count`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/api/bibliotheque/public-preview`, { next: { revalidate: 3600 } })
    ])

    const countData = countRes.ok ? await countRes.json() : { count: 0 }
    const previewData = previewRes.ok ? await previewRes.json() : { data: [] }

    return {
      count: countData.count || 0,
      documents: (previewData.data || []) as DocumentType[]
    }
  } catch (error) {
    console.error('Erreur lors du fetch de la bibliothèque:', error)
    return { count: 0, documents: [] }
  }
}

export default async function BibliothequePublicPage() {
  const { count, documents } = await getBibliothequeData()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f8f6' }}>

      {/* Hero section */}
      <section className="bg-[#0d3520] pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Accent badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fcb726]/10 border border-[#fcb726]/20 text-[#fcb726] text-sm font-heading font-semibold mb-6">
            <BookOpen className="w-4 h-4" />
            Ressources du réseau
          </div>

          <h1 className="font-heading font-[800] text-4xl sm:text-5xl text-white mb-6 max-w-3xl mx-auto leading-tight">
            Bibliothèque du réseau
          </h1>

          <p className="text-white/70 text-xl mb-10 max-w-2xl mx-auto font-sans">
            Accédez à notre collection de{' '}
            {count > 0 ? (
              <span className="font-semibold text-[#fcb726]">{count} documents</span>
            ) : (
              'documents'
            )}{' '}
            techniques, rapports, thèses et guides spécialisés en agriculture et développement durable.
          </p>

          <Link
            href="/rejoindre"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fcb726] text-[#1a1a1a] font-heading font-[700] hover:bg-[#e5a620] transition-colors"
          >
            Devenir membre
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Documents section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section title */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading font-[800] text-2xl text-[#1a1a1a]">Récemment ajoutés</h2>
          </div>

          {documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} publicView={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: '#ccc' }} />
              <p style={{ color: '#666' }} className="font-sans">Les documents sont en cours de chargement...</p>
            </div>
          )}

          {/* Bottom CTA card */}
          <div className="mt-16 text-center bg-[#0d3520] p-10 rounded-2xl shadow-sm">
            <h3 className="font-heading font-[800] text-2xl text-white mb-4">
              Accédez à la bibliothèque complète
            </h3>
            <p className="mb-8 max-w-2xl mx-auto font-sans text-white/70">
              Rejoignez Agrolide pour consulter, télécharger et même partager vos propres documents avec la communauté.
            </p>
            <Link
              href="/rejoindre"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fcb726] text-[#1a1a1a] font-heading font-[700] hover:bg-[#e5a620] transition-colors"
            >
              Voir les offres d&apos;adhésion
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  )
}
