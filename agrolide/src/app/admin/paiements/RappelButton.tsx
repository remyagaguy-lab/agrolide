"use client"

import { useState } from "react"
import { Send, CheckCircle2 } from "@/components/ui/icons"
interface Props {
  membreId: string
  email: string
  nom: string
}

export default function RappelButton({ membreId, email, nom }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")

  const sendRappel = async () => {
    setStatus("loading")
    try {
      const res = await fetch(`/api/admin/membres/${membreId}/rappel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nom }),
      })
      if (res.ok) setStatus("done")
      else setStatus("error")
    } catch {
      setStatus("error")
    }
  }

  if (status === "done") {
    return (
      <span className="flex items-center gap-1 text-xs text-success font-medium">
        <CheckCircle2 size={16} /> Envoyé
      </span>
    )
  }

  return (
    <button
      onClick={sendRappel}
      disabled={status === "loading"}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-on-warning-container bg-warning-container hover:bg-warning-container rounded-lg transition-colors disabled:opacity-50"
    >
      <Send size={16} />
      {status === "loading" ? "Envoi..." : "Envoyer rappel"}
    </button>
  )
}
