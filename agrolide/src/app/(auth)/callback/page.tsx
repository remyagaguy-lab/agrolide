'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Avec Clerk, la page callback n'est plus nécessaire. 
// Clerk gère ses propres redirections via /__clerk/...
// On redirige simplement vers le dashboard membre.
export default function CallbackPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/membres/dashboard')
  }, [router])
  return null
}
