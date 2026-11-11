'use client'

import React, { useState, useEffect } from 'react'

import { CheckCircle, XCircle, Clock, Eye, Trash2, Loader2, Plus } from 'lucide-react'
import { validateOpportunity, rejectOpportunity, deleteOpportunityAdmin } from '@/app/actions/admin-opportunites'
import SubmitOpportunityModal from '@/components/modules/opportunites/SubmitOpportunityModal'
import { OpportunityDetailsModal } from '@/components/modules/admin/OpportunityDetailsModal'

export const dynamic = 'force-dynamic';

export default function AdminOpportunitesPage() {
  const [opportunites, setOpportunites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  
  const [selectedOpp, setSelectedOpp] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)

  const fetchOpportunites = async () => {
    setLoading(true)
    try {
      const { getAdminOpportunites } = await import('@/app/actions/admin-opportunites')
      const data = await getAdminOpportunites()
      if (data) setOpportunites(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOpportunites()
  }, [])

  const handleValidate = async (id: string) => {
    setProcessing(id)
    try {
      await validateOpportunity(id)
      setOpportunites(opps => opps.map(o => o.id === id ? { ...o, statut: 'publie' } : o))
      setIsModalOpen(false)
      alert("L'opportunité a été publiée.")
    } catch (err: any) {
      alert("Erreur: " + err.message)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessing(id)
    try {
      await rejectOpportunity(id)
      setOpportunites(opps => opps.map(o => o.id === id ? { ...o, statut: 'rejete' } : o))
      setIsModalOpen(false)
      alert("L'opportunité a été rejetée.")
    } catch (err: any) {
      alert("Erreur: " + err.message)
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer définitivement cette opportunité ?")) return
    setProcessing(id)
    try {
      await deleteOpportunityAdmin(id)
      setOpportunites(opps => opps.filter(o => o.id !== id))
      alert("L'opportunité a été supprimée.")
    } catch (err: any) {
      alert("Erreur: " + err.message)
    } finally {
      setProcessing(null)
    }
  }

  const openDetails = (opp: any) => {
    setSelectedOpp(opp)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Modération des Opportunités</h1>
          <p className="text-on-surface-muted">Gérez les offres soumises par les membres et publiez-en de nouvelles.</p>
        </div>
        <button 
          onClick={() => setIsSubmitModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium shrink-0"
        >
          <Plus className="w-5 h-5" /> Nouvelle opportunité
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-on-surface-muted mb-2" />
            <span className="text-on-surface-muted">Chargement...</span>
          </div>
        ) : opportunites.length === 0 ? (
          <div className="p-12 text-center text-on-surface-muted">Aucune opportunité soumise.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-4 font-semibold">Titre & Détails</th>
                  <th className="px-6 py-4 font-semibold">Soumis par</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {opportunites.map((opp) => (
                  <tr key={opp.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-on-surface">{opp.titre}</div>
                      <div className="text-on-surface-muted text-xs mt-1 capitalize">{opp.type_opp}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-on-surface font-medium">
                        {opp.auteur ? `${opp.auteur.prenom} ${opp.auteur.nom}` : 'Utilisateur inconnu'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        opp.statut === 'publie' ? 'bg-success-container text-success' :
                        opp.statut === 'rejete' ? 'bg-error-container text-error' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {opp.statut === 'publie' && <CheckCircle className="w-3.5 h-3.5" />}
                        {opp.statut === 'rejete' && <XCircle className="w-3.5 h-3.5" />}
                        {opp.statut === 'en_attente' && <Clock className="w-3.5 h-3.5" />}
                        {opp.statut.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openDetails(opp)}
                          className="p-2 text-info hover:text-info bg-info-container hover:bg-info-container rounded-lg transition-colors"
                          title="Voir les détails et modérer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {(opp.statut === 'en_attente' || opp.statut === 'rejete') && (
                          <button 
                            onClick={() => handleDelete(opp.id)}
                            disabled={processing === opp.id}
                            className="p-2 text-on-surface-muted hover:text-error bg-surface-container-low hover:bg-error-container rounded-lg transition-colors"
                            title="Supprimer définitivement"
                          >
                            {processing === opp.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OpportunityDetailsModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedOpp(null)
        }}
        opportunity={selectedOpp}
        onValidate={handleValidate}
        onReject={handleReject}
        processing={!!processing}
      />

      <SubmitOpportunityModal 
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSuccess={() => {
          setIsSubmitModalOpen(false)
          fetchOpportunites()
        }}
        isAdmin={true}
      />
    </div>
  )
}
