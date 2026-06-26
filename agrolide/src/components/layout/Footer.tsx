"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"

function IconLinkedIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function IconX() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
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
              width={130}
              height={34}
              className="h-[34px] w-auto brightness-0 invert object-contain"
            />
            <p className="font-sans text-[14px] leading-[1.8] text-[rgba(255,255,255,0.45)] max-w-[300px]">
              Fédérer la chaîne agricole africaine pour conquérir la souveraineté alimentaire.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <IconLinkedIn />
              </Link>
              <Link
                href="#"
                className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <IconX />
              </Link>
              <Link
                href="#"
                className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <IconFacebook />
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
              Abidjan, Côte d'Ivoire
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
