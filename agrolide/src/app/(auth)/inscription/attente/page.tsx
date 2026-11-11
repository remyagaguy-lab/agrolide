"use client"

import { useSearchParams } from "next/navigation"
import { Mail } from "lucide-react"
import { Suspense } from "react"
import { AuthCard } from "@/components/auth/AuthCard"
import { Button } from "@/components/ui/Button"
import { Spinner } from "@/components/ui/Spinner"

function AttenteContent() {
  const searchParams = useSearchParams()
  const email = searchParams?.get('email')

  return (
    <AuthCard title="Vérifiez votre boîte mail" subtitle="Nous venons d’envoyer un lien de confirmation à :">
      <div className="text-center">
        <span aria-hidden="true" className="mx-auto mb-5 inline-flex size-16 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
          <Mail className="size-8" />
        </span>
        <p className="text-title-md text-on-surface">{email || "votre adresse e-mail"}</p>
        <div className="mt-6 rounded-card bg-surface-container p-4 text-left text-body-md text-on-surface-variant">
          <p>Cliquez sur le lien contenu dans cet e-mail pour vérifier votre adresse et passer à l’étape du paiement de votre cotisation.</p>
          <p className="mt-2 text-body-sm text-on-surface-muted">Pensez à vérifier votre dossier spam.</p>
        </div>
        <Button href="/" variant="text" className="mt-6">Retour à l’accueil</Button>
      </div>
    </AuthCard>
  )
}

export default function AttentePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Spinner className="size-8 text-primary" /></div>}>
      <AttenteContent />
    </Suspense>
  )
}
