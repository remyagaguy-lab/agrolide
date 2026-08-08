'use client'

import React, { useState } from 'react'
import { UserPlus, MessageCircle, Clock } from 'lucide-react'
import { sendConnectionRequest } from '@/app/actions/connections'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

interface ConnectButtonProps {
  memberId: string;
  status: 'accepted' | 'pending_sent' | 'pending_received' | null;
}

export default function ConnectButton({ memberId, status: initialStatus }: ConnectButtonProps) {
  const [status, setStatus] = useState(initialStatus)
  const [isPending, setIsPending] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()
  const { userId } = useAuth()

  const handleConnect = async () => {
    if (!userId) {
      router.push('/login')
      return
    }
    if (status) return;
    
    setIsPending(true)
    setErrorMsg(null)
    try {
      const res = await sendConnectionRequest(memberId);
      if (res?.error) {
        setErrorMsg("Erreur Serveur: " + res.error);
      } else if (res?.success) {
        setStatus('pending_sent');
      } else {
        setErrorMsg("Erreur: Réponse inattendue " + JSON.stringify(res));
      }
    } catch (error: any) {
      console.error("Erreur catchée :", error);
      setErrorMsg("Exception: " + (error.message || JSON.stringify(error)));
    } finally {
      setIsPending(false)
    }
  }

  if (status === 'accepted') {
    return (
      <Link 
        href={`/membres/messages?user=${memberId}`}
        className="flex-1 md:flex-none bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <MessageCircle className="w-5 h-5" /> Message
      </Link>
    )
  }

  if (status === 'pending_sent') {
    return (
      <button 
        disabled
        className="flex-1 md:flex-none bg-gray-100 text-gray-500 px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 cursor-not-allowed"
      >
        <Clock className="w-5 h-5" /> En attente
      </button>
    )
  }

  if (status === 'pending_received') {
    return (
      <Link 
        href="/membres/reseau"
        className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        Répondre à l'invitation
      </Link>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <button 
        onClick={handleConnect}
        disabled={isPending}
        className="flex-1 md:flex-none bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        {isPending ? <Clock className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />} 
        {isPending ? 'Envoi...' : 'Se connecter'}
      </button>
      {errorMsg && (
        <p className="text-red-500 text-xs font-medium max-w-[200px] text-center">{errorMsg}</p>
      )}
    </div>
  )
}
