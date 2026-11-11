"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/Button"
import { Logo } from "@/components/ui/Logo"

/* Pictogrammes des réseaux sociaux : décoratifs (le lien porte le nom accessible). */
const svgProps = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const

function IconLinkedIn() {
  return (
    <svg {...svgProps}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg {...svgProps}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg {...svgProps}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg {...svgProps}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function IconTiktok() {
  return (
    <svg {...svgProps}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.26 6.32 6.32 6.32 0 0 0 6.26-6.32V8.9a8.27 8.27 0 0 0 4 1V6.62a5 5 0 0 1-1.93-.33z"/>
    </svg>
  )
}

function IconYoutube() {
  return (
    <svg {...svgProps}>
      <path fillRule="evenodd" d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12z"/>
    </svg>
  )
}

const SOCIALS = [
  { href: "https://www.linkedin.com/company/réseau-bifera", icon: <IconLinkedIn />, label: "LinkedIn" },
  { href: "https://www.facebook.com/bibliotheque.ifera", icon: <IconFacebook />, label: "Facebook" },
  { href: "https://www.instagram.com/bibliotheque.ifera", icon: <IconInstagram />, label: "Instagram" },
  { href: "https://tiktok.com/@rseau.bifera", icon: <IconTiktok />, label: "TikTok" },
  { href: "https://www.youtube.com/@agrolide", icon: <IconYoutube />, label: "YouTube" },
]

const footerLink = "inline-flex min-h-11 items-center rounded-tag text-body-sm text-on-surface-brand/80 transition-colors duration-150 ease-standard hover:text-on-surface-brand"
const footerHeading = "mb-1 text-label-sm uppercase tracking-[0.14em] text-on-surface-brand"

export function Footer() {
  const pathname = usePathname()

  // Chemins qui ont déjà leur propre appel à l'action en bas de page
  const pathsWithCustomCTA = ["/qui-sommes-nous", "/nos-actions", "/bibliotheque", "/rejoindre"]
  const showGlobalCTA = !pathsWithCustomCTA.includes(pathname || "")

  return (
    <>
      {/* ── APPEL À L'ACTION GLOBAL ── */}
      {showGlobalCTA && (
        <div className="bg-primary-container py-20 text-center md:py-24">
          <div className="container flex flex-col items-center">
            <h2 className="mx-auto mb-4 max-w-[700px] text-headline-md text-on-primary-container">
              Prêt à participer à la conquête de la souveraineté alimentaire&nbsp;?
            </h2>
            <p className="mb-7 text-body-md text-on-primary-container">
              Annuaire · Formations · Agrobusiness · Bibliothèque · Événements
            </p>
            <Button variant="primary" href="/rejoindre">
              Rejoindre le réseau <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

      {/* ── PIED DE PAGE : bandeau vert de marque avec motif ── */}
      <footer className="relative overflow-hidden bg-surface-brand pb-9 pt-[60px] text-on-surface-brand">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.07]"
          style={{ backgroundImage: "url('/images/motif-transparent.webp')", backgroundSize: "800px", backgroundRepeat: "repeat" }}
        />

        <div className="relative z-10 mx-auto max-w-[1100px] px-6">
          <div className="mb-12 grid grid-cols-2 items-start gap-x-6 gap-y-10 md:grid-cols-4 md:gap-10">
            {/* Marque */}
            <div className="col-span-2 flex flex-col items-start gap-4 md:col-span-1">
              <Logo tone="on-dark" size="lg" />
              <p className="max-w-[240px] text-body-sm text-on-surface-brand/80">
                Fédérer la chaîne agricole africaine pour conquérir la souveraineté alimentaire.
              </p>
              <ul className="-ml-2 flex flex-wrap items-center">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} (nouvel onglet)`}
                      className="ag-state flex size-11 items-center justify-center rounded-full text-on-surface-brand/85"
                    >
                      {s.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* À propos */}
            <nav aria-label="À propos" className="flex flex-col">
              <h2 className={footerHeading}>À propos de nous</h2>
              {[
                { href: "/qui-sommes-nous",        label: "Notre histoire" },
                { href: "/#actions",               label: "Nos activités" },
                { href: "/qui-sommes-nous#equipe", label: "Notre équipe" },
                { href: "mailto:contact@agrolide.org", label: "Contactez-nous" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className={footerLink}>{l.label}</Link>
              ))}
            </nav>

            {/* Navigation */}
            <nav aria-label="Navigation du pied de page" className="flex flex-col">
              <h2 className={footerHeading}>Navigation</h2>
              {[
                { href: "/",             label: "Accueil" },
                { href: "/annuaire",     label: "Annuaire" },
                { href: "/blog",         label: "Blog" },
                { href: "/bibliotheque", label: "Bibliothèque" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className={footerLink}>{l.label}</Link>
              ))}
            </nav>

            {/* Contact */}
            <div className="flex flex-col items-start">
              <h2 className={footerHeading}>Contact</h2>
              <p className="flex min-h-11 items-center gap-2 text-body-sm text-on-surface-brand/80">
                <MapPin className="size-4 shrink-0" aria-hidden="true" /> Lomé, Togo
              </p>
              <a href="tel:+22891016724" className={`${footerLink} gap-2`}>
                <Phone className="size-4 shrink-0" aria-hidden="true" /> +228 91 01 67 24
              </a>
              <a href="mailto:contact@agrolide.org" className={`${footerLink} gap-2 break-all`}>
                <Mail className="size-4 shrink-0" aria-hidden="true" /> contact@agrolide.org
              </a>
              <a
                href="https://whatsapp.com/channel/0029VbBd42p8V0tgiDJwzU2T"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "ghost-dark", size: "sm", className: "mt-3 whitespace-normal text-left" })}
              >
                {/* Vert WhatsApp : couleur officielle d'une marque tierce, volontairement hors palette. */}
                <span className="text-[#25D366]"><IconWhatsApp /></span>{/* ds-check:ignore couleur de marque WhatsApp */}
                Rejoindre la chaîne WhatsApp
                <span className="sr-only"> (nouvel onglet)</span>
              </a>
            </div>
          </div>

          <div className="mb-6 h-px bg-on-surface-brand/15" aria-hidden="true" />

          {/* Bas de page : mentions légales ; crédit technique discret, sans logo ni couleurs tierces */}
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <p className="text-label-sm font-normal text-on-surface-brand/75">
              © 2026 agrolide. Tous droits réservés. · Site réalisé par{" "}
              <a
                href="https://orkedio.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 hover:text-on-surface-brand hover:underline"
              >
                Orkedio
              </a>
            </p>
            <ul className="flex flex-wrap justify-center gap-x-5">
              {[
                { href: "/mentions-legales", label: "Mentions légales" },
                { href: "/cgu", label: "CGU / CGV" },
                { href: "/confidentialite", label: "Confidentialité" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-11 items-center text-label-sm font-normal text-on-surface-brand/75 hover:text-on-surface-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}
