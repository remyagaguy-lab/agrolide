'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'
import { DocumentCard, DocumentType } from './DocumentCard'
import { createClient } from '@supabase/supabase-js'

export function BibliothequeClient({ initialData, supabaseUrl, supabaseAnonKey }: any) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [documents, setDocuments] = useState<DocumentType[]>(initialData?.data || [])
  const [nextCursor, setNextCursor] = useState<string | null>(initialData?.nextCursor || null)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

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
    try {
      // In a real implementation, we would fetch from our Worker API with Auth header.
      // But since we are client-side here and the worker needs the Auth token we could fetch from worker:
      // const res = await fetch(`/api/bibliotheque?${queryString}`, { headers: { Authorization: `Bearer ${session.access_token}` } })
      // For simplicity in this demo, let's just query Supabase directly since RLS is usually configured to allow reading public documents.
      // If RLS blocks it, we must use the worker endpoint and get the token.
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      let query = supabase.from('documents').select('*').eq('statut', 'publie').order('created_at', { ascending: false }).limit(20)
      
      if (search) query = query.ilike('titre', `%${search}%`)
      if (type) query = query.in('type_doc', type.split(','))
      if (thematique) query = query.in('thematique', thematique.split(','))
      
      const { data, error } = await query
      
      if (!error && data) {
        setDocuments(data as DocumentType[])
        setNextCursor(data.length === 20 ? data[data.length - 1].created_at : null)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    if (!nextCursor || loadingMore) return
    
    setLoadingMore(true)
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      let query = supabase
        .from('documents')
        .select('*')
        .eq('statut', 'publie')
        .order('created_at', { ascending: false })
        .lt('created_at', nextCursor)
        .limit(20)
        
      if (search) query = query.ilike('titre', `%${search}%`)
      if (type) query = query.in('type_doc', type.split(','))
      if (thematique) query = query.in('thematique', thematique.split(','))
      
      const { data, error } = await query
      
      if (!error && data) {
        setDocuments(prev => [...prev, ...(data as DocumentType[])])
        setNextCursor(data.length === 20 ? data[data.length - 1].created_at : null)
      }
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
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filtres
            </h3>
            {(search || type || thematique) && (
              <button onClick={resetFilters} className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1">
                <X className="w-3 h-3" /> Réinitialiser
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Recherche textuelle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Titre, mots-clés..."
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de document</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Thématique</label>
              <select 
                value={thematique}
                onChange={(e) => setThematique(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
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
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-xl h-64 overflow-hidden">
                <div className="h-32 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="pt-4 flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : documents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
            {nextCursor && (
              <div className="mt-8 text-center">
                <button 
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {loadingMore ? 'Chargement...' : 'Charger plus'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun document trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos filtres de recherche.</p>
            <button onClick={resetFilters} className="mt-4 text-green-700 hover:text-green-800 font-medium">
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
