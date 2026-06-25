"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/Button"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    // Run once on mount to check initial position
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/agrolide-png.png" alt="agrolide" width={240} height={80} className="h-16 w-auto object-contain scale-[1.8] origin-left" priority />
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={`text-sm font-medium transition-colors ${isScrolled ? "text-gray-700 hover:text-[var(--color-vert-principal)]" : "text-white hover:text-gray-200"}`}>Accueil</Link>
          <Link href="/qui-sommes-nous" className={`text-sm font-medium transition-colors ${isScrolled ? "text-gray-700 hover:text-[var(--color-vert-principal)]" : "text-white hover:text-gray-200"}`}>Qui sommes-nous</Link>
          <Link href="/rejoindre" className={`text-sm font-medium transition-colors ${isScrolled ? "text-gray-700 hover:text-[var(--color-vert-principal)]" : "text-white hover:text-gray-200"}`}>Rejoindre</Link>
          <Link href="/blog" className={`text-sm font-medium transition-colors ${isScrolled ? "text-gray-700 hover:text-[var(--color-vert-principal)]" : "text-white hover:text-gray-200"}`}>Blog</Link>
        </nav>

        {/* CTA Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${isScrolled ? "border-[var(--color-vert-principal)] text-[var(--color-vert-principal)] hover:bg-green-50" : "border-white text-white hover:bg-white/10"}`}>
            Connexion
          </Link>
          <Link href="/rejoindre" className="px-4 py-2 bg-[var(--color-orange-accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
            Rejoindre
          </Link>
        </div>

        {/* Mobile Menu */}
        <DialogPrimitive.Root>
          <DialogPrimitive.Trigger asChild>
            <Button variant="ghost" className="md:hidden px-2">
              <Menu className="h-6 w-6 text-[var(--color-vert-profond)]" />
            </Button>
          </DialogPrimitive.Trigger>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
            <DialogPrimitive.Content className="fixed right-0 top-0 z-50 h-full w-3/4 max-w-xs bg-[var(--color-blanc)] p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right">
              <div className="flex flex-col gap-6 mt-10">
                <Link href="/" className="text-lg font-medium hover:text-[var(--color-vert-principal)]">Accueil</Link>
                <Link href="/qui-sommes-nous" className="text-lg font-medium hover:text-[var(--color-vert-principal)]">Qui sommes-nous</Link>
                <Link href="/rejoindre" className="text-lg font-medium hover:text-[var(--color-vert-principal)]">Rejoindre</Link>
                <Link href="/blog" className="text-lg font-medium hover:text-[var(--color-vert-principal)]">Blog</Link>
                
                <div className="flex flex-col gap-4 mt-6">
                  <Link href="/login" className="w-full text-center px-4 py-2 border-2 border-[var(--color-vert-principal)] text-[var(--color-vert-principal)] rounded-lg font-medium hover:bg-green-50 transition-colors">
                    Connexion
                  </Link>
                  <Link href="/rejoindre" className="w-full text-center px-4 py-2 bg-[var(--color-vert-principal)] text-white rounded-lg font-medium hover:bg-green-800 transition-colors">
                    Rejoindre
                  </Link>
                </div>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      </div>
    </header>
  )
}
