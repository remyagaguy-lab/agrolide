'use client'

import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/Modal'

export interface ExplicationPermissionProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  titre: string
  /** Une ou deux phrases : à quoi sert l'autorisation. */
  pourquoi: string
  /** Appelé au clic sur « Autoriser » : c'est CE geste qui déclenche la demande du navigateur. */
  onAutoriser: () => void
  libelleAutoriser?: string
}

/**
 * Écran d'explication affiché AVANT la demande système (notifications, etc.). La fenêtre du navigateur ne peut pas être
 * remplacée ni personnalisée : on la précède d'un message clair. « Plus tard » ne déclenche aucune demande,
 * donc l'autorisation n'est pas refusée définitivement par un réflexe.
 */
export function ExplicationPermission({ open, onOpenChange, titre, pourquoi, onAutoriser, libelleAutoriser = 'Autoriser' }: ExplicationPermissionProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{titre}</ModalTitle>
          <ModalDescription>{pourquoi}</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button type="button" variant="text" onClick={() => onOpenChange(false)}>
            Plus tard
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              onOpenChange(false)
              onAutoriser()
            }}
          >
            {libelleAutoriser}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
