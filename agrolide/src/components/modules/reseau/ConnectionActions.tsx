'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import { acceptConnectionRequest, declineConnectionRequest, sendConnectionRequest } from '@/app/actions/connections'
import type { ConnectionState } from '@/lib/reseau/profil'
import { SuivreOrganisation } from './SuivreOrganisation'

import { Check, Clock, MessageCircle, UserPlus } from "@/components/ui/icons"
/** Même plafond que l'action serveur (qui reste la seule source de vérité). */
const NOTE_MAX = 300

export interface ConnectionActionsProps {
  memberId: string
  /** Prénom ou nom affiché, pour des libellés de bouton précis (lecteurs d'écran). */
  name: string
  state: ConnectionState
  connectionId: string | null
  /** `false` : le membre ne souhaite pas recevoir d'invitations. */
  ouvertContact: boolean | null
  /** Libellé du statut d'une invitation envoyée (« Invitation envoyée » par défaut). */
  libelleEnAttente?: string
  /** Sur une fiche, « Se connecter » est le geste principal de la page : bouton plein plutôt que contour. */
  principal?: boolean
  /** Organisation (Partenaire, compte agrolide) : seul « Suivre » est proposé, ni invitation ni message. */
  organisation?: boolean
  suivi?: boolean
  alertes?: boolean
}

/**
 * Le geste principal d'une carte de membre selon la relation :
 * Se connecter → Invitation envoyée (retirable) ; Accepter / Ignorer ; Message.
 * L'état est mis à jour tout de suite, sans recharger la page, et annoncé aux lecteurs d'écran.
 */
export function ConnectionActions({ memberId, name, state: initialState, connectionId: initialId, ouvertContact, libelleEnAttente = 'Invitation envoyée', principal = false, organisation = false, suivi = false, alertes = true }: ConnectionActionsProps) {
  const [state, setState] = React.useState<ConnectionState>(initialState)
  const [connectionId, setConnectionId] = React.useState<string | null>(initialId)
  const [pending, startTransition] = React.useTransition()
  const { toast } = useToast()
  const notify = (title: string) => toast({ title, variant: 'success' })
  const [error, setError] = React.useState('')
  const [inviter, setInviter] = React.useState(false)
  const [note, setNote] = React.useState('')

  const run = (task: () => Promise<void>) => {
    setError('')
    startTransition(async () => {
      try {
        await task()
      } catch {
        setError('Une erreur est survenue. Réessayez dans un instant.')
      }
    })
  }

  const connect = () =>
    run(async () => {
      const res = await sendConnectionRequest(memberId, note.trim() || undefined)
      if (res && 'success' in res && res.success) {
        setInviter(false)
        setNote('')
        setState('pending_sent')
        setConnectionId(res.connectionId ?? null)
        notify(`Invitation envoyée à ${name}.`)
      } else {
        setError(
          res && 'error' in res && res.error === 'Non autorisé'
            ? 'Votre session a expiré. Reconnectez-vous pour envoyer une invitation.'
            : ((res && 'error' in res && res.error) || 'Impossible d’envoyer l’invitation.'),
        )
      }
    })

  const withdraw = () =>
    run(async () => {
      if (!connectionId) return
      const res = await declineConnectionRequest(connectionId)
      if (res.error) return setError(res.error)
      setState('none')
      setConnectionId(null)
      notify(`Invitation à ${name} retirée.`)
    })

  const accept = () =>
    run(async () => {
      if (!connectionId) return
      const res = await acceptConnectionRequest(connectionId)
      if (res.error) return setError(res.error)
      setState('accepted')
      notify(`Vous êtes maintenant connecté(e) à ${name}.`)
    })

  const ignore = () =>
    run(async () => {
      if (!connectionId) return
      const res = await declineConnectionRequest(connectionId)
      if (res.error) return setError(res.error)
      setState('none')
      setConnectionId(null)
      notify(`Invitation de ${name} ignorée.`)
    })

  if (organisation) return <SuivreOrganisation organisationId={memberId} name={name} suivi={suivi} alertes={alertes} principal={principal} />

  return (
    <div className="flex flex-col gap-2">
      {state === 'none' &&
        (ouvertContact === false ? (
          <p className="text-body-sm text-on-surface-muted">Ce membre ne reçoit pas d’invitations.</p>
        ) : (
          <Button variant={principal ? 'secondary' : 'outline'} fullWidth className="@max-[17rem]:px-2" onClick={() => { setError(''); setInviter(true) }} aria-label={`Se connecter à ${name}`}>
            <UserPlus className="size-5" aria-hidden />
            Se connecter
          </Button>
        ))}

      {state === 'pending_sent' && (
        <>
          <p className="flex min-h-12 items-center justify-center gap-2 rounded-control bg-surface-container text-label-lg text-on-surface-variant @max-[17rem]:text-label-md">
            <Clock className="size-5" aria-hidden />
            {libelleEnAttente}
          </p>
          {connectionId && (
            <Button variant="text" fullWidth className="@max-[17rem]:px-1" onClick={withdraw} loading={pending} aria-label={`Retirer l’invitation envoyée à ${name}`}>
              Retirer l’invitation
            </Button>
          )}
        </>
      )}

      {state === 'pending_received' && (
        <div className="grid grid-cols-2 gap-2 @max-[17rem]:grid-cols-1">
          <Button variant="secondary" className="@max-[17rem]:px-2" onClick={accept} loading={pending} disabled={!connectionId} aria-label={`Accepter l’invitation de ${name}`}>
            <Check className="size-5" aria-hidden />
            Accepter
          </Button>
          <Button variant="outline" className="@max-[17rem]:px-2" onClick={ignore} disabled={pending || !connectionId} aria-label={`Ignorer l’invitation de ${name}`}>
            Ignorer
          </Button>
        </div>
      )}

      {state === 'accepted' && (
        <Button variant="secondary" fullWidth className="@max-[17rem]:px-2" href={`/membres/messages?user=${memberId}`} aria-label={`Écrire un message à ${name}`}>
          <MessageCircle className="size-5" aria-hidden />
          Message
        </Button>
      )}

      {error && (
        <p role="alert" className="text-body-sm text-error">
          {error}{' '}
          {error.includes('Reconnectez-vous') && (
            <Link href="/login" className="font-semibold underline">
              Se connecter
            </Link>
          )}
        </p>
      )}

      <Modal open={inviter} onOpenChange={setInviter}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Inviter {name}</ModalTitle>
            <ModalDescription>Vous pouvez joindre une courte note pour dire pourquoi vous souhaitez vous connecter. Elle est facultative.</ModalDescription>
          </ModalHeader>
          <Textarea
            label="Note (facultative)"
            hint={`${note.length}/${NOTE_MAX} caractères`}
            value={note}
            maxLength={NOTE_MAX}
            rows={4}
            onChange={(e) => setNote(e.target.value)}
          />
          {error && <p role="alert" className="text-body-sm text-error">{error}</p>}
          <ModalFooter>
            <Button variant="outline" onClick={() => setInviter(false)}>Annuler</Button>
            <Button variant="secondary" onClick={connect} loading={pending}>Envoyer l’invitation</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
