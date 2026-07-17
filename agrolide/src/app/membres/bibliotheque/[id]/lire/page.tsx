import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SecurePDFViewerWrapper } from '@/components/modules/bibliotheque/SecurePDFViewerWrapper'

export const metadata = {
  title: 'Lecture Sécurisée | Agrolide Bibliothèque'
}

export default async function SecureReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Retour */}
      <Link href={`/membres/bibliotheque/${id}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" />
        Retour aux détails du document
      </Link>
      
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Lecture Sécurisée</h1>
        <p className="text-gray-500 text-sm">Le téléchargement, la sélection et le clic droit sont désactivés pour protéger ce document.</p>
      </div>

      <SecurePDFViewerWrapper documentId={id} />
    </div>
  )
}
