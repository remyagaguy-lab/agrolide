import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, Eye, Tag, FileText, User } from 'lucide-react'
import { DocumentCard, DocumentType } from '@/components/modules/bibliotheque/DocumentCard'
import { DownloadButton } from '@/components/modules/bibliotheque/DownloadButton'
import { db } from '@/db'
import { documents, users } from '@/db/schema'
import { auth } from '@/lib/auth/server'
import { eq, and, ne } from 'drizzle-orm'
import { labelType, labelDomaine, labelSousDomaine, labelPublic, labelNiveau } from '@/lib/bibliotheque/taxonomie'

type Espace = 'membre' | 'public'

/**
 * Fiche d'un document de la bibliothèque, partagée par le site public (/bibliotheque/[id]) et l'espace membre
 * (/membres/bibliotheque/[id]). Seuls les liens changent selon l'espace.
 */
export async function DocumentDetailView({ id, mode }: { id: string; mode: Espace }) {
  const racine = mode === 'membre' ? '/membres/bibliotheque' : '/bibliotheque'

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

  const tags = Array.from(new Set([...(document.mots_cles ?? []), document.filiere].filter(Boolean))) as string[]
  const sujet = document.sous_domaine ? labelSousDomaine(document.sous_domaine) : ''

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb jsonLd={mode === 'public'} items={[{ label: 'Bibliothèque', href: racine }, { label: document.titre }]} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Principale */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-surface-container text-on-surface">
                {labelType(document.type_doc)}
              </span>
              {(document.domaine || document.thematique) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-container text-success">
                  {document.domaine ? labelDomaine(document.domaine) : document.thematique}
                </span>
              )}
              {sujet && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-surface-container-low text-on-surface-variant">
                  {sujet}
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
                      href={`${racine}?search=${encodeURIComponent(tag)}`}
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
              {document.public_cible && (
                <div className="flex justify-between items-center gap-4 text-sm">
                  <span className="text-on-surface-muted">Pour qui ?</span>
                  <span className="font-medium text-on-surface text-right">{labelPublic(document.public_cible)}</span>
                </div>
              )}
              {document.niveau && (
                <div className="flex justify-between items-center gap-4 text-sm">
                  <span className="text-on-surface-muted">Niveau</span>
                  <span className="font-medium text-on-surface">{labelNiveau(document.niveau)}</span>
                </div>
              )}
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
            
            <DownloadButton documentId={document.id} mode={mode} />

            {(document.source_organisation || document.licence) && (
              <div className="mt-4 pt-4 border-t border-outline-variant text-xs text-on-surface-muted space-y-1">
                {document.source_organisation && <p>Source : <span className="text-on-surface-variant">{document.source_organisation}</span></p>}
                {document.licence && <p>Licence : <span className="text-on-surface-variant">{document.licence}</span></p>}
              </div>
            )}
            
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
              <DocumentCard key={doc.id} document={doc} publicView={mode === 'public'} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
