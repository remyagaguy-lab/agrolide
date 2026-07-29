'use client'

import React from 'react'
import { X, Briefcase, MapPin, Calendar, DollarSign, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface OpportunityAdmin {
  id: string
  titre: string
  description: string
  type_opp: string
  lieu: string
  date_limite?: string
  montant?: string
  lien_externe?: string
  statut: string
  auteur?: { prenom: string; nom: string }
}

interface OpportunityDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  opportunity: OpportunityAdmin | null
  onValidate: (id: string) => void
  onReject: (id: string) => void
  processing: boolean
}

export function OpportunityDetailsModal({ isOpen, onClose, opportunity, onValidate, onReject, processing }: OpportunityDetailsModalProps) {
  if (!isOpen || !opportunity) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-gray-400" />
            Détails de l'opportunité
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                  {opportunity.type_opp}
                </span>
                <span className="text-sm text-gray-500">
                  Soumis par : <span className="font-medium text-gray-900">{opportunity.auteur ? `${opportunity.auteur.prenom} ${opportunity.auteur.nom}` : 'Utilisateur inconnu'}</span>
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{opportunity.titre}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
              {opportunity.lieu && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Lieu</div>
                    <div className="text-sm font-medium text-gray-900">{opportunity.lieu}</div>
                  </div>
                </div>
              )}
              {opportunity.date_limite && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Date Limite</div>
                    <div className="text-sm font-medium text-gray-900">
                      {format(new Date(opportunity.date_limite), "dd MMMM yyyy", { locale: fr })}
                    </div>
                  </div>
                </div>
              )}
              {opportunity.montant && (
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Montant / Budget</div>
                    <div className="text-sm font-medium text-gray-900">{opportunity.montant}</div>
                  </div>
                </div>
              )}
              {opportunity.lien_externe && (
                <div className="flex items-start gap-2">
                  <LinkIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase">Lien Externe</div>
                    <a href={opportunity.lien_externe} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline line-clamp-1">
                      {opportunity.lien_externe}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Description complète</h3>
              <div className="bg-white p-0 text-gray-700 text-sm whitespace-pre-wrap">
                {opportunity.description || <span className="text-gray-400 italic">Aucune description fournie</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={processing}>
            Fermer
          </Button>
          {opportunity.statut === 'en_attente' && (
            <>
              <Button 
                onClick={() => onReject(opportunity.id)} 
                disabled={processing}
                className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-0"
              >
                {processing ? 'En cours...' : 'Rejeter'}
              </Button>
              <Button 
                onClick={() => onValidate(opportunity.id)} 
                disabled={processing}
              >
                {processing ? 'En cours...' : 'Publier l\'opportunité'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
