"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Menu, X } from "lucide-react"
import { Show, UserButton } from "@/lib/auth/client"
import { Button } from "@/components/ui/Button"
import { IconButton } from "@/components/ui/IconButton"
import { Logo } from "@/components/ui/Logo"
import { ThemeMenu, ThemeToggle } from "@/components/ui/ThemeToggle"
import { cn } from "@/lib/utils/formatters"
import { NAV_DIRECT, NAV_MEGA, type NavMega } from "./nav"

const navLink = "whitespace-nowrap rounded-tag text-label-lg transition-colors duration-150 ease-standard"

/** Panneau d'un méga menu : promesse du domaine à gauche, actions à droite. */
function MegaPanel({ mega, id }: { mega: NavMega; id: string }) {
  return (
    <div
      id={id}
      role="group"
      aria-label={mega.label}
      className="absolute inset-x-0 top-full border-b border-outline-variant bg-surface-container-lowest shadow-elev-2"
    >
      <div className="mx-auto grid max-w-[1100px] gap-8 px-6 py-8 lg:grid-cols-[minmax(0,280px)_1fr]">
        <div>
          <p className="text-title-md text-on-surface">{mega.label}</p>
          <p className="mt-2 text-body-md text-on-surface-variant">{mega.promise}</p>
          <Link
            href={mega.allHref}
            className="mt-4 inline-flex min-h-11 items-center text-label-lg font-semibold text-primary underline decoration-transparent underline-offset-4 transition-colors hover:decoration-primary"
          >
            Voir tout le domaine
          </Link>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {mega.items.map(({ label, description, href, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="ag-state flex min-h-12 items-start gap-3 rounded-card p-3 text-on-surface"
              >
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-control bg-primary-container text-on-primary-container">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-title-sm">{label}</span>
                  <span className="mt-0.5 block text-body-sm text-on-surface-variant">{description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [mega, setMega] = React.useState<string | null>(null)
  const [mobileSection, setMobileSection] = React.useState<string | null>(null)
  const headerRef = React.useRef<HTMLElement>(null)
  const triggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  React.useEffect(() => { setOpen(false); setMega(null) }, [pathname])

  // Échap ferme le menu mobile ou le méga menu (et rend le focus au bouton) ; clic ou focus à l'extérieur le ferme aussi.
  React.useEffect(() => {
    if (!open && !mega) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (mega) triggerRefs.current[mega]?.focus()
      setMega(null)
      setOpen(false)
    }
    const onPointer = (e: Event) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMega(null)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointer)
    document.addEventListener("focusin", onPointer)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointer)
      document.removeEventListener("focusin", onPointer)
    }
  }, [open, mega])

  const isHeroPage = pathname === "/"
  const solid = scrolled || open || mega !== null || !isHeroPage
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"))
  const megaActive = (m: NavMega) => m.items.some((i) => active(i.href))

  return (
    <header
      ref={headerRef}
      onMouseLeave={() => setMega(null)}
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-[background-color,border-color] duration-200 ease-standard",
        solid ? "border-outline-variant bg-surface-container-lowest" : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1100px] items-center justify-between gap-4 px-6 lg:gap-6">
        {/* shrink-0 : le logo ne doit jamais être écrasé par la navigation */}
        <div className="shrink-0">
          <Logo href="/" size="md" priority />
        </div>

        {/* Navigation desktop */}
        <nav aria-label="Navigation principale" className="hidden items-center gap-4 lg:flex xl:gap-6">
          {NAV_DIRECT.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              onMouseEnter={() => setMega(null)}
              className={cn(
                navLink,
                "inline-flex min-h-11 items-center",
                pathname === l.href ? "text-primary" : "text-on-surface-variant hover:text-primary",
              )}
            >
              {l.label}
            </Link>
          ))}
          {NAV_MEGA.map((m) => {
            const isOpen = mega === m.key
            const panelId = `mega-${m.key}`
            return (
              <button
                key={m.key}
                ref={(el) => { triggerRefs.current[m.key] = el }}
                type="button"
                aria-expanded={isOpen}
                aria-controls={isOpen ? panelId : undefined}
                onClick={() => setMega(isOpen ? null : m.key)}
                onMouseEnter={(e) => { if ((e.nativeEvent as PointerEvent).pointerType !== "touch") setMega(m.key) }}
                className={cn(
                  navLink,
                  "inline-flex min-h-11 items-center gap-1",
                  isOpen || megaActive(m) ? "text-primary" : "text-on-surface-variant hover:text-primary",
                )}
              >
                {m.label}
                <ChevronDown className={cn("size-4 transition-transform duration-150", isOpen && "rotate-180")} aria-hidden="true" />
              </button>
            )
          })}
        </nav>

        {/* Actions desktop */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-3" onMouseEnter={() => setMega(null)}>
          <ThemeMenu />
          <Show when="signed-out">
            <Link href="/login" className={cn(navLink, "inline-flex min-h-11 items-center px-1 text-on-surface-variant hover:text-primary")}>
              Connexion
            </Link>
            <Button href="/rejoindre" variant="secondary" size="sm">Rejoindre</Button>
          </Show>
          <Show when="signed-in">
            <Link href="/membres/dashboard" className={cn(navLink, "inline-flex min-h-11 items-center text-primary")}>
              Mon espace
            </Link>
            <UserButton />
          </Show>
        </div>

        {/* Bouton menu mobile */}
        <IconButton
          label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </IconButton>
      </div>

      {/* Panneau du méga menu (desktop) */}
      {mega && <div className="hidden lg:block">{NAV_MEGA.filter((m) => m.key === mega).map((m) => <MegaPanel key={m.key} mega={m} id={`mega-${m.key}`} />)}</div>}

      {/* Menu mobile */}
      {open && (
        <div id="menu-mobile" className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-outline-variant bg-surface-container-lowest lg:hidden">
          <nav aria-label="Navigation principale" className="mx-auto flex max-w-[1100px] flex-col px-6 py-4">
            {NAV_DIRECT.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className={cn(
                  "flex min-h-12 items-center rounded-control text-title-md transition-colors duration-150 ease-standard",
                  pathname === l.href ? "text-primary" : "text-on-surface hover:text-primary",
                )}
              >
                {l.label}
              </Link>
            ))}
            {NAV_MEGA.map((m) => {
              const isOpen = mobileSection === m.key
              const panelId = `mobile-${m.key}`
              return (
                <div key={m.key} className="border-t border-outline-variant first:border-t-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setMobileSection(isOpen ? null : m.key)}
                    className={cn(
                      "flex min-h-12 w-full items-center justify-between rounded-control text-left text-title-md transition-colors duration-150 ease-standard",
                      megaActive(m) ? "text-primary" : "text-on-surface hover:text-primary",
                    )}
                  >
                    {m.label}
                    <ChevronDown className={cn("size-5 transition-transform duration-150", isOpen && "rotate-180")} aria-hidden="true" />
                  </button>
                  {isOpen && (
                    <ul id={panelId} className="mb-2 flex flex-col gap-1">
                      {m.items.map(({ label, description, href, Icon }) => (
                        <li key={href}>
                          <Link href={href} className="ag-state flex min-h-12 items-start gap-3 rounded-card p-2.5 text-on-surface">
                            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-control bg-primary-container text-on-primary-container">
                              <Icon className="size-5" aria-hidden="true" />
                            </span>
                            <span>
                              <span className="block text-title-sm">{label}</span>
                              <span className="block text-body-sm text-on-surface-variant">{description}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href={m.allHref} className="flex min-h-11 items-center px-2.5 text-label-lg font-semibold text-primary">
                          Voir tout le domaine
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              )
            })}
            <div className="mt-3 flex flex-col gap-3 border-t border-outline-variant pt-5">
              <Show when="signed-out">
                <Button href="/login" variant="outline" fullWidth>Connexion</Button>
                <Button href="/rejoindre" variant="secondary" fullWidth>Rejoindre le réseau</Button>
              </Show>
              <Show when="signed-in">
                <Button href="/membres/dashboard" variant="secondary" fullWidth>Mon espace</Button>
                <div className="flex items-center justify-start pt-1">
                  <UserButton />
                </div>
              </Show>
              <ThemeToggle showLabels className="self-start" />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
