'use client'

import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { nePlusSuivreOrganisation, suivreOrganisation } from '@/app/actions/suivi'
import { AGROLIDE_ID } from '@/lib/suivi/organisation'
import { Check, UserPlus } from '@/components/ui/icons'

export interface SuivreOrganisationProps {
  organisationId: string
  name: string
  suivi: boolean
  principal?: boolean
}

/**
 * Le seul geste proposé pour une organisation : « Suivre », puis « Abonné ».
 * Se désabonner demande une confirmation qui rappelle les alertes perdues. Une organisation ne reçoit pas d'invitation de
 * connexion ; ses abonnés ne sont visibles que d'elle.
 */
export function SuivreOrganisation({ organisationId, name, suivi: initial, principal = false }: SuivreOrganisationProps) {
  const [suivi, setSuivi] = React.useState(initial)
  const [confirmer, setConfirmer] = React.useState(false)
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState('')
  const { toast } = useToast()
  const estAgrolide = organisationId === AGROLIDE_ID

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
      toast({ title: estAgrolide ? `Vous suivez ${name} : vous recevrez ses alertes.` : `Vous suivez ${name}.`, variant: 'success' })
    })

  const arreter = () =>
    run(async () => {
      const res = await nePlusSuivreOrganisation(organisationId)
      if ('error' in res) return setError(res.error)
      setSuivi(false)
      setConfirmer(false)
      toast({ title: `Vous ne suivez plus ${name}.`, variant: 'success' })
    })

  return (
    <div className="flex flex-col gap-2">
      {!suivi ? (
        <Button variant={principal ? 'secondary' : 'outline'} fullWidth className="@max-[17rem]:px-2" onClick={suivre} loading={pending} aria-label={`Suivre ${name}`}>
          <UserPlus className="size-5" aria-hidden />
          Suivre
        </Button>
      ) : (
        <Button variant="outline" fullWidth className="@max-[17rem]:px-2" onClick={() => { setError(''); setConfirmer(true) }} aria-label={`Abonné à ${name} : ne plus suivre`}>
          <Check className="size-5" aria-hidden />
          Abonné
        </Button>
      )}
      {error && !confirmer && (
        <p role="alert" className="text-body-sm text-error">
          {error}
        </p>
      )}

      <Modal open={confirmer} onOpenChange={(v) => !pending && setConfirmer(v)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Ne plus suivre {name} ?</ModalTitle>
            <ModalDescription>
              {estAgrolide
                ? 'Vous ne recevrez plus les alertes d’opportunités, d’événements ni les autres notifications de la plateforme. Vous pourrez vous réabonner à tout moment.'
                : `Vous ne recevrez plus les alertes liées aux publications de ${name}. Vous pourrez vous réabonner à tout moment.`}
            </ModalDescription>
          </ModalHeader>
          {error && (
            <p role="alert" className="text-body-sm text-error">
              {error}
            </p>
          )}
          <ModalFooter>
            <Button variant="outline" onClick={() => setConfirmer(false)} disabled={pending}>
              Rester abonné
            </Button>
            <Button variant="danger" onClick={arreter} loading={pending}>
              Ne plus suivre
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
