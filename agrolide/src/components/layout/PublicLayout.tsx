import * as React from "react"
import { Header } from "./Header"
import { Footer } from "./Footer"

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Lien d'évitement : visible au premier Tab, saute la navigation. */}
      <a
        href="#contenu"
        className="sr-only z-[60] rounded-control bg-primary px-4 py-3 text-label-lg text-on-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
