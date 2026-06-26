'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import OpportunityCard from './OpportunityCard'
import SubmitOpportunityModal from './SubmitOpportunityModal'
import { Plus, Search, Filter } from 'lucide-react'

export default function OpportunitesClient() {
  const [opportunites, setOpportunites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  const [activeTab, setActiveTab] = useState<'toutes' | 'mes_soumissions'>('toutes')
  const [filterType, setFilterType] = useState('tous')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
    
    let query = supabase.from('opportunites').select('*').order('created_at', { ascending: false })
    
    if (activeTab === 'toutes') {
      // Afficher seulement celles publiées
      query = query.eq('statut', 'publie')
    } else if (activeTab === 'mes_soumissions' && user) {
      // Afficher les soumissions de l'utilisateur (quel que soit le statut)
      query = query.eq('publie_par', user.id)
    }

    const { data } = await query
    if (data) setOpportunites(data)
    
    setLoading(false)
  }

  // Filtrage local
  let filteredOpp = opportunites.filter(o => {
    if (filterType !== 'tous' && o.type_opp !== filterType) return false
    if (search && !o.titre.toLowerCase().includes(search.toLowerCase()) && !o.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bourse aux Opportunités</h1>
          <p className="text-gray-600 mt-2">Trouvez ou proposez des emplois, financements et partenariats.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" /> Proposer une opportunité
        </button>
      </div>

      {/* Tabs */}
      {currentUser && (
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('toutes')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'toutes' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Toutes les opportunités
          </button>
          <button
            onClick={() => setActiveTab('mes_soumissions')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'mes_soumissions' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Mes soumissions
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Rechercher par mot-clé..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select 
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 bg-gray-50 outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="tous">Tous les types</option>
            <option value="emploi">Emplois / Stages</option>
            <option value="financement">Financements</option>
            <option value="partenariat">Partenariats</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center text-gray-500">Chargement...</div>
      ) : filteredOpp.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Aucune opportunité trouvée pour vos critères.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpp.map(opp => (
            <div key={opp.id} className="relative">
              <OpportunityCard opp={opp} />
              {activeTab === 'mes_soumissions' && (
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    opp.statut === 'publie' ? 'bg-green-100 text-green-700' :
                    opp.statut === 'rejete' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {opp.statut.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <SubmitOpportunityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  )
}
