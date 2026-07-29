'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Check, X, Eye, FileText, Loader2, AlertCircle, Trash2, Plus } from 'lucide-react'
import { validateDocument, rejectDocument, deleteDocumentAdmin } from '@/app/actions/admin-documents'
import { DocumentDetailsModal } from '@/components/modules/admin/DocumentDetailsModal'
import SubmitDocumentModal from '@/components/modules/admin/SubmitDocumentModal'

export const dynamic = 'force-dynamic';

type DocumentAdmin = {
  id: string
  titre: string
  auteurs: string
  type_doc: string
  statut: string
  created_at: string
  resume?: string
  thematique?: string
  pays?: string
  filiere?: string
  langue?: string
  annee?: number
  fichier_r2_key?: string
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
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })
        
      if (error) throw error
      
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
      case 'en_attente_validation': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">En attente</span>
      case 'publie': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Publié</span>
      case 'rejete': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejeté</span>
      default: return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{statut}</span>
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modération des documents</h1>
          <p className="text-gray-500">Gérez les documents et publiez-en de nouveaux dans la bibliothèque.</p>
        </div>
        <button 
          onClick={() => setIsSubmitModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium shrink-0"
        >
          <Plus className="w-5 h-5" /> Nouveau document
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Aucun document trouvé.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className={doc.statut === 'en_attente_validation' ? 'bg-amber-50/30' : ''}>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">{doc.titre}</div>
                          <div className="text-sm text-gray-500">{doc.auteurs}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{doc.type_doc}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(doc.statut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openDetails(doc)}
                          className="p-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Voir les détails et modérer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {(doc.statut === 'rejete' || doc.statut === 'en_attente_validation') && (
                           <button 
                             onClick={() => handleDelete(doc.id)}
                             disabled={processing === doc.id}
                             className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"
                             title="Supprimer définitivement"
                           >
                             {processing === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
