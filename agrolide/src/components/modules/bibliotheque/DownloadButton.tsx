'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkTrocEligibility, getDocumentUrl } from '@/app/actions/bibliotheque'
import { useAuth } from '@/lib/auth/client'
import { Button } from '@/components/ui/Button'
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/Modal'

import { Eye, Download, AlertTriangle, Lock } from "@/components/ui/icons"
/**
 * Gestes de la fiche : lire en ligne (le geste principal, gratuit) et télécharger (réservé aux membres, avec le troc).
 * Le bouton orange de la vue, c'est la lecture.
 */
export function DownloadButton({ documentId, mode = 'public' }: { documentId: string; mode?: 'membre' | 'public' }) {
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()

  const [downloading, setDownloading] = useState(false)
  const [showTrocModal, setShowTrocModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [trocCount, setTrocCount] = useState(0)

  const isAuthenticated = isLoaded ? isSignedIn : null
  const retour = encodeURIComponent(`/bibliotheque/${documentId}`)

  // Le quota de lectures gratuites est géré par le serveur (cookie signé) : on ouvre simplement le lecteur.
  const handleRead = () => {
    router.push(`${mode === 'membre' ? '/membres' : ''}/bibliotheque/${documentId}/lire`)
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

      const doc = await getDocumentUrl(documentId)
      if (doc.url) {
        const a = document.createElement('a')
        a.href = doc.url
        a.download = `Document-${documentId}.pdf` // le navigateur gère le nom
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
      <div className="space-y-2">
        <Button type="button" variant="primary" fullWidth onClick={handleRead}>
          <Eye className="size-5" aria-hidden />
          Lire en ligne
        </Button>
        {isAuthenticated === false && (
          <p className="text-center text-label-md text-on-surface-variant">5 documents à lire en entier, sans compte</p>
        )}
      </div>

      <Button type="button" variant="outline" fullWidth onClick={handleDownload} loading={downloading}>
        {!downloading && <Download className="size-5" aria-hidden />}
        Télécharger le PDF
      </Button>

      {error && (
        <p role="alert" className="text-center text-body-sm text-error">
          {error}
        </p>
      )}

      {/* Troc : pour télécharger, il faut avoir déposé deux documents */}
      <Modal open={showTrocModal} onOpenChange={setShowTrocModal}>
        <ModalContent>
          <ModalHeader>
            <span className="mb-1 flex size-12 items-center justify-center rounded-full bg-warning-container text-on-warning-container">
              <AlertTriangle className="size-6" aria-hidden />
            </span>
            <ModalTitle>Le téléchargement s’obtient par le troc</ModalTitle>
            <ModalDescription>
              Pour télécharger des documents, partagez d’abord <strong>2 documents agricoles pertinents</strong> avec le réseau.
              Votre progression : <strong>{trocCount} / 2</strong> documents validés.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => setShowTrocModal(false)}>
              Plus tard
            </Button>
            <Button variant="secondary" href="/membres/bibliotheque/deposer">
              Partager un document
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Téléchargement réservé aux membres */}
      <Modal open={showAuthModal} onOpenChange={setShowAuthModal}>
        <ModalContent>
          <ModalHeader>
            <span className="mb-1 flex size-12 items-center justify-center rounded-full bg-info-container text-on-info-container">
              <Lock className="size-6" aria-hidden />
            </span>
            <ModalTitle>Ce document vous plaît ? Gardez-le.</ModalTitle>
            <ModalDescription>
              Le téléchargement est réservé aux membres du réseau Agrolide. Créez votre compte gratuit en 1&nbsp;minute : vous
              pourrez télécharger ce document, lire toute la bibliothèque et retrouver vos lectures.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="outline" href={`/login?next=${retour}`}>
              Se connecter
            </Button>
            <Button variant="secondary" href={`/inscription?next=${retour}`}>
              Créer mon compte gratuit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
