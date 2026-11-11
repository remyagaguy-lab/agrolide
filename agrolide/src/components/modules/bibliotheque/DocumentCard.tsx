import Link from 'next/link'
import { FileText, Eye, Calendar, MapPin } from 'lucide-react'

export interface DocumentType {
  id: string
  titre: string
  auteurs: string
  type_doc: string
  annee?: number
  pays?: string
  nb_telechargements: number
  statut?: string
  created_at?: string
}

interface DocumentCardProps {
  document: DocumentType
  publicView?: boolean
}

export function DocumentCard({ document, publicView = false }: DocumentCardProps) {
  // Couleur par type de document
  const formatType = (type_doc: string) => {
    if (!type_doc) return 'Inconnu';
    switch (type_doc.toLowerCase()) {
      case 'these': return 'Thèse';
      case 'memoire': return 'Mémoire';
      case 'fiche_technique': return 'Fiche technique';
      case 'guide_pratique': return 'Guide pratique';
      case 'article': return 'Article';
      case 'rapport': return 'Rapport';
      default: return type_doc;
    }
  }

  const getBadgeColor = (type_doc: string) => {
    if (!type_doc) return 'bg-surface-container text-on-surface';
    switch (type_doc.toLowerCase()) {
      case 'these': return 'bg-info-container text-on-info-container'
      case 'memoire': return 'bg-info-container text-on-info-container'
      case 'fiche_technique': return 'bg-success-container text-on-success-container'
      case 'guide_pratique': return 'bg-warning-container text-on-warning-container'
      case 'article': return 'bg-error-container text-on-error-container'
      case 'rapport': return 'bg-surface-container text-on-surface'
      default: return 'bg-surface-container text-on-surface'
    }
  }

  const href = `/bibliotheque/${document.id}`

  return (
    <Link href={href} className={`group flex flex-col h-full bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm hover:border-primary hover:shadow-md transition-all overflow-hidden`}>
      {/* En-tête miniature */}
      <div className="h-32 bg-surface-container-low flex items-center justify-center border-b border-outline-variant relative group-hover:bg-surface-container transition-colors">
        <FileText className="w-12 h-12 text-on-surface-muted" strokeWidth={1.5} />
        <span className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${getBadgeColor(document.type_doc)}`}>
          {formatType(document.type_doc)}
        </span>
      </div>

      {/* Contenu */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-on-surface text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {document.titre}
        </h3>
        
        <p className="text-sm text-on-surface-muted mb-4 line-clamp-1">
          {document.auteurs || 'Auteur inconnu'}
        </p>
        
        <div className="mt-auto space-y-2">
          <div className="flex items-center text-xs text-on-surface-muted gap-4">
            {document.annee && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{document.annee}</span>
              </div>
            )}
            {document.pays && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="line-clamp-1">{document.pays}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-outline-variant">
            <div className="flex items-center gap-1.5 text-xs font-medium text-on-surface-muted">
              <Eye className="w-3.5 h-3.5" />
              <span>{document.nb_telechargements || 0}</span>
            </div>
            
            {publicView ? (
              <span className="text-xs font-medium text-success opacity-0 group-hover:opacity-100 transition-opacity">
                Consulter →
              </span>
            ) : (
              <span className="text-xs font-medium text-success opacity-0 group-hover:opacity-100 transition-opacity">
                Consulter →
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
