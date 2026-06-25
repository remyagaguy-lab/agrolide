"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-[#0f3d22] pt-[60px] pb-[32px]">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Col 1 */}
          <div className="flex flex-col gap-6">
            <Image src="/agrolide-png.png" alt="agrolide" width={140} height={36} className="h-[36px] w-auto brightness-0 invert object-contain" />
            <p className="font-sans text-[15px] leading-relaxed text-[rgba(255,255,255,0.55)] max-w-[280px]">
              Fédérer la chaîne agricole, pour conquérir la souveraineté alimentaire en Afrique.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="font-sans font-bold text-[rgba(255,255,255,0.55)] hover:text-white transition-colors">
                IN
              </Link>
              <Link href="#" className="font-sans font-bold text-[rgba(255,255,255,0.55)] hover:text-white transition-colors">
                X
              </Link>
              <Link href="#" className="font-sans font-bold text-[rgba(255,255,255,0.55)] hover:text-white transition-colors">
                FB
              </Link>
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-bold text-[16px] text-[rgba(255,255,255,0.9)] mb-2">Liens rapides</h4>
            <Link href="/" className="font-sans text-[15px] text-[rgba(255,255,255,0.55)] hover:text-white transition-colors">Accueil</Link>
            <Link href="/qui-sommes-nous" className="font-sans text-[15px] text-[rgba(255,255,255,0.55)] hover:text-white transition-colors">Qui sommes-nous</Link>
            <Link href="/rejoindre" className="font-sans text-[15px] text-[rgba(255,255,255,0.55)] hover:text-white transition-colors">Rejoindre le réseau</Link>
            <Link href="/blog" className="font-sans text-[15px] text-[rgba(255,255,255,0.55)] hover:text-white transition-colors">Blog & Actualités</Link>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-bold text-[16px] text-[rgba(255,255,255,0.9)] mb-2">Contact</h4>
            <p className="font-sans text-[15px] text-[rgba(255,255,255,0.55)]">
              contact@agrolide.org
            </p>
            <p className="font-sans text-[15px] text-[rgba(255,255,255,0.55)]">
              Abidjan, Côte d'Ivoire
            </p>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.1)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-[13px] text-[rgba(255,255,255,0.35)]">
            © 2025 agrolide. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="font-sans text-[13px] text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.55)] transition-colors">Mentions légales</Link>
            <Link href="/confidentialite" className="font-sans text-[13px] text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.55)] transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
