'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import OpportunityCard from './OpportunityCard'
import SubmitOpportunityModal from './SubmitOpportunityModal'
import { Plus, Search, Filter } from 'lucide-react'
import { SkeletonGrid } from "@/components/ui/Skeleton"

export default function OpportunitesClient() {
  const [opportunites, setOpportunites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user, isLoaded } = useUser()
  const currentUser = isLoaded ? user : null

  const [activeTab, setActiveTab] = useState<'toutes' | 'mes_soumissions'>('toutes')
  const [filterType, setFilterType] = useState('tous')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { getOpportunites } = await import('@/app/actions/opportunites')
      const data = await getOpportunites(activeTab)
      if (data) setOpportunites(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Filtrage local
  let filteredOpp = opportunites.filter(o => {
    if (filterType !== 'tous' && o.type_opp !== filterType) return false
    if (search && !o.titre.toLowerCase().includes(search.toLowerCase()) && !o.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-[1600px] mx-auto px-2 md:px-4 py-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="dash-page-title">Bourse aux Opportunités</h1>
          <p className="text-gray-500 mt-2 text-sm">Trouvez ou proposez des emplois, financements et partenariats.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-dash"
        >
          <Plus className="w-5 h-5" /> Proposer une opportunité
        </button>
      </div>

      {/* Tabs */}
      {currentUser && (
        <div className="flex bg-gray-50/50 p-1 rounded-full w-fit border border-gray-100">
          <button
            onClick={() => setActiveTab('toutes')}
            className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all ${activeTab === 'toutes' ? 'bg-white text-[#1b5e38] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Toutes les opportunités
          </button>
          <button
            onClick={() => setActiveTab('mes_soumissions')}
            className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all ${activeTab === 'mes_soumissions' ? 'bg-white text-[#1b5e38] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Mes soumissions
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="card-glass p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Rechercher par mot-clé..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-[#50a853]/30 focus:border-[#50a853] outline-none bg-gray-50/50"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-400 hidden md:block" />
          <select 
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="w-full md:w-auto border border-gray-200 rounded-full px-4 py-2.5 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#50a853]/30 text-sm font-medium text-gray-700"
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
        <div className="py-8">
          <SkeletonGrid count={6} />
        </div>
      ) : filteredOpp.length === 0 ? (
        <div className="py-20 text-center card-glass">
          <p className="text-gray-500 font-medium">Aucune opportunité trouvée pour vos critères.</p>
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
