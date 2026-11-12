"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useClerk } from "@/lib/auth/client"
import { MembresUserMenu } from "./MembresUserMenu"
import { Logo } from "@/components/ui/Logo"
import { Modal, ModalContent, ModalDescription, ModalTitle, ModalTrigger } from "@/components/ui/Modal"
import { cn } from "@/lib/utils/formatters"
import {
  LayoutDashboard,
  User,
  Users,
  Library,
  BookOpen,
  Calendar,
  Briefcase,
  Mail,
  LogOut,
  Menu,
} from "lucide-react"
import NotificationBell from "@/components/shared/NotificationBell"

interface MembresLayoutProps {
  children: React.ReactNode
  profile: any
  pendingRequestsCount?: number
  unreadMessagesCount?: number
}

type NavItem = { name: string; href: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>; badge?: number; badgeLabel?: (n: number) => string }

const labelInvitations = (n: number) => `${n} ${n > 1 ? "demandes en attente" : "demande en attente"}`
const labelMessages = (n: number) => `${n} ${n > 1 ? "messages non lus" : "message non lu"}`
const afficherNombre = (n: number) => (n > 99 ? "99+" : String(n))

export function MembresLayout({ children, profile, pendingRequestsCount = 0, unreadMessagesCount = 0 }: MembresLayoutProps) {
  const pathname = usePathname()
  const { signOut } = useClerk()
  const [moreOpen, setMoreOpen] = React.useState(false)

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/" })
  }

  // --- Sidebar Navigation ---
  const navMain: NavItem[] = [
    { name: "Dashboard", href: "/membres/dashboard", icon: LayoutDashboard },
    { name: "Annuaire", href: "/membres/annuaire", icon: Users },
    { name: "Bibliothèque", href: "/membres/bibliotheque", icon: Library },
    // { name: "Forum", href: "/membres/forum", icon: MessageSquare },
    { name: "Événements", href: "/membres/evenements", icon: Calendar },
    { name: "Opportunités", href: "/membres/opportunites", icon: Briefcase },
    { name: "Formations", href: "/formations", icon: BookOpen },
  ]

  const navPersonal: NavItem[] = [
    { name: "Mon réseau", href: "/membres/reseau", icon: Users, badge: pendingRequestsCount, badgeLabel: labelInvitations },
    { name: "Messages", href: "/membres/messages", icon: Mail, badge: unreadMessagesCount, badgeLabel: labelMessages },
    { name: "Mes Formations", href: "/membres/formations", icon: BookOpen },
    { name: "Mon Profil", href: "/membres/profil", icon: User },
  ]

  // Barre du bas (mobile) : 4 destinations + « Plus » (5 maximum, comme le recommande Material 3).
  const mobileNavItems: NavItem[] = [
    { name: "Accueil", href: "/membres/dashboard", icon: LayoutDashboard },
    { name: "Annuaire", href: "/membres/annuaire", icon: Users },
    { name: "Mon réseau", href: "/membres/reseau", icon: Users, badge: pendingRequestsCount, badgeLabel: labelInvitations },
    { name: "Formations", href: "/membres/formations", icon: BookOpen },
  ]
  const moreItems: NavItem[] = [
    { name: "Mon profil", href: "/membres/profil", icon: User },
    { name: "Bibliothèque", href: "/membres/bibliotheque", icon: Library },
    { name: "Messages", href: "/membres/messages", icon: Mail, badge: unreadMessagesCount, badgeLabel: labelMessages },
    { name: "Événements", href: "/membres/evenements", icon: Calendar },
    { name: "Opportunités", href: "/membres/opportunites", icon: Briefcase },
    { name: "Catalogue des formations", href: "/formations", icon: BookOpen },
  ]

  const isActiveFor = (href: string) =>
    pathname === href || (href !== "/membres/dashboard" && pathname?.startsWith(`${href}/`))

  const sidebarLink = (item: NavItem) => {
    const isActive = isActiveFor(item.href)
    return (
      <Link
        key={item.name}
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
        <span>{item.name}</span>
        {item.badge ? (
          <span className="ml-auto rounded-full bg-error px-2 py-0.5 text-label-sm text-on-error">
            <span className="sr-only">{item.badgeLabel?.(item.badge)} — </span>
            <span aria-hidden>{afficherNombre(item.badge)}</span>
          </span>
        ) : null}
      </Link>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-container-low">
      {/* ================= VERTICAL SIDEBAR (DESKTOP) ================= */}
      <aside className="relative z-30 hidden h-full w-[260px] shrink-0 flex-col bg-surface-container lg:flex">
        <div className="flex h-20 shrink-0 items-center px-6">
          <Logo href="/membres/dashboard" size="md" priority />
        </div>

        <nav aria-label="Navigation de l'espace membre" className="custom-scrollbar relative z-10 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overflow-x-hidden py-4 pl-4">
          <div>
            <p className="mb-3 px-2 text-label-sm uppercase tracking-wider text-on-surface-muted">Menu principal</p>
            <div className="flex flex-col gap-1">{navMain.map(sidebarLink)}</div>
          </div>
          <div>
            <p className="mb-3 px-2 text-label-sm uppercase tracking-wider text-on-surface-muted">Personnel</p>
            <div className="flex flex-col gap-1">{navPersonal.map(sidebarLink)}</div>
          </div>
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
          {mobileNavItems.map((item) => {
            const isActive = isActiveFor(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex h-16 min-w-16 flex-1 flex-col items-center justify-center gap-1 rounded-card text-label-sm transition-colors duration-150 ease-standard",
                  isActive ? "bg-primary-container font-bold text-on-primary-container" : "font-medium text-on-surface-variant",
                )}
              >
                <span className="relative">
                  <item.icon className="size-[22px]" strokeWidth={isActive ? 2.5 : 2} aria-hidden />
                  {item.badge ? (
                    <span className="absolute -right-1.5 -top-1 size-2.5 rounded-full border-2 border-surface-container-lowest bg-error">
                      <span className="sr-only">{item.badgeLabel?.(item.badge)}</span>
                    </span>
                  ) : null}
                </span>
                <span>{item.name}</span>
              </Link>
            )
          })}

          <Modal open={moreOpen} onOpenChange={setMoreOpen}>
            <ModalTrigger className="relative flex h-16 min-w-16 flex-1 flex-col items-center justify-center gap-1 rounded-card text-label-sm font-medium text-on-surface-variant">
              <span className="relative">
                <Menu className="size-[22px]" aria-hidden />
                {unreadMessagesCount > 0 ? (
                  <span className="absolute -right-1.5 -top-1 size-2.5 rounded-full border-2 border-surface-container-lowest bg-error">
                    <span className="sr-only">{labelMessages(unreadMessagesCount)}</span>
                  </span>
                ) : null}
              </span>
              <span>Plus</span>
            </ModalTrigger>
            <ModalContent className="gap-2">
              <ModalTitle>Plus de destinations</ModalTitle>
              <ModalDescription className="sr-only">Autres pages de l’espace membre</ModalDescription>
              <nav aria-label="Autres pages" className="mt-2 flex flex-col">
                {moreItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="ag-state flex min-h-12 items-center gap-3 rounded-control px-3 text-body-md text-on-surface"
                  >
                    <item.icon className="size-5 text-on-surface-muted" aria-hidden />
                    {item.name}
                    {item.badge ? (
                      <span className="ml-auto rounded-full bg-error px-2 py-0.5 text-label-sm text-on-error">
                        <span className="sr-only">{item.badgeLabel?.(item.badge)} — </span>
                        <span aria-hidden>{afficherNombre(item.badge)}</span>
                      </span>
                    ) : null}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="ag-state mt-1 flex min-h-12 items-center gap-3 rounded-control px-3 text-body-md text-error"
                >
                  <LogOut className="size-5" aria-hidden />
                  Déconnexion
                </button>
              </nav>
            </ModalContent>
          </Modal>
        </div>
      </nav>
    </div>
  )
}
