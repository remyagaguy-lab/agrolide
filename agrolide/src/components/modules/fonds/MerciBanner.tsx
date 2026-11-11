"use client"

import { useSearchParams } from "next/navigation"
import { Alert } from "@/components/ui/Alert"

export default function MerciBanner() {
  const params = useSearchParams()
  if (params.get("merci") !== "true") return null
  return (
    <div className="container pt-8">
      <Alert variant="success" title="Merci pour votre soutien">
        Votre paiement a bien été transmis. Un e-mail de confirmation vous est envoyé une fois le don validé.
      </Alert>
    </div>
  )
}
