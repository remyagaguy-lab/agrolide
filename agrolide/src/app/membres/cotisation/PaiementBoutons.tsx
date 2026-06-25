"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { CreditCard, Smartphone, Loader2 } from "lucide-react"

export function PaiementBoutons({ sessionToken, categorie }: { sessionToken: string, categorie: string }) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async (methode: 'stripe' | 'cinetpay') => {
    setIsLoading(methode)
    setError(null)
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"
      
      const response = await fetch(`${apiUrl}/api/paiements/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ methode, categorie })
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'initialisation du paiement")
      }

      const data = await response.json()
      
      if (data.url) {
        // Redirection vers Stripe Checkout ou CinetPay URL
        window.location.href = data.url
      } else {
        throw new Error("URL de paiement non reçue")
      }
      
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
      setIsLoading(null)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-[#d32f2f] text-sm rounded-md text-center">
          {error}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="outline" 
          className="flex-1 h-14 text-lg border-2 hover:border-[var(--color-vert-principal)] flex justify-center items-center gap-3"
          onClick={() => handlePayment('stripe')}
          disabled={isLoading !== null}
        >
          {isLoading === 'stripe' ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <><CreditCard size={24} /> Carte Bancaire</>
          )}
        </Button>
        
        <Button 
          variant="primary" 
          className="flex-1 h-14 text-lg flex justify-center items-center gap-3"
          onClick={() => handlePayment('cinetpay')}
          disabled={isLoading !== null}
        >
          {isLoading === 'cinetpay' ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <><Smartphone size={24} /> Mobile Money</>
          )}
        </Button>
      </div>
    </div>
  )
}
