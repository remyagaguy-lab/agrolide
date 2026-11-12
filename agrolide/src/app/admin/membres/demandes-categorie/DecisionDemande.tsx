"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Alert } from "@/components/ui/Alert"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

/** Boutons de décision d'une demande de changement de catégorie (accepter, ou refuser avec un motif facultatif). */
export function DecisionDemande({ id, libelleMembre }: { id: string; libelleMembre: string }) {
  const router = useRouter()
  const [refus, setRefus] = React.useState(false)
  const [motif, setMotif] = React.useState("")
  const [erreur, setErreur] = React.useState("")
  const [pending, startTransition] = React.useTransition()

  const decider = (decision: "accepter" | "refuser") => {
    setErreur("")
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/membres/demandes-categorie/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ decision, motif }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setErreur(data.error || "La décision n'a pas pu être enregistrée.")
          return
        }
        router.refresh()
      } catch {
        setErreur("La décision n'a pas pu être enregistrée. Vérifiez la connexion.")
      }
    })
  }

  return (
    <div className="flex flex-col items-start gap-2">
      {!refus ? (
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="secondary" loading={pending} onClick={() => decider("accepter")} aria-label={`Accepter la demande de ${libelleMembre}`}>
            Accepter
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={pending} onClick={() => setRefus(true)} aria-label={`Refuser la demande de ${libelleMembre}`}>
            Refuser
          </Button>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-2 sm:max-w-xs">
          <Input value={motif} onChange={(e) => setMotif(e.target.value)} maxLength={200} placeholder="Motif (facultatif, transmis au membre)" aria-label={`Motif du refus pour ${libelleMembre}`} />
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="danger" loading={pending} onClick={() => decider("refuser")}>Confirmer le refus</Button>
            <Button type="button" size="sm" variant="text" disabled={pending} onClick={() => setRefus(false)}>Retour</Button>
          </div>
        </div>
      )}
      {erreur && <Alert variant="error">{erreur}</Alert>}
    </div>
  )
}
