"use client"

import React, { useState } from "react"
import EventsClient from "@/components/modules/evenements/EventsClient"
import OpportunitesClient from "@/components/modules/opportunites/OpportunitesClient"

export default function ActualitesClient() {
  const [activeTab, setActiveTab] = useState<'evenements' | 'opportunites'>('evenements')

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 border-b border-gray-200 flex space-x-8">
          <button
            onClick={() => setActiveTab('evenements')}
            className={`pb-4 text-lg font-medium transition-colors relative ${
              activeTab === 'evenements' ? 'text-[#1b5e38]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Événements
            {activeTab === 'evenements' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1b5e38]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('opportunites')}
            className={`pb-4 text-lg font-medium transition-colors relative ${
              activeTab === 'opportunites' ? 'text-[#1b5e38]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Opportunités
            {activeTab === 'opportunites' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1b5e38]" />
            )}
          </button>
        </div>
      </div>

      <div className="animate-in fade-in duration-300">
        {activeTab === 'evenements' ? (
          <EventsClient />
        ) : (
          <OpportunitesClient />
        )}
      </div>
    </div>
  )
}
