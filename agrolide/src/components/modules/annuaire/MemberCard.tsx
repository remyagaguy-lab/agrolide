'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Briefcase, ArrowRight } from 'lucide-react'

interface MemberCardProps {
  member: any
}

export default function MemberCard({ member }: MemberCardProps) {
  const [imgError, setImgError] = useState(false)
  const displayName = `${member.prenom || ''} ${member.nom || ''}`.trim() || 'Membre Anonyme'
  const avatarUrl = member.photo_url || member.avatar_url
  const initial = member.prenom ? member.prenom.charAt(0).toUpperCase() : '?'

  const getSectors = () => {
    const val = member.secteurs_expertise;
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val !== 'string') return [];
    const trimmed = val.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return trimmed.split(',').map((s: string) => s.trim()).filter(Boolean);
  }
  const sectors = getSectors();

  const getBadgeClass = (cat: string) => {
    switch(cat?.toLowerCase()) {
      case 'senior':
      case 'sénior': return 'bg-[#fcb726]/15 text-[#5a3d00] border-[#fcb726]/30'
      case 'professionnel': return 'bg-[#1b5e38]/10 text-[#1b5e38] border-[#1b5e38]/20'
      case 'partenaire': return 'bg-[#878e2c]/10 text-[#878e2c] border-[#878e2c]/20'
      case 'junior': return 'bg-[#50a853]/10 text-[#1b5e38] border-[#50a853]/20'
      case 'passionne':
      case 'passionné': return 'bg-[#f99e1d]/10 text-[#8a4e00] border-[#f99e1d]/20'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <Link 
      href={`/annuaire/${member.id}`}
      className="group relative flex flex-col h-full bg-white border border-[#e8e8e4] rounded-2xl shadow-sm hover:border-[#1b5e38] hover:shadow-md transition-all overflow-hidden"
    >
      <div className="h-14 bg-gradient-to-r from-[#1b5e38] to-[#0c361e] w-full relative">
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:16px_16px]"></div>
      </div>

      <div className="flex flex-col items-center px-4 pb-4 -mt-8 flex-1">
        <div className="w-16 h-16 rounded-full bg-white p-1 shadow-sm shrink-0 relative z-10 mb-2 border border-[#e8e8e4]">
          <div className="w-full h-full rounded-full bg-[#f4f8f4] text-[#1b5e38] flex items-center justify-center text-xl font-bold overflow-hidden relative">
            {avatarUrl && !imgError ? (
              <Image 
                src={avatarUrl} 
                alt={displayName} 
                fill 
                sizes="64px" 
                className="object-cover" 
                onError={() => setImgError(true)}
              />
            ) : (
              initial
            )}
          </div>
        </div>

        {member.categorie && (
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-1.5 border ${getBadgeClass(member.categorie)}`}>
            {member.categorie}
          </span>
        )}

        <h3 className="text-sm font-extrabold text-[#1a1a1a] group-hover:text-[#1b5e38] transition-colors text-center leading-tight mb-1">
          {displayName}
        </h3>
        
        {member.specialite && (
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5 w-full">
            <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="line-clamp-1 text-center leading-snug">{member.specialite}</span>
          </div>
        )}

        {member.pays && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-2 w-full">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{member.ville ? `${member.ville}, ` : ''}{member.pays}</span>
          </div>
        )}

        {sectors.length > 0 && (
          <div className="mt-auto pt-2 flex justify-center gap-1.5 flex-wrap w-full">
            {sectors.slice(0, 2).map((secteur: string, idx: number) => (
              <span key={idx} className="bg-gray-50 text-gray-500 px-2 py-1 rounded-md text-[9px] font-bold border border-gray-100 uppercase tracking-wider">
                {secteur}
              </span>
            ))}
            {sectors.length > 2 && (
              <span className="bg-gray-50 text-gray-400 px-2 py-1 rounded-md text-[9px] font-bold border border-gray-100 uppercase tracking-wider">
                +{sectors.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-[#e8e8e4] p-2.5 bg-[#fcfdfc] flex items-center justify-center text-xs font-bold text-gray-500 group-hover:text-[#1b5e38] group-hover:bg-[#dff0e0]/30 transition-colors gap-2">
        Voir le profil <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  )
}
