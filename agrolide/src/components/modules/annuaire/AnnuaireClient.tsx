'use client'

import React, { useState, useEffect } from 'react'
import MemberCard from './MemberCard'
import { SkeletonGrid } from "@/components/ui/Skeleton"
import { Search, Filter, Loader2, ChevronLeft, ChevronRight, X, ChevronDown, Users, CheckCircle2 } from 'lucide-react'
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
  
  // Custom dropdown states
  const [isPaysOpen, setIsPaysOpen] = useState(false)
  const [paysSearch, setPaysSearch] = useState('')

  // Options statiques pour les filtres (dans un cas réel, on pourrait les fetcher)
  const paysOptions = ["Sénégal", "Côte d'Ivoire", "Cameroun", "Bénin", "Togo", "Mali", "Burkina Faso", "Guinée", "Congo", "Gabon", "RDC", "Madagascar", "Maroc", "Tunisie", "Algérie", "France", "Canada"]
  const catOptions = ["Passionné", "Junior", "Professionnel", "Partenaire", "Sénior"]
  const specOptions = ["Productions végétales", "Élevage", "Transformation", "Agroéconomie", "Agritech", "Environnement", "Logistique", "Commerce", "Recherche"]

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

  // Fermer le menu dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isPaysOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.pays-dropdown-container')) {
          setIsPaysOpen(false);
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isPaysOpen]);

  return (
    <div className="pb-12">
      {/* Banner Premium */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 rounded-3xl p-8 md:p-12 mb-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-4 leading-tight">L'Annuaire des Membres</h1>
          <p className="text-primary-100 text-lg md:text-xl font-medium">Découvrez et connectez-vous avec les leaders, experts et entrepreneurs qui façonnent l'agriculture africaine de demain.</p>
        </div>
        <div className="relative z-10 shrink-0 w-32 h-32 md:w-40 md:h-40 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
          <Users className="w-16 h-16 md:w-20 md:h-20 text-white/90" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <div className={`md:w-72 shrink-0 ${showFiltersMobile ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden md:block'}`}>
          <div className="flex items-center justify-between md:hidden mb-8 pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-extrabold font-heading text-gray-900">Filtres</h2>
            <button onClick={() => setShowFiltersMobile(false)} className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8 md:sticky md:top-24 bg-white md:p-6 md:rounded-3xl md:border md:border-gray-100 md:shadow-sm">
            
            {/* Recherche */}
            <div>
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3 block">Recherche</label>
              <div className="relative group">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Nom, spécialité..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white outline-none text-sm transition-all"
                />
              </div>
            </div>

            {/* Mentorat */}
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-gradient-to-r from-purple-50 to-white rounded-xl border border-purple-100 hover:border-purple-300 hover:shadow-sm transition-all group">
              <input 
                type="checkbox" 
                checked={mentoratOnly}
                onChange={e => { setMentoratOnly(e.target.checked); setPage(1); }}
                className="w-5 h-5 text-purple-600 rounded-md border-gray-300 focus:ring-purple-500"
              />
              <span className="text-sm font-bold text-purple-900 group-hover:text-purple-950">Ouverts au mentorat</span>
            </label>

            {/* Pays (Dropdown avec recherche intégrée) */}
            <div className="pays-dropdown-container relative">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3 block flex items-center justify-between">
                Pays
                {selectedPays.length > 0 && (
                  <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-[10px]">
                    {selectedPays.length}
                  </span>
                )}
              </label>
              <button 
                onClick={() => setIsPaysOpen(!isPaysOpen)}
                className={`w-full bg-white border ${isPaysOpen ? 'border-primary-500 ring-2 ring-primary-50' : 'border-gray-200'} rounded-xl px-4 py-3 text-left text-sm text-gray-700 flex justify-between items-center hover:border-primary-300 hover:bg-gray-50 transition-all`}
              >
                <span className="truncate font-medium">
                  {selectedPays.length === 0 ? "Tous les pays" : `${selectedPays.length} pays sélectionné(s)`}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isPaysOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isPaysOpen && (
                <div className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Rechercher un pays..." 
                        value={paysSearch}
                        onChange={(e) => setPaysSearch(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg text-sm pl-9 pr-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
                    {paysOptions.filter(p => p.toLowerCase().includes(paysSearch.toLowerCase())).map(p => (
                      <label key={p} className="flex items-center gap-3 cursor-pointer p-2.5 hover:bg-primary-50 rounded-lg transition-colors group">
                        <input 
                          type="checkbox"
                          checked={selectedPays.includes(p)}
                          onChange={() => toggleFilter(selectedPays, setSelectedPays, p)}
                          className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 transition-colors"
                        />
                        <span className={`text-sm ${selectedPays.includes(p) ? 'font-bold text-primary-700' : 'text-gray-700 group-hover:text-gray-900'}`}>{p}</span>
                      </label>
                    ))}
                    {paysOptions.filter(p => p.toLowerCase().includes(paysSearch.toLowerCase())).length === 0 && (
                      <div className="p-4 text-center text-sm text-gray-500">Aucun pays trouvé</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Catégories */}
            <div>
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3 block">Catégorie</label>
              <div className="space-y-1.5">
                {catOptions.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <input 
                      type="checkbox"
                      checked={selectedCategories.includes(cat.toLowerCase())}
                      onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat.toLowerCase())}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 transition-colors"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Spécialités */}
            <div>
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3 block">Spécialité</label>
              <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                {specOptions.map(spec => (
                  <label key={spec} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <input 
                      type="checkbox"
                      checked={selectedSpecialites.includes(spec)}
                      onChange={() => toggleFilter(selectedSpecialites, setSelectedSpecialites, spec)}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 transition-colors"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 w-full">
          
          {/* Header Mobile & Stats Desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-white p-4 sm:px-6 rounded-2xl border border-gray-100 shadow-sm gap-4">
            <div className="text-gray-600 flex items-center gap-3 w-full sm:w-auto">
              {loading ? (
                <span className="flex items-center gap-2 font-medium text-primary-600"><Loader2 className="w-5 h-5 animate-spin"/> Actualisation...</span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {totalCount}
                  </span>
                  <span className="font-medium">membres trouvés</span>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setShowFiltersMobile(true)}
              className="md:hidden w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold bg-primary-50 text-primary-700 px-5 py-2.5 rounded-xl hover:bg-primary-100 transition-colors"
            >
              <Filter className="w-4 h-4" /> Filtres de recherche
            </button>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="py-8">
              <SkeletonGrid count={8} />
            </div>
          ) : members.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Aucun membre trouvé</h3>
              <p className="text-gray-500 max-w-md">Nous n'avons trouvé aucun membre correspondant à vos critères. Essayez d'élargir votre recherche.</p>
              <button onClick={() => {
                setSearch('');
                setSelectedPays([]);
                setSelectedCategories([]);
                setSelectedSpecialites([]);
                setMentoratOnly(false);
              }} className="mt-6 text-primary-600 font-bold hover:underline">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {members.map(member => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-14 flex justify-center items-center gap-4">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-200 hover:border-primary-300 hover:text-primary-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-bold text-gray-600 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
                    Page <span className="text-gray-900">{page}</span> sur {totalPages}
                  </span>
                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-200 hover:border-primary-300 hover:text-primary-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
          
        </div>
      </div>
    </div>
  )
}
