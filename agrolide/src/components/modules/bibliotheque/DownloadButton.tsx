'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/client'
import { Button } from '@/components/ui/Button'
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/Modal'
import { AnneauProgression, useTelechargementHorsLigne } from './useTelechargementHorsLigne'

import { Check, Download, Eye, Lock } from "@/components/ui/icons"
/**
 * Gestes de la fiche : lire en ligne (le geste principal, gratuit) et télécharger. « Télécharger » enregistre le
 * document dans l'application (jamais comme un fichier) : le membre le relit plus tard, même sans connexion, depuis
 * « Documents hors ligne ». Le bouton orange de la vue, c'est la lecture.
 */
export function DownloadButton({ documentId, titre, mode = 'public' }: { documentId: string; titre?: string; mode?: 'membre' | 'public' }) {
  const router = useRouter()
  const { isSignedIn, isLoaded, userId } = useAuth()
  const isAuthenticated = isLoaded ? isSignedIn : null
  const [showAuthModal, setShowAuthModal] = useState(false)
  const retour = encodeURIComponent(`/bibliotheque/${documentId}`)
  const { etat, progression, telecharger, retirer } = useTelechargementHorsLigne({ documentId, titre, membreId: mode === 'membre' ? userId : null })

  // Le quota de lectures gratuites est géré par le serveur (cookie signé) : on ouvre simplement le lecteur.
  const handleRead = () => {
    router.push(`${mode === 'membre' ? '/membres' : ''}/bibliotheque/${documentId}/lire`)
  }

  const enCours = etat === 'progression'
  const pourcent = progression === null ? null : Math.round(progression)

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

      {mode === 'membre' && etat === 'fait' ? (
        <div className="rounded-card border border-outline-variant bg-surface-container-low p-3 text-center">
          <p className="flex items-center justify-center gap-1.5 text-label-lg font-bold text-on-surface">
            <Check className="size-5 text-success" aria-hidden /> Disponible hors ligne
          </p>
          <p className="mt-1 text-label-md text-on-surface-variant">
            Retrouvez-le à tout moment, même sans connexion, dans{' '}
            <Link href="/membres/bibliotheque/hors-ligne" className="font-medium text-primary underline underline-offset-2">
              Documents hors ligne
            </Link>
            .
          </p>
          <button type="button" onClick={retirer} className="ag-state mt-1 min-h-11 rounded-control px-3 text-label-md font-medium text-on-surface-variant hover:text-error">
            Retirer de cet appareil
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            fullWidth
            disabled={enCours}
            onClick={mode === 'membre' ? telecharger : () => setShowAuthModal(true)}
            aria-busy={enCours}
          >
            {enCours ? (
              <>
                <span role="progressbar" aria-label="Téléchargement" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pourcent ?? undefined} className="flex">
                  <AnneauProgression valeur={progression} className="size-5" />
                </span>
                {pourcent === null ? 'Téléchargement…' : `Téléchargement ${pourcent} %`}
              </>
            ) : (
              <>
                <Download className="size-5" aria-hidden />
                {etat === 'echec' ? 'Échec : réessayer' : 'Télécharger'}
              </>
            )}
          </Button>
          <p className="text-center text-label-md text-on-surface-variant">
            {etat === 'echec'
              ? "Le document n'a pas pu être enregistré. Vérifiez votre connexion et l'espace disponible, puis réessayez."
              : "Enregistre le document dans l'application pour le relire plus tard, même sans connexion. Aucun fichier n'est créé sur votre appareil."}
          </p>
        </div>
      )}

      {/* Réservé aux membres */}
      <Modal open={showAuthModal} onOpenChange={setShowAuthModal}>
        <ModalContent>
          <ModalHeader>
            <span className="mb-1 flex size-12 items-center justify-center rounded-full bg-info-container text-on-info-container">
              <Lock className="size-6" aria-hidden />
            </span>
            <ModalTitle>Ce document vous plaît ? Gardez-le.</ModalTitle>
            <ModalDescription>
              Le téléchargement est réservé aux membres du réseau Agrolide. Créez votre compte gratuit en 1&nbsp;minute : vous
              pourrez enregistrer ce document dans l&apos;application et le relire plus tard, même sans connexion.
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
