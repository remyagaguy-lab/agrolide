"use client"

import React, { useState, useEffect } from "react"
import { subscribeToNewsletter } from "@/app/actions/newsletter"
import { X } from "lucide-react"

export function NewsletterForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Check if user has already seen or closed the popup
    const hasSeen = localStorage.getItem("agrolide_newsletter_seen")
    if (!hasSeen) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  const closePopup = () => {
    setIsOpen(false)
    localStorage.setItem("agrolide_newsletter_seen", "true")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    setMessage("")

    const formData = new FormData()
    formData.append("email", email)

    const result = await subscribeToNewsletter(null, formData)

    if (result.success) {
      setStatus("success")
      setMessage(result.message || "Inscription réussie !")
      setEmail("")
      localStorage.setItem("agrolide_newsletter_seen", "true")
      // Auto close after 3 seconds on success
      setTimeout(() => {
        setIsOpen(false)
      }, 3000)
    } else {
      setStatus("error")
      setMessage(result.error || "Une erreur est survenue.")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] w-[calc(100%-2rem)] md:w-[450px] bg-white rounded-2xl shadow-2xl border border-[#d6e5db] overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-500">
      
      {/* Decorative top bar */}
      <div className="h-1.5 w-full bg-[#1b5e38]" />

      {/* Close Button */}
      <button 
        onClick={closePopup}
        className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-20"
        aria-label="Fermer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Motif Background (subtle) */}
      <div 
        className="absolute inset-0 z-0 opacity-5 pointer-events-none" 
        style={{ backgroundImage: "url('/images/motif-transparent.png')", backgroundSize: "200px", backgroundRepeat: "repeat" }} 
      />
      
      <div className="relative z-10 p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-heading font-bold mb-2 text-[#1b5e38]">Parlons agriculture</h3>
        
        {status === "success" ? (
          <div className="bg-[#e6f0e9] border border-[#d6e5db] rounded-xl p-4 mt-4">
            <h4 className="text-lg font-bold text-[#1b5e38] mb-1">🎉 Bienvenue !</h4>
            <p className="text-gray-700 text-sm">{message}</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-5 pr-4">
              Recevez nos meilleures analyses et opportunités de financement.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="w-full px-4 py-2.5 rounded-xl text-gray-900 bg-gray-50 border border-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b5e38] disabled:opacity-70 text-sm"
              />
              <button
                type="submit"
                disabled={status === "loading" || !email}
                className="w-full font-bold text-white bg-[#1b5e38] hover:bg-[#154a2b] transition-colors px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed text-sm flex justify-center items-center"
              >
                {status === "loading" ? "Inscription..." : "S'inscrire"}
              </button>
            </form>
            
            {status === "error" && (
              <p className="text-red-700 text-xs mt-3 font-medium bg-red-50 p-2 rounded border border-red-100">
                {message}
              </p>
            )}
            
            <p className="text-[11px] text-gray-400 mt-4 leading-tight">
              En vous inscrivant, vous acceptez notre politique de confidentialité.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
