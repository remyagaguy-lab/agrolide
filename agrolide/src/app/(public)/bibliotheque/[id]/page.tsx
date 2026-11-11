import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, MapPin, Eye, Tag, FileText, User } from 'lucide-react'
import { DocumentCard, DocumentType } from '@/components/modules/bibliotheque/DocumentCard'
import { DownloadButton } from '@/components/modules/bibliotheque/DownloadButton'
import { db } from '@/db'
import { documents } from '@/db/schema'
import { eq, and, ne } from 'drizzle-orm'
import { auth } from '@/lib/auth/server'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const data = await db.query.documents.findFirst({
    columns: { titre: true },
    where: eq(documents.id, id)
  })
  
  return { title: data?.titre ? `${data.titre} | Bibliothèque Agrolide` : "Document | Bibliothèque Agrolide" }
}

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const { userId } = await auth();
  const session = userId ? { user: { id: userId } } : null;
  const isLoggedIn = !!session?.user
  
  // Fetch document
  const document = await db.query.documents.findFirst({
    where: eq(documents.id, id)
  })
    
  if (!document) {
    notFound()
  }

  // Fetch similar documents (same thématique, excluding current)
  let similarDocs: DocumentType[] = []
  if (document.thematique) {
    const data = await db.query.documents.findMany({
      where: and(
        eq(documents.statut, 'publie'),
        eq(documents.thematique, document.thematique),
        ne(documents.id, document.id)
      ),
      limit: 3
    })
      
    if (data) similarDocs = data as DocumentType[]
  }

  const tags = [document.filiere, document.langue].filter(Boolean) as string[]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Retour */}
      <Link href="/bibliotheque" className="inline-flex items-center gap-2 text-sm text-on-surface-muted hover:text-on-surface mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Retour à la bibliothèque
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Principale */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-surface-container text-on-surface">
                {document.type_doc}
              </span>
              {document.thematique && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-container text-success">
                  {document.thematique}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-on-surface mb-4">
              {document.titre}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-on-surface-muted mb-8 pb-8 border-b border-outline-variant">
              {document.auteurs && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{document.auteurs}</span>
                </div>
              )}
              {document.annee && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{document.annee}</span>
                </div>
              )}
              {document.pays && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{document.pays}</span>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-on-surface mb-4">Résumé</h2>
              <div className="prose prose-green max-w-none text-on-surface-variant">
                <p className="whitespace-pre-line">{document.resume || 'Aucun résumé disponible pour ce document.'}</p>
              </div>
            </div>
            
            {tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-outline-variant">
                <h3 className="text-sm font-medium text-on-surface mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Mots-clés
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string, i: number) => (
                    <Link 
                      key={i} 
                      href={`/membres/bibliotheque?search=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-sm rounded-lg hover:bg-surface-container transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm sticky top-24">
            <div className="flex items-center justify-center w-16 h-16 bg-success-container rounded-2xl mb-6">
              <FileText className="w-8 h-8 text-success" />
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-muted">Format</span>
                <span className="font-medium text-on-surface">PDF</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-muted">Taille</span>
                <span className="font-medium text-on-surface">{document.taille_octets ? `${(document.taille_octets / 1024 / 1024).toFixed(2)} MB` : 'Inconnue'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-muted">Consultations</span>
                <span className="font-medium text-on-surface flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {document.nb_telechargements || 0}
                </span>
              </div>
            </div>
            
            <DownloadButton documentId={document.id} />
            
            <p className="mt-4 text-xs text-center text-on-surface-muted">
              En consultant ce document, vous acceptez nos conditions d'utilisation de la bibliothèque.
            </p>
          </div>
        </div>
      </div>
      
      {/* Documents similaires */}
      {similarDocs.length > 0 && (
        <div className="mt-16 pt-16 border-t border-outline-variant">
          <h2 className="text-2xl font-bold text-on-surface mb-8">Documents similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarDocs.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
