import React from 'react'
import Link from 'next/link'
import { MapPin, Briefcase, Award } from 'lucide-react'

interface MemberCardProps {
  member: any
}

export default function MemberCard({ member }: MemberCardProps) {
  // Initiale du nom
  const nomInitiale = member.nom ? `${member.nom.charAt(0)}.` : ''
  const displayName = `${member.prenom} ${nomInitiale}`

  // Déterminer la couleur du badge en fonction de la catégorie
  const getBadgeClass = (cat: string) => {
    switch(cat?.toLowerCase()) {
      case 'senior': return 'bg-purple-100 text-purple-700'
      case 'professionnel': return 'bg-blue-100 text-blue-700'
      case 'partenaire': return 'bg-orange-100 text-orange-700'
      case 'junior': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <Link 
      href={`/membres/annuaire/${member.id}`}
      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-xl font-bold overflow-hidden shrink-0 border border-primary-100">
          {member.avatar_url ? (
            <img src={member.avatar_url} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            member.prenom?.charAt(0) || '?'
          )}
        </div>
        
        {member.categorie && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize whitespace-nowrap ${getBadgeClass(member.categorie)}`}>
            {member.categorie}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">
        {displayName}
      </h3>
      
      {member.specialite && (
        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
          <Briefcase className="w-4 h-4 text-primary-500 shrink-0" />
          <span className="line-clamp-1">{member.specialite}</span>
        </div>
      )}

      {member.pays && (
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="line-clamp-1">{member.pays}</span>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-50 flex gap-2 flex-wrap">
        {member.secteurs_expertise && Array.isArray(member.secteurs_expertise) && member.secteurs_expertise.slice(0, 2).map((secteur: string, idx: number) => (
          <span key={idx} className="bg-gray-50 text-gray-600 px-2 py-1 rounded text-xs">
            {secteur}
          </span>
        ))}
        {member.secteurs_expertise?.length > 2 && (
          <span className="bg-gray-50 text-gray-500 px-2 py-1 rounded text-xs font-medium">
            +{member.secteurs_expertise.length - 2}
          </span>
        )}
      </div>
    </Link>
  )
}
