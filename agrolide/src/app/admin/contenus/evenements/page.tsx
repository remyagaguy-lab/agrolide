'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Plus, Edit2, Trash2, Calendar, Globe, MapPin, Users } from 'lucide-react'
import EventForm from '@/components/modules/admin/EventForm'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function AdminEvenementsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEvent, setEditingEvent] = useState<any | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchEvents = async () => {
    setLoading(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const { data, error } = await supabase
      .from('evenements')
      .select('*, inscriptions:inscriptions_evenement(count)')
      .order('date_debut', { ascending: false })
      
    if (!error && data) {
      setEvents(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ? Les inscriptions liées seront perdues.")) return
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    await supabase.from('inscriptions_evenement').delete().eq('evenement_id', id)
    await supabase.from('evenements').delete().eq('id', id)
    
    fetchEvents()
  }

  const handleEdit = (evt: any) => {
    setEditingEvent(evt)
    setIsFormOpen(true)
  }

  const handleCreateNew = () => {
    setEditingEvent(null)
    setIsFormOpen(true)
  }

  const onFormSuccess = () => {
    setIsFormOpen(false)
    fetchEvents()
  }

  if (isFormOpen) {
    return (
      <div>
        <EventForm 
          initialData={editingEvent} 
          onSuccess={onFormSuccess} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Événements</h1>
          <p className="text-gray-500">Créez et administrez les événements de la communauté</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" /> Nouvel événement
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Chargement...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Aucun événement trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Titre & Type</th>
                  <th className="px-6 py-4 font-semibold">Dates</th>
                  <th className="px-6 py-4 font-semibold">Lieu / Format</th>
                  <th className="px-6 py-4 font-semibold text-center">Inscrits</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{evt.titre}</div>
                      <div className="text-gray-500 text-xs mt-1 capitalize">{evt.type_evt.replace('_', ' ')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {format(new Date(evt.date_debut), "dd MMM yyyy à HH:mm", { locale: fr })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {evt.en_ligne ? (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Globe className="w-4 h-4" /> En ligne
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="truncate max-w-[150px]">{evt.lieu || 'Non spécifié'}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                        <Users className="w-4 h-4" />
                        {evt.inscriptions[0]?.count || 0}
                        {evt.places_max && <span className="text-gray-400 font-normal">/ {evt.places_max}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${evt.publie ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {evt.publie ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(evt)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(evt.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
