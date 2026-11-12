"use client"

import * as React from "react"
import { Eye, Save } from "lucide-react"
import { Alert } from "@/components/ui/Alert"
import { useToast } from "@/components/ui/Toast"
import { Button } from "@/components/ui/Button"
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/Modal"
import { MemberCard } from "@/components/modules/reseau/MemberCard"
import { CartePubliqueView } from "@/components/modules/reseau/CartePubliqueView"
import type { CartePublique } from "@/lib/reseau/carte-publique"
import { updateConfidentialite } from "@/app/actions/profil"
import type { MemberSummary } from "@/lib/reseau/profil"

interface Props {
  initial: { annuaireVisible: boolean; ouvertContact: boolean; profilPublic: boolean }
  apercu: MemberSummary
  carte: CartePublique
}

function Reglage({ id, titre, description, checked, onChange }: { id: string; titre: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <li>
      <label
        htmlFor={id}
        className="flex min-h-14 cursor-pointer items-start gap-4 rounded-card border border-outline-variant bg-surface-container-lowest p-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus-ring"
      >
        <input id={id} type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span
          aria-hidden
          className="relative mt-0.5 h-7 w-12 shrink-0 rounded-full border border-outline bg-surface-container-high transition-colors duration-150 after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-outline after:transition-transform after:duration-150 peer-checked:border-primary peer-checked:bg-primary peer-checked:after:translate-x-5 peer-checked:after:bg-on-primary"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-title-sm text-on-surface">{titre}</span>
          <span className="mt-0.5 block text-body-sm text-on-surface-variant">{description}</span>
        </span>
        <span className="mt-0.5 shrink-0 text-label-md text-on-surface-variant">{checked ? "Activé" : "Désactivé"}</span>
      </label>
    </li>
  )
}

export function ConfidentialiteForm({ initial, apercu, carte }: Props) {
  const [visible, setVisible] = React.useState(initial.annuaireVisible)
  const [contact, setContact] = React.useState(initial.ouvertContact)
  const [publicCard, setPublicCard] = React.useState(initial.profilPublic)
  const [saved, setSaved] = React.useState(initial)
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null)
  const [pending, startTransition] = React.useTransition()
  const { toast } = useToast()

  // Sans présence dans l'annuaire, il n'y a pas de carte publique (le serveur applique la même règle).
  const carteActive = visible && publicCard
  const modifie = visible !== saved.annuaireVisible || contact !== saved.ouvertContact || carteActive !== saved.profilPublic

  const [confirmer, setConfirmer] = React.useState(false)
  const [confirmerPublic, setConfirmerPublic] = React.useState(false)

  const soumettre = (e: React.FormEvent) => {
    e.preventDefault()
    // Masquer son profil a des conséquences : on les explique et on demande confirmation avant d'enregistrer.
    if (saved.annuaireVisible && !visible) setConfirmer(true)
    // Rendre sa carte visible sans compte est un choix qu'on confirme en connaissance de cause.
    else if (!saved.profilPublic && carteActive) setConfirmerPublic(true)
    else enregistrer()
  }

  const enregistrer = () => {
    setConfirmer(false)
    setConfirmerPublic(false)
    setMessage(null)
    startTransition(async () => {
      try {
        const res = await updateConfidentialite({ annuaire_visible: visible, ouvert_contact: contact, profil_public: carteActive })
        if (res.success) {
          setSaved({ annuaireVisible: visible, ouvertContact: contact, profilPublic: carteActive })
          toast({ title: "Vos choix sont enregistrés", variant: "success" })
        } else {
          setMessage({ type: "error", text: res.error })
        }
      } catch {
        setMessage({ type: "error", text: "L’enregistrement a échoué. Vérifiez votre connexion et réessayez." })
      }
    })
  }

  return (
    <div className="space-y-8">
      <form onSubmit={soumettre} className="space-y-4">
        <ul className="space-y-3">
          <Reglage
            id="reglage-annuaire"
            titre="Apparaître dans l’annuaire et les suggestions"
            description="Si vous le désactivez, les autres membres ne vous voient plus dans l’annuaire ni dans les suggestions, et votre fiche n’est plus consultable."
            checked={visible}
            onChange={(v) => { setVisible(v); setMessage(null) }}
          />
          <Reglage
            id="reglage-contact"
            titre="Recevoir des invitations et des messages"
            description="Si vous le désactivez, votre carte indique que vous ne recevez pas d’invitations et le bouton pour vous inviter disparaît."
            checked={contact}
            onChange={(v) => { setContact(v); setMessage(null) }}
          />
          <Reglage
            id="reglage-public"
            titre="Carte publique visible sans compte"
            description="Si vous l’activez, une personne sans compte qui a le lien de votre fiche voit votre prénom, l’initiale de votre nom, votre photo, votre spécialité, votre pays et 3 thématiques au plus. Cette page n’est pas proposée aux moteurs de recherche. Désactivée par défaut."
            checked={carteActive}
            onChange={(v) => { setPublicCard(v); setMessage(null) }}
          />
        </ul>

        {saved.annuaireVisible && !visible && (
          <Alert variant="warning">Vous allez masquer votre profil. Les conséquences vous seront détaillées avant l’enregistrement.</Alert>
        )}

        <div aria-live="polite">{message && <Alert variant={message.type}>{message.text}</Alert>}</div>

        <Button type="submit" variant="secondary" loading={pending} disabled={!modifie}>
          <Save className="size-5" aria-hidden />
          Enregistrer mes choix
        </Button>
      </form>

      <div role="group" aria-labelledby="apercu-titre" className="space-y-3">
        <h2 id="apercu-titre" className="flex items-center gap-2 text-title-md text-on-surface">
          <Eye className="size-5" aria-hidden />
          Voir comme un autre membre
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          Voici la carte que les autres membres voient dans l’annuaire, selon les choix ci-dessus (avant enregistrement). Les boutons sont inactifs dans cet aperçu.
        </p>
        {visible ? (
          <div className="max-w-md" inert>
            <MemberCard member={{ ...apercu, ouvert_contact: contact }} />
          </div>
        ) : (
          <Alert variant="info">Vous n’apparaissez pas dans l’annuaire : aucun membre ne voit cette carte.</Alert>
        )}
      </div>
      <div role="group" aria-labelledby="apercu-visiteur-titre" className="space-y-3">
        <h2 id="apercu-visiteur-titre" className="flex items-center gap-2 text-title-md text-on-surface">
          <Eye className="size-5" aria-hidden />
          Voir comme un visiteur
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          Voici ce que voit une personne sans compte qui ouvre votre fiche, selon les choix ci-dessus (avant enregistrement).
        </p>
        {carteActive ? (
          <div className="max-w-md" inert>
            <CartePubliqueView carte={carte} titre="h3" />
          </div>
        ) : (
          <Alert variant="info">Votre carte n’est pas publique : un visiteur voit seulement « Ce profil est réservé aux membres », comme pour un profil inexistant.</Alert>
        )}
      </div>
      <Modal open={confirmerPublic} onOpenChange={setConfirmerPublic}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Rendre votre carte publique ?</ModalTitle>
            <ModalDescription>Toute personne qui a le lien de votre fiche pourra voir, sans compte :</ModalDescription>
          </ModalHeader>
          <ul className="list-disc space-y-1.5 pl-5 text-body-md text-on-surface">
            <li>votre prénom et l’initiale de votre nom ;</li>
            <li>votre photo, votre spécialité et votre pays ;</li>
            <li>3 thématiques au plus.</li>
          </ul>
          <p className="text-body-sm text-on-surface-variant">Votre e-mail, votre téléphone, votre nom complet et le reste de votre fiche restent réservés aux membres. Vous pouvez désactiver la carte à tout moment dans cette page.</p>
          <ModalFooter>
            <Button variant="outline" onClick={() => setConfirmerPublic(false)}>Annuler</Button>
            <Button variant="secondary" onClick={enregistrer} loading={pending}>Rendre ma carte publique</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal open={confirmer} onOpenChange={setConfirmer}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Masquer votre profil ?</ModalTitle>
            <ModalDescription>Voici ce que cela change :</ModalDescription>
          </ModalHeader>
          <ul className="list-disc space-y-1.5 pl-5 text-body-md text-on-surface">
            <li>Vous n’apparaissez plus dans l’annuaire ni dans les suggestions.</li>
            <li>Votre fiche n’est plus consultable par les autres membres.</li>
            <li>Personne ne peut plus vous inviter à vous connecter.</li>
            <li>Les invitations en attente, reçues ou envoyées, disparaissent de « Mon réseau » tant que votre profil est masqué.</li>
            <li>Vos relations actuelles sont conservées.</li>
          </ul>
          <p className="text-body-sm text-on-surface-variant">Vous pouvez réactiver votre profil à tout moment dans cette page.</p>
          <ModalFooter>
            <Button variant="outline" onClick={() => setConfirmer(false)}>Annuler</Button>
            <Button variant="secondary" onClick={enregistrer} loading={pending}>Masquer mon profil</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
