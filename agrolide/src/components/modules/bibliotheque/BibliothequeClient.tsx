'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'
import { DocumentCard, DocumentType } from './DocumentCard'
import { SkeletonGrid } from '@/components/ui/Skeleton'
import { buttonVariants } from '@/components/ui/Button'
import { DOMAINES, TYPES_DOCUMENT, PUBLICS_CIBLES, NIVEAUX, sousDomainesDe, type Option } from '@/lib/bibliotheque/taxonomie'

const CLASSE_SELECT = 'w-full p-2.5 border border-outline-variant rounded-2xl text-sm focus:ring-2 focus:ring-accent-leaf/30 focus:border-accent-leaf bg-surface-container-low/50 outline-none transition-all'
const CLASSE_LABEL = 'text-label-sm font-bold uppercase tracking-wider text-on-surface-muted mb-2 block'

function Select({ label, value, onChange, options, tous }: { label: string; value: string; onChange: (v: string) => void; options: Option[]; tous: string }) {
  return (
    <div>
      <label className={CLASSE_LABEL}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={CLASSE_SELECT}>
        <option value="">{tous}</option>
        {options.map((o) => (
          <option key={o.code} value={o.code}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

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
  const [domaine, setDomaine] = useState(searchParams.get('domaine') || '')
  const [sousDomaine, setSousDomaine] = useState(searchParams.get('sous_domaine') || '')
  const [publicCible, setPublicCible] = useState(searchParams.get('public') || '')
  const [niveau, setNiveau] = useState(searchParams.get('niveau') || '')

  const filtresActifs = Boolean(search || type || domaine || sousDomaine || publicCible || niveau)
  const sousDomaines = sousDomainesDe(domaine)

  const changerDomaine = (v: string) => {
    setDomaine(v)
    setSousDomaine('') // un sous-domaine n'a de sens que dans son domaine
  }

  // Debounce search. Au premier affichage, la liste vient déjà du serveur (initialData) : on ne la redemande pas
  // (avant, chaque ouverture relançait une requête + un router.replace qui refaisait tout le rendu de la page,
  // et pouvait avaler le clic suivant de l'utilisateur).
  const premierAffichage = useRef(true)
  useEffect(() => {
    if (premierAffichage.current) {
      premierAffichage.current = false
      return
    }
    const timer = setTimeout(() => {
      updateUrlAndFetch(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [search, type, domaine, sousDomaine, publicCible, niveau]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const filtres = { search, type, domaine, sous_domaine: sousDomaine, public_cible: publicCible, niveau }

  const updateUrlAndFetch = async (resetCursor = false) => {
    const queryString = createQueryString({
      search: search || null,
      type: type || null,
      domaine: domaine || null,
      sous_domaine: sousDomaine || null,
      public: publicCible || null,
      niveau: niveau || null,
      thematique: null, // ancien paramètre, remplacé par « domaine »
    })

    // Update URL without refresh
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })

    // Fetch new data
    setLoading(true)
    setError(null)
    try {
      const { fetchDocuments } = await import('@/app/actions/bibliotheque')
      const result = await fetchDocuments(filtres)

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
      const result = await fetchDocuments({ ...filtres, cursor: nextCursor })

      setDocuments(prev => [...prev, ...(result.data as DocumentType[])])
      setNextCursor(result.nextCursor)
    } finally {
      setLoadingMore(false)
    }
  }

  const resetFilters = () => {
    setSearch('')
    setType('')
    setDomaine('')
    setSousDomaine('')
    setPublicCible('')
    setNiveau('')
    router.replace(pathname)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
      {/* Sidebar Filtres */}
      <div className="lg:col-span-3 space-y-6 md:sticky md:top-24 h-fit">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-on-surface flex items-center gap-2">
              <Filter className="w-4 h-4 text-on-surface-muted" /> Filtres
            </h3>
            {filtresActifs && (
              <button onClick={resetFilters} className="text-xs text-error hover:text-on-error-container flex items-center gap-1 font-bold">
                <X className="w-3 h-3" /> Réinitialiser
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Recherche textuelle */}
            <div>
              <label className={CLASSE_LABEL}>Recherche</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Titre, auteur, culture, mot-clé..."
                  className="w-full pl-8 pr-3 py-2.5 border border-outline-variant rounded-2xl text-sm focus:ring-2 focus:ring-accent-leaf/30 focus:border-accent-leaf bg-surface-container-low/50 outline-none transition-all"
                />
                <Search className="w-4 h-4 text-on-surface-muted absolute left-2.5 top-3" />
              </div>
            </div>

            <Select label="Domaine" value={domaine} onChange={changerDomaine} options={DOMAINES} tous="Tous les domaines" />
            {sousDomaines.length > 0 && (
              <Select label="Sujet" value={sousDomaine} onChange={setSousDomaine} options={sousDomaines} tous="Tous les sujets" />
            )}
            <Select label="Type de document" value={type} onChange={setType} options={TYPES_DOCUMENT} tous="Tous les types" />
            <Select label="Pour qui ?" value={publicCible} onChange={setPublicCible} options={PUBLICS_CIBLES} tous="Tous les publics" />
            <Select label="Niveau" value={niveau} onChange={setNiveau} options={NIVEAUX} tous="Tous les niveaux" />
          </div>
        </div>
      </div>

      {/* Grille de résultats */}
      <div className="lg:col-span-9">
        {loading && documents.length === 0 ? (
          <SkeletonGrid count={6} />
        ) : error ? (
          <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-6">
            <p className="text-error font-medium">{error}</p>
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
                  className={buttonVariants({ variant: 'outline', className: 'disabled:opacity-50' })}
                >
                  {loadingMore ? 'Chargement...' : 'Charger plus'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-8 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-outline" />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-1">Aucun document trouvé</h3>
            <p className="text-on-surface-muted">Essayez de modifier vos filtres de recherche.</p>
            <button onClick={resetFilters} className="mt-4 text-primary hover:text-primary font-bold">
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
