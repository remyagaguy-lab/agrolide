"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e8e8e4] backdrop-blur-[8px] bg-[rgba(255,255,255,0.95)]">
      <div className="max-w-[1100px] mx-auto flex h-[80px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/agrolide-png.png" alt="agrolide" width={140} height={36} className="h-[36px] w-auto object-contain" priority />
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="font-heading font-medium text-[14px] text-[#555] hover:text-[#1b5e38]">Accueil</Link>
          <Link href="/qui-sommes-nous" className="font-heading font-medium text-[14px] text-[#555] hover:text-[#1b5e38]">Qui sommes-nous</Link>
          <Link href="/rejoindre" className="font-heading font-medium text-[14px] text-[#555] hover:text-[#1b5e38]">Rejoindre</Link>
          <Link href="/blog" className="font-heading font-medium text-[14px] text-[#555] hover:text-[#1b5e38]">Blog</Link>
        </nav>

        {/* CTA Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/login" className="font-heading font-medium text-[14px] text-[#555] hover:text-[#1b5e38]">
            Connexion
          </Link>
          <Link href="/rejoindre" className="bg-[#1b5e38] text-white px-[20px] py-[8px] rounded-[6px] text-[14px] font-semibold hover:opacity-90">
            Rejoindre
          </Link>
        </div>
      </div>
    </header>
  )
}
