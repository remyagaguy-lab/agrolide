import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, MapPin } from 'lucide-react'

interface AgripreneurProps {
  agripreneur: {
    id: string
    nom: string
    projet: string
    description: string | null
    lien_web: string | null
    photo_url: string | null
    secteur: string | null
    pays: string | null
  }
}

export default function AgripreneurCard({ agripreneur }: AgripreneurProps) {
  const nom = agripreneur.nom || "Agripreneur"
  const nameParts = nom.split(' ')
  const initials = nameParts.map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="p-6 pb-0 flex items-center gap-4 mb-4">
        {agripreneur.photo_url ? (
          <Image 
            src={agripreneur.photo_url} 
            alt={nom} 
            width={64} 
            height={64} 
            className="rounded-full object-cover w-16 h-16 border-2 border-primary-100"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xl font-bold border-2 border-primary-50">
            {initials || '?'}
          </div>
        )}
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{nom}</h3>
          {agripreneur.pays && (
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1" /> {agripreneur.pays}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 pt-2 flex-grow flex flex-col">
        {agripreneur.secteur && (
          <div className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full w-fit mb-3">
            {agripreneur.secteur}
          </div>
        )}
        <h4 className="font-bold text-xl text-primary-800 mb-2">{agripreneur.projet}</h4>
        {agripreneur.description && (
          <p className="text-gray-600 text-sm flex-grow line-clamp-3">
            {agripreneur.description}
          </p>
        )}
      </div>

      {agripreneur.lien_web && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 group-hover:bg-primary-50 transition-colors">
          <a href={agripreneur.lien_web} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-primary-700 font-semibold text-sm">
            Découvrir le projet <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  )
}
