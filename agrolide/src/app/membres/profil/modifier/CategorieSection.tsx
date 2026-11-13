"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Alert } from "@/components/ui/Alert"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { FormField } from "@/components/ui/FormField"
import { NativeSelect } from "@/components/ui/Select"
import { ChevronDown } from "@/components/ui/icons"
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/Modal"
import { useToast } from "@/components/ui/Toast"
import { annulerDemandeCategorie, changerCategorie } from "@/app/actions/profil"
import {
  CATEGORIES_ADHESION,
  DATE_FIN_GRATUITE_LISIBLE,
  estCategorie,
  formaterDate,
  formaterFcfa,
  gratuiteEnCours,
  libelleCategorie,
  tarifAnnuel,
  type CategorieAdhesion,
} from "@/lib/adhesion"
import { demandeValidation, evaluerChangement } from "@/lib/categorie"

export interface DemandeOuverte {
  categorie: string
  statut: "en_attente" | "programmee"
  effetLe: string | null
}

const DESCRIPTIONS: Record<CategorieAdhesion, string> = {
  passionne: "Curieux ou non-professionnel, profil gratuit sans limite de durée.",
  junior: "Étudiants, jeunes diplômés, personnes qui débutent dans le secteur.",
  professionnel: "Acteurs du secteur : agronomes, ingénieurs, entrepreneurs.",
  partenaire: "Entreprises, ONG, coopératives, institutions. Validé par un administrateur.",
  senior: "Experts et mentors à forte expérience. Validé par un administrateur.",
}

/** Explication, avant confirmation, de ce qui va se passer (mêmes règles que le serveur). */
function consequence(actuelle: CategorieAdhesion | null, demandee: CategorieAdhesion, finCotisationPayee: string | null): string {
  const ev = evaluerChangement({ actuelle, demandee, finCotisationPayee })
  const nom = `« ${libelleCategorie(demandee)} »`
  if (ev.mode === "validation") {
    return `Le profil ${nom} est validé par un administrateur. Votre catégorie actuelle reste inchangée en attendant sa décision, et vous serez prévenu(e) dans vos notifications.`
  }
  if (ev.mode === "prochaine_echeance") {
    return `Votre cotisation en cours reste valable. Le passage en ${nom} prendra effet le ${formaterDate(ev.effetLe ?? "")}, à la fin de cette cotisation.`
  }
  if (ev.regularisationFcfa > 0) {
    return `Le changement est immédiat. Une régularisation de ${formaterFcfa(ev.regularisationFcfa)} (différence de tarif sur la période restante) sera à régler dans « Ma cotisation ».`
  }
  return gratuiteEnCours()
    ? `Le changement est immédiat et sans frais : votre adhésion est gratuite jusqu'au ${DATE_FIN_GRATUITE_LISIBLE}. Vous pourrez changer de nouveau à tout moment.`
    : `Le changement est immédiat.`
}

export function CategorieSection({
  actuelle,
  finCotisationPayee,
  demandeOuverte,
}: {
  actuelle: string | null
  finCotisationPayee: string | null
  demandeOuverte: DemandeOuverte | null
}) {
  const router = useRouter()
  const { toast } = useToast()
  const categorieActuelle = estCategorie(actuelle) ? actuelle : null
  const [choix, setChoix] = React.useState<CategorieAdhesion | null>(categorieActuelle)
  const [ouvert, setOuvert] = React.useState(false)
  const [deplie, setDeplie] = React.useState(false)
  const [erreur, setErreur] = React.useState("")
  const [pending, startTransition] = React.useTransition()

  const peutChanger = choix !== null && choix !== categorieActuelle

  const confirmer = () => {
    if (!choix) return
    setErreur("")
    startTransition(async () => {
      try {
        const res = await changerCategorie({ categorie: choix })
        if (res.success) {
          setOuvert(false)
          toast({ title: res.mode === "validation" ? "Demande envoyée" : "Catégorie mise à jour", description: res.message, variant: "success" })
          router.refresh()
        } else {
          setErreur(res.error)
        }
      } catch {
        setErreur("Le changement a échoué. Vérifiez votre connexion et réessayez.")
      }
    })
  }

  const annuler = () => {
    startTransition(async () => {
      const res = await annulerDemandeCategorie()
      if (res.success) {
        toast({ title: "Demande annulée", variant: "success" })
        router.refresh()
      } else {
        setErreur(res.error)
      }
    })
  }

  const tarifChoix = choix ? tarifAnnuel(choix) : null

  return (
    <section aria-labelledby="categorie-titre" className="rounded-card border border-outline-variant bg-surface-container-lowest">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-2 md:px-5">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <h2 id="categorie-titre" className="text-label-lg text-on-surface">Catégorie d’adhésion</h2>
          {categorieActuelle ? <Badge variant="category">{libelleCategorie(categorieActuelle)}</Badge> : <span className="text-body-sm text-on-surface-muted">Non choisie</span>}
        </div>
        <Button type="button" variant="text" size="sm" aria-expanded={deplie} aria-controls="categorie-contenu" onClick={() => setDeplie((d) => !d)}>
          {deplie ? "Fermer" : "Changer de catégorie"}
          <ChevronDown className={`size-4 transition-transform ${deplie ? "rotate-180" : ""}`} aria-hidden />
        </Button>
      </div>

      {demandeOuverte && (
        <Alert variant="info" className="mx-4 mb-3 md:mx-5">
          <p>
            {demandeOuverte.statut === "en_attente"
              ? `Votre demande de passage en « ${libelleCategorie(demandeOuverte.categorie)} » attend la validation d'un administrateur.`
              : `Votre passage en « ${libelleCategorie(demandeOuverte.categorie)} » est prévu le ${formaterDate(demandeOuverte.effetLe ?? "")}.`}
          </p>
          <Button type="button" variant="text" size="sm" className="mt-2" onClick={annuler} loading={pending}>
            Annuler cette demande
          </Button>
        </Alert>
      )}

      {deplie && (
        <div id="categorie-contenu" className="space-y-3 border-t border-outline-variant px-4 py-4 md:px-5">
          <p className="text-body-sm text-on-surface-variant">
            {gratuiteEnCours()
              ? `Adhésion gratuite jusqu'au ${DATE_FIN_GRATUITE_LISIBLE} : le changement est libre, sauf pour Partenaire et Sénior, validés par un administrateur.`
              : "Une montée de catégorie s'applique tout de suite avec régularisation du montant ; une baisse s'applique à la prochaine échéance."}
          </p>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,16rem)_1fr] sm:items-end">
            <FormField label="Catégorie souhaitée">
              <NativeSelect value={choix ?? ""} onChange={(e) => setChoix(e.target.value as CategorieAdhesion)}>
                {!categorieActuelle && <option value="" disabled>Choisir…</option>}
                {CATEGORIES_ADHESION.map((c) => (
                  <option key={c} value={c}>{libelleCategorie(c)}{c === categorieActuelle ? " (actuelle)" : ""}</option>
                ))}
              </NativeSelect>
            </FormField>
            {choix && (
              <p className="text-body-sm text-on-surface-muted" aria-live="polite">
                {DESCRIPTIONS[choix]} {tarifChoix ? `Tarif indicatif après la gratuité : ${formaterFcfa(tarifChoix)} par an.` : "Toujours gratuit."}
                {demandeValidation(choix) ? " Sur validation." : ""}
              </p>
            )}
          </div>
          {erreur && !ouvert && <Alert variant="error">{erreur}</Alert>}
          <div className="flex justify-end">
            <Button type="button" variant="outline" disabled={!peutChanger} onClick={() => { setErreur(""); setOuvert(true) }}>
              Valider ce changement
            </Button>
          </div>
        </div>
      )}

      <Modal open={ouvert} onOpenChange={(o) => !pending && setOuvert(o)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Passer en « {choix ? libelleCategorie(choix) : ""} » ?</ModalTitle>
            <ModalDescription>
              {choix ? consequence(categorieActuelle, choix, finCotisationPayee) : ""}
            </ModalDescription>
          </ModalHeader>
          {erreur && <Alert variant="error">{erreur}</Alert>}
          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => setOuvert(false)} disabled={pending}>Annuler</Button>
            <Button type="button" variant="secondary" onClick={confirmer} loading={pending}>
              {choix && demandeValidation(choix) ? "Envoyer la demande" : "Confirmer le changement"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  )
}
