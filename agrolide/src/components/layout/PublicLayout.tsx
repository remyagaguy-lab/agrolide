import * as React from "react"
import { Header } from "./Header"
import { Footer } from "./Footer"
import { NewsletterForm } from "@/components/modules/newsletter/NewsletterForm"

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      {/* <NewsletterForm /> */}
    </div>
  )
}
