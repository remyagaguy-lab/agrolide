'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import CustomCalendar from './CustomCalendar'
import EventCard from './EventCard'
import InscriptionModal from './InscriptionModal'
import { List, Calendar as CalendarIcon, Filter, X } from 'lucide-react'

export default function EventsClient() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Modal state
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Filters
  const [filterType, setFilterType] = useState('tous')
  const [filterFormat, setFilterFormat] = useState('tous')
  const [showPast, setShowPast] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // On récupère tous les événements publiés
    const { data, error } = await supabase
      .from('evenements')
      .select('*')
      .eq('publie', true)
      .order('date_debut', { ascending: true })
      
    if (!error && data) {
      setEvents(data)
    }
    setLoading(false)
  }

  const handleInscrireClick = (event: any) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const now = new Date()
  
  // Filtrage
  let filteredEvents = events.filter(e => {
    if (filterType !== 'tous' && e.type_evt !== filterType) return false
    if (filterFormat === 'en_ligne' && !e.en_ligne) return false
    if (filterFormat === 'presentiel' && e.en_ligne) return false
    return true
  })

  // Séparation passés / à venir
  const upcomingEvents = filteredEvents.filter(e => new Date(e.date_debut) >= now)
  const pastEvents = filteredEvents.filter(e => new Date(e.date_debut) < now).reverse() // Plus récents d'abord

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Événements & Communauté</h1>
          <p className="text-gray-600 mt-2">Participez à nos formations, webinaires et rencontres.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <List className="w-4 h-4" /> Liste
          </button>
          <button 
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <CalendarIcon className="w-4 h-4" /> Calendrier
          </button>
        </div>
      </div>

      {/* Filters (only show in list view for simplicity) */}
      {view === 'list' && (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-gray-500">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtres :</span>
          </div>
          
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="tous">Tous les types</option>
            <option value="webinaire">Webinaire</option>
            <option value="atelier">Atelier</option>
            <option value="conference">Conférence</option>
            <option value="rencontre_locale">Rencontre Locale</option>
          </select>
          
          <select 
            value={filterFormat} 
            onChange={e => setFilterFormat(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="tous">Tous les formats</option>
            <option value="en_ligne">En ligne uniquement</option>
            <option value="presentiel">En présentiel</option>
          </select>

          {(filterType !== 'tous' || filterFormat !== 'tous') && (
            <button 
              onClick={() => { setFilterType('tous'); setFilterFormat('tous'); }}
              className="text-sm text-red-500 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Réinitialiser
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center text-gray-500">Chargement des événements...</div>
      ) : view === 'calendar' ? (
        <div className="mb-12">
          <CustomCalendar 
            events={filteredEvents}
            currentDate={currentDate}
            onCurrentDateChange={setCurrentDate}
            onEventClick={handleInscrireClick}
          />
        </div>
      ) : (
        <div className="space-y-12">
          {/* Upcoming Events */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
              Événements à venir
            </h2>
            
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-500">Aucun événement à venir ne correspond à vos critères.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onInscrireClick={handleInscrireClick} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Past Events Toggle */}
          {pastEvents.length > 0 && (
            <div className="border-t border-gray-100 pt-8">
              <button 
                onClick={() => setShowPast(!showPast)}
                className="text-lg font-bold text-gray-700 hover:text-gray-900 flex items-center gap-2 transition-colors"
              >
                <span className="w-2 h-6 bg-gray-300 rounded-full"></span>
                Événements passés {showPast ? '▼' : '▶'}
              </button>
              
              {showPast && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {pastEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onInscrireClick={handleInscrireClick} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <InscriptionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  )
}
