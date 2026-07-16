"use client"

import React, { useState, useEffect } from "react"
import { createClient } from '@supabase/supabase-js'
import { Filter, Plus } from 'lucide-react'
import EventCard from "@/components/modules/evenements/EventCard"
import OpportunityCard from "@/components/modules/opportunites/OpportunityCard"
import InscriptionModal from "@/components/modules/evenements/InscriptionModal"
import SubmitOpportunityModal from "@/components/modules/opportunites/SubmitOpportunityModal"

export default function ActualitesClient() {
  const [filter, setFilter] = useState<'tous' | 'evenements' | 'opportunites'>('tous')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isOppModalOpen, setIsOppModalOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // On récupère les événements publiés
    const { data: eventsData } = await supabase
      .from('evenements')
      .select('*')
      .eq('publie', true)

    // On récupère les opportunités publiées
    const { data: oppsData } = await supabase
      .from('opportunites')
      .select('*')
      .eq('statut', 'publie')

    const events = (eventsData || []).map(e => ({ ...e, _itemType: 'evenement' }))
    const opps = (oppsData || []).map(o => ({ ...o, _itemType: 'opportunite' }))

    const combined = [...events, ...opps]
    // Tri par date de création, de la plus ancienne à la plus récente, comme demandé
    combined.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

    setItems(combined)
    setLoading(false)
  }

  const handleInscrireClick = (event: any) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const filteredItems = items.filter(item => {
    if (filter === 'evenements' && item._itemType !== 'evenement') return false
    if (filter === 'opportunites' && item._itemType !== 'opportunite') return false
    return true
  })

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
              <option value="evenements">Événements & Webinaires</option>
              <option value="opportunites">Bourse aux Opportunités</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="py-20 text-center text-gray-500">Chargement des actualités...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500">Aucune actualité ne correspond à vos critères.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              if (item._itemType === 'evenement') {
                return <EventCard key={`evt-${item.id}`} event={item} onInscrireClick={handleInscrireClick} />
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
    </div>
  )
}
