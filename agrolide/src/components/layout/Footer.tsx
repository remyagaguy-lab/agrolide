"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"

function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function IconTiktok() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.26 6.32 6.32 6.32 0 0 0 6.26-6.32V8.9a8.27 8.27 0 0 0 4 1V6.62a5 5 0 0 1-1.93-.33z"/>
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#0f3d22] pt-[64px] pb-[36px]">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Col 1 — Marque */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <Image
              src="/agrolide-png.png"
              alt="agrolide"
              width={350}
              height={100}
              className="h-[100px] w-auto brightness-0 invert object-contain object-left"
            />
            <p className="font-sans text-[14px] leading-[1.8] text-[rgba(255,255,255,0.45)] max-w-[300px]">
              Fédérer la chaîne agricole africaine pour conquérir la souveraineté alimentaire.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://whatsapp.com/channel/0029VbBd42p8V0tgiDJwzU2T"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgba(255,255,255,0.4)] hover:text-[#fcb726] transition-colors"
                aria-label="WhatsApp"
              >
                <IconWhatsApp />
              </Link>
              <Link
                href="https://www.facebook.com/bibliotheque.ifera"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgba(255,255,255,0.4)] hover:text-[#fcb726] transition-colors"
                aria-label="Facebook"
              >
                <IconFacebook />
              </Link>
              <Link
                href="https://www.linkedin.com/company/réseau-bifera"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgba(255,255,255,0.4)] hover:text-[#fcb726] transition-colors"
                aria-label="LinkedIn"
              >
                <IconLinkedIn />
              </Link>
              <Link
                href="https://www.instagram.com/bibliotheque.ifera"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgba(255,255,255,0.4)] hover:text-[#fcb726] transition-colors"
                aria-label="Instagram"
              >
                <IconInstagram />
              </Link>
              <Link
                href="https://tiktok.com/@rseau.bifera"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgba(255,255,255,0.4)] hover:text-[#fcb726] transition-colors"
                aria-label="Tiktok"
              >
                <IconTiktok />
              </Link>
            </div>
          </div>

          {/* Col 2 — Liens */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading font-[700] text-[12px] text-[rgba(255,255,255,0.9)] uppercase tracking-[0.1em] mb-2">
              Navigation
            </h4>
            {[
              { href: "/",               label: "Accueil" },
              { href: "/qui-sommes-nous", label: "Qui sommes-nous" },
              { href: "/rejoindre",       label: "Rejoindre le réseau" },
              { href: "/blog",            label: "Blog & Actualités" },
              { href: "/partenaires",     label: "Partenaires" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-sans text-[14px] text-[rgba(255,255,255,0.45)] hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Col 3 — Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading font-[700] text-[12px] text-[rgba(255,255,255,0.9)] uppercase tracking-[0.1em] mb-2">
              Contact
            </h4>
            <a
              href="mailto:contact@agrolide.org"
              className="font-sans text-[14px] text-[rgba(255,255,255,0.45)] hover:text-white transition-colors"
            >
              contact@agrolide.org
            </a>
            <p className="font-sans text-[14px] text-[rgba(255,255,255,0.45)]">
              Lomé, Togo
            </p>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.08)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-[12px] text-[rgba(255,255,255,0.25)]">
            © 2025 agrolide. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="font-sans text-[12px] text-[rgba(255,255,255,0.25)] hover:text-[rgba(255,255,255,0.5)] transition-colors">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="font-sans text-[12px] text-[rgba(255,255,255,0.25)] hover:text-[rgba(255,255,255,0.5)] transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
