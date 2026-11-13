'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { DocumentCard, DocumentType } from './DocumentCard'
import { SkeletonGrid } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { NativeSelect } from '@/components/ui/Select'
import {
  DOMAINES, TYPES_DOCUMENT, PUBLICS_CIBLES, NIVEAUX, sousDomainesDe,
  labelDomaine, labelSousDomaine, labelType, labelPublic, labelNiveau, type Option,
} from '@/lib/bibliotheque/taxonomie'

import { Search, SlidersHorizontal, X } from "@/components/ui/icons"
function Filtre({ label, value, onChange, options, tous }: { label: string; value: string; onChange: (v: string) => void; options: Option[]; tous: string }) {
  return (
    <FormField label={label}>
      <NativeSelect value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{tous}</option>
        {options.map((o) => (
          <option key={o.code} value={o.code}>{o.label}</option>
        ))}
      </NativeSelect>
    </FormField>
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

  const nbFiltres = [type, domaine, sousDomaine, publicCible, niveau].filter(Boolean).length
  const filtresActifs = Boolean(search || nbFiltres)
  const sousDomaines = sousDomainesDe(domaine)
  // Sur mobile, les filtres se replient derrière un bouton ; sur ordinateur ils sont toujours visibles.
  const [ouvert, setOuvert] = useState(nbFiltres > 0)

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

  /** Une puce par filtre actif : on voit ce qui restreint la liste et on le retire d'un geste. */
  const puces: Array<{ libelle: string; retirer: () => void }> = []
  if (domaine) puces.push({ libelle: labelDomaine(domaine), retirer: () => changerDomaine('') })
  if (sousDomaine) puces.push({ libelle: labelSousDomaine(sousDomaine), retirer: () => setSousDomaine('') })
  if (type) puces.push({ libelle: labelType(type), retirer: () => setType('') })
  if (publicCible) puces.push({ libelle: labelPublic(publicCible), retirer: () => setPublicCible('') })
  if (niveau) puces.push({ libelle: labelNiveau(niveau), retirer: () => setNiveau('') })

  return (
    <div className="space-y-5 pb-12">
      {/* Recherche et filtres */}
      <form role="search" aria-label="Rechercher dans la bibliothèque" onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <FormField label="Rechercher un document" className="sm:flex-1">
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Titre, auteur, culture, mot-clé…"
              autoComplete="off"
              maxLength={120}
            />
          </FormField>
          <Button
            type="button"
            variant="outline"
            className="md:hidden"
            aria-expanded={ouvert}
            aria-controls="filtres-bibliotheque"
            onClick={() => setOuvert((v) => !v)}
          >
            <SlidersHorizontal className="size-5" aria-hidden />
            Filtres{nbFiltres > 0 ? ` (${nbFiltres})` : ''}
          </Button>
        </div>

        <div
          id="filtres-bibliotheque"
          className={ouvert ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4' : 'hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-4'}
        >
          <Filtre label="Domaine" value={domaine} onChange={changerDomaine} options={DOMAINES} tous="Tous les domaines" />
          {sousDomaines.length > 0 ? (
            <Filtre label="Sujet" value={sousDomaine} onChange={setSousDomaine} options={sousDomaines} tous="Tous les sujets" />
          ) : (
            <Filtre label="Type de document" value={type} onChange={setType} options={TYPES_DOCUMENT} tous="Tous les types" />
          )}
          {sousDomaines.length > 0 && (
            <Filtre label="Type de document" value={type} onChange={setType} options={TYPES_DOCUMENT} tous="Tous les types" />
          )}
          <Filtre label="Pour qui ?" value={publicCible} onChange={setPublicCible} options={PUBLICS_CIBLES} tous="Tous les publics" />
          <Filtre label="Niveau" value={niveau} onChange={setNiveau} options={NIVEAUX} tous="Tous les niveaux" />
        </div>
      </form>

      {filtresActifs && (
        <div className="flex flex-wrap items-center gap-2">
          <p className="sr-only">Filtres appliqués</p>
          {puces.map((p) => (
            <button
              key={p.libelle}
              type="button"
              onClick={p.retirer}
              aria-label={`Retirer le filtre ${p.libelle}`}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary-container px-4 text-label-md text-on-primary-container hover:bg-primary-container/80"
            >
              {p.libelle}
              <X className="size-4" aria-hidden />
            </button>
          ))}
          <Button type="button" variant="text" size="sm" onClick={resetFilters}>
            Tout effacer
          </Button>
        </div>
      )}

      {/* Résultats */}
      <div>
        {loading && documents.length === 0 ? (
          <SkeletonGrid count={8} />
        ) : error ? (
          <div className="rounded-card border border-outline-variant bg-surface-container-lowest p-6 text-center">
            <p className="font-medium text-error">{error}</p>
          </div>
        ) : documents.length > 0 ? (
          <>
            <p role="status" className="mb-4 text-body-md text-on-surface-variant">
              {documents.length}{nextCursor ? '+' : ''} {documents.length > 1 ? 'documents' : 'document'}
            </p>
            <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${loading ? 'opacity-60 transition-opacity' : ''}`}>
              {documents.map((doc: DocumentType) => (
                <DocumentCard key={doc.id} document={doc} publicView={publicView} />
              ))}
            </div>
            {nextCursor && (
              <div className="mt-8 text-center">
                <Button type="button" variant="outline" onClick={loadMore} loading={loadingMore}>
                  Charger plus de documents
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center rounded-card border border-dashed border-outline-variant bg-surface-container-low px-6 py-12 text-center">
            <span className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
              <Search className="size-6" aria-hidden />
            </span>
            <h3 className="text-title-lg text-on-surface">Aucun document trouvé</h3>
            <p className="mt-1.5 max-w-md text-body-md text-on-surface-variant">Essayez avec moins de critères, ou une autre orthographe.</p>
            <Button type="button" variant="tonal" className="mt-6" onClick={resetFilters}>
              Effacer les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
