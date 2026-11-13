'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

import { CheckCircle2, Loader2 } from "@/components/ui/icons"
/** Inscription en un clic d'un membre connecté, depuis la fiche d'un événement de son espace. */
export function InscriptionEvenementBouton({ evenementId }: { evenementId: string }) {
  const router = useRouter()
  const [envoi, setEnvoi] = useState(false)
  const [fait, setFait] = useState(false)
  const [erreur, setErreur] = useState('')

  const sInscrire = async () => {
    setEnvoi(true)
    setErreur('')
    try {
      const res = await fetch('/api/evenements/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evenement_id: evenementId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Une erreur est survenue lors de l'inscription.")
      setFait(true)
      router.refresh()
    } catch (e: any) {
      setErreur(e.message)
    } finally {
      setEnvoi(false)
    }
  }

  if (fait) {
    return (
      <p role="status" className="flex items-center gap-2 text-label-lg text-success">
        <CheckCircle2 className="size-5" aria-hidden="true" /> Inscription confirmée
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <Button variant="primary" onClick={sInscrire} disabled={envoi}>
        {envoi && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        S'inscrire à l'événement
      </Button>
      {erreur && <p role="alert" className="text-body-sm text-error">{erreur}</p>}
    </div>
  )
}
