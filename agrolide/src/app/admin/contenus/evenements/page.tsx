'use client'

import React, { useState, useEffect } from 'react'

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
    try {
      const { getAdminEvenements } = await import('@/app/actions/admin-evenements')
      const data = await getAdminEvenements()
      if (data) setEvents(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ? Les inscriptions liées seront perdues.")) return
    
    try {
      const { deleteAdminEvenement } = await import('@/app/actions/admin-evenements')
      await deleteAdminEvenement(id)
      fetchEvents()
    } catch (err: any) {
      alert("Erreur: " + err.message)
    }
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
      <div className="flex justify-between items-center bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Gestion des Événements</h1>
          <p className="text-on-surface-muted">Créez et administrez les événements de la communauté</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" /> Nouvel événement
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-on-surface-muted">Chargement...</div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-on-surface-muted">Aucun événement trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-4 font-semibold">Titre & Type</th>
                  <th className="px-6 py-4 font-semibold">Dates</th>
                  <th className="px-6 py-4 font-semibold">Lieu / Format</th>
                  <th className="px-6 py-4 font-semibold text-center">Inscrits</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-on-surface">{evt.titre}</div>
                      <div className="text-on-surface-muted text-xs mt-1 capitalize">{evt.type_evt.replace('_', ' ')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <Calendar className="w-4 h-4 text-on-surface-muted" />
                        {format(new Date(evt.date_debut), "dd MMM yyyy à HH:mm", { locale: fr })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {evt.en_ligne ? (
                        <div className="flex items-center gap-2 text-info">
                          <Globe className="w-4 h-4" /> En ligne
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-on-surface-variant">
                          <MapPin className="w-4 h-4 text-on-surface-muted" />
                          <span className="truncate max-w-[150px]">{evt.lieu || 'Non spécifié'}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-medium">
                        <Users className="w-4 h-4" />
                        {evt.inscriptions[0]?.count || 0}
                        {evt.places_max && <span className="text-on-surface-muted font-normal">/ {evt.places_max}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${evt.publie ? 'bg-success-container text-success' : 'bg-surface-container text-on-surface-variant'}`}>
                        {evt.publie ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(evt)} className="p-2 text-on-surface-muted hover:text-info hover:bg-info-container rounded-lg transition-colors" title="Modifier">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(evt.id)} className="p-2 text-on-surface-muted hover:text-error hover:bg-error-container rounded-lg transition-colors" title="Supprimer">
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
