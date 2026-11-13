"use client"

import { useClerk } from "@/lib/auth/client"
import { LogOut } from "@/components/ui/icons"
export function LogoutButton() {
  const { signOut } = useClerk()

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/" })
  }

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 text-error hover:text-error/80 transition-colors px-3 py-2 rounded-md text-sm font-medium"
      title="Se déconnecter"
    >
      <LogOut size={20} />
      <span className="hidden sm:inline">Se déconnecter</span>
    </button>
  )
}
