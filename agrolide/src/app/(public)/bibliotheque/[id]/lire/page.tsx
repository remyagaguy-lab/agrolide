import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SecurePDFViewerWrapper } from '@/components/modules/bibliotheque/SecurePDFViewerWrapper'

import { db } from '@/db'
import { documents } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { QuotaTracker } from '@/components/modules/bibliotheque/QuotaTracker'

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
  const { userId } = await auth();
  const session = userId ? { user: { id: userId } } : null;
  const isLoggedIn = !!session?.user

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <QuotaTracker documentId={id} isLoggedIn={isLoggedIn} />
      {/* Retour */}
      <Link href={`/bibliotheque/${id}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 mb-6 transition-colors font-medium">
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
