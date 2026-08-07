'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Briefcase, UserPlus } from 'lucide-react'

interface MemberCardProps {
  member: any
}

export default function MemberCard({ member }: MemberCardProps) {
  const [imgError, setImgError] = useState(false)
  const displayName = `${member.prenom || ''} ${member.nom || ''}`.trim() || 'Membre Anonyme'
  const avatarUrl = member.photo_url || member.avatar_url
  const initial = member.prenom ? member.prenom.charAt(0).toUpperCase() : '?'

  return (
    <Link 
      href={`/annuaire/${member.id}`}
      className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow relative"
    >
      {/* Banner */}
      <div className="h-[72px] bg-gradient-to-r from-[#1b5e38] to-[#0c361e] w-full relative">
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:16px_16px]"></div>
      </div>

      <div className="flex flex-col items-center px-4 pb-4 flex-1">
        {/* Avatar */}
        <div className="w-[104px] h-[104px] rounded-full bg-white p-1 shrink-0 z-10 -mt-[52px] shadow-sm">
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
        </div>

        {/* Name */}
        <h3 className="text-[17px] font-semibold text-gray-900 mt-3 text-center leading-tight group-hover:underline decoration-1 underline-offset-2">
          {displayName}
        </h3>
        
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

        {/* Button */}
        <div className="mt-auto pt-5 w-full">
           <div className="w-full py-1.5 border-[1.5px] border-[#1b5e38] text-[#1b5e38] rounded-full flex items-center justify-center gap-2 text-sm font-semibold group-hover:bg-[#1b5e38]/5 transition-colors duration-200">
             Voir le profil
           </div>
        </div>
      </div>
    </Link>
  )
}
