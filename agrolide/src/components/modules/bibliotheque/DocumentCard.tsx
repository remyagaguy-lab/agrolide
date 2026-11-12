import Link from 'next/link'
import { FileText, Eye, Calendar, MapPin, Lock } from 'lucide-react'
import { labelType, labelDomaine, couleurType } from '@/lib/bibliotheque/taxonomie'

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
  acces?: string
  domaine?: string | null
  sous_domaine?: string | null
}

interface DocumentCardProps {
  document: DocumentType
  publicView?: boolean
}

export function DocumentCard({ document, publicView = false }: DocumentCardProps) {
  // Le visiteur reste sur le site public ; un membre reste dans son espace.
  const href = publicView ? `/bibliotheque/${document.id}` : `/membres/bibliotheque/${document.id}`
  const reserveAuxMembres = document.acces && document.acces !== 'public'

  return (
    <Link href={href} className={`group flex flex-col h-full bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm hover:border-primary hover:shadow-md transition-all overflow-hidden`}>
      {/* En-tête miniature */}
      <div className="h-32 bg-surface-container-low flex items-center justify-center border-b border-outline-variant relative group-hover:bg-surface-container transition-colors">
        <FileText className="w-12 h-12 text-on-surface-muted" strokeWidth={1.5} />
        <span className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${couleurType(document.type_doc)}`}>
          {labelType(document.type_doc)}
        </span>
        {document.domaine && (
          <span className="absolute bottom-3 left-3 max-w-[70%] truncate text-xs font-medium text-on-surface-muted">
            {labelDomaine(document.domaine)}
          </span>
        )}
        {reserveAuxMembres && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-surface-container text-on-surface-variant" title="Lecture réservée aux membres inscrits">
            <Lock className="w-3 h-3" /> Inscrits
          </span>
        )}
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
