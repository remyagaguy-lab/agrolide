'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { CheckCircle, XCircle, Clock, Eye, Trash2, Loader2 } from 'lucide-react'
import { validateOpportunity, rejectOpportunity, deleteOpportunityAdmin } from '@/app/actions/admin-opportunites'
import { OpportunityDetailsModal } from '@/components/modules/admin/OpportunityDetailsModal'

export default function AdminOpportunitesPage() {
  const [opportunites, setOpportunites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  
  const [selectedOpp, setSelectedOpp] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchOpportunites = async () => {
    setLoading(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data } = await supabase
      .from('opportunites')
      .select('*, auteur:profiles!opportunites_publie_par_fkey(prenom, nom)')
      .order('created_at', { ascending: false })
      
    if (data) setOpportunites(data)
    setLoading(false)
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Modération des Opportunités</h1>
        <p className="text-gray-500">Validez ou rejetez les offres soumises par les membres.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-2" />
            <span className="text-gray-500">Chargement...</span>
          </div>
        ) : opportunites.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Aucune opportunité soumise.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Titre & Détails</th>
                  <th className="px-6 py-4 font-semibold">Soumis par</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {opportunites.map((opp) => (
                  <tr key={opp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{opp.titre}</div>
                      <div className="text-gray-500 text-xs mt-1 capitalize">{opp.type_opp}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">
                        {opp.auteur ? `${opp.auteur.prenom} ${opp.auteur.nom}` : 'Utilisateur inconnu'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        opp.statut === 'publie' ? 'bg-green-100 text-green-700' :
                        opp.statut === 'rejete' ? 'bg-red-100 text-red-700' :
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
                          className="p-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Voir les détails et modérer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {(opp.statut === 'en_attente' || opp.statut === 'rejete') && (
                          <button 
                            onClick={() => handleDelete(opp.id)}
                            disabled={processing === opp.id}
                            className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"
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
        onClose={() => setIsModalOpen(false)}
        opportunity={selectedOpp}
        onValidate={handleValidate}
        onReject={handleReject}
        processing={!!processing}
      />
    </div>
  )
}
