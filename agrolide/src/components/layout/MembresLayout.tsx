"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useClerk } from "@/lib/auth/client"
import { MembresUserMenu } from "./MembresUserMenu"
import { MembresBadgesProvider } from "./MembresBadges"
import { LienEnCours } from "./LienEnCours"
import { MEMBRES_RUBRIQUES, afficherNombre, labelInvitations, labelMessages, rubriqueActive, type MembresRubrique } from "./membres-nav"
import { Logo } from "@/components/ui/Logo"
import { cn } from "@/lib/utils/formatters"
import { LogOut, Mail } from "lucide-react"
import { Avatar } from "@/components/ui/Avatar"
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
  // Sur le tableau de bord, la cloche et le menu du compte sont dans le bandeau de bienvenue : pas de barre au-dessus.
  const surDashboard = pathname === "/membres/dashboard"
  // Barre du bas : cinq entrées au plus (cibles lisibles à 360 px) ; Messages passe dans l'en-tête mobile.
  const rubriquesBas = MEMBRES_RUBRIQUES.filter((r) => r.key !== "messages")
  const nomProfil = [profile?.prenom, profile?.nom].filter(Boolean).join(" ") || "Mon compte"
  const photoProfil = profile?.photo_url || profile?.image || null
  const profilActif = !!pathname && (pathname === "/membres/profil" || pathname.startsWith("/membres/profil/"))

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
        <LienEnCours className="inset-x-4" />
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

        <div className="mt-auto flex shrink-0 flex-col gap-1 p-4">
          <Link
            href="/membres/profil"
            aria-current={profilActif ? "page" : undefined}
            className={cn(
              "ag-state flex min-h-14 items-center gap-3 rounded-control px-3 py-2",
              profilActif ? "bg-surface-container-high text-primary" : "text-on-surface hover:bg-surface-container-high",
            )}
          >
            <Avatar src={photoProfil} name={nomProfil === "Mon compte" ? undefined : nomProfil} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-label-lg font-medium">{nomProfil}</span>
              <span className="block text-label-sm text-on-surface-muted">Mon profil</span>
            </span>
          </Link>
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
            <Link
              href="/membres/messages"
              aria-current={rubriqueCourante === "messages" ? "page" : undefined}
              className={cn(
                "ag-state relative flex size-11 items-center justify-center rounded-full",
                rubriqueCourante === "messages" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant",
              )}
            >
              <Mail className="size-5" aria-hidden />
              <span className="sr-only">Messages{unreadMessagesCount > 0 ? ` — ${labelMessages(unreadMessagesCount)}` : ""}</span>
              {unreadMessagesCount > 0 ? (
                <span aria-hidden className="absolute right-1 top-1 flex min-w-5 items-center justify-center rounded-full bg-error px-1 text-label-sm font-bold text-on-error">
                  {afficherNombre(unreadMessagesCount)}
                </span>
              ) : null}
            </Link>
            <NotificationBell userId={profile?.id} className="rounded-full" />
            <MembresUserMenu profile={profile} compact />
          </div>
        </header>

        {/* Barre supérieure (desktop) : menu du compte toujours visible */}
        {!surDashboard && (
          <div className="hidden h-16 shrink-0 items-center justify-end gap-3 px-6 lg:flex">
            <NotificationBell userId={profile?.id} />
            <MembresUserMenu profile={profile} />
          </div>
        )}

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
          {rubriquesBas.map((item) => {
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
                <LienEnCours className="inset-x-3 bottom-1" />
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
    </MembresBadgesProvider>
  )
}
