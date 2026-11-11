"use client"

import { useSearchParams } from "next/navigation"
import { Heart } from "lucide-react"

export default function MerciBanner() {
  const params = useSearchParams()
  if (params.get("merci") !== "true") return null
  return (
    <div className="max-w-[1200px] mx-auto px-6 mt-10">
      <div className="bg-primary-container border border-primary/20 text-primary p-6 rounded-2xl flex flex-col md:flex-row items-center gap-4 shadow-sm text-center md:text-left">
        <div className="w-12 h-12 bg-surface-container-lowest rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
          <Heart className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="font-heading font-[800] text-[20px]">Un immense merci pour votre générosité !</p>
          <p className="font-sans text-[15px] opacity-80 mt-1">Votre don a bien été enregistré. Vous recevrez un reçu par email d'ici quelques minutes.</p>
        </div>
      </div>
    </div>
  )
}
