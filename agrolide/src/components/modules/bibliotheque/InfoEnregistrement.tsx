'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/Button'
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/Modal'
import { AVANTAGES_APPLICATION } from '@/components/pwa/InvitationInstallation'
import { useInstallation } from '@/lib/pwa-installation'
import { Check, Download, Share2 } from '@/components/ui/icons'
import type { EtatTelechargement } from './useTelechargementHorsLigne'

const CLE = 'ag-hl-info'
/** Le cadre explicatif s'affiche aux trois premiers enregistrements, puis cesse (le membre a compris). */
const MAX = 3

/**
 * Cadre qui s'ouvre quand un document vient d'être enregistré dans l'application : ce que « Télécharger » a fait
 * (copie dans l'application, lisible sans connexion), et l'installation de l'application si elle ne l'est pas encore.
 */
export function InfoEnregistrement({ etat }: { etat: EtatTelechargement }) {
  const [ouvert, setOuvert] = useState(false)
  const avant = useRef(etat)
  const { peutProposer, invite, installer } = useInstallation()

  useEffect(() => {
    if (avant.current === 'progression' && etat === 'fait') {
      let n = 0
      try {
        n = Number(localStorage.getItem(CLE)) || 0
        if (n < MAX) localStorage.setItem(CLE, String(n + 1))
      } catch {}
      if (n < MAX) setOuvert(true)
    }
    avant.current = etat
  }, [etat])

  return (
    <Modal open={ouvert} onOpenChange={setOuvert}>
      <ModalContent>
        <ModalHeader>
          <span className="mb-1 flex size-12 items-center justify-center rounded-full bg-success-container text-on-success-container">
            <Download className="size-6" aria-hidden />
          </span>
          <ModalTitle>Document enregistré dans l&apos;application</ModalTitle>
          <ModalDescription>
            Il n&apos;est pas téléchargé comme un fichier : agrolide le garde pour vous. Retrouvez-le à tout moment, même sans connexion,
            dans « Documents hors ligne » (30 jours, effacé à la déconnexion).
          </ModalDescription>
        </ModalHeader>

        {peutProposer && (
          <div className="rounded-card bg-surface-container-low p-4">
            <p className="text-title-sm text-on-surface">Installez l&apos;application pour tout retrouver en un geste</p>
            <ul className="mt-2 space-y-1.5">
              {AVANTAGES_APPLICATION.map((a) => (
                <li key={a} className="flex items-start gap-2 text-body-md text-on-surface-variant">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
            {invite ? (
              <Button
                variant="secondary"
                className="mt-3"
                onClick={async () => {
                  if (await installer()) setOuvert(false)
                }}
              >
                Installer l&apos;application
              </Button>
            ) : (
              <p className="mt-3 text-body-md text-on-surface-variant">
                Touchez <Share2 className="inline size-4 align-text-bottom" aria-hidden />
                <span className="font-medium text-on-surface"> Partager</span>, puis{' '}
                <span className="font-medium text-on-surface">Sur l&apos;écran d&apos;accueil</span>.
              </p>
            )}
          </div>
        )}

        <ModalFooter>
          <Button variant="text" onClick={() => setOuvert(false)}>
            Fermer
          </Button>
          <Link href="/membres/bibliotheque/hors-ligne" className={buttonVariants({ variant: 'outline' })}>
            Documents hors ligne
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
