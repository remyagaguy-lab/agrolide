'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Ban, Flag, MoreVertical } from 'lucide-react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { ChoiceChip } from '@/components/ui/ChoiceChip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { IconButton } from '@/components/ui/IconButton'
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { bloquerMembre, signalerMembre } from '@/app/actions/blocages'
import { MOTIFS_SIGNALEMENT, type MotifSignalement } from '@/lib/reseau/blocage'

/**
 * Menu « Bloquer / Signaler » d'un membre (fiche et messagerie). Chaque action passe par une confirmation (`Modal`) ;
 * le motif d'un signalement se choisit dans une liste fermée. Après un blocage, `apresBlocage` est appelé
 * (par défaut : retour à l'annuaire, la fiche n'étant plus consultable).
 */
export function MembreActionsMenu({ memberId, name, apresBlocage }: { memberId: string; name: string; apresBlocage?: () => void }) {
  const router = useRouter()
  const { toast } = useToast()
  const [bloquerOuvert, setBloquerOuvert] = React.useState(false)
  const [signalerOuvert, setSignalerOuvert] = React.useState(false)
  const [motif, setMotif] = React.useState<MotifSignalement | null>(null)
  const [bloquerAussi, setBloquerAussi] = React.useState(false)
  const [erreur, setErreur] = React.useState<string | null>(null)
  const [pending, start] = React.useTransition()

  const fin = () => (apresBlocage ? apresBlocage() : router.push('/membres/annuaire'))

  const bloquer = () => {
    setErreur(null)
    start(async () => {
      const res = await bloquerMembre(memberId)
      if (res.success) {
        setBloquerOuvert(false)
        toast({ title: `${name} est bloqué(e).`, variant: 'success' })
        fin()
      } else setErreur(res.error)
    })
  }

  const signaler = () => {
    if (!motif) return
    setErreur(null)
    start(async () => {
      const res = await signalerMembre({ id: memberId, motif, bloquer: bloquerAussi })
      if (res.success) {
        setSignalerOuvert(false)
        toast({ title: 'Signalement envoyé.', description: 'L’équipe d’administration le consultera.', variant: 'success' })
        setMotif(null)
        if (bloquerAussi) fin()
        setBloquerAussi(false)
      } else setErreur(res.error)
    })
  }

  const ouvrir = (quoi: 'bloquer' | 'signaler') => {
    setErreur(null)
    if (quoi === 'bloquer') setBloquerOuvert(true)
    else setSignalerOuvert(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton label={`Plus d’actions concernant ${name}`} variant="outline">
            <MoreVertical className="size-5" aria-hidden />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => ouvrir('signaler')}>
            <Flag className="size-5" aria-hidden />
            Signaler ce membre
          </DropdownMenuItem>
          <DropdownMenuItem destructive onSelect={() => ouvrir('bloquer')}>
            <Ban className="size-5" aria-hidden />
            Bloquer ce membre
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal open={bloquerOuvert} onOpenChange={setBloquerOuvert}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Bloquer {name} ?</ModalTitle>
            <ModalDescription>Voici ce que cela change :</ModalDescription>
          </ModalHeader>
          <ul className="list-disc space-y-1.5 pl-5 text-body-md text-on-surface">
            <li>Vous ne vous voyez plus l’un l’autre dans l’annuaire, les suggestions ni sur les fiches.</li>
            <li>Plus aucune invitation n’est possible entre vous.</li>
            <li>Votre relation, si elle existe, est supprimée : vous ne pouvez plus vous écrire. Vos anciens messages restent.</li>
            <li>{name} n’est pas prévenu(e).</li>
          </ul>
          <p className="text-body-sm text-on-surface-variant">Vous pouvez débloquer ce membre à tout moment dans « Confidentialité du profil ». Le lien supprimé ne revient pas : il faudra vous inviter de nouveau.</p>
          <div aria-live="polite">{erreur && <Alert variant="error">{erreur}</Alert>}</div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setBloquerOuvert(false)}>Annuler</Button>
            <Button variant="secondary" onClick={bloquer} loading={pending}>Bloquer ce membre</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal open={signalerOuvert} onOpenChange={setSignalerOuvert}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Signaler {name}</ModalTitle>
            <ModalDescription>Choisissez le motif. L’équipe d’administration consultera votre signalement ; {name} n’en est pas informé(e).</ModalDescription>
          </ModalHeader>
          <fieldset className="space-y-2">
            <legend className="mb-2 text-label-lg text-on-surface">Motif du signalement</legend>
            {MOTIFS_SIGNALEMENT.map((m) => (
              <ChoiceChip key={m.value} name="motif" value={m.value} checked={motif === m.value} onChange={() => setMotif(m.value)} className="block">
                {m.label}
              </ChoiceChip>
            ))}
          </fieldset>
          <ChoiceChip type="checkbox" checked={bloquerAussi} onChange={(e) => setBloquerAussi(e.target.checked)}>
            Bloquer aussi ce membre
          </ChoiceChip>
          <div aria-live="polite">{erreur && <Alert variant="error">{erreur}</Alert>}</div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setSignalerOuvert(false)}>Annuler</Button>
            <Button variant="secondary" onClick={signaler} loading={pending} disabled={!motif}>Envoyer le signalement</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
