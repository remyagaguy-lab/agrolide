"use client"

import { useState } from "react"
import { Send, CheckCircle } from "lucide-react"

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
      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
        <CheckCircle size={13} /> Envoyé
      </span>
    )
  }

  return (
    <button
      onClick={sendRappel}
      disabled={status === "loading"}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors disabled:opacity-50"
    >
      <Send size={12} />
      {status === "loading" ? "Envoi..." : "Envoyer rappel"}
    </button>
  )
}
