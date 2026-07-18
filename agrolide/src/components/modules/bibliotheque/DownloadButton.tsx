'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Download, Loader2, AlertCircle } from 'lucide-react'
import { checkTrocEligibility, getDocumentUrl } from '@/app/actions/bibliotheque'
import Link from 'next/link'

export function DownloadButton({ documentId }: { documentId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const [downloading, setDownloading] = useState(false)
  const [showTrocModal, setShowTrocModal] = useState(false)
  const [trocCount, setTrocCount] = useState(0)

  const handleRead = () => {
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
          router.push('/connexion?redirect=/bibliotheque/' + documentId)
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
      <button 
        onClick={handleRead}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium hover:bg-green-100 transition-colors"
      >
        <Eye className="w-5 h-5" />
        Lire de façon sécurisée (Gratuit)
      </button>

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
    </div>
  )
}
