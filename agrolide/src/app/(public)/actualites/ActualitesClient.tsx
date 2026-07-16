"use client"

import React, { useState } from "react"
import EventsClient from "@/components/modules/evenements/EventsClient"
import OpportunitesClient from "@/components/modules/opportunites/OpportunitesClient"
import { Filter } from 'lucide-react'

export default function ActualitesClient() {
  const [filter, setFilter] = useState<'tous' | 'evenements' | 'opportunites'>('tous')

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Actualités du Réseau</h1>
          <p className="text-gray-600 mt-2">Restez informé de tout ce qui se passe dans la communauté Agrolide.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          <Filter className="w-5 h-5 text-gray-400 ml-2" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border-none outline-none focus:ring-0 bg-transparent text-gray-700 font-medium cursor-pointer py-1 pr-4"
          >
            <option value="tous">Toutes les actualités</option>
            <option value="evenements">Événements & Webinaires</option>
            <option value="opportunites">Bourse aux Opportunités</option>
          </select>
        </div>
      </div>

      <div className="animate-in fade-in duration-300 space-y-12">
        {(filter === 'tous' || filter === 'evenements') && (
          <div>
            {filter === 'tous' && <h2 className="max-w-7xl mx-auto px-4 text-2xl font-bold text-gray-900 mb-[-30px] z-10 relative">Événements</h2>}
            <EventsClient />
          </div>
        )}
        
        {(filter === 'tous' || filter === 'opportunites') && (
          <div>
            {filter === 'tous' && (
              <div className="max-w-7xl mx-auto px-4">
                <hr className="border-t border-gray-200 mb-8" />
              </div>
            )}
            {filter === 'tous' && <h2 className="max-w-7xl mx-auto px-4 text-2xl font-bold text-gray-900 mb-[-30px] z-10 relative">Opportunités</h2>}
            <OpportunitesClient />
          </div>
        )}
      </div>
    </div>
  )
}
