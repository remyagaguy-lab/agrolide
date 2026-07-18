"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Filter, Plus, AlertCircle } from 'lucide-react'
import { useActualites } from "@/hooks/useActualites"
import EventCard from "@/components/modules/evenements/EventCard"
import OpportunityCard from "@/components/modules/opportunites/OpportunityCard"
import InscriptionModal from "@/components/modules/evenements/InscriptionModal"
import SubmitOpportunityModal from "@/components/modules/opportunites/SubmitOpportunityModal"

export default function ActualitesClient() {
  const { loading, error, filter, setFilter, filteredItems, fetchData } = useActualites()

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isOppModalOpen, setIsOppModalOpen] = useState(false)

  const handleInscrireClick = (event: any) => {
    if (event.lien_inscription) {
      window.open(event.lien_inscription, '_blank', 'noopener,noreferrer')
    } else {
      setSelectedEvent(event)
      setIsEventModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Actualités du Réseau</h1>
          <p className="text-gray-600 mt-2">Restez informé de tout ce qui se passe dans la communauté Agrolide.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => setIsOppModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" /> Proposer une opportunité
          </button>
          
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <Filter className="w-5 h-5 text-gray-400 ml-2" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border-none outline-none focus:ring-0 bg-transparent text-gray-700 font-medium cursor-pointer py-1 pr-4"
            >
              <option value="tous">Toutes les actualités</option>
              <option value="evenements">Événements</option>
              <option value="bourse">Bourse d'étude</option>
              <option value="appel">Appel à projet</option>
              <option value="emploi">Offres d'emploi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500">
            <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mb-4"></div>
            <p className="font-medium">Chargement des actualités...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100 flex flex-col items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Impossible de charger les actualités</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={fetchData} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Réessayer
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500">Aucune actualité ne correspond à vos critères.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              if (item._itemType === 'evenement') {
                return <EventCard key={`evt-${item.id}`} event={item} onInscrireClick={handleInscrireClick} onDetailsClick={(evt) => setSelectedEvent(evt)} />
              } else {
                return <OpportunityCard key={`opp-${item.id}`} opp={item} />
              }
            })}
          </div>
        )}
      </div>

      <InscriptionModal 
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
      />

      <SubmitOpportunityModal 
        isOpen={isOppModalOpen}
        onClose={() => setIsOppModalOpen(false)}
        onSuccess={fetchData}
      />

      {/* Event Details Modal */}
      {selectedEvent && selectedEvent._itemType === 'evenement' && !isEventModalOpen && (
        <EventDetailsModal 
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
          onInscrire={() => {
            setSelectedEvent(null)
            handleInscrireClick(selectedEvent)
          }}
        />
      )}
    </div>
  )
}

function EventDetailsModal({ isOpen, onClose, event, onInscrire }: { isOpen: boolean, onClose: () => void, event: any, onInscrire: () => void }) {
  const [marked, setMarked] = useState<any>(null)

  useEffect(() => {
    import('marked').then(m => setMarked(m))
  }, [])

  if (!isOpen || !event) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-900 pr-8">{event.titre}</h2>
          <button aria-label="Fermer les détails" onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <div className="p-6 flex-grow">
          {event.image_url && (
            <div className="mb-6 rounded-xl overflow-hidden bg-gray-100 relative w-full h-[400px]">
              <Image src={event.image_url} alt="Affiche" fill sizes="(max-width: 768px) 100vw, 800px" className="object-contain" />
            </div>
          )}
          
          <div className="prose prose-green max-w-none text-gray-700">
            {event.description ? (
              marked ? (
                <div dangerouslySetInnerHTML={{ __html: marked.parse(event.description) }} />
              ) : (
                <p>Chargement de la description...</p>
              )
            ) : (
              <p className="italic text-gray-500">Aucune description disponible pour cet événement.</p>
            )}
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">
            Fermer
          </button>
          
          {new Date(event.date_debut) >= new Date() && (
            <button 
              onClick={onInscrire} 
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors shadow-sm"
            >
              S'inscrire à l'événement
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
