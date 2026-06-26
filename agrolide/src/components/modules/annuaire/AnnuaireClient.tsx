'use client'

import React, { useState, useEffect } from 'react'
import MemberCard from './MemberCard'
import { Search, Filter, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useDebounce } from 'use-debounce'

export default function AnnuaireClient() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  
  // Filters
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  
  const [selectedPays, setSelectedPays] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSpecialites, setSelectedSpecialites] = useState<string[]>([])
  const [mentoratOnly, setMentoratOnly] = useState(false)
  
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)

  // Options statiques pour les filtres (dans un cas réel, on pourrait les fetcher)
  const paysOptions = ["Sénégal", "Côte d'Ivoire", "Cameroun", "Bénin", "Togo", "Mali", "Burkina Faso", "Guinée", "Congo"]
  const catOptions = ["Junior", "Professionnel", "Partenaire", "Senior"]
  const specOptions = ["Productions végétales", "Élevage", "Transformation", "Agroéconomie", "Agritech", "Environnement"]

  useEffect(() => {
    fetchMembers()
  }, [debouncedSearch, selectedPays, selectedCategories, selectedSpecialites, mentoratOnly, page])

  const fetchMembers = async () => {
    setLoading(true)
    
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('q', debouncedSearch)
    if (selectedPays.length) params.set('pays', selectedPays.join(','))
    if (selectedCategories.length) params.set('categories', selectedCategories.join(','))
    if (selectedSpecialites.length) params.set('specialites', selectedSpecialites.join(','))
    if (mentoratOnly) params.set('mentorat', 'true')
    params.set('page', page.toString())

    try {
      const res = await fetch(`/api/annuaire?${params.toString()}`)
      const data = await res.json()
      if (data.data) {
        setMembers(data.data)
        setTotalCount(data.count)
        setTotalPages(data.totalPages)
      }
    } catch (err) {
      console.error("Erreur de fetch:", err)
    }
    setLoading(false)
  }

  const toggleFilter = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item))
    } else {
      setList([...list, item])
    }
    setPage(1) // Reset pagination
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className={`md:w-72 shrink-0 ${showFiltersMobile ? 'fixed inset-0 z-50 bg-white p-4 overflow-y-auto' : 'hidden md:block'}`}>
        <div className="flex items-center justify-between md:hidden mb-6">
          <h2 className="text-xl font-bold">Filtres</h2>
          <button onClick={() => setShowFiltersMobile(false)} className="p-2 bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-8 sticky top-24">
          
          {/* Recherche */}
          <div>
            <label className="text-sm font-bold text-gray-900 mb-2 block">Recherche</label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Nom, spécialité..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm"
              />
            </div>
          </div>

          {/* Mentorat */}
          <label className="flex items-center gap-3 cursor-pointer p-3 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors">
            <input 
              type="checkbox" 
              checked={mentoratOnly}
              onChange={e => { setMentoratOnly(e.target.checked); setPage(1); }}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-bold text-purple-900">Ouverts au mentorat</span>
          </label>

          {/* Catégories */}
          <div>
            <label className="text-sm font-bold text-gray-900 mb-3 block">Catégorie</label>
            <div className="space-y-2">
              {catOptions.map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={selectedCategories.includes(cat.toLowerCase())}
                    onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat.toLowerCase())}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Spécialités */}
          <div>
            <label className="text-sm font-bold text-gray-900 mb-3 block">Spécialité</label>
            <div className="space-y-2">
              {specOptions.map(spec => (
                <label key={spec} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={selectedSpecialites.includes(spec)}
                    onChange={() => toggleFilter(selectedSpecialites, setSelectedSpecialites, spec)}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{spec}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pays */}
          <div>
            <label className="text-sm font-bold text-gray-900 mb-3 block">Pays</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {paysOptions.map(p => (
                <label key={p} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={selectedPays.includes(p)}
                    onChange={() => toggleFilter(selectedPays, setSelectedPays, p)}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{p}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        
        {/* Header Mobile / Stats */}
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-600">
            {loading ? (
              <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Recherche...</span>
            ) : (
              <span className="font-bold text-gray-900">{totalCount} membres trouvés</span>
            )}
          </div>
          
          <button 
            onClick={() => setShowFiltersMobile(true)}
            className="md:hidden flex items-center gap-2 text-sm font-medium bg-gray-100 px-4 py-2 rounded-lg"
          >
            <Filter className="w-4 h-4" /> Filtres
          </button>
        </div>

        {/* Grid */}
        {loading && members.length === 0 ? (
          <div className="py-20 text-center text-gray-500">Chargement de l'annuaire...</div>
        ) : members.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun membre trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos filtres de recherche.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {members.map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium text-gray-600">
                  Page {page} sur {totalPages}
                </span>
                <button 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
        
      </div>
    </div>
  )
}
