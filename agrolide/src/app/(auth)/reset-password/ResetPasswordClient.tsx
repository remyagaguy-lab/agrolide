"use client"
import { useUser } from "@clerk/nextjs"
import { KeyRound, CheckCircle } from "lucide-react"
import Link from "next/link"

// La réinitialisation de mot de passe est gérée par Clerk.
// Cette page redirige vers le portail Clerk ou affiche un message.
export default function ResetPasswordClient() {
  const { isSignedIn } = useUser()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-[var(--color-vert-principal)] mb-6">
          <KeyRound size={48} />
        </div>
        <h2 className="text-center text-3xl font-heading font-extrabold text-gray-900">
          Mot de passe oublié
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          La gestion du mot de passe est sécurisée par Clerk.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-100 sm:rounded-2xl sm:px-10 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-[var(--color-vert-principal)]" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
            Utilisez la page de connexion
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Sur la page de connexion, cliquez sur <strong>&quot;Mot de passe oublié ?&quot;</strong> 
            et Clerk vous enverra automatiquement un email sécurisé pour réinitialiser votre mot de passe.
          </p>
          <Link href="/sign-in">
            <button className="w-full px-4 py-3 bg-[var(--color-vert-principal)] text-white rounded-lg font-medium hover:bg-green-800 transition-colors">
              Aller à la connexion
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
