"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Show, UserButton } from "@/lib/auth/client"
import { Button } from "@/components/ui/Button"
import { IconButton } from "@/components/ui/IconButton"
import { Logo } from "@/components/ui/Logo"
import { cn } from "@/lib/utils/formatters"

const NAV_LINKS = [
  { href: "/",                label: "Accueil" },
  { href: "/qui-sommes-nous", label: "Qui sommes-nous" },
  { href: "/actualites",      label: "Actualités" },
  { href: "/nos-actions",     label: "Nos actions" },
  { href: "/formations",      label: "Formations" },
  { href: "/bibliotheque",    label: "Bibliothèque" },
  { href: "/blog",            label: "Blog" },
]

const navLink = "whitespace-nowrap rounded-tag text-label-lg transition-colors duration-150 ease-standard"

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  React.useEffect(() => { setOpen(false) }, [pathname])

  // Échap referme le menu mobile.
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  const isHeroPage = pathname === "/"
  const solid = scrolled || open || !isHeroPage

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-[background-color,border-color] duration-200 ease-standard",
        solid ? "border-outline-variant bg-surface-container-lowest" : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1100px] items-center justify-between gap-6 px-6">
        <Logo href="/" size="md" priority />

        {/* Navigation desktop */}
        <nav aria-label="Navigation principale" className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className={cn(
                navLink,
                "inline-flex min-h-11 items-center",
                pathname === l.href ? "text-primary" : "text-on-surface-variant hover:text-primary",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions desktop */}
        <div className="hidden items-center gap-4 lg:flex">
          <Show when="signed-out">
            <Link href="/login" className={cn(navLink, "inline-flex min-h-11 items-center text-on-surface-variant hover:text-primary")}>
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

      {/* Menu mobile */}
      {open && (
        <div id="menu-mobile" className="border-t border-outline-variant bg-surface-container-lowest lg:hidden">
          <nav aria-label="Navigation principale" className="mx-auto flex max-w-[1100px] flex-col px-6 py-4">
            {NAV_LINKS.map((l) => (
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
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
