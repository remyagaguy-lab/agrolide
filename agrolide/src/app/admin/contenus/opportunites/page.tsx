'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

export default function AdminOpportunitesPage() {
  const [opportunites, setOpportunites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  const handleUpdateStatut = async (id: string, newStatut: string) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    await supabase
      .from('opportunites')
      .update({ statut: newStatut })
      .eq('id', id)
      
    fetchOpportunites()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer définitivement ?")) return
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    await supabase.from('opportunites').delete().eq('id', id)
    fetchOpportunites()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modération des Opportunités</h1>
          <p className="text-gray-500">Validez ou rejetez les offres soumises par les membres.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Chargement...</div>
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
                        {opp.statut === 'en_attente' && (
                          <>
                            <button onClick={() => handleUpdateStatut(opp.id, 'publie')} className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-lg text-xs transition-colors">
                              Publier
                            </button>
                            <button onClick={() => handleUpdateStatut(opp.id, 'rejete')} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg text-xs transition-colors">
                              Rejeter
                            </button>
                          </>
                        )}
                        <button onClick={() => handleDelete(opp.id)} className="px-3 py-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 font-medium rounded-lg text-xs transition-colors">
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
