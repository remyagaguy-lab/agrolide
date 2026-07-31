'use client'

import React from 'react'
import { X, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface DocumentAdmin {
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

interface DocumentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  document: DocumentAdmin | null
  onValidate: (id: string) => void
  onReject: (id: string, reason?: string) => void
  processing: boolean
}

export function DocumentDetailsModal({ isOpen, onClose, document, onValidate, onReject, processing }: DocumentDetailsModalProps) {
  const [isRejecting, setIsRejecting] = React.useState(false)
  const [rejectReason, setRejectReason] = React.useState('')

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setIsRejecting(false)
      setRejectReason('')
    }
  }, [isOpen])

  if (!isOpen || !document) return null

  const handleReject = () => {
    if (isRejecting) {
      onReject(document.id, rejectReason)
    } else {
      setIsRejecting(true)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" />
            Détails du document
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Titre</h3>
              <p className="text-gray-900 font-medium text-lg">{document.titre}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Auteurs</h3>
                <p className="text-gray-900">{document.auteurs}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Type</h3>
                <p className="text-gray-900 capitalize">{document.type_doc?.replace('_', ' ')}</p>
              </div>
              {document.thematique && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Thématique</h3>
                  <p className="text-gray-900 capitalize">{document.thematique}</p>
                </div>
              )}
              {document.pays && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Pays</h3>
                  <p className="text-gray-900">{document.pays}</p>
                </div>
              )}
            </div>

            {document.resume && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Résumé</h3>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm whitespace-pre-wrap">
                  {document.resume}
                </div>
              </div>
            )}
            
            {isRejecting && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                <label className="block text-sm font-medium text-red-800 mb-2">
                  Motif du refus (sera envoyé à l'auteur par email)
                </label>
                <textarea
                  className="w-full p-3 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  rows={3}
                  placeholder="Expliquez brièvement pourquoi ce document est refusé..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
                <div className="mt-3 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsRejecting(false)} className="bg-white">Annuler</Button>
                  <Button onClick={handleReject} disabled={processing || !rejectReason.trim()} className="bg-red-600 hover:bg-red-700 text-white border-0">
                    Confirmer le refus
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <div>
             <a href={`/bibliotheque/${document.id}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-[var(--color-vert-principal)] hover:underline flex items-center gap-1">
                <FileText className="w-4 h-4" /> Voir la page du document
             </a>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={processing}>
              Fermer
            </Button>
            {document.statut === 'en_attente_validation' && !isRejecting && (
              <>
                <Button 
                  onClick={handleReject} 
                  disabled={processing}
                  className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-0"
                >
                  {processing ? 'En cours...' : 'Refuser'}
                </Button>
                <Button 
                  onClick={() => onValidate(document.id)} 
                  disabled={processing}
                >
                  {processing ? 'En cours...' : 'Publier le document'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
