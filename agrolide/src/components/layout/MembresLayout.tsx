"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useClerk } from "@/lib/auth/client"
import { MembresUserMenu } from "./MembresUserMenu"
import { MembresBadgesProvider } from "./MembresBadges"
import { MEMBRES_RUBRIQUES, afficherNombre, labelInvitations, labelMessages, rubriqueActive, type MembresRubrique } from "./membres-nav"
import { Logo } from "@/components/ui/Logo"
import { cn } from "@/lib/utils/formatters"
import { LogOut } from "lucide-react"
import NotificationBell from "@/components/shared/NotificationBell"

interface MembresLayoutProps {
  children: React.ReactNode
  profile: any
  pendingRequestsCount?: number
  unreadMessagesCount?: number
}

export function MembresLayout({ children, profile, pendingRequestsCount = 0, unreadMessagesCount = 0 }: MembresLayoutProps) {
  const pathname = usePathname()
  const { signOut } = useClerk()

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/" })
  }

  const rubriqueCourante = rubriqueActive(pathname)

  /** Pastille d'une rubrique : invitations sur Réseauter, messages non lus sur Messages. */
  const pastille = (r: MembresRubrique) => {
    const n = r.badge === "invitations" ? pendingRequestsCount : r.badge === "messages" ? unreadMessagesCount : 0
    return { n, label: r.badge === "invitations" ? labelInvitations(n) : labelMessages(n) }
  }

  const sidebarLink = (item: MembresRubrique) => {
    const isActive = rubriqueCourante === item.key
    const { n, label } = pastille(item)
    return (
      <Link
        key={item.key}
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "relative flex min-h-12 items-center gap-3 rounded-l-card px-4 py-3 text-label-lg transition-colors duration-150 ease-standard",
          isActive
            ? "fusion-active z-20 bg-surface-container-low font-bold text-primary"
            : "mr-4 font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
        )}
      >
        <item.icon className={cn("size-[18px]", isActive ? "text-primary" : "text-on-surface-muted")} strokeWidth={isActive ? 2.5 : 2} aria-hidden />
        <span>{item.label}</span>
        {n > 0 ? (
          <span className="ml-auto rounded-full bg-error px-2 py-0.5 text-label-sm text-on-error">
            <span className="sr-only">{label} — </span>
            <span aria-hidden>{afficherNombre(n)}</span>
          </span>
        ) : null}
      </Link>
    )
  }

  return (
    <MembresBadgesProvider valeurs={{ invitations: pendingRequestsCount, messages: unreadMessagesCount }}>
    <div className="flex h-screen overflow-hidden bg-surface-container-low">
      {/* ================= VERTICAL SIDEBAR (DESKTOP) ================= */}
      <aside className="relative z-30 hidden h-full w-[260px] shrink-0 flex-col bg-surface-container lg:flex">
        <div className="flex h-20 shrink-0 items-center px-6">
          <Logo href="/membres/dashboard" size="md" priority />
        </div>

        <nav aria-label="Navigation de l'espace membre" className="custom-scrollbar relative z-10 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overflow-x-hidden py-4 pl-4">
          <div className="flex flex-col gap-1">{MEMBRES_RUBRIQUES.map(sidebarLink)}</div>
        </nav>

        <div className="mt-auto shrink-0 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="ag-state flex min-h-12 w-full items-center gap-3 rounded-control px-3 text-label-lg font-medium text-on-surface-variant hover:text-error"
          >
            <LogOut className="size-[18px]" aria-hidden />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* En-tête mobile */}
        <header className="z-20 flex h-14 shrink-0 items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-4 lg:hidden">
          <Logo href="/membres/dashboard" size="sm" priority />
          <div className="flex items-center gap-2">
            <NotificationBell userId={profile?.id} className="rounded-full" />
            <MembresUserMenu profile={profile} compact />
          </div>
        </header>

        {/* Barre supérieure (desktop) : menu du compte toujours visible */}
        <div className="hidden h-16 shrink-0 items-center justify-end gap-3 px-6 lg:flex">
          <NotificationBell userId={profile?.id} />
          <MembresUserMenu profile={profile} />
        </div>

        {/* SCROLLABLE PAGE CONTENT */}
        <main id="contenu" className="custom-scrollbar relative min-h-0 flex-1 overflow-y-auto p-3 pb-28 md:p-5 md:pb-28 lg:p-6 lg:pb-6">
          <div className="mx-auto h-full max-w-[1400px]">{children}</div>
        </main>
      </div>

      {/* ================= BOTTOM NAVIGATION (MOBILE) ================= */}
      <nav
        aria-label="Navigation principale"
        className="fixed bottom-0 left-0 z-50 w-full border-t border-outline-variant bg-surface-container-lowest px-2 pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <div className="flex h-20 items-center justify-around px-1">
          {MEMBRES_RUBRIQUES.map((item) => {
            const isActive = rubriqueCourante === item.key
            const { n, label } = pastille(item)
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-card px-0.5 text-label-sm transition-colors duration-150 ease-standard",
                  isActive ? "bg-primary-container font-bold text-on-primary-container" : "font-medium text-on-surface-variant",
                )}
              >
                <span className="relative">
                  <item.icon className="size-[22px]" strokeWidth={isActive ? 2.5 : 2} aria-hidden />
                  {n > 0 ? (
                    <span className="absolute -right-1.5 -top-1 size-2.5 rounded-full border-2 border-surface-container-lowest bg-error">
                      <span className="sr-only">{label}</span>
                    </span>
                  ) : null}
                </span>
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
    </MembresBadgesProvider>
  )
}
