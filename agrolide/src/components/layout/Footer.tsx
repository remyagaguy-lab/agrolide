"use client"
import * as React from "react"

import Link from "next/link"
import Image from "next/image"
import { Globe, Link as LinkIcon, Mail } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export function Footer() {
  return (
    <footer className="bg-[var(--color-vert-profond)] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Col 1 */}
          <div className="flex flex-col gap-4">
            <Image src="/agrolide-png.png" alt="agrolide" width={150} height={50} className="h-12 w-auto brightness-0 invert" />
            <p className="text-sm font-sans mt-2 opacity-90 max-w-sm">
              Fédérer la chaîne agricole, pour conquérir la souveraineté alimentaire
            </p>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-lg font-heading font-semibold text-white mb-2">Liens rapides</h4>
            <Link href="/" className="text-sm opacity-80 hover:opacity-100 hover:text-[var(--color-vert-principal)] transition-colors">Accueil</Link>
            <Link href="/qui-sommes-nous" className="text-sm opacity-80 hover:opacity-100 hover:text-[var(--color-vert-principal)] transition-colors">Qui sommes-nous</Link>
            <Link href="/rejoindre" className="text-sm opacity-80 hover:opacity-100 hover:text-[var(--color-vert-principal)] transition-colors">Rejoindre</Link>
            <Link href="/blog" className="text-sm opacity-80 hover:opacity-100 hover:text-[var(--color-vert-principal)] transition-colors">Blog</Link>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-lg font-heading font-semibold text-white mb-2">Newsletter</h4>
            <p className="text-sm opacity-80 mb-2">Abonnez-vous pour recevoir les dernières actualités agricoles africaines.</p>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); fetch('/api/newsletter/subscribe', {method: 'POST'}) }}>
              <Input type="email" placeholder="Votre email" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:border-[var(--color-vert-principal)]" required />
              <Button type="submit" variant="primary">S'abonner</Button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
          <p>Copyright agrolide 2025</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
