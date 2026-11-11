"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ExternalLink, LogOut, User } from "lucide-react"
import { useClerk } from "@/lib/auth/client"

interface MembresUserMenuProps {
  profile: {
    prenom?: string | null
    nom?: string | null
    email?: string | null
    photo_url?: string | null
    image?: string | null
  } | null
  /** Version compacte (avatar seul) pour l'en-tête mobile. */
  compact?: boolean
}

/** Menu du compte membre : toujours visible, avec la déconnexion. */
export function MembresUserMenu({ profile, compact = false }: MembresUserMenuProps) {
  const { signOut } = useClerk()
  const [open, setOpen] = React.useState(false)
  const [signingOut, setSigningOut] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const fullName = [profile?.prenom, profile?.nom].filter(Boolean).join(" ") || "Mon compte"
  const photo = profile?.photo_url || profile?.image || null
  const initials = ((profile?.prenom?.[0] ?? "") + (profile?.nom?.[0] ?? "")).toUpperCase()

  const handleLogout = async () => {
    setSigningOut(true)
    await signOut({ redirectUrl: "/" })
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu du compte"
        className="flex items-center gap-2.5 rounded-xl border border-[#e8e8e4] bg-white px-2 py-1.5 hover:border-[#1b5e38]/40 transition-colors"
      >
        <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-[#dff0e0] text-[#1b5e38] text-xs font-bold flex items-center justify-center">
          {photo ? (
            <Image src={photo} alt="" fill sizes="32px" className="object-cover" />
          ) : initials ? (
            initials
          ) : (
            <User size={16} />
          )}
        </span>
        {!compact && (
          <>
            <span className="hidden xl:block max-w-[160px] truncate text-sm font-semibold text-gray-800">{fullName}</span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-xl border border-[#e8e8e4] bg-white py-1.5 shadow-lg z-50"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="truncate text-sm font-bold text-gray-900">{fullName}</p>
            {profile?.email && <p className="truncate text-xs text-gray-500">{profile.email}</p>}
          </div>
          <Link
            href="/membres/profil"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <User size={16} className="text-gray-400" /> Mon profil
          </Link>
          <Link
            href="/"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <ExternalLink size={16} className="text-gray-400" /> Retour au site
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={signingOut}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            <LogOut size={16} /> {signingOut ? "Déconnexion…" : "Se déconnecter"}
          </button>
        </div>
      )}
    </div>
  )
}
