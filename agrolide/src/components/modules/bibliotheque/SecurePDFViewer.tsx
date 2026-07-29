'use client'

import { useState, useEffect, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, FileStack } from 'lucide-react'
import Image from 'next/image'

// Configurer le worker pour pdf.js avec un fichier local (mouchard + fiabilité)
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

export function SecurePDFViewer({ documentId }: { documentId: string }) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [scale, setScale] = useState<number>(1.0)
  const [viewMode, setViewMode] = useState<'single' | 'continuous'>('continuous')
  const [containerWidth, setContainerWidth] = useState<number>()
  const containerRef = useRef<HTMLDivElement>(null)

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
    const fetchSecureUrl = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!, 
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data: { session } } = await supabase.auth.getSession()

        // L'API route proxie maintenant directement le flux binaire
        // Nous donnons juste l'URL à react-pdf qui se chargera du fetch
        setPdfUrl(`/api/bibliotheque/download/${documentId}`)
      } catch (err: any) {
        setError(err.message || 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }
    fetchSecureUrl()
  }, [documentId])

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
      <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 rounded-xl">
        <Loader2 className="w-10 h-10 animate-spin text-green-700 mb-4" />
        <p className="text-gray-500 font-medium">Sécurisation et chargement du document...</p>
      </div>
    )
  }

  if (error || !pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-red-50 rounded-xl">
        <p className="text-red-600 font-medium">{error || 'Erreur'}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
      {/* Toolbar */}
      <div className="w-full bg-white border-b border-gray-200 p-2 sm:p-4 flex flex-wrap items-center justify-between gap-2 shadow-sm z-10">
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => changeScale(-0.2)} 
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            title="Dézoomer"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-xs sm:text-sm font-medium text-gray-600 w-10 sm:w-12 text-center">{Math.round(scale * 100)}%</span>
          <button 
            onClick={() => changeScale(0.2)} 
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            title="Zoomer"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setViewMode(viewMode === 'single' ? 'continuous' : 'single')}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors flex items-center gap-2 text-xs sm:text-sm font-medium mr-2"
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
                className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 text-gray-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                Page {pageNumber} / {numPages || '--'}
              </span>
              <button
                disabled={pageNumber >= numPages}
                onClick={() => changePage(1)}
                className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 text-gray-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          ) : (
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              {numPages ? `${numPages} pages au total` : 'Chargement...'}
            </span>
          )}
        </div>
      </div>

      {/* Secure PDF Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-[60vh] sm:h-[800px] overflow-auto flex justify-center p-4 sm:p-8 bg-[#e5e5e5] select-none"
        style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<Loader2 className="w-10 h-10 animate-spin text-green-700 mx-auto mt-20" />}
          onLoadError={(err) => {
            console.error("Erreur détaillée react-pdf:", err)
            setError(`Erreur: ${err.message || 'Impossible de charger le PDF'}`)
          }}
          error={<div className="text-red-500 mt-20">Impossible de charger le PDF.</div>}
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
              ))
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
          </div>
        </Document>
      </div>
    </div>
  )
}
