"use client"
import { Suspense } from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { KeyRound, Mail, ArrowRight, CheckCircle } from "lucide-react"

// Schémas
const emailSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
})

const passwordSchema = z.object({
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

type EmailForm = z.infer<typeof emailSchema>
type PasswordForm = z.infer<typeof passwordSchema>

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isRecovery = searchParams?.get('type') === 'recovery' || searchParams?.get('error')

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  // Formulaire 1: Demande par email
  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema)
  })

  // Formulaire 2: Nouveau mot de passe
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema)
  })

  const onSubmitEmail = async (data: EmailForm) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    // L'URL de redirection doit pointer vers cette même page avec le token/code si on utilise PKCE
    // Supabase va s'en charger selon la config
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password?type=recovery`,
    })

    if (resetError) {
      setError(resetError.message)
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setIsLoading(false)
  }

  const onSubmitPassword = async (data: PasswordForm) => {
    setIsLoading(true)
    setError(null)

    // Lorsque le token de recovery est validé, l'utilisateur a une session temporaire
    // On met à jour son mot de passe
    const { error: updateError } = await supabase.auth.updateUser({
      password: data.password
    })

    if (updateError) {
      setError(updateError.message)
      setIsLoading(false)
      return
    }

    // Succès
    router.push('/login?message=Mot+de+passe+modifié+avec+succès')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-[var(--color-vert-principal)] mb-6">
          <KeyRound size={48} />
        </div>
        <h2 className="text-center text-3xl font-heading font-extrabold text-gray-900">
          {isRecovery ? "Nouveau mot de passe" : "Mot de passe oublié"}
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--color-gris-texte)]">
          {!isRecovery && "Saisissez votre email pour recevoir un lien de réinitialisation."}
          {isRecovery && "Saisissez votre nouveau mot de passe sécurisé."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-[var(--color-gris-clair)] sm:rounded-2xl sm:px-10">
          
          {error && (
            <div className="p-3 mb-6 bg-red-50 border border-red-200 text-[#d32f2f] text-sm rounded-md">
              {error}
            </div>
          )}

          {/* Mode 1: Demande par email */}
          {!isRecovery && !success && (
            <form className="space-y-6" onSubmit={emailForm.handleSubmit(onSubmitEmail)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    {...emailForm.register("email")}
                    className={`pl-10 ${emailForm.formState.errors.email ? "border-red-500" : ""}`}
                    placeholder="votre@email.com"
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-[#d32f2f]">{emailForm.formState.errors.email.message}</p>
                )}
              </div>

              <Button type="submit" variant="primary" className="w-full flex justify-center items-center gap-2" disabled={isLoading}>
                {isLoading ? "Envoi en cours..." : "Envoyer le lien"} <ArrowRight size={18} />
              </Button>
            </form>
          )}

          {/* Message de succès après demande email */}
          {!isRecovery && success && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-[var(--color-vert-principal)]" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Email envoyé</h3>
              <p className="text-sm text-gray-500 mb-6">
                Si un compte correspond à cette adresse, vous recevrez un email avec un lien pour réinitialiser votre mot de passe.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          )}

          {/* Mode 2: Saisie du nouveau mot de passe */}
          {isRecovery && (
            <form className="space-y-6" onSubmit={passwordForm.handleSubmit(onSubmitPassword)}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                <Input type="password" {...passwordForm.register("password")} className={passwordForm.formState.errors.password ? "border-red-500" : ""} />
                {passwordForm.formState.errors.password && <p className="mt-1 text-xs text-[#d32f2f]">{passwordForm.formState.errors.password.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer mot de passe</label>
                <Input type="password" {...passwordForm.register("confirmPassword")} className={passwordForm.formState.errors.confirmPassword ? "border-red-500" : ""} />
                {passwordForm.formState.errors.confirmPassword && <p className="mt-1 text-xs text-[#d32f2f]">{passwordForm.formState.errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </Button>
            </form>
          )}

          {(!success || isRecovery) && (
            <div className="mt-6 text-center text-sm">
              <Link href="/login" className="font-medium text-[var(--color-vert-principal)] hover:text-green-700">
                Retour à la connexion
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Chargement...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
