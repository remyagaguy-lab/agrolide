'use client'

import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { nePlusSuivreOrganisation, reglerAlertesOrganisation, suivreOrganisation } from '@/app/actions/suivi'
import { Bell, Check, UserPlus } from '@/components/ui/icons'

export interface SuivreOrganisationProps {
  organisationId: string
  name: string
  suivi: boolean
  /** Alertes de publication activées pour cette organisation (vrai par défaut). */
  alertes: boolean
  principal?: boolean
}

/**
 * Le seul geste proposé pour une organisation : Suivre / Abonné, avec « Ne plus suivre » et un réglage des alertes.
 * Une organisation ne reçoit pas d'invitation de connexion ; ses abonnés ne sont visibles que d'elle.
 */
export function SuivreOrganisation({ organisationId, name, suivi: initial, alertes: alertesInitiales, principal = false }: SuivreOrganisationProps) {
  const [suivi, setSuivi] = React.useState(initial)
  const [alertes, setAlertes] = React.useState(alertesInitiales)
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState('')
  const { toast } = useToast()

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

  const suivre = () =>
    run(async () => {
      const res = await suivreOrganisation(organisationId)
      if ('error' in res) return setError(res.error)
      setSuivi(true)
      setAlertes(true)
      toast({ title: `Vous suivez ${name}.`, variant: 'success' })
    })

  const arreter = () =>
    run(async () => {
      const res = await nePlusSuivreOrganisation(organisationId)
      if ('error' in res) return setError(res.error)
      setSuivi(false)
      toast({ title: `Vous ne suivez plus ${name}.`, variant: 'success' })
    })

  const regler = () =>
    run(async () => {
      const res = await reglerAlertesOrganisation(organisationId, !alertes)
      if ('error' in res) return setError(res.error)
      setAlertes(!alertes)
      toast({ title: alertes ? `Alertes de ${name} coupées.` : `Alertes de ${name} rétablies.`, variant: 'success' })
    })

  return (
    <div className="flex flex-col gap-2">
      {!suivi ? (
        <Button variant={principal ? 'secondary' : 'outline'} fullWidth className="@max-[17rem]:px-2" onClick={suivre} loading={pending} aria-label={`Suivre ${name}`}>
          <UserPlus className="size-5" aria-hidden />
          Suivre
        </Button>
      ) : (
        <>
          <p className="flex min-h-12 items-center justify-center gap-2 rounded-control bg-surface-container text-label-lg text-on-surface-variant @max-[17rem]:text-label-md">
            <Check className="size-5" aria-hidden />
            Abonné
          </p>
          <div className="flex flex-wrap justify-center gap-x-2">
            <Button variant="text" className="@max-[17rem]:px-1" onClick={regler} disabled={pending} aria-label={alertes ? `Couper les alertes de ${name}` : `Rétablir les alertes de ${name}`}>
              <Bell className="size-4" aria-hidden />
              {alertes ? 'Couper les alertes' : 'Rétablir les alertes'}
            </Button>
            <Button variant="text" className="@max-[17rem]:px-1" onClick={arreter} disabled={pending} aria-label={`Ne plus suivre ${name}`}>
              Ne plus suivre
            </Button>
          </div>
        </>
      )}
      {error && (
        <p role="alert" className="text-body-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
}
