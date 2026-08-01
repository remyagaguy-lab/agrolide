import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Briefcase, ArrowRight } from 'lucide-react'

interface MemberCardProps {
  member: any
}

export default function MemberCard({ member }: MemberCardProps) {
  // Use full name to avoid awkward truncation
  const displayName = `${member.prenom || ''} ${member.nom || ''}`.trim() || 'Membre Anonyme'
  const avatarUrl = member.photo_url || member.avatar_url

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

  // Déterminer la couleur du badge en fonction de la catégorie
  const getBadgeClass = (cat: string) => {
    switch(cat?.toLowerCase()) {
      case 'senior':
      case 'sénior': return 'bg-[#fcb726]/15 text-[#5a3d00] ring-[#fcb726]/30'
      case 'professionnel': return 'bg-[#1b5e38]/10 text-[#1b5e38] ring-[#1b5e38]/20'
      case 'partenaire': return 'bg-[#878e2c]/10 text-[#878e2c] ring-[#878e2c]/20'
      case 'junior': return 'bg-[#50a853]/10 text-[#1b5e38] ring-[#50a853]/20'
      case 'passionne':
      case 'passionné': return 'bg-[#f99e1d]/10 text-[#8a4e00] ring-[#f99e1d]/20'
      default: return 'bg-gray-100 text-gray-700 ring-gray-200'
    }
  }

  return (
    <Link 
      href={`/annuaire/${member.id}`}
      className="group relative flex flex-col h-full bg-white border border-[#e8e8e4] rounded-2xl shadow-sm hover:border-[#1b5e38] hover:shadow-md transition-all overflow-hidden"
    >
      {/* Decorative Top Background */}
      <div className="h-12 bg-gradient-to-r from-[#1b5e38]/10 to-[#50a853]/10 w-full relative">
      </div>

      <div className="flex flex-col items-center px-4 pb-4 -mt-6 flex-1">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-xl bg-white p-1 shadow-sm shrink-0 relative z-10 mb-2 border border-[#e8e8e4]">
          <div className="w-full h-full rounded-lg bg-[#e8f5e9] text-[#1b5e38] flex items-center justify-center text-xl font-bold overflow-hidden relative">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={displayName} fill sizes="64px" className="object-cover" />
            ) : (
              member.prenom?.charAt(0) || '?'
            )}
          </div>
        </div>

        {/* Badge */}
        {member.categorie && (
          <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider mb-2 ring-1 ring-inset ${getBadgeClass(member.categorie)}`}>
            {member.categorie}
          </span>
        )}

        {/* Name - Allow wrapping instead of truncating */}
        <h3 className="text-sm font-extrabold text-[#1a1a1a] group-hover:text-[#1b5e38] transition-colors text-center leading-tight mb-1">
          {displayName}
        </h3>
        
        {/* Speciality */}
        {member.specialite && (
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5 w-full">
            <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="line-clamp-1 text-center leading-snug">{member.specialite}</span>
          </div>
        )}

        {/* Location */}
        {member.pays && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-3 w-full">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{member.ville ? `${member.ville}, ` : ''}{member.pays}</span>
          </div>
        )}

        {/* Sectors Tags */}
        <div className="mt-auto flex justify-center gap-1.5 flex-wrap w-full">
          {sectors.slice(0, 2).map((secteur: string, idx: number) => (
            <span key={idx} className="bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md text-[10px] font-medium border border-gray-100">
              {secteur}
            </span>
          ))}
          {sectors.length > 2 && (
            <span className="bg-gray-50 text-gray-400 px-2 py-0.5 rounded-md text-[10px] font-medium border border-gray-100">
              +{sectors.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Hover CTA Footer */}
      <div className="border-t border-[#e8e8e4] p-2.5 bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:text-[#1b5e38] group-hover:bg-[#f0f7f0] transition-colors gap-1.5">
        Voir le profil <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  )
}
