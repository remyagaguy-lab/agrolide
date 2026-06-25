"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors px-3 py-2 rounded-md text-sm font-medium"
      title="Se déconnecter"
    >
      <LogOut size={18} />
      <span className="hidden sm:inline">Se déconnecter</span>
    </button>
  )
}
