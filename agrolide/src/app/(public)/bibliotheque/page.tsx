import Link from 'next/link'
import { DocumentCard, DocumentType } from '@/components/modules/bibliotheque/DocumentCard'
import { ArrowRight, BookOpen, Library } from 'lucide-react'

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
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-6">
            <Library className="w-8 h-8 text-green-700" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            Ressources & Bibliothèque
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Accédez à notre collection de {count > 0 ? <span className="font-semibold text-green-700">{count} documents</span> : 'documents'} techniques, rapports, thèses et guides spécialisés en agriculture et développement durable.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link 
              href="/rejoindre" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-800 transition-colors"
            >
              Devenir membre
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Aperçu des documents (SANS floutage comme demandé) */}
        <div className="relative mt-12">
          {/* Titre de section */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Récemment ajoutés</h2>
          </div>

          {documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} publicView={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Les documents sont en cours de chargement...</p>
            </div>
          )}

          <div className="mt-16 text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Accédez à la bibliothèque complète</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Rejoignez Agrolide pour consulter, télécharger et même partager vos propres documents avec la communauté.
            </p>
            <Link 
              href="/rejoindre" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-green-700 text-green-700 font-semibold hover:bg-green-50 transition-colors"
            >
              Voir les offres d'adhésion
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  )
}
