"use client"

import * as React from "react"
import Link from "next/link"
import { Bell, ChevronDown, CreditCard, ExternalLink, LogOut, ShieldCheck, User } from "lucide-react"
import { useClerk } from "@/lib/auth/client"
import { Avatar } from "@/components/ui/Avatar"
import { ThemeMenuItems } from "@/components/ui/ThemeToggle"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

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
  const [signingOut, setSigningOut] = React.useState(false)

  const fullName = [profile?.prenom, profile?.nom].filter(Boolean).join(" ") || "Mon compte"
  const photo = profile?.photo_url || profile?.image || null

  const handleLogout = async () => {
    setSigningOut(true)
    await signOut({ redirectUrl: "/" })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Menu du compte"
        className="ag-state group flex min-h-11 items-center gap-2.5 rounded-control border border-outline-variant bg-surface-container-lowest px-2 py-1.5"
      >
        <Avatar src={photo} name={fullName === "Mon compte" ? undefined : fullName} size="sm" className="rounded-control" />
        {!compact && (
          <>
            <span className="hidden max-w-40 truncate text-label-lg text-on-surface xl:block">{fullName}</span>
            <ChevronDown className="size-4 text-on-surface-muted transition-transform group-data-[state=open]:rotate-180" aria-hidden="true" />
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>
          <span className="block truncate text-title-sm text-on-surface">{fullName}</span>
          {profile?.email && <span className="block truncate text-body-sm font-normal text-on-surface-muted">{profile.email}</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/membres/profil"><User className="size-4 text-on-surface-muted" aria-hidden="true" /> Mon profil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/membres/profil/confidentialite"><ShieldCheck className="size-4 text-on-surface-muted" aria-hidden="true" /> Confidentialité</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/membres/cotisation"><CreditCard className="size-4 text-on-surface-muted" aria-hidden="true" /> Cotisation</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/membres/notifications"><Bell className="size-4 text-on-surface-muted" aria-hidden="true" /> Notifications</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/"><ExternalLink className="size-4 text-on-surface-muted" aria-hidden="true" /> Retour au site</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ThemeMenuItems />
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive disabled={signingOut} onSelect={(e) => { e.preventDefault(); void handleLogout() }}>
          <LogOut className="size-4" aria-hidden="true" /> {signingOut ? "Déconnexion…" : "Se déconnecter"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
