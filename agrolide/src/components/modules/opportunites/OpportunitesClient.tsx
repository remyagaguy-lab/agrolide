'use client'

import React, { useState, useEffect } from 'react'
import OpportunityCard from './OpportunityCard'
import SubmitOpportunityModal from './SubmitOpportunityModal'
import { SkeletonGrid } from "@/components/ui/Skeleton"

import { Plus, Search, SlidersHorizontal } from "@/components/ui/icons"
/** `initial` : opportunités publiées, lues côté serveur — la liste est déjà là au premier affichage. */
export default function OpportunitesClient({ initial }: { initial?: any[] }) {
  const [opportunites, setOpportunites] = useState<any[]>(initial ?? [])
  const [loading, setLoading] = useState(initial === undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [filterType, setFilterType] = useState('tous')
  const [search, setSearch] = useState('')

  // La liste du premier affichage vient du serveur ; sans elle (ou après une proposition), on la lit ici.
  useEffect(() => {
    if (initial === undefined) void fetchData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    setLoading(true)
    try {
      const { getOpportunites } = await import('@/app/actions/opportunites')
      const data = await getOpportunites()
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
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface font-heading">Bourse aux Opportunités</h1>
          <p className="text-xs text-on-surface-muted mt-1">Trouvez ou proposez des emplois, financements et partenariats.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-on-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="size-4" /> Proposer une opportunité
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="size-4 text-on-surface-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Rechercher par mot-clé..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded-xl focus:ring-2 focus:ring-accent-leaf/30 focus:border-accent-leaf outline-none bg-surface-container-low text-sm transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <SlidersHorizontal className="size-4 text-on-surface-muted hidden md:block" />
          <select 
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="w-full md:w-auto border border-outline-variant rounded-xl px-4 py-2 bg-surface-container-low outline-none focus:ring-2 focus:ring-accent-leaf/30 text-sm font-medium text-on-surface-variant transition-all"
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
        <div className="py-16 text-center bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-8">
          <p className="text-on-surface-muted font-medium text-sm">Aucune opportunité trouvée pour vos critères.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpp.map(opp => (
            <div key={opp.id} className="relative">
              <OpportunityCard opp={opp} />
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
