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
      const res = await fetch(`/api/annuaire?${params.toString()}`, { cache: 'no-store' })
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
      <div className="bg-surface-brand rounded-2xl p-6 md:px-8 md:py-6 mb-6 text-on-surface-brand shadow-sm relative overflow-hidden flex items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
        <div className="relative z-10 max-w-xl">
          <h1 className="text-xl md:text-2xl font-bold font-heading text-white mb-1">Annuaire des Membres</h1>
          <p className="text-white/80 text-xs md:text-sm">Découvrez et connectez-vous avec les acteurs de l'agriculture africaine.</p>
        </div>
        <div className="relative z-10 hidden sm:flex shrink-0 w-12 h-12 bg-white/10 rounded-xl items-center justify-center border border-white/20">
          <Users className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <div className={`md:w-72 shrink-0 ${showFiltersMobile ? 'fixed inset-0 z-50 bg-surface-container-lowest p-6 overflow-y-auto' : 'hidden md:block'}`}>
          <div className="flex items-center justify-between md:hidden mb-8 pb-4 border-b border-outline-variant">
            <h2 className="text-2xl font-extrabold font-heading text-on-surface">Filtres</h2>
            <button onClick={() => setShowFiltersMobile(false)} className="p-2 bg-surface-container-low hover:bg-surface-container text-on-surface-muted rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6 md:sticky md:top-24 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm md:p-5">
            
            {/* Recherche */}
            <div>
              <label className="text-label-sm font-bold uppercase tracking-wider text-on-surface-muted mb-3 block">Recherche</label>
              <div className="relative group">
                <Search className="w-5 h-5 text-on-surface-muted absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Nom, spécialité..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant rounded-2xl focus:ring-2 focus:ring-accent-leaf/30 focus:border-accent-leaf focus:bg-surface-container-lowest outline-none text-sm transition-all"
                />
              </div>
            </div>

            {/* Mentorat */}
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-tertiary-container rounded-2xl border border-tertiary/20 hover:border-tertiary/40 hover:shadow-sm transition-all group">
              <input 
                type="checkbox" 
                checked={mentoratOnly}
                onChange={e => { setMentoratOnly(e.target.checked); setPage(1); }}
                className="w-5 h-5 text-on-tertiary-container rounded-md border-outline focus:ring-tertiary"
              />
              <span className="text-sm font-bold text-on-surface group-hover:text-on-surface">Ouverts au mentorat</span>
            </label>

            {/* Pays (Dropdown avec recherche intégrée) */}
            <div className="pays-dropdown-container relative">
              <label className="text-label-sm font-bold uppercase tracking-wider text-on-surface-muted mb-3 block flex items-center justify-between">
                Pays
                {selectedPays.length > 0 && (
                  <span className="bg-success-container text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {selectedPays.length}
                  </span>
                )}
              </label>
              <button 
                onClick={() => setIsPaysOpen(!isPaysOpen)}
                className={`w-full bg-surface-container-lowest border ${isPaysOpen ? 'border-accent-leaf ring-2 ring-accent-leaf/10' : 'border-outline-variant'} rounded-2xl px-4 py-3 text-left text-sm text-on-surface-variant flex justify-between items-center hover:border-accent-leaf/50 hover:bg-surface-container-low transition-all`}
              >
                <span className="truncate font-medium">
                  {selectedPays.length === 0 ? "Tous les pays" : `${selectedPays.length} pays sélectionné(s)`}
                </span>
                <ChevronDown className={`w-5 h-5 text-on-surface-muted transition-transform duration-200 ${isPaysOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isPaysOpen && (
                <div className="absolute z-20 mt-2 w-full bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-outline-variant bg-surface-container-low/50">
                    <div className="relative">
                      <Search className="w-4 h-4 text-on-surface-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Rechercher un pays..." 
                        value={paysSearch}
                        onChange={(e) => setPaysSearch(e.target.value)}
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl text-sm pl-9 pr-3 py-2 focus:ring-2 focus:ring-accent-leaf/30 focus:border-accent-leaf outline-none transition-shadow"
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
                    {paysOptions.filter(p => p.toLowerCase().includes(paysSearch.toLowerCase())).map(p => (
                      <label key={p} className="flex items-center gap-3 cursor-pointer p-2.5 hover:bg-success-container/50 rounded-xl transition-colors group">
                        <input 
                          type="checkbox"
                          checked={selectedPays.includes(p)}
                          onChange={() => toggleFilter(selectedPays, setSelectedPays, p)}
                          className="w-4 h-4 text-primary rounded border-outline focus:ring-accent-leaf transition-colors"
                        />
                        <span className={`text-sm ${selectedPays.includes(p) ? 'font-bold text-primary' : 'text-on-surface-variant group-hover:text-on-surface'}`}>{p}</span>
                      </label>
                    ))}
                    {paysOptions.filter(p => p.toLowerCase().includes(paysSearch.toLowerCase())).length === 0 && (
                      <div className="p-4 text-center text-sm text-on-surface-muted">Aucun pays trouvé</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Catégories */}
            <div>
              <label className="text-label-sm font-bold uppercase tracking-wider text-on-surface-muted mb-3 block">Catégorie</label>
              <div className="space-y-1.5">
                {catOptions.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 hover:bg-success-container/30 rounded-xl transition-colors">
                    <input 
                      type="checkbox"
                      checked={selectedCategories.includes(cat.toLowerCase())}
                      onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat.toLowerCase())}
                      className="w-4 h-4 text-primary rounded border-outline focus:ring-accent-leaf transition-colors"
                    />
                    <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Spécialités */}
            <div>
              <label className="text-label-sm font-bold uppercase tracking-wider text-on-surface-muted mb-3 block">Spécialité</label>
              <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                {specOptions.map(spec => (
                  <label key={spec} className="flex items-center gap-3 cursor-pointer group p-2 -mx-2 hover:bg-success-container/30 rounded-xl transition-colors">
                    <input 
                      type="checkbox"
                      checked={selectedSpecialites.includes(spec)}
                      onChange={() => toggleFilter(selectedSpecialites, setSelectedSpecialites, spec)}
                      className="w-4 h-4 text-primary rounded border-outline focus:ring-accent-leaf transition-colors"
                    />
                    <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 w-full">
          
          {/* Header Mobile & Stats Desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-4 gap-4">
            <div className="text-on-surface-variant flex items-center gap-3 w-full sm:w-auto">
              {loading ? (
                <span className="flex items-center gap-2 font-medium text-primary"><Loader2 className="w-5 h-5 animate-spin"/> Actualisation...</span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="bg-success-container text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> {totalCount}
                  </span>
                  <span className="font-medium">membres trouvés</span>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setShowFiltersMobile(true)}
              className="md:hidden w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold bg-success-container text-primary px-5 py-2.5 rounded-2xl hover:bg-success-container transition-colors"
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
            <div className="py-16 text-center bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-8 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-outline" />
              </div>
              <h3 className="text-xl font-extrabold text-on-surface mb-2">Aucun membre trouvé</h3>
              <p className="text-on-surface-muted max-w-md">Nous n'avons trouvé aucun membre correspondant à vos critères. Essayez d'élargir votre recherche.</p>
              <button onClick={() => {
                setSearch('');
                setSelectedPays([]);
                setSelectedCategories([]);
                setSelectedSpecialites([]);
                setMentoratOnly(false);
              }} className="mt-6 text-primary font-bold hover:underline">
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
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-on-surface-variant bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5">
                    Page <span className="text-on-surface">{page}</span> / {totalPages}
                  </span>
                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
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
