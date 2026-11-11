'use client'

import * as React from 'react'
import Link from 'next/link'
import { Check, Clock, MessageCircle, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { acceptConnectionRequest, declineConnectionRequest, sendConnectionRequest } from '@/app/actions/connections'
import type { ConnectionState } from '@/lib/reseau/profil'

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
}

/**
 * Le geste principal d'une carte de membre selon la relation :
 * Se connecter → Invitation envoyée (retirable) ; Accepter / Ignorer ; Message.
 * L'état est mis à jour tout de suite, sans recharger la page, et annoncé aux lecteurs d'écran.
 */
export function ConnectionActions({ memberId, name, state: initialState, connectionId: initialId, ouvertContact, libelleEnAttente = 'Invitation envoyée' }: ConnectionActionsProps) {
  const [state, setState] = React.useState<ConnectionState>(initialState)
  const [connectionId, setConnectionId] = React.useState<string | null>(initialId)
  const [pending, startTransition] = React.useTransition()
  const [message, setMessage] = React.useState('')
  const [error, setError] = React.useState('')

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
      const res = await sendConnectionRequest(memberId)
      if (res && 'success' in res && res.success) {
        setState('pending_sent')
        setConnectionId(res.connectionId ?? null)
        setMessage(`Invitation envoyée à ${name}.`)
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
      setMessage(`Invitation à ${name} retirée.`)
    })

  const accept = () =>
    run(async () => {
      if (!connectionId) return
      const res = await acceptConnectionRequest(connectionId)
      if (res.error) return setError(res.error)
      setState('accepted')
      setMessage(`Vous êtes maintenant connecté(e) à ${name}.`)
    })

  const ignore = () =>
    run(async () => {
      if (!connectionId) return
      const res = await declineConnectionRequest(connectionId)
      if (res.error) return setError(res.error)
      setState('none')
      setConnectionId(null)
      setMessage(`Invitation de ${name} ignorée.`)
    })

  return (
    <div className="flex flex-col gap-2">
      {state === 'none' &&
        (ouvertContact === false ? (
          <p className="text-body-sm text-on-surface-muted">Ce membre ne reçoit pas d’invitations.</p>
        ) : (
          <Button variant="outline" fullWidth onClick={connect} loading={pending} aria-label={`Se connecter à ${name}`}>
            <UserPlus className="size-5" aria-hidden />
            Se connecter
          </Button>
        ))}

      {state === 'pending_sent' && (
        <>
          <p className="flex min-h-12 items-center justify-center gap-2 rounded-control bg-surface-container text-label-lg text-on-surface-variant">
            <Clock className="size-5" aria-hidden />
            {libelleEnAttente}
          </p>
          {connectionId && (
            <Button variant="text" fullWidth onClick={withdraw} loading={pending} aria-label={`Retirer l’invitation envoyée à ${name}`}>
              Retirer l’invitation
            </Button>
          )}
        </>
      )}

      {state === 'pending_received' && (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={accept} loading={pending} disabled={!connectionId} aria-label={`Accepter l’invitation de ${name}`}>
            <Check className="size-5" aria-hidden />
            Accepter
          </Button>
          <Button variant="outline" onClick={ignore} disabled={pending || !connectionId} aria-label={`Ignorer l’invitation de ${name}`}>
            Ignorer
          </Button>
        </div>
      )}

      {state === 'accepted' && (
        <Button variant="secondary" fullWidth href={`/membres/messages?user=${memberId}`} aria-label={`Écrire un message à ${name}`}>
          <MessageCircle className="size-5" aria-hidden />
          Message
        </Button>
      )}

      <p role="status" className="sr-only">
        {message}
      </p>
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
    </div>
  )
}
