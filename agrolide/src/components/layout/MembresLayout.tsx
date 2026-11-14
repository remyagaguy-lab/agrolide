"use client"

import * as React from "react"
import { viderHorsLigne } from "@/lib/bibliotheque/hors-ligne"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useClerk } from "@/lib/auth/client"
import { MembresUserMenu } from "./MembresUserMenu"
import { MembresBadgesProvider } from "./MembresBadges"
import { LienEnCours } from "./LienEnCours"
import { COOKIE_BARRE_REPLIEE, MEMBRES_RUBRIQUES, afficherNombre, estPageImmersive, labelInvitations, labelMessages, rubriqueActive, type MembresRubrique } from "./membres-nav"
import { Logo } from "@/components/ui/Logo"
import { cn } from "@/lib/utils/formatters"
import { Avatar } from "@/components/ui/Avatar"
import NotificationBell from "@/components/shared/NotificationBell"

import { ChevronLeft, ChevronRight, LogOut, Mail } from "@/components/ui/icons"
interface MembresLayoutProps {
  children: React.ReactNode
  profile: any
  pendingRequestsCount?: number
  unreadMessagesCount?: number
  /** Choix mémorisé (cookie) lu côté serveur : la barre s'affiche d'emblée dans le bon état, sans saut. */
  barreRepliee?: boolean
}

/** Info-bulle de la barre repliée : visible au survol et au focus clavier, sans intercepter la souris. */
function InfoBulle({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-control bg-inverse-surface px-3 py-1.5 text-label-md font-medium text-inverse-on-surface opacity-0 shadow-md transition-opacity duration-150 group-hover/info:opacity-100 group-focus-visible/info:opacity-100"
    >
      {children}
    </span>
  )
}

export function MembresLayout({ children, profile, pendingRequestsCount = 0, unreadMessagesCount = 0, barreRepliee = false }: MembresLayoutProps) {
  const pathname = usePathname()
  const { signOut } = useClerk()

  const handleLogout = async () => {
    await viderHorsLigne()
    await signOut({ redirectUrl: "/" })
  }

  // Repli de la barre : choix du membre (mémorisé), sauf sur les pages de lecture où elle se replie d'elle-même.
  // La rouvrir à la main sur une page de lecture ne vaut que pour cette page ; en la quittant, le choix du membre reprend.
  const [choixRepli, setChoixRepli] = React.useState(barreRepliee)
  const [forcage, setForcage] = React.useState<{ page: string | null; replie: boolean } | null>(null)
  const immersive = estPageImmersive(pathname)
  const replie = immersive ? (forcage && forcage.page === pathname ? forcage.replie : true) : choixRepli

  const basculerBarre = React.useCallback(() => {
    if (immersive) {
      setForcage({ page: pathname, replie: !replie })
      return
    }
    const suivant = !choixRepli
    setChoixRepli(suivant)
    try {
      document.cookie = `${COOKIE_BARRE_REPLIEE}=${suivant ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`
    } catch {}
  }, [immersive, pathname, replie, choixRepli])

  // Raccourci « [ » (hors champ de saisie) : replier / déplier la barre.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "[" || e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      basculerBarre()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [basculerBarre])

  const rubriqueCourante = rubriqueActive(pathname)
  // Sur le tableau de bord, la cloche et le menu du compte sont dans le bandeau de bienvenue : pas de barre au-dessus.
  const surDashboard = pathname === "/membres/dashboard"
  // Barre du bas : quatre entrées. Messages passe dans l'en-tête mobile ; Entreprendre est un onglet d'Opportunités.
  const rubriquesBas = MEMBRES_RUBRIQUES.filter((r) => r.key !== "messages" && r.key !== "entreprendre")
  const nomProfil = [profile?.prenom, profile?.nom].filter(Boolean).join(" ") || "Mon compte"
  const photoProfil = profile?.photo_url || profile?.image || null
  const profilActif = !!pathname && (pathname === "/membres/profil" || pathname.startsWith("/membres/profil/"))

  /** Pastille d'une rubrique : invitations sur Réseauter, messages non lus sur Messages. */
  const pastille = (r: MembresRubrique) => {
    const n = r.badge === "invitations" ? pendingRequestsCount : r.badge === "messages" ? unreadMessagesCount : 0
    return { n, label: r.badge === "invitations" ? labelInvitations(n) : labelMessages(n) }
  }

  const sidebarLink = (item: MembresRubrique) => {
    const isActive = rubriqueCourante === item.key || (item.key === "opportunites" && rubriqueCourante === "entreprendre")
    const { n, label } = pastille(item)
    if (replie) {
      return (
        <Link
          key={item.key}
          href={item.href}
          aria-current={isActive ? "page" : undefined}
          aria-label={n > 0 ? `${item.label}, ${label}` : item.label}
          className={cn(
            "group/info ag-state relative flex size-12 items-center justify-center rounded-control transition-colors duration-150 ease-standard",
            isActive ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
          )}
        >
          <item.icon className="size-[20px]" strokeWidth={isActive ? 2.5 : 2} aria-hidden />
          {n > 0 ? <span aria-hidden className="absolute right-1.5 top-1.5 size-2.5 rounded-full border-2 border-surface-container bg-error" /> : null}
          <LienEnCours className="inset-x-2" />
          <InfoBulle>{item.label}</InfoBulle>
        </Link>
      )
    }
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
            <span className="sr-only">{label}, </span>
            <span aria-hidden>{afficherNombre(n)}</span>
          </span>
        ) : null}
      </Link>
    )
  }

  return (
    <MembresBadgesProvider valeurs={{ invitations: pendingRequestsCount, messages: unreadMessagesCount }}>
    <div className="flex h-dvh overflow-hidden bg-surface-container-low">
      {/* ================= VERTICAL SIDEBAR (DESKTOP) ================= */}
      <aside
        data-visite="navigation"
        data-replie={replie ? "oui" : "non"}
        className={cn(
          "relative z-30 hidden h-full shrink-0 flex-col bg-surface-container transition-[width] duration-200 ease-standard motion-reduce:transition-none lg:flex",
          replie ? "w-[72px]" : "w-[240px]",
        )}
      >
        <div className={cn("flex h-20 shrink-0 items-center", replie ? "justify-center" : "px-6")}>
          <Logo href="/membres/dashboard" variant={replie ? "symbol" : "horizontal"} size={replie ? "sm" : "md"} priority />
        </div>

        <nav
          aria-label="Navigation de l'espace membre"
          className={cn(
            "custom-scrollbar relative z-10 flex min-h-0 flex-1 flex-col gap-5 py-4",
            replie ? "items-center" : "overflow-y-auto overflow-x-hidden pl-4",
          )}
        >
          <div className={cn("flex flex-col gap-1", replie && "items-center")}>{MEMBRES_RUBRIQUES.map(sidebarLink)}</div>
        </nav>

        <div className={cn("mt-auto flex shrink-0 flex-col gap-1 p-4", replie && "items-center px-3")}>
          <Link
            href="/membres/profil"
            aria-current={profilActif ? "page" : undefined}
            aria-label={replie ? nomProfil : undefined}
            className={cn(
              "group/info ag-state relative flex items-center gap-3 rounded-control",
              replie ? "size-12 justify-center" : "min-h-14 px-3 py-2",
              profilActif ? "bg-surface-container-high text-primary" : "text-on-surface hover:bg-surface-container-high",
            )}
          >
            <Avatar src={photoProfil} name={nomProfil === "Mon compte" ? undefined : nomProfil} size="sm" />
            {replie ? (
              <InfoBulle>{nomProfil}</InfoBulle>
            ) : (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-label-lg font-medium">{nomProfil}</span>
                <span className="block text-label-sm text-on-surface-muted">Mon profil</span>
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            aria-label={replie ? "Déconnexion" : undefined}
            className={cn(
              "group/info ag-state relative flex items-center gap-3 rounded-control text-label-lg font-medium text-on-surface-variant hover:text-error",
              replie ? "size-12 justify-center" : "min-h-12 w-full px-3",
            )}
          >
            <LogOut className="size-5" aria-hidden />
            {replie ? <InfoBulle>Déconnexion</InfoBulle> : <span>Déconnexion</span>}
          </button>
          <button
            type="button"
            onClick={basculerBarre}
            aria-expanded={!replie}
            aria-label={replie ? "Déplier la barre latérale" : "Replier la barre latérale"}
            aria-keyshortcuts="["
            className={cn(
              "group/info ag-state relative flex items-center gap-3 rounded-control text-label-lg font-medium text-on-surface-variant hover:text-on-surface",
              replie ? "size-12 justify-center" : "min-h-12 w-full px-3",
            )}
          >
            {replie ? <ChevronRight className="size-5" aria-hidden /> : <ChevronLeft className="size-5" aria-hidden />}
            {replie ? <InfoBulle>Déplier (touche [)</InfoBulle> : <span>Replier</span>}
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
              <span className="sr-only">Messages{unreadMessagesCount > 0 ? `, ${labelMessages(unreadMessagesCount)}` : ""}</span>
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
        {/* Marge du bas = barre du bas (h-20) + zone de sécurité de l'appareil + 1,5 rem de respiration.
            Le conteneur est une colonne flex et le contenu un `flex-1` (et non plus `h-full`) : avec une hauteur
            fixe, le contenu débordait du bloc et la marge basse disparaissait, laissant le bas des pages sous la barre. */}
        <main
          id="contenu"
          className="custom-scrollbar relative flex min-h-0 flex-1 flex-col overflow-y-auto p-3 pb-[calc(5rem+env(safe-area-inset-bottom)+1.5rem)] md:p-5 md:pb-[calc(5rem+env(safe-area-inset-bottom)+1.5rem)] lg:p-6 lg:pb-6"
        >
          <div className="mx-auto w-full max-w-[1400px] flex-1">{children}</div>
        </main>
      </div>

      {/* ================= BOTTOM NAVIGATION (MOBILE) ================= */}
      <nav
        data-visite="navigation"
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
