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
    if (!type_doc) return 'bg-gray-100 text-gray-800';
    switch (type_doc.toLowerCase()) {
      case 'these': return 'bg-purple-100 text-purple-800'
      case 'memoire': return 'bg-blue-100 text-blue-800'
      case 'fiche_technique': return 'bg-emerald-100 text-emerald-800'
      case 'guide_pratique': return 'bg-amber-100 text-amber-800'
      case 'article': return 'bg-rose-100 text-rose-800'
      case 'rapport': return 'bg-slate-100 text-slate-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const href = `/bibliotheque/${document.id}`

  return (
    <Link href={href} className={`group flex flex-col h-full bg-white border border-[#e8e8e4] rounded-2xl shadow-sm hover:border-[#1b5e38] hover:shadow-md transition-all overflow-hidden`}>
      {/* En-tête miniature */}
      <div className="h-32 bg-gray-50 flex items-center justify-center border-b border-gray-100 relative group-hover:bg-gray-100 transition-colors">
        <FileText className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
        <span className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${getBadgeColor(document.type_doc)}`}>
          {formatType(document.type_doc)}
        </span>
      </div>

      {/* Contenu */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-[#1a1a1a] text-sm line-clamp-2 mb-1 group-hover:text-[#1b5e38] transition-colors">
          {document.titre}
        </h3>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-1">
          {document.auteurs || 'Auteur inconnu'}
        </p>
        
        <div className="mt-auto space-y-2">
          <div className="flex items-center text-xs text-gray-500 gap-4">
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
          
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#e8e8e4]">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <Eye className="w-3.5 h-3.5" />
              <span>{document.nb_telechargements || 0}</span>
            </div>
            
            {publicView ? (
              <span className="text-xs font-medium text-green-700 opacity-0 group-hover:opacity-100 transition-opacity">
                Consulter →
              </span>
            ) : (
              <span className="text-xs font-medium text-green-700 opacity-0 group-hover:opacity-100 transition-opacity">
                Consulter →
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
