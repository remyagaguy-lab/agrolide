"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Logo } from "@/components/ui/Logo"
import { HorizonDivider, Motif } from "@/components/brand"

/*
 * Pictogrammes des réseaux sociaux : un seul jeu au trait (24 × 24, trait de 1,75, bouts arrondis, sans remplissage),
 * dans le style des pictogrammes Lucide du reste du site. Décoratifs : le lien porte le nom accessible.
 */
const lineProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
} as const

function IconTiktok(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...lineProps} {...props}>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  )
}

/** WhatsApp au trait (bulle et combiné), même gabarit que les pictogrammes Lucide de la colonne Contact. */
function IconWhatsApp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...lineProps} strokeWidth={2} {...props}>
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  )
}

const SOCIALS = [
  { href: "https://www.linkedin.com/company/réseau-bifera", icon: <Linkedin {...lineProps} />, label: "LinkedIn" },
  { href: "https://www.facebook.com/bibliotheque.ifera", icon: <Facebook {...lineProps} />, label: "Facebook" },
  { href: "https://www.instagram.com/bibliotheque.ifera", icon: <Instagram {...lineProps} />, label: "Instagram" },
  { href: "https://tiktok.com/@rseau.bifera", icon: <IconTiktok />, label: "TikTok" },
  { href: "https://www.youtube.com/@agrolide", icon: <Youtube {...lineProps} />, label: "YouTube" },
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
        <div className="bg-primary-container pt-20 text-center md:pt-24">
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
          {/* Transition organique (collines du logo) vers le pied de page vert */}
          <HorizonDivider className="mt-16 text-surface-brand md:mt-20" />
        </div>
      )}

      {/* ── PIED DE PAGE : bandeau vert de marque avec motif ── */}
      <footer className="relative overflow-hidden bg-surface-brand pb-9 pt-[60px] text-on-surface-brand">
        {/* Le motif s'estompe en haut : sinon les plants sont tranchés net sous la courbe de transition. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_140px)] [mask-image:linear-gradient(to_bottom,transparent,black_140px)]">
          <Motif size={800} opacity={0.045} className="text-on-surface-brand" />
        </div>

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
                className={`${footerLink} gap-2 whitespace-nowrap`}
              >
                <IconWhatsApp className="size-4 shrink-0" /> Rejoindre la chaîne
                <span className="sr-only"> WhatsApp (nouvel onglet)</span>
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
