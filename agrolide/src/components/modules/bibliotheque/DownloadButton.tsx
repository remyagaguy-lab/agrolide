'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Download, Loader2, AlertCircle, Lock } from 'lucide-react'
import { checkTrocEligibility, getDocumentUrl } from '@/app/actions/bibliotheque'
import Link from 'next/link'

export function DownloadButton({ documentId }: { documentId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const [downloading, setDownloading] = useState(false)
  const [showTrocModal, setShowTrocModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showQuotaModal, setShowQuotaModal] = useState(false)
  const [trocCount, setTrocCount] = useState(0)
  
  const [readDocsCount, setReadDocsCount] = useState<number | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check local storage for read documents
    const docs = JSON.parse(localStorage.getItem('agrolide_read_docs') || '[]')
    setReadDocsCount(docs.length)
    
    // Check if user is authenticated client-side to show/hide the counter
    const fetchAuth = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data } = await supabase.auth.getSession()
        setIsAuthenticated(!!data.session)
      } catch (e) {
        setIsAuthenticated(false)
      }
    }
    fetchAuth()
  }, [])

  const handleRead = async () => {
    const eligibility = await checkTrocEligibility()
    if (!eligibility.authorized && eligibility.reason === 'unauthenticated') {
      // Unauthenticated user logic for reading
      const savedDocsStr = localStorage.getItem('agrolide_read_docs')
      const readDocs: string[] = savedDocsStr ? JSON.parse(savedDocsStr) : []
      
      if (readDocs.includes(documentId)) {
        // Already unlocked, allow reading without consuming quota
        router.push(`/bibliotheque/${documentId}/lire`)
        return
      }
      
      if (readDocs.length >= 5) {
        // Quota reached
        setShowQuotaModal(true)
        return
      }
      
      // Consume quota
      readDocs.push(documentId)
      localStorage.setItem('agrolide_read_docs', JSON.stringify(readDocs))
      setReadDocsCount(readDocs.length)
      
      // Redirect
      router.push(`/bibliotheque/${documentId}/lire`)
      return
    }
    // Redirige vers le lecteur sécurisé interne
    router.push(`/bibliotheque/${documentId}/lire`)
  }

  const handleDownload = async () => {
    setDownloading(true)
    setError(null)
    
    try {
      const eligibility = await checkTrocEligibility()
      
      if (!eligibility.authorized) {
        if (eligibility.reason === 'unauthenticated') {
          setShowAuthModal(true)
          return
        }
        if (eligibility.reason === 'quota_not_met') {
          setTrocCount(eligibility.count)
          setShowTrocModal(true)
          return
        }
      }

      // Authorization passed! Get download URL
      const doc = await getDocumentUrl(documentId)
      if (doc.url) {
        // Trigger download
        const a = document.createElement('a')
        a.href = doc.url
        a.download = `Document-${documentId}.pdf` // Navigateur gère le nom
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } else {
        setError(doc.error || 'Erreur inconnue')
      }
    } catch (err) {
      console.error(err)
      setError('Une erreur est survenue')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <button 
          onClick={handleRead}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium hover:bg-green-100 transition-colors"
        >
          <Eye className="w-5 h-5" />
          Lire de façon sécurisée (Gratuit)
        </button>
        {isAuthenticated === false && readDocsCount !== null && (
          <p className="text-center text-xs text-gray-500 font-medium px-2">
            Quota gratuit : <span className={readDocsCount >= 5 ? 'text-red-500 font-bold' : 'text-green-600'}>{readDocsCount}/5</span> documents consultés
          </p>
        )}
      </div>

      <button 
        onClick={handleDownload}
        disabled={downloading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-70"
      >
        {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
        Télécharger le fichier PDF
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium text-center">{error}</p>
      )}

      {/* MODALE DE TROC */}
      {showTrocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Système de Troc Actif</h3>
            <p className="text-center text-gray-600 mb-6">
              Pour télécharger des documents, vous devez contribuer à la plateforme en important <strong>2 documents agricoles pertinents</strong>. 
              <br/><br/>
              Votre progression actuelle : <span className="font-bold text-green-700">{trocCount} / 2</span> documents validés.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/membres/bibliotheque/deposer" className="w-full text-center px-4 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors">
                Importer un document
              </Link>
              <button onClick={() => setShowTrocModal(false)} className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE D'AUTHENTIFICATION (Téléchargement) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-center mb-4 mt-2">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Lock className="w-7 h-7" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-3">Accès Réservé</h3>
            <p className="text-center text-gray-600 mb-6">
              Pour accéder à l'intégralité de notre bibliothèque, lire en mode sécurisé ou télécharger des documents pour les conserver, vous devez avoir un compte.
              <br/><br/>
              Rejoignez le Réseau Agrolide pour profiter de toutes nos ressources !
            </p>
            <div className="flex flex-col gap-3">
              <Link href={`/inscription?redirect=/bibliotheque/${documentId}`} className="w-full flex justify-center items-center px-4 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors">
                Créer un compte
              </Link>
              <Link href={`/login?redirect=/bibliotheque/${documentId}`} className="w-full flex justify-center items-center px-4 py-3 bg-white text-green-700 border border-green-200 rounded-lg font-medium hover:bg-green-50 transition-colors">
                Se connecter
              </Link>
              <button onClick={() => setShowAuthModal(false)} className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors mt-2">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE QUOTA ATTEINT */}
      {showQuotaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-center mb-4 mt-2">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-3">Quota Gratuit Atteint</h3>
            <p className="text-center text-gray-600 mb-6">
              Vous avez épuisé votre quota de <strong>5 consultations gratuites</strong>.
              <br/><br/>
              Pour continuer à explorer notre bibliothèque et télécharger des documents, créez un compte gratuitement en quelques secondes !
            </p>
            <div className="flex flex-col gap-3">
              <Link href={`/inscription?redirect=/bibliotheque/${documentId}`} className="w-full flex justify-center items-center px-4 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors">
                Créer mon compte
              </Link>
              <Link href={`/login?redirect=/bibliotheque/${documentId}`} className="w-full flex justify-center items-center px-4 py-3 bg-white text-green-700 border border-green-200 rounded-lg font-medium hover:bg-green-50 transition-colors">
                J'ai déjà un compte
              </Link>
              <button onClick={() => setShowQuotaModal(false)} className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors mt-2">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
