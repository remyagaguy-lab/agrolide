'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Briefcase, UserPlus, MessageCircle, Clock, Check } from 'lucide-react'
import { sendConnectionRequest } from '@/app/actions/connections'
import { useRouter } from 'next/navigation'

interface MemberCardProps {
  member: any
}

export default function MemberCard({ member }: MemberCardProps) {
  const [imgError, setImgError] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const displayName = `${member.prenom || ''} ${member.nom || ''}`.trim() || 'Membre Anonyme'
  const avatarUrl = member.photo_url || member.avatar_url
  const initial = member.prenom ? member.prenom.charAt(0).toUpperCase() : '?'
  
  const status = member.connectionStatus; // 'accepted', 'pending_sent', 'pending_received', or null/undefined

  const handleConnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (status) return;
    
    startTransition(async () => {
      try {
        await sendConnectionRequest(member.id);
      } catch (error) {
        console.error("Erreur:", error);
      }
    });
  }

  const handleMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/membres/messages?user=${member.id}`);
  }

  return (
    <div className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow relative">
      {/* Banner */}
      <Link href={`/annuaire/${member.id}`} className="block h-[72px] bg-gradient-to-r from-[#1b5e38] to-[#0c361e] w-full relative">
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:16px_16px]"></div>
      </Link>

      <div className="flex flex-col items-center px-4 pb-4 flex-1">
        {/* Avatar */}
        <Link href={`/annuaire/${member.id}`} className="block w-[104px] h-[104px] rounded-full bg-white p-1 shrink-0 z-10 -mt-[52px] shadow-sm">
          <div className="w-full h-full rounded-full bg-[#f4f8f4] text-[#1b5e38] flex items-center justify-center text-3xl font-bold overflow-hidden relative">
            {avatarUrl && !imgError ? (
              <Image 
                src={avatarUrl} 
                alt={displayName} 
                fill 
                sizes="104px" 
                className="object-cover" 
                onError={() => setImgError(true)}
              />
            ) : (
              initial
            )}
          </div>
        </Link>

        {/* Name */}
        <Link href={`/annuaire/${member.id}`}>
          <h3 className="text-[17px] font-semibold text-gray-900 mt-3 text-center leading-tight group-hover:underline decoration-1 underline-offset-2">
            {displayName}
          </h3>
        </Link>
        
        {/* Headline / Specialty */}
        <p className="text-[13px] text-gray-500 text-center mt-1.5 line-clamp-2 w-full px-2 leading-relaxed h-[38px]">
          {member.specialite || 'Agro-acteur passionné'}
          {member.organisation ? ` chez ${member.organisation}` : ''}
        </p>

        {/* Location & Category */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[12px] text-gray-500 w-full px-2">
          <div className="flex items-center gap-1.5">
             <div className="flex -space-x-1.5">
               <div className="w-5 h-5 rounded-full bg-[#1b5e38]/10 flex items-center justify-center border border-white z-10">
                 <Briefcase className="w-3 h-3 text-[#1b5e38]" />
               </div>
               <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center border border-white">
                 <MapPin className="w-3 h-3 text-gray-500" />
               </div>
             </div>
             <span className="truncate">
               {member.categorie ? member.categorie.charAt(0).toUpperCase() + member.categorie.slice(1) : 'Membre'} 
               {member.pays ? ` • ${member.pays}` : ''}
             </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-5 w-full">
          {status === 'accepted' ? (
             <button 
               onClick={handleMessage}
               className="w-full py-1.5 border-[1.5px] border-[#1b5e38] text-[#1b5e38] rounded-full flex items-center justify-center gap-2 text-sm font-semibold hover:bg-[#1b5e38]/5 transition-colors duration-200"
             >
               <MessageCircle className="w-4 h-4" /> Message
             </button>
          ) : status === 'pending_sent' ? (
             <button 
               disabled
               className="w-full py-1.5 border-[1.5px] border-gray-300 text-gray-500 rounded-full flex items-center justify-center gap-2 text-sm font-semibold bg-gray-50 cursor-not-allowed"
             >
               <Clock className="w-4 h-4" /> En attente
             </button>
          ) : status === 'pending_received' ? (
             <Link
               href="/membres/reseau"
               className="w-full py-1.5 border-[1.5px] border-orange-500 text-orange-600 rounded-full flex items-center justify-center gap-2 text-sm font-semibold hover:bg-orange-50 transition-colors duration-200"
             >
               Répondre
             </Link>
          ) : (
             <button 
               onClick={handleConnect}
               disabled={isPending}
               className="w-full py-1.5 border-[1.5px] border-[#1b5e38] text-[#1b5e38] rounded-full flex items-center justify-center gap-2 text-sm font-semibold hover:bg-[#1b5e38] hover:text-white transition-colors duration-200"
             >
               {isPending ? <Clock className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} 
               {isPending ? 'Envoi...' : 'Se connecter'}
             </button>
          )}
        </div>
      </div>
    </div>
  )
}
