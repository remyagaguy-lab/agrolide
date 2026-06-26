"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

const NAV_LINKS = [
  { href: "/",                label: "Accueil" },
  { href: "/qui-sommes-nous", label: "Qui sommes-nous" },
  { href: "/actualites",      label: "Actualités" },
  { href: "/agrobusiness",    label: "Agrobusiness" },
  { href: "/blog",            label: "Blog" },
]

function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

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

  const isHeroPage = pathname === "/"
  const bgClass = scrolled || open || !isHeroPage
    ? "bg-white border-b border-[#e8e8e4]"
    : "bg-transparent border-b border-transparent"

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${bgClass}`}>
      <div className="max-w-[1100px] mx-auto flex h-[72px] items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/agrolide-png.png"
            alt="agrolide"
            width={280}
            height={80}
            className={`h-[68px] w-auto object-contain transition-all duration-200 ${
              !scrolled && !open && isHeroPage ? "brightness-0 invert" : ""
            }`}
            priority
          />
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-heading font-[600] text-[13px] tracking-[0.01em] transition-colors ${
                pathname === l.href
                  ? "text-[#1b5e38]"
                  : !scrolled && isHeroPage
                  ? "text-[rgba(255,255,255,0.75)] hover:text-white"
                  : "text-[#666] hover:text-[#1b5e38]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA Desktop */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/login"
            className={`font-heading font-[600] text-[13px] transition-colors ${
              !scrolled && isHeroPage
                ? "text-[rgba(255,255,255,0.7)] hover:text-white"
                : "text-[#666] hover:text-[#1b5e38]"
            }`}
          >
            Connexion
          </Link>
          <Link
            href="/rejoindre"
            className="bg-[#1b5e38] text-white font-heading font-[700] px-[18px] py-[9px] text-[13px] hover:bg-[#164d2e] transition-colors"
          >
            Rejoindre
          </Link>
        </div>

        {/* Hamburger Mobile */}
        <button
          className={`md:hidden transition-colors ${
            !scrolled && !open && isHeroPage ? "text-white" : "text-[#1a1a1a]"
          }`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {/* Menu Mobile */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#e8e8e4]">
          <nav className="max-w-[1100px] mx-auto px-6 py-6 flex flex-col gap-5">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-heading font-[600] text-[16px] text-[#1a1a1a] hover:text-[#1b5e38] transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t border-[#e8e8e4] pt-5 flex flex-col gap-3">
              <Link href="/login" className="font-heading font-[600] text-[15px] text-[#666]">
                Connexion
              </Link>
              <Link
                href="/rejoindre"
                className="bg-[#1b5e38] text-white font-heading font-[700] px-[20px] py-[12px] text-[14px] text-center hover:bg-[#164d2e] transition-colors"
              >
                Rejoindre le réseau
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
