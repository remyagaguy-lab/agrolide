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
      className="group relative flex flex-col h-full card-glass-hover overflow-hidden"
    >
      {/* Decorative Top Background */}
      <div className="h-16 bg-gradient-to-r from-[#1b5e38]/10 to-[#50a853]/10 w-full relative">
        <div className="absolute top-0 right-0 w-20 h-20 bg-[#50a853]/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
      </div>

      <div className="flex flex-col items-center px-6 pb-6 -mt-10 flex-1">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-white p-1 shadow-md shrink-0 relative z-10 mb-3">
          <div className="w-full h-full rounded-full bg-[#e8f5e9] text-[#1b5e38] flex items-center justify-center text-2xl font-bold overflow-hidden border border-white relative">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={displayName} fill sizes="80px" className="object-cover" />
            ) : (
              member.prenom?.charAt(0) || '?'
            )}
          </div>
        </div>

        {/* Badge */}
        {member.categorie && (
          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3 ring-1 ring-inset ${getBadgeClass(member.categorie)}`}>
            {member.categorie}
          </span>
        )}

        {/* Name - Allow wrapping instead of truncating */}
        <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-[#1b5e38] transition-colors text-center leading-tight mb-2">
          {displayName}
        </h3>
        
        {/* Speciality */}
        {member.specialite && (
          <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-gray-600 mb-2 w-full">
            <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="line-clamp-2 text-center leading-snug">{member.specialite}</span>
          </div>
        )}

        {/* Location */}
        {member.pays && (
          <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500 mb-4 w-full">
            <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
            <span className="truncate">{member.ville ? `${member.ville}, ` : ''}{member.pays}</span>
          </div>
        )}

        {/* Sectors Tags */}
        <div className="mt-auto flex justify-center gap-1.5 flex-wrap w-full">
          {sectors.slice(0, 2).map((secteur: string, idx: number) => (
            <span key={idx} className="bg-gray-50/80 text-gray-600 px-2.5 py-1 rounded-full text-[11px] font-medium border border-gray-100/50">
              {secteur}
            </span>
          ))}
          {sectors.length > 2 && (
            <span className="bg-gray-50/80 text-gray-500 px-2 py-1 rounded-full text-[11px] font-medium border border-gray-100/50">
              +{sectors.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Hover CTA Footer */}
      <div className="border-t border-gray-50/50 p-4 bg-transparent flex items-center justify-center text-sm font-bold text-[#1b5e38] opacity-0 group-hover:opacity-100 group-hover:bg-[#e8f5e9]/30 transition-all duration-300 gap-2">
        Voir le profil <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  )
}
