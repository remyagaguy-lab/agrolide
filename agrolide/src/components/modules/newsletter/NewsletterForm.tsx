"use client"

import React, { useState } from "react"
import { subscribeToNewsletter } from "@/app/actions/newsletter"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    setMessage("")

    const formData = new FormData()
    formData.append("email", email)

    // Using Server Action directly
    const result = await subscribeToNewsletter(null, formData)

    if (result.success) {
      setStatus("success")
      setMessage(result.message || "Inscription réussie !")
      setEmail("")
    } else {
      setStatus("error")
      setMessage(result.error || "Une erreur est survenue.")
    }
  }

  return (
    <div className="mt-20 p-10 md:p-16 rounded-3xl bg-[#f0f6f2] border border-[#d6e5db] text-center text-gray-900 relative overflow-hidden shadow-sm">
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: "url('/images/motif-transparent.png')", backgroundSize: "400px", backgroundRepeat: "repeat" }} 
      />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-heading font-bold mb-4">Parlons agriculture</h3>
        
        {status === "success" ? (
          <div className="bg-[#e6f0e9] border border-[#d6e5db] rounded-xl p-6 mb-4">
            <h4 className="text-xl font-bold text-[#1b5e38] mb-2">🎉 Bienvenue à bord !</h4>
            <p className="text-gray-700">{message}</p>
          </div>
        ) : (
          <>
            <p className="text-lg text-gray-600 mb-8">
              Recevez directement dans votre boîte mail les meilleures analyses, conseils agronomiques et opportunités de financement pour développer votre activité.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="flex-1 px-6 py-3.5 rounded-full text-gray-900 bg-white border border-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b5e38] disabled:opacity-70"
              />
              <button
                type="submit"
                disabled={status === "loading" || !email}
                className="font-bold text-white bg-[#1b5e38] hover:bg-[#154a2b] transition-colors px-8 py-3.5 rounded-full shadow hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none disabled:cursor-not-allowed whitespace-nowrap"
              >
                {status === "loading" ? "Inscription..." : "S'inscrire"}
              </button>
            </form>
            
            {status === "error" && (
              <p className="text-red-700 text-sm mt-3 font-medium bg-red-50 border border-red-200 p-2 rounded-lg inline-block">
                {message}
              </p>
            )}
            
            <p className="text-xs text-gray-500 mt-4">
              En vous inscrivant, vous acceptez de recevoir notre newsletter. Vous pourrez vous désabonner à tout moment.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
