'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Download, Loader2, AlertCircle, Lock } from 'lucide-react'
import { checkTrocEligibility, getDocumentUrl } from '@/app/actions/bibliotheque'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/client'

export function DownloadButton({ documentId }: { documentId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()

  const [downloading, setDownloading] = useState(false)
  const [showTrocModal, setShowTrocModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [trocCount, setTrocCount] = useState(0)
  
  const isAuthenticated = isLoaded ? isSignedIn : null

  // Le quota de lectures gratuites est géré par le serveur (cookie signé) : on ouvre simplement le lecteur.
  const handleRead = () => {
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
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-success-container text-success border border-success/30 rounded-lg font-medium hover:bg-success-container transition-colors"
        >
          <Eye className="w-5 h-5" />
          Lire de façon sécurisée (Gratuit)
        </button>
        {isAuthenticated === false && (
          <p className="text-center text-xs text-on-surface-muted font-medium px-2">
            3 documents à lire en entier, sans compte
          </p>
        )}
      </div>

      <button 
        onClick={handleDownload}
        disabled={downloading}
        className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-success text-white text-base rounded-xl font-bold shadow-md hover:bg-green-800 hover:shadow-lg transition disabled:opacity-70"
      >
        {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
        Télécharger le fichier PDF
      </button>

      {error && (
        <p className="mt-2 text-sm text-error font-medium text-center">{error}</p>
      )}

      {/* MODALE DE TROC */}
      {showTrocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-on-surface mb-2">Système de Troc Actif</h3>
            <p className="text-center text-on-surface-variant mb-6">
              Pour télécharger des documents, vous devez contribuer à la plateforme en important <strong>2 documents agricoles pertinents</strong>. 
              <br/><br/>
              Votre progression actuelle : <span className="font-bold text-success">{trocCount} / 2</span> documents validés.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/membres/bibliotheque/deposer" className="w-full text-center px-4 py-3 bg-success text-white rounded-lg font-medium hover:bg-green-800 transition-colors">
                Importer un document
              </Link>
              <button onClick={() => setShowTrocModal(false)} className="w-full px-4 py-3 bg-surface-container text-on-surface-variant rounded-lg font-medium hover:bg-surface-container-high transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE D'AUTHENTIFICATION (Téléchargement) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-center mb-4 mt-2">
              <div className="w-14 h-14 bg-info-container text-info rounded-full flex items-center justify-center">
                <Lock className="w-7 h-7" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center text-on-surface mb-3">Ça vous plaît ? Gardez-le ! 📥</h3>
            <p className="text-center text-on-surface-variant mb-6">
              Le téléchargement est réservé aux membres du réseau Agrolide.
              <br/><br/>
              Créez votre compte gratuit en 1&nbsp;minute : vous pourrez télécharger ce document, lire toute la bibliothèque sans pub, et retrouver vos lectures.
            </p>
            <div className="flex flex-col gap-3">
              <Link href={`/inscription?next=${encodeURIComponent(`/bibliotheque/${documentId}`)}`} className="w-full flex justify-center items-center px-4 py-3 bg-success text-white rounded-lg font-medium hover:bg-green-800 transition-colors">
                Je crée mon compte gratuit
              </Link>
              <Link href={`/login?next=${encodeURIComponent(`/bibliotheque/${documentId}`)}`} className="w-full flex justify-center items-center px-4 py-3 bg-white text-success border border-success/30 rounded-lg font-medium hover:bg-success-container transition-colors">
                Se connecter
              </Link>
              <button onClick={() => setShowAuthModal(false)} className="w-full px-4 py-3 bg-surface-container text-on-surface-variant rounded-lg font-medium hover:bg-surface-container-high transition-colors mt-2">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
