"use client"

import * as React from "react"
import { Alert } from "@/components/ui/Alert"
import { Button } from "@/components/ui/Button"
import { CATEGORIES_PUSH, TOUTES_CATEGORIES, type CategoriePush } from "@/lib/push/categories"
import { activerPush, changerCategoriesPush, desactiverPush, lireEtatPush, type EtatPush } from "@/lib/push/client"

import { Bell, Loader2 } from "@/components/ui/icons"

/**
 * Réglage des alertes push de CET appareil. La permission du navigateur n'est demandée qu'au clic sur
 * « Activer les alertes » ; rien n'est demandé au chargement de la page.
 */
export function AlertesPush() {
  const [etat, setEtat] = React.useState<EtatPush | null>(null)
  const [occupe, setOccupe] = React.useState(false)
  const [message, setMessage] = React.useState<{ type: "success" | "error" | "info"; texte: string } | null>(null)

  React.useEffect(() => {
    let actif = true
    void lireEtatPush().then((e) => {
      if (actif) setEtat(e)
    })
    return () => {
      actif = false
    }
  }, [])

  const executer = async (tache: () => Promise<void>) => {
    setOccupe(true)
    setMessage(null)
    try {
      await tache()
    } catch (e) {
      setMessage({ type: "error", texte: e instanceof Error && e.message ? e.message : "Une erreur est survenue. Réessayez." })
    } finally {
      setOccupe(false)
    }
  }

  const activer = () =>
    executer(async () => {
      setEtat(await activerPush())
      setMessage({ type: "success", texte: "Alertes activées sur cet appareil." })
    })

  const desactiver = () =>
    executer(async () => {
      await desactiverPush()
      setEtat({ etat: "inactif" })
      setMessage({ type: "info", texte: "Alertes désactivées sur cet appareil." })
    })

  const basculer = (cle: CategoriePush) =>
    executer(async () => {
      if (etat?.etat !== "actif") return
      const suivantes = TOUTES_CATEGORIES.filter((c) => (c === cle ? !etat.categories.includes(c) : etat.categories.includes(c)))
      const enregistrees = await changerCategoriesPush(etat.endpoint, suivantes)
      setEtat({ ...etat, categories: enregistrees })
    })

  const essai = () =>
    executer(async () => {
      const res = await fetch("/api/push/test", { method: "POST", credentials: "same-origin" })
      const d = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(d.error || "L’essai n’a pas pu être envoyé.")
      setMessage({ type: "success", texte: "Alerte d’essai envoyée : elle doit apparaître dans quelques secondes." })
    })

  return (
    <section id="alertes" aria-labelledby="alertes-titre" className="scroll-mt-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-outline-variant bg-primary-container text-primary" aria-hidden>
          <Bell className="size-5" />
        </div>
        <div className="min-w-0">
          <h2 id="alertes-titre" className="text-title-md text-on-surface">Alertes sur cet appareil</h2>
          <p className="mt-0.5 text-body-sm text-on-surface-variant">
            Recevez un signal sur votre téléphone quand quelqu’un vous écrit ou qu’une opportunité est publiée, même si l’application est fermée.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {etat === null && (
          <p className="flex items-center gap-2 text-body-sm text-on-surface-muted"><Loader2 className="size-4 animate-spin" aria-hidden /> Vérification de cet appareil…</p>
        )}

        {etat?.etat === "indisponible" && (
          <Alert variant="info">
            {etat.raison === "ios-installer"
              ? "Sur iPhone, les alertes fonctionnent dans l’application installée : touchez Partager puis « Sur l’écran d’accueil », ouvrez agrolide depuis l’icône, puis revenez ici."
              : "Ce navigateur ne permet pas les alertes. Essayez avec Chrome, Edge ou Firefox, ou avec l’application installée."}
          </Alert>
        )}

        {etat?.etat === "refuse" && (
          <Alert variant="warning">
            Les alertes sont bloquées pour ce site. Pour les autoriser : ouvrez les réglages de votre navigateur (ou de l’application), rubrique « Notifications », autorisez agrolide, puis revenez ici.
          </Alert>
        )}

        {etat?.etat === "inactif" && (
          <Button type="button" variant="secondary" onClick={activer} loading={occupe}>
            <Bell className="size-5" aria-hidden />
            Activer les alertes
          </Button>
        )}

        {etat?.etat === "actif" && (
          <>
            <fieldset disabled={occupe} className="space-y-1">
              <legend className="text-label-lg text-on-surface">Alertes à recevoir</legend>
              {CATEGORIES_PUSH.map((c) => (
                <label key={c.cle} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-control py-2">
                  <input
                    type="checkbox"
                    checked={etat.categories.includes(c.cle)}
                    onChange={() => void basculer(c.cle)}
                    className="mt-0.5 size-5 shrink-0 accent-primary"
                  />
                  <span>
                    <span className="block text-body-md font-medium text-on-surface">{c.libelle}</span>
                    <span className="block text-body-sm text-on-surface-variant">{c.description}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={essai} disabled={occupe}>Envoyer une alerte d’essai</Button>
              <Button type="button" variant="text" onClick={desactiver} disabled={occupe}>
                Désactiver sur cet appareil
              </Button>
            </div>
          </>
        )}

        <div aria-live="polite" className="empty:hidden">
          {message && <Alert variant={message.type}>{message.texte}</Alert>}
        </div>
      </div>
    </section>
  )
}
