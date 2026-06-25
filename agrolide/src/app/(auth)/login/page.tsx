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
import { LogIn } from "lucide-react"

const loginSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect') || '/membres/dashboard'
  
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      setError("Identifiants incorrects. Veuillez réessayer.")
      setIsLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-[var(--color-vert-principal)] mb-6">
          <LogIn size={48} />
        </div>
        <h2 className="text-center text-3xl font-heading font-extrabold text-gray-900">
          Connexion à votre espace
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--color-gris-texte)]">
          Ou{" "}
          <Link href="/rejoindre" className="font-medium text-[var(--color-vert-principal)] hover:text-green-700">
            rejoignez le réseau si vous n'êtes pas encore membre
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-[var(--color-gris-clair)] sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Error Message sans Toast */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-[#d32f2f] text-sm rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-[#d32f2f]">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <Link href="/reset-password" className="text-sm font-medium text-[var(--color-vert-principal)] hover:text-green-700">
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-[#d32f2f]">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Chargement...</div>}>
      <LoginContent />
    </Suspense>
  )
}
