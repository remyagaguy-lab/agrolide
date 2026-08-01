'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'
import { DocumentCard, DocumentType } from './DocumentCard'
import { SkeletonGrid } from '@/components/ui/Skeleton'

export function BibliothequeClient({ initialData, publicView = false }: any) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [documents, setDocuments] = useState<DocumentType[]>(initialData?.data || [])
  const [nextCursor, setNextCursor] = useState<string | null>(initialData?.nextCursor || null)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filtres state (local state synced with URL)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [type, setType] = useState(searchParams.get('type') || '')
  const [thematique, setThematique] = useState(searchParams.get('thematique') || '')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateUrlAndFetch(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [search, type, thematique]) // eslint-disable-line react-hooks/exhaustive-deps

  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      return params.toString()
    },
    [searchParams]
  )

  const updateUrlAndFetch = async (resetCursor = false) => {
    const queryString = createQueryString({
      search: search || null,
      type: type || null,
      thematique: thematique || null,
    })
    
    // Update URL without refresh
    router.replace(`${pathname}?${queryString}`, { scroll: false })
    
    // Fetch new data
    setLoading(true)
    setError(null)
    try {
      const { fetchDocuments } = await import('@/app/actions/bibliotheque')
      const result = await fetchDocuments({ search, type, thematique })
      
      setDocuments(result.data as DocumentType[])
      setNextCursor(result.nextCursor)
    } catch (err) {
      console.error(err)
      setError('Erreur lors du chargement des documents')
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    if (!nextCursor || loadingMore) return
    
    setLoadingMore(true)
    try {
      const { fetchDocuments } = await import('@/app/actions/bibliotheque')
      const result = await fetchDocuments({ search, type, thematique, cursor: nextCursor })
      
      setDocuments(prev => [...prev, ...(result.data as DocumentType[])])
      setNextCursor(result.nextCursor)
    } finally {
      setLoadingMore(false)
    }
  }

  const resetFilters = () => {
    setSearch('')
    setType('')
    setThematique('')
    router.replace(pathname)
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filtres */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-6 md:sticky md:top-24 h-fit">
        <div className="card-glass p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" /> Filtres
            </h3>
            {(search || type || thematique) && (
              <button onClick={resetFilters} className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 font-bold">
                <X className="w-3 h-3" /> Réinitialiser
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Recherche textuelle */}
            <div>
              <label className="dash-label mb-2 block">Recherche</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Titre, mots-clés..."
                  className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#50a853]/30 focus:border-[#50a853] bg-gray-50/50 outline-none transition-all"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="dash-label mb-2 block">Type de document</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#50a853]/30 focus:border-[#50a853] bg-gray-50/50 outline-none transition-all"
              >
                <option value="">Tous les types</option>
                <option value="these">Thèse</option>
                <option value="memoire">Mémoire</option>
                <option value="fiche_technique">Fiche technique</option>
                <option value="guide_pratique">Guide pratique</option>
                <option value="article">Article</option>
                <option value="rapport">Rapport</option>
              </select>
            </div>
            
            {/* Thématique */}
            <div>
              <label className="dash-label mb-2 block">Thématique</label>
              <select 
                value={thematique}
                onChange={(e) => setThematique(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#50a853]/30 focus:border-[#50a853] bg-gray-50/50 outline-none transition-all"
              >
                <option value="">Toutes</option>
                <option value="Agroécologie">Agroécologie</option>
                <option value="Élevage">Élevage</option>
                <option value="Maraîchage">Maraîchage</option>
                <option value="Gestion de projet">Gestion de projet</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grille de résultats */}
      <div className="flex-1">
        {loading && documents.length === 0 ? (
          <SkeletonGrid count={6} />
        ) : error ? (
          <div className="text-center py-16 card-glass p-8">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : documents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc: DocumentType) => (
                <DocumentCard key={doc.id} document={doc} publicView={publicView} />
              ))}
            </div>
            {nextCursor && (
              <div className="mt-8 text-center">
                <button 
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="btn-dash-outline disabled:opacity-50"
                >
                  {loadingMore ? 'Chargement...' : 'Charger plus'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 card-glass p-8 flex flex-col items-center">
            <div className="icon-circle-lg bg-gray-50 mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Aucun document trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos filtres de recherche.</p>
            <button onClick={resetFilters} className="mt-4 text-[#1b5e38] hover:text-[#145030] font-bold">
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
