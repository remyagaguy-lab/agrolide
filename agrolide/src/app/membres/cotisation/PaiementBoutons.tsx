"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { CreditCard, Smartphone, Loader2 } from "lucide-react"
import { sendGAEvent } from "@next/third-parties/google"
import { DATE_FIN_GRATUITE_LISIBLE, paiementOuvert } from "@/lib/adhesion"

export function PaiementBoutons({ categorie }: { categorie: string }) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async (methode: 'stripe' | 'cinetpay') => {
    setIsLoading(methode)
    setError(null)
    
    // Suivi de conversion GA4 pour le début du processus d'adhésion
    sendGAEvent('event', 'begin_checkout', {
      payment_type: methode,
      item_category: categorie
    })

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"
      
      const response = await fetch(`${apiUrl}/api/paiements/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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

  // Garde-fou : tant que le paiement n'est pas ouvert, aucun bouton (même si le composant est rendu par erreur).
  if (!paiementOuvert()) {
    return (
      <p className="text-center text-body-sm text-on-surface-variant">
        Le paiement n'est pas encore ouvert : votre adhésion est gratuite jusqu'au {DATE_FIN_GRATUITE_LISIBLE}.
      </p>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-error-container border border-error/30 text-error text-sm rounded-md text-center">
          {error}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="outline" 
          className="flex-1 h-14 text-lg border-2 hover:border-primary flex justify-center items-center gap-3"
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
