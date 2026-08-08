'use client'

import React, { useState } from 'react'
import { acceptConnectionRequest, declineConnectionRequest } from '@/app/actions/network'
import { Check, X, Loader2 } from 'lucide-react'

export default function NetworkActions({ requestId }: { requestId: string }) {
  const [isPending, setIsPending] = useState(false)

  const handleAccept = async () => {
    setIsPending(true)
    try {
      const res = await acceptConnectionRequest(requestId)
      if (res.error) {
        alert(res.error)
      }
    } catch (e: any) {
      alert(e.message || "Erreur lors de l'acceptation")
    } finally {
      setIsPending(false)
    }
  }

  const handleDecline = async () => {
    setIsPending(true)
    try {
      const res = await declineConnectionRequest(requestId)
      if (res.error) {
        alert(res.error)
      }
    } catch (e: any) {
      alert(e.message || "Erreur lors du refus")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button 
        onClick={handleDecline} 
        disabled={isPending}
        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
        title="Ignorer"
      >
        <X size={20} />
      </button>
      <button 
        onClick={handleAccept} 
        disabled={isPending}
        className="px-4 py-2 bg-[#1b5e38] text-white font-medium rounded-xl hover:bg-[#14472a] transition-colors flex items-center gap-2 disabled:opacity-75"
      >
        {isPending ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
        Accepter
      </button>
    </div>
  )
}
