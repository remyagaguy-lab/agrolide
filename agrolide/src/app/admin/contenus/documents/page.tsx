'use client'

import { useState, useEffect } from 'react'
import { validateDocument, rejectDocument, deleteDocumentAdmin, getAdminDocuments } from '@/app/actions/admin-documents'
import { DocumentDetailsModal } from '@/components/modules/admin/DocumentDetailsModal'
import SubmitDocumentModal from '@/components/modules/admin/SubmitDocumentModal'
import { labelType } from '@/lib/bibliotheque/taxonomie'

import { Check, X, Eye, FileText, Loader2, AlertTriangle, Trash2, Plus } from "@/components/ui/icons"
export const dynamic = 'force-dynamic';

type DocumentAdmin = {
  id: string
  titre: string
  auteurs: string
  type_doc: string
  statut: string
  created_at?: string | null
  resume?: string | null
  thematique?: string | null
  pays?: string | null
  filiere?: string | null
  langue?: string | null
  annee?: number | null
  fichier_r2_key?: string | null
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)
  
  // Modal State
  const [selectedDoc, setSelectedDoc] = useState<DocumentAdmin | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const data = await getAdminDocuments()
      
      const sorted = [...(data || [])].sort((a, b) => {
        if (a.statut === 'en_attente_validation' && b.statut !== 'en_attente_validation') return -1
        if (a.statut !== 'en_attente_validation' && b.statut === 'en_attente_validation') return 1
        return 0
      })
      
      setDocuments(sorted)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleValidate = async (id: string) => {
    setProcessing(id)
    try {
      await validateDocument(id)
      setDocuments(docs => docs.map(d => d.id === id ? { ...d, statut: 'publie' } : d))
      setIsModalOpen(false)
      alert("Document publié avec succès")
    } catch (err: any) {
      alert("Erreur: " + err.message)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (id: string, reason?: string) => {
    if (!reason) return // Modal forces reason
    setProcessing(id)
    try {
      await rejectDocument(id, reason)
      setDocuments(docs => docs.map(d => d.id === id ? { ...d, statut: 'rejete' } : d))
      setIsModalOpen(false)
      alert("Document refusé. Un email a été envoyé à l'auteur.")
    } catch (err: any) {
      alert("Erreur: " + err.message)
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce document ?")) return
    setProcessing(id)
    try {
      await deleteDocumentAdmin(id)
      setDocuments(docs => docs.filter(d => d.id !== id))
      alert("Document supprimé")
    } catch (err: any) {
      alert("Erreur: " + err.message)
    } finally {
      setProcessing(null)
    }
  }

  const openDetails = (doc: DocumentAdmin) => {
    setSelectedDoc(doc)
    setIsModalOpen(true)
  }

  const getStatusBadge = (statut: string) => {
    switch(statut) {
      case 'en_attente_validation': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-warning-container text-on-warning-container">En attente</span>
      case 'publie': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-success-container text-on-success-container">Publié</span>
      case 'rejete': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-error-container text-on-error-container">Rejeté</span>
      default: return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-surface-container text-on-surface">{statut}</span>
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Modération des documents</h1>
          <p className="text-on-surface-muted">Gérez les documents et publiez-en de nouveaux dans la bibliothèque.</p>
        </div>
        <button 
          onClick={() => setIsSubmitModalOpen(true)}
          className="bg-info hover:bg-info text-on-surface-brand px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium shrink-0"
        >
          <Plus className="size-5" /> Nouveau document
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-container text-error rounded-lg flex items-start gap-3 text-sm">
          <AlertTriangle className="size-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-outline-variant">
            <thead className="bg-surface-container-low">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-on-surface-muted uppercase tracking-wider">Document</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-on-surface-muted uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-on-surface-muted uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-on-surface-muted uppercase tracking-wider">Statut</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-on-surface-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-surface-container-lowest divide-y divide-outline-variant">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="size-6 animate-spin text-on-surface-muted mx-auto" />
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-muted">
                    Aucun document trouvé.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className={doc.statut === 'en_attente_validation' ? 'bg-warning-container/30' : ''}>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <FileText className="size-5 text-on-surface-muted mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-on-surface line-clamp-1">{doc.titre}</div>
                          <div className="text-sm text-on-surface-muted">{doc.auteurs}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-on-surface">{labelType(doc.type_doc)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-muted">
                      {doc.created_at ? new Date(doc.created_at).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(doc.statut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openDetails(doc)}
                          className="p-2 text-info hover:text-info bg-info-container hover:bg-info-container rounded-lg transition-colors"
                          title="Voir les détails et modérer"
                        >
                          <Eye className="size-4" />
                        </button>
                        
                        {(doc.statut === 'rejete' || doc.statut === 'en_attente_validation') && (
                           <button 
                             onClick={() => handleDelete(doc.id)}
                             disabled={processing === doc.id}
                             className="p-2 text-on-surface-muted hover:text-error bg-surface-container-low hover:bg-error-container rounded-lg transition-colors"
                             title="Supprimer définitivement"
                           >
                             {processing === doc.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                           </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DocumentDetailsModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedDoc(null)
        }}
        document={selectedDoc}
        onValidate={handleValidate}
        onReject={handleReject}
        processing={!!processing}
      />

      <SubmitDocumentModal 
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSuccess={() => {
          setIsSubmitModalOpen(false)
          fetchDocuments()
        }}
      />
    </div>
  )
}
