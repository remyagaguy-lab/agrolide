import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, MapPin } from 'lucide-react'

interface AgripreneurProps {
  agripreneur: {
    prenom: string
    nom: string
    photo_url: string | null
    titre_projet: string
    description_courte: string
    secteur: string
    pays: string
    website_url: string | null
  }
}

export default function AgripreneurCard({ agripreneur }: AgripreneurProps) {
  const initiale = agripreneur.prenom.charAt(0) + agripreneur.nom.charAt(0)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="p-6 pb-0 flex items-center gap-4 mb-4">
        {agripreneur.photo_url ? (
          <Image 
            src={agripreneur.photo_url} 
            alt={`${agripreneur.prenom} ${agripreneur.nom}`} 
            width={64} 
            height={64} 
            className="rounded-full object-cover w-16 h-16 border-2 border-primary-100"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xl font-bold border-2 border-primary-50">
            {initiale}
          </div>
        )}
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{agripreneur.prenom} {agripreneur.nom}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="w-3.5 h-3.5 mr-1" /> {agripreneur.pays}
          </div>
        </div>
      </div>
      
      <div className="p-6 pt-2 flex-grow flex flex-col">
        <div className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full w-fit mb-3">
          {agripreneur.secteur}
        </div>
        <h4 className="font-bold text-xl text-primary-800 mb-2">{agripreneur.titre_projet}</h4>
        <p className="text-gray-600 text-sm flex-grow line-clamp-3">
          {agripreneur.description_courte}
        </p>
      </div>

      {agripreneur.website_url && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 group-hover:bg-primary-50 transition-colors">
          <a href={agripreneur.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-primary-700 font-semibold text-sm">
            Découvrir le projet <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  )
}
