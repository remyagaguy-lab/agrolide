"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, ArrowRight } from "lucide-react"
import { Suspense } from "react"

function AttenteContent() {
  const searchParams = useSearchParams()
  const email = searchParams?.get('email')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-8 shadow-sm border border-[var(--color-gris-clair)] sm:rounded-2xl text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-500 mb-6">
            <Mail size={40} />
          </div>
          
          <h2 className="text-3xl font-heading font-extrabold text-gray-900 mb-4">
            Vérifiez votre boîte mail
          </h2>
          
          <div className="text-lg text-[var(--color-gris-texte)] mb-8">
            <p>Nous venons d'envoyer un lien de confirmation à :</p>
            <p className="font-bold text-gray-900 mt-2">{email || "votre adresse email"}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 mb-8 border border-gray-100">
            <p>Veuillez cliquer sur le lien contenu dans cet email pour vérifier votre adresse et passer à l'étape du paiement de votre cotisation.</p>
            <p className="mt-2 text-xs text-gray-500">(Vérifiez également vos courriers indésirables / spams)</p>
          </div>
          
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-vert-principal)] font-bold hover:text-green-700">
            Retour à l'accueil <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AttentePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <AttenteContent />
    </Suspense>
  )
}
