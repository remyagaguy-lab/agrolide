'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/Modal'
import { removeConnection } from '@/app/actions/connections'
import { displayName, type MemberSummary } from '@/lib/reseau/profil'

import { MapPin, MessageCircle, UserMinus } from "@/components/ui/icons"
/**
 * Une relation : qui, ce qu'elle fait, un message en un geste, et le retrait de la relation après confirmation.
 * Le nom ouvre la fiche ; les deux boutons restent des cibles distinctes de 48 px.
 */
export function RelationCard({ member }: { member: MemberSummary }) {
  const router = useRouter()
  const name = displayName(member)
  const headline = [member.specialite, member.organisation].filter(Boolean).join(' · ')
  const place = [member.ville, member.pays].filter(Boolean).join(', ')

  const [open, setOpen] = React.useState(false)
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState('')

  const retirer = () => {
    setError('')
    startTransition(async () => {
      try {
        const res = await removeConnection(member.connectionId ?? '')
        if (res.error) {
          setError(res.error)
          return
        }
        setOpen(false)
        router.refresh()
      } catch {
        setError('Une erreur est survenue. Réessayez dans un instant.')
      }
    })
  }

  return (
    <article className="flex h-full flex-col gap-4 rounded-card border border-outline-variant bg-surface-container-lowest p-5">
      <div className="flex items-start gap-4">
        <Avatar src={member.photo_url} name={name} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="text-title-md text-on-surface">
            <Link href={`/membres/annuaire/${member.id}`} className="inline-flex min-h-11 items-center rounded-tag">
              {name}
            </Link>
          </h3>
          {headline ? (
            <p className="mt-0.5 line-clamp-2 text-body-sm text-on-surface-variant">{headline}</p>
          ) : (
            <p className="mt-0.5 text-body-sm text-on-surface-muted">Métier non renseigné</p>
          )}
          {place && (
            <p className="mt-1 flex items-center gap-1.5 text-body-sm text-on-surface-muted">
              <MapPin className="size-4 shrink-0" aria-hidden />
              <span className="truncate">{place}</span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-1">
        <Button variant="secondary" fullWidth href={`/membres/messages?user=${member.id}`} aria-label={`Écrire un message à ${name}`}>
          <MessageCircle className="size-5" aria-hidden />
          Message
        </Button>
        <Button variant="text" fullWidth onClick={() => setOpen(true)} aria-label={`Retirer ${name} de mes relations`}>
          <UserMinus className="size-5" aria-hidden />
          Retirer de mes relations
        </Button>
      </div>

      <Modal open={open} onOpenChange={(v) => !pending && setOpen(v)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Retirer {name} de vos relations ?</ModalTitle>
            <ModalDescription>
              Vous ne serez plus connecté(e) à ce membre. Il n’en sera pas averti. Vous pourrez lui envoyer une nouvelle invitation plus tard.
            </ModalDescription>
          </ModalHeader>
          {error && (
            <p role="alert" className="text-body-sm text-error">
              {error}
            </p>
          )}
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Annuler
            </Button>
            <Button variant="danger" onClick={retirer} loading={pending}>
              Retirer de mes relations
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </article>
  )
}
