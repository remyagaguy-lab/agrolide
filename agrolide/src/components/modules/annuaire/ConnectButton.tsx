'use client'

import React, { useTransition } from 'react'
import { UserPlus, MessageCircle, Clock } from 'lucide-react'
import { sendConnectionRequest } from '@/app/actions/connections'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

interface ConnectButtonProps {
  memberId: string;
  status: 'accepted' | 'pending_sent' | 'pending_received' | null;
}

export default function ConnectButton({ memberId, status }: ConnectButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { userId } = useAuth()

  const handleConnect = async () => {
    if (!userId) {
      router.push('/login')
      return
    }
    if (status) return;
    
    startTransition(async () => {
      try {
        await sendConnectionRequest(memberId);
      } catch (error) {
        console.error("Erreur:", error);
      }
    });
  }

  const handleMessage = () => {
    router.push(`/membres/messages?user=${memberId}`);
  }

  if (status === 'accepted') {
    return (
      <button 
        onClick={handleMessage}
        className="flex-1 md:flex-none bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <MessageCircle className="w-5 h-5" /> Message
      </button>
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
    <button 
      onClick={handleConnect}
      disabled={isPending}
      className="flex-1 md:flex-none bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
    >
      {isPending ? <Clock className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />} 
      {isPending ? 'Envoi...' : 'Se connecter'}
    </button>
  )
}
