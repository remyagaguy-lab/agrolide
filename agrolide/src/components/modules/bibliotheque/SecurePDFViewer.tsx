'use client'

import { useState, useEffect, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, FileStack, AlertCircle, Info } from 'lucide-react'
import { EncartInscription } from './EncartInscription'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/client'

// Configurer le worker pour pdf.js avec un fichier local (mouchard + fiabilité)
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

export function SecurePDFViewer({ documentId }: { documentId: string }) {
  const { userId, isLoaded } = useAuth()
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [scale, setScale] = useState<number>(1.0)
  const [viewMode, setViewMode] = useState<'single' | 'continuous'>('continuous')
  const [containerWidth, setContainerWidth] = useState<number>()
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [quotaReached, setQuotaReached] = useState<boolean>(false)
  const [readCount, setReadCount] = useState<number>(0)
  const [readLimit, setReadLimit] = useState<number>(3)
  const nextPath = `/bibliotheque/${documentId}/lire`
  const showEncarts = isLoaded && !userId

  useEffect(() => {
    // Empêcher le clic droit sur toute la zone du lecteur
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }
    const container = containerRef.current
    if (container) {
      container.addEventListener('contextmenu', handleContextMenu)
      
      // Observer la taille du container pour adapter le PDF (responsivité)
      const observer = new ResizeObserver((entries) => {
        if (entries[0]) {
          // Soustraire un peu de padding (environ 32px)
          const width = entries[0].contentRect.width
          setContainerWidth(width > 600 ? undefined : width - 32)
        }
      })
      observer.observe(container)
      return () => {
        container.removeEventListener('contextmenu', handleContextMenu)
        observer.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    // Empêcher les raccourcis clavier (Ctrl+S, Ctrl+P)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p')) {
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!isLoaded) return; // Wait for session check

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
      } catch (err: any) {
        setError(err.message || 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }
    fetchSecureUrl()
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [documentId, userId, isLoaded])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPage = prevPageNumber + offset;
      return Math.min(Math.max(1, newPage), numPages);
    })
  }

  const changeScale = (offset: number) => {
    setScale(prevScale => Math.min(Math.max(0.5, prevScale + offset), 3))
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-surface-container-low rounded-xl">
        <Loader2 className="w-10 h-10 animate-spin text-success mb-4" />
        <p className="text-on-surface-muted font-medium">Sécurisation et chargement du document...</p>
      </div>
    )
  }

  if (quotaReached) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-surface-container-low rounded-xl border border-outline-variant p-6 text-center">
        <div className="w-16 h-16 bg-warning-container text-warning rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-on-surface mb-3">Vous avez lu vos 5 documents gratuits 🎉</h3>
        <p className="text-on-surface-variant mb-8 max-w-md">
          Bravo, vous avez bien exploré ! Pour continuer à lire sans limite (et sans pub), créez votre compte Agrolide : c&apos;est gratuit et ça prend 1&nbsp;minute.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Link href={`/inscription?next=${encodeURIComponent(nextPath)}`} className="flex-1 px-4 py-3 bg-success text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Créer mon compte
          </Link>
          <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="flex-1 px-4 py-3 bg-surface-container-lowest text-success border border-success/30 rounded-lg font-medium hover:bg-success-container transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  if (error || !pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-error-container rounded-xl">
        <p className="text-error font-medium">{error || 'Erreur'}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center bg-surface-container rounded-xl overflow-hidden border border-outline-variant relative">
      
      {/* Bandeau permanent pour les visiteurs */}
      {showEncarts && (
        <div className="sticky top-0 w-full bg-success text-on-success px-3 py-2 flex items-center justify-between gap-3 z-20 text-xs sm:text-sm">
          <span className="flex items-center min-w-0">
            <Info className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              Mode visiteur{readCount > 0 && <> : <strong>{readCount}/{readLimit}</strong> documents gratuits</>} · Lisez sans pub en créant un compte
            </span>
          </span>
          <Link href={`/inscription?next=${encodeURIComponent(nextPath)}`} className="shrink-0 rounded-md bg-surface-container-lowest px-3 py-1 font-semibold text-on-success-container hover:bg-success-container">
            Créer un compte
          </Link>
        </div>
      )}

      {/* Toolbar */}
      <div className="w-full bg-surface-container-lowest border-b border-outline-variant p-2 sm:p-4 flex flex-wrap items-center justify-between gap-2 shadow-sm z-10">
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => changeScale(-0.2)} 
            className="p-1 sm:p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"
            title="Dézoomer"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-xs sm:text-sm font-medium text-on-surface-variant w-10 sm:w-12 text-center">{Math.round(scale * 100)}%</span>
          <button 
            onClick={() => changeScale(0.2)} 
            className="p-1 sm:p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"
            title="Zoomer"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setViewMode(viewMode === 'single' ? 'continuous' : 'single')}
            className="p-1 sm:p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors flex items-center gap-2 text-xs sm:text-sm font-medium mr-2"
            title="Changer le mode d'affichage"
          >
            {viewMode === 'single' ? <FileStack className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />}
            <span className="hidden sm:inline">{viewMode === 'single' ? 'Défilement continu' : 'Page par page'}</span>
          </button>
          
          {viewMode === 'single' ? (
            <>
              <button
                disabled={pageNumber <= 1}
                onClick={() => changePage(-1)}
                className="p-1 sm:p-2 hover:bg-surface-container rounded-lg disabled:opacity-50 text-on-surface-variant transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs sm:text-sm font-medium text-on-surface-variant">
                Page {pageNumber} / {numPages || '--'}
              </span>
              <button
                disabled={pageNumber >= numPages}
                onClick={() => changePage(1)}
                className="p-1 sm:p-2 hover:bg-surface-container rounded-lg disabled:opacity-50 text-on-surface-variant transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          ) : (
            <span className="text-xs sm:text-sm font-medium text-on-surface-variant">
              {numPages ? `${numPages} pages au total` : 'Chargement...'}
            </span>
          )}
        </div>
      </div>

      {/* Secure PDF Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-[60vh] sm:h-[800px] overflow-auto flex justify-center p-4 sm:p-8 bg-surface-container-high select-none"
        style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<Loader2 className="w-10 h-10 animate-spin text-success mx-auto mt-20" />}
          onLoadError={(err) => {
            console.error("Erreur détaillée react-pdf:", err)
            setError(`Erreur: ${err.message || 'Impossible de charger le PDF'}`)
          }}
          error={<div className="text-error mt-20">Impossible de charger le PDF.</div>}
        >
          <div className="flex flex-col gap-6 items-center w-full">
            {viewMode === 'continuous' ? (
              Array.from(new Array(numPages), (el, index) => (
                <div key={`page_${index + 1}`} className="relative shadow-xl">
                  <Page 
                    pageNumber={index + 1} 
                    scale={scale} 
                    width={containerWidth}
                    renderTextLayer={false} 
                    renderAnnotationLayer={false}
                    className="pointer-events-none" 
                  />
                  
                  {/* Watermark Overlay (Transparent Logo) */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-[0.04] z-50 overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex gap-16 mb-16 transform -rotate-45">
                        <Image src="/agrolide-png.png" alt="Agrolide Watermark" width={300} height={100} className="grayscale" />
                        <Image src="/agrolide-png.png" alt="Agrolide Watermark" width={300} height={100} className="grayscale" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Transparent anti-drag overlay */}
                  <div className="absolute inset-0 z-40 bg-transparent pointer-events-auto" />
                </div>
              )).flatMap((el, index) => [
                el,
                ...(showEncarts && index !== numPages - 1 && index % 3 === 0
                  ? [<EncartInscription key={`encart_${index}`} next={nextPath} />]
                  : []),
              ])
            ) : (
              <div className="relative shadow-xl">
                <Page 
                  pageNumber={pageNumber} 
                  scale={scale} 
                  width={containerWidth}
                  renderTextLayer={false} 
                  renderAnnotationLayer={false}
                  className="pointer-events-none" 
                />
                
                {/* Watermark Overlay (Transparent Logo) */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-[0.04] z-50 overflow-hidden">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex gap-16 mb-16 transform -rotate-45">
                      <Image src="/agrolide-png.png" alt="Agrolide Watermark" width={300} height={100} className="grayscale" />
                      <Image src="/agrolide-png.png" alt="Agrolide Watermark" width={300} height={100} className="grayscale" />
                    </div>
                  ))}
                </div>
                
                {/* Transparent anti-drag overlay */}
                <div className="absolute inset-0 z-40 bg-transparent pointer-events-auto" />
              </div>
            )}
            {viewMode === 'single' && showEncarts && <EncartInscription next={nextPath} variant="compact" />}
          </div>
        </Document>
      </div>
    </div>
  )
}
