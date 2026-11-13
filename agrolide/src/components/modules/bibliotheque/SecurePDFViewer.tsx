'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import Link from 'next/link'
import { cn } from '@/lib/utils/formatters'
import { EncartInscription } from './EncartInscription'
import { useAuth } from '@/lib/auth/client'

import { AlertTriangle, ChevronLeft, ChevronRight, FileStack, FileText, Info, Loader2, Maximize, X, ZoomIn, ZoomOut } from '@/components/ui/icons'

// Configurer le worker pour pdf.js avec un fichier local (mouchard + fiabilité)
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

/** Marge (en pixels) autour de la zone visible : une page est dessinée un peu avant d'arriver à l'écran. */
const MARGE_PAGES = 1500
/** Largeur maximale d'une page à 100 % : au-delà, un A4 devient inutilement énorme sur grand écran. */
const LARGEUR_MAX = 960
const ZOOM_MIN = 0.5
const ZOOM_MAX = 2.5
const ECART = 16

type Taille = { largeur: number; hauteur: number }

/** Filigrane : un motif répété, une seule couche par page (au lieu de douze images). */
function Filigrane() {
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-30 overflow-hidden opacity-[0.04]">
        <div
          className="absolute -inset-1/2 -rotate-45 grayscale"
          style={{ backgroundImage: 'url(/agrolide-png.png)', backgroundSize: '260px auto', backgroundRepeat: 'repeat' }}
        />
      </div>
      {/* Couche transparente : pas de glisser-déposer de l'image */}
      <div className="absolute inset-0 z-40 bg-transparent pointer-events-auto" />
    </>
  )
}

/**
 * Page du défilement continu, dessinée seulement quand elle est proche de l'écran.
 * Hors de la zone, elle est remplacée par une case vide de même taille (le défilement reste juste) et sa mémoire est libérée.
 */
function PageParesseuse({
  numero,
  largeur,
  hauteur,
  racine,
  children,
}: {
  numero: number
  largeur: number
  hauteur: number
  racine: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [proche, setProche] = useState(numero <= 2)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setProche(true)
      return
    }
    const observer = new IntersectionObserver(([entree]) => setProche(entree.isIntersecting), {
      root: racine.current,
      rootMargin: `${MARGE_PAGES}px 0px`,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [racine])

  return (
    <div
      ref={ref}
      data-page={numero}
      className="relative shrink-0 bg-surface-container-lowest shadow-elev-2"
      style={{ width: largeur, height: hauteur }}
    >
      {proche ? children : null}
    </div>
  )
}

/** Bouton de la barre d'outils : icône seule, cible tactile de 44 px, nom accessible. */
function Outil({ libelle, className, children, ...props }: { libelle: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={libelle}
      title={libelle}
      className={cn(
        'ag-state inline-flex size-11 shrink-0 items-center justify-center rounded-control text-on-surface-variant transition-colors hover:bg-surface-container disabled:pointer-events-none disabled:opacity-40',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecurePDFViewer({ documentId }: { documentId: string }) {
  const { userId, isLoaded } = useAuth()
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [saisiePage, setSaisiePage] = useState('1')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [viewMode, setViewMode] = useState<'single' | 'continuous'>('continuous')
  const [plein, setPlein] = useState(false)
  // Taille visible de la zone de lecture (sans les marges) : toutes les pages s'y ajustent, aucun débordement à 100 %.
  const [zone, setZone] = useState<{ largeur: number; hauteur: number } | null>(null)
  // Taille d'origine de chaque page (formats mixtes : portrait, paysage, très grands).
  const [tailles, setTailles] = useState<Taille[]>([])
  const racineRef = useRef<HTMLDivElement>(null)
  const defilRef = useRef<HTMLDivElement>(null)

  const [quotaReached, setQuotaReached] = useState(false)
  const [readCount, setReadCount] = useState(0)
  const [readLimit, setReadLimit] = useState(3)
  const nextPath = `/bibliotheque/${documentId}/lire`
  const showEncarts = isLoaded && !userId

  // Pas de clic droit dans la zone ; mesure de la zone pour adapter les pages à l'écran.
  useEffect(() => {
    const el = defilRef.current
    if (!el) return
    const bloquer = (e: MouseEvent) => e.preventDefault()
    el.addEventListener('contextmenu', bloquer)
    const mesurer = () => {
      const marge = window.innerWidth < 640 ? 12 : 24
      setZone({ largeur: Math.max(200, el.clientWidth - marge * 2), hauteur: Math.max(200, el.clientHeight - marge * 2) })
    }
    mesurer()
    const observer = new ResizeObserver(mesurer)
    observer.observe(el)
    return () => {
      el.removeEventListener('contextmenu', bloquer)
      observer.disconnect()
    }
  }, [loading, error, quotaReached, pdfUrl])

  // Empêcher les raccourcis clavier (Ctrl+S, Ctrl+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p')) e.preventDefault()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    let objectUrl: string | null = null
    let cancelled = false
    const fetchSecureUrl = async () => {
      try {
        // Le serveur décide (quota de lectures gratuites, cookie signé) : le navigateur ne fait que l'afficher.
        const res = await fetch(`/api/bibliotheque/download/${documentId}`, { credentials: 'same-origin' })
        if (res.status === 402) {
          setQuotaReached(true)
          return
        }
        if (!res.ok) throw new Error(res.status === 404 ? 'Document introuvable' : 'Erreur de chargement')
        const used = res.headers.get('X-Quota-Used')
        if (used) {
          setReadCount(Number(used))
          setReadLimit(Number(res.headers.get('X-Quota-Limit') || 3))
        }
        const blob = await res.blob()
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setPdfUrl(objectUrl)
      } catch (err) {
        setError(err instanceof Error && err.message ? err.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }
    fetchSecureUrl()
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [documentId])

  // Plein écran : vrai plein écran quand le navigateur le permet, sinon la zone occupe tout l'écran (iPhone).
  const basculerPlein = useCallback(() => {
    const el = racineRef.current
    if (!plein) {
      setPlein(true)
      el?.requestFullscreen?.().catch(() => {})
    } else {
      setPlein(false)
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    }
  }, [plein])

  useEffect(() => {
    const sortie = () => {
      if (!document.fullscreenElement) setPlein(false)
    }
    document.addEventListener('fullscreenchange', sortie)
    return () => document.removeEventListener('fullscreenchange', sortie)
  }, [])

  useEffect(() => {
    if (!plein) return
    const echap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPlein(false)
    }
    window.addEventListener('keydown', echap)
    const avant = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', echap)
      document.body.style.overflow = avant
    }
  }, [plein])

  // Taille de toutes les pages, lue par paquets (rien n'est dessiné) : les cases vides gardent la bonne hauteur.
  const onDocumentLoadSuccess = useCallback(async (pdf: pdfjs.PDFDocumentProxy) => {
    setNumPages(pdf.numPages)
    const resultat: Taille[] = []
    for (let debut = 1; debut <= pdf.numPages; debut += 25) {
      const lot = await Promise.all(
        Array.from({ length: Math.min(25, pdf.numPages - debut + 1) }, async (_, i) => {
          const page = await pdf.getPage(debut + i)
          const v = page.getViewport({ scale: 1 })
          return { largeur: v.width, hauteur: v.height }
        }),
      ).catch(() => null)
      if (!lot) break
      resultat.push(...lot)
      setTailles([...resultat])
    }
  }, [])

  // Largeur d'affichage d'une page : ajustée à la zone (et à sa hauteur en mode page par page), puis multipliée par le zoom.
  const largeurDe = useCallback(
    (numero: number) => {
      const t = tailles[numero - 1] ?? tailles[0]
      if (!zone) return 0
      let base = Math.min(zone.largeur, LARGEUR_MAX)
      if (viewMode === 'single' && t) base = Math.min(base, zone.hauteur * (t.largeur / t.hauteur))
      return Math.round(base * scale)
    },
    [tailles, zone, viewMode, scale],
  )
  const hauteurDe = (numero: number) => {
    const t = tailles[numero - 1] ?? tailles[0]
    return t ? Math.round(largeurDe(numero) * (t.hauteur / t.largeur)) : Math.round(largeurDe(numero) * 1.414)
  }

  const allerA = useCallback(
    (n: number) => {
      const cible = Math.min(Math.max(1, Math.round(n) || 1), Math.max(1, numPages))
      setPageNumber(cible)
      setSaisiePage(String(cible))
      const zoneEl = defilRef.current
      if (!zoneEl) return
      if (viewMode === 'single') {
        zoneEl.scrollTo({ top: 0, left: 0 })
        return
      }
      const page = zoneEl.querySelector<HTMLElement>(`[data-page="${cible}"]`)
      if (page) zoneEl.scrollTo({ top: page.getBoundingClientRect().top - zoneEl.getBoundingClientRect().top + zoneEl.scrollTop - ECART })
    },
    [numPages, viewMode],
  )

  // Défilement continu : la page affichée dans la barre suit le défilement.
  const attente = useRef(false)
  const surDefilement = useCallback(() => {
    if (viewMode !== 'continuous' || attente.current) return
    attente.current = true
    requestAnimationFrame(() => {
      attente.current = false
      const zoneEl = defilRef.current
      if (!zoneEl) return
      const seuil = zoneEl.getBoundingClientRect().top + zoneEl.clientHeight * 0.35
      let courante = 1
      for (const p of zoneEl.querySelectorAll<HTMLElement>('[data-page]')) {
        if (p.getBoundingClientRect().top <= seuil) courante = Number(p.dataset.page)
        else break
      }
      setPageNumber(courante)
      setSaisiePage(String(courante))
    })
  }, [viewMode])

  // Flèches du clavier en mode page par page.
  useEffect(() => {
    if (viewMode !== 'single') return
    const touche = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') allerA(pageNumber + 1)
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') allerA(pageNumber - 1)
    }
    window.addEventListener('keydown', touche)
    return () => window.removeEventListener('keydown', touche)
  }, [viewMode, pageNumber, allerA])

  const changerMode = () => {
    const prochain = viewMode === 'single' ? 'continuous' : 'single'
    setViewMode(prochain)
    // Après le changement d'affichage, on revient à la page qu'on lisait.
    requestAnimationFrame(() => requestAnimationFrame(() => allerA(pageNumber)))
  }

  const changerZoom = (delta: number) => setScale((s) => Math.round(Math.min(Math.max(ZOOM_MIN, s + delta), ZOOM_MAX) * 10) / 10)

  const dpr = useMemo(() => (typeof window === 'undefined' ? 1 : Math.min(2, window.devicePixelRatio || 1)), [])

  if (loading) {
    return (
      <div className="flex min-h-[24rem] flex-col items-center justify-center rounded-card border border-outline-variant bg-surface-container-low">
        <Loader2 className="mb-4 size-6 animate-spin text-primary" aria-hidden />
        <p className="font-medium text-on-surface-muted">Sécurisation et chargement du document…</p>
      </div>
    )
  }

  if (quotaReached) {
    return (
      <div className="flex min-h-[24rem] flex-col items-center justify-center rounded-card border border-outline-variant bg-surface-container-low p-6 text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-warning-container text-warning">
          <AlertTriangle className="size-6" aria-hidden />
        </div>
        <h3 className="mb-3 text-title-lg font-bold text-on-surface">Vous avez lu vos {readLimit} documents gratuits</h3>
        <p className="mb-8 max-w-md text-on-surface-variant">
          Bravo, vous avez bien exploré ! Pour continuer à lire sans limite (et sans pub), créez votre compte Agrolide : c&apos;est gratuit et ça prend 1&nbsp;minute.
        </p>
        <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
          <Link href={`/inscription?next=${encodeURIComponent(nextPath)}`} className="flex min-h-11 flex-1 items-center justify-center rounded-control bg-success px-4 py-2 font-medium text-on-primary transition-colors hover:bg-primary/90">
            Créer mon compte
          </Link>
          <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="flex min-h-11 flex-1 items-center justify-center rounded-control border border-success/30 bg-surface-container-lowest px-4 py-2 font-medium text-success transition-colors hover:bg-success-container">
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  if (error || !pdfUrl) {
    return (
      <div role="alert" className="flex min-h-[24rem] flex-col items-center justify-center rounded-card bg-error-container p-6 text-center">
        <p className="font-medium text-error">{error || 'Erreur de chargement'}</p>
      </div>
    )
  }

  const pagesAffichees = Array.from({ length: numPages }, (_, i) => i + 1)

  return (
    <div
      ref={racineRef}
      className={cn(
        'relative flex min-w-0 flex-col overflow-hidden border border-outline-variant bg-surface-container',
        plein ? 'fixed inset-0 z-[100] h-dvh rounded-none' : 'h-[calc(100dvh-9rem)] min-h-[26rem] max-h-[64rem] rounded-card',
      )}
    >
      {/* Bandeau permanent pour les visiteurs */}
      {showEncarts && (
        <div className="z-20 flex w-full items-center justify-between gap-3 bg-success px-3 py-2 text-xs text-on-success sm:text-sm">
          <span className="flex min-w-0 items-center">
            <Info className="mr-2 size-4 shrink-0" aria-hidden />
            <span className="truncate">
              Mode visiteur{readCount > 0 && <> : <strong>{readCount}/{readLimit}</strong> documents gratuits</>} · Lisez sans pub en créant un compte
            </span>
          </span>
          <Link href={`/inscription?next=${encodeURIComponent(nextPath)}`} className="flex min-h-9 shrink-0 items-center rounded-control bg-surface-container-lowest px-3 font-semibold text-on-success-container hover:bg-success-container">
            Créer un compte
          </Link>
        </div>
      )}

      {/* Barre d'outils : pages, zoom, affichage, plein écran */}
      <div role="toolbar" aria-label="Outils de lecture" className="z-10 flex w-full flex-wrap items-center justify-between gap-x-2 border-b border-outline-variant bg-surface-container-lowest px-1.5 py-0.5 sm:px-3">
        <div className="flex items-center">
          <Outil libelle="Page précédente" className={viewMode === 'continuous' ? 'max-sm:hidden' : undefined} disabled={pageNumber <= 1} onClick={() => allerA(pageNumber - 1)}>
            <ChevronLeft className="size-5" aria-hidden />
          </Outil>
          <label className="flex items-center gap-1 text-body-sm text-on-surface-variant">
            <span className="sr-only">Aller à la page</span>
            <input
              value={saisiePage}
              inputMode="numeric"
              onChange={(e) => setSaisiePage(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onBlur={() => allerA(Number(saisiePage))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  allerA(Number(saisiePage))
                  e.currentTarget.blur()
                }
              }}
              className="h-11 w-12 rounded-control border border-outline bg-surface-container-lowest text-center text-label-lg text-on-surface"
            />
            <span aria-hidden>/ {numPages || '–'}</span>
          </label>
          <Outil libelle="Page suivante" className={viewMode === 'continuous' ? 'max-sm:hidden' : undefined} disabled={pageNumber >= numPages} onClick={() => allerA(pageNumber + 1)}>
            <ChevronRight className="size-5" aria-hidden />
          </Outil>
        </div>

        <div className="flex items-center">
          <Outil libelle="Dézoomer" disabled={scale <= ZOOM_MIN} onClick={() => changerZoom(-0.25)}>
            <ZoomOut className="size-5" aria-hidden />
          </Outil>
          <button
            type="button"
            onClick={() => setScale(1)}
            title="Ajuster à la largeur"
            aria-label={`Zoom ${Math.round(scale * 100)} %, cliquer pour ajuster à la largeur`}
            className="ag-state hidden min-h-11 w-14 items-center justify-center rounded-control text-label-md font-medium text-on-surface-variant hover:bg-surface-container sm:flex"
          >
            {Math.round(scale * 100)} %
          </button>
          <Outil libelle="Zoomer" disabled={scale >= ZOOM_MAX} onClick={() => changerZoom(0.25)}>
            <ZoomIn className="size-5" aria-hidden />
          </Outil>
        </div>

        <div className="flex items-center">
          <Outil libelle={viewMode === 'single' ? 'Passer en défilement continu' : 'Passer en page par page'} onClick={changerMode}>
            {viewMode === 'single' ? <FileStack className="size-5" aria-hidden /> : <FileText className="size-5" aria-hidden />}
          </Outil>
          <Outil libelle={plein ? 'Quitter le plein écran' : 'Plein écran'} onClick={basculerPlein}>
            {plein ? <X className="size-5" aria-hidden /> : <Maximize className="size-5" aria-hidden />}
          </Outil>
        </div>
      </div>

      {/* Zone de lecture : défile dans les deux sens quand on zoome, jamais de débordement de la page du site */}
      <div
        ref={defilRef}
        onScroll={surDefilement}
        className="relative min-h-0 w-full flex-1 select-none overflow-auto overscroll-contain bg-surface-container-high"
        style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
      >
        <div className="mx-auto flex w-max min-w-full flex-col items-center gap-4 p-3 sm:p-6">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<Loader2 className="mx-auto mt-20 size-6 animate-spin text-primary" aria-label="Chargement" />}
            onLoadError={(err) => {
              console.error('Erreur détaillée react-pdf:', err)
              setError(`Erreur : ${err.message || 'Impossible de charger le PDF'}`)
            }}
            error={<div className="mt-20 text-error">Impossible de charger le PDF.</div>}
            className="flex flex-col items-center gap-4"
          >
            {zone && viewMode === 'continuous' &&
              pagesAffichees
                .map((n) => (
                  <PageParesseuse key={`page_${n}`} numero={n} racine={defilRef} largeur={largeurDe(n)} hauteur={hauteurDe(n)}>
                    <Page pageNumber={n} width={largeurDe(n)} devicePixelRatio={dpr} renderTextLayer={false} renderAnnotationLayer={false} className="pointer-events-none" />
                    <Filigrane />
                  </PageParesseuse>
                ))
                .flatMap((el, index) => [
                  el,
                  ...(showEncarts && index !== numPages - 1 && index % 3 === 0
                    ? [<div key={`encart_${index}`} className="shrink-0" style={{ width: Math.min(zone.largeur, LARGEUR_MAX) }}><EncartInscription next={nextPath} /></div>]
                    : []),
                ])}
            {zone && viewMode === 'single' && numPages > 0 && (
              <div className="relative shrink-0 bg-surface-container-lowest shadow-elev-2" style={{ width: largeurDe(pageNumber), height: hauteurDe(pageNumber) }}>
                <Page pageNumber={pageNumber} width={largeurDe(pageNumber)} devicePixelRatio={dpr} renderTextLayer={false} renderAnnotationLayer={false} className="pointer-events-none" />
                <Filigrane />
              </div>
            )}
          </Document>
          {viewMode === 'single' && showEncarts && zone && (
            <div className="shrink-0" style={{ width: Math.min(zone.largeur, LARGEUR_MAX) }}>
              <EncartInscription next={nextPath} variant="compact" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
