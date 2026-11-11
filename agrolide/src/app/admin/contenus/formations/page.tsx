"use client"

import React, { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, BookOpen, Clock, Users } from "lucide-react"
import FormationForm from "@/components/modules/admin/FormationForm"
import { getAdminFormations, deleteFormation } from "@/app/actions/admin-formations"

export default function AdminFormationsPage() {
  const [formations, setFormations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingFormation, setEditingFormation] = useState<any | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchFormations = async () => {
    setLoading(true)
    try {
      const data = await getAdminFormations()
      setFormations(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchFormations()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) return
    
    try {
      await deleteFormation(id)
      fetchFormations()
    } catch (e) {
      console.error(e)
    }
  }

  const handleEdit = (formation: any) => {
    // Map prix_fcfa to prix for the form
    setEditingFormation({ ...formation, prix: formation.prix_fcfa })
    setIsFormOpen(true)
  }

  const handleCreateNew = () => {
    setEditingFormation(null)
    setIsFormOpen(true)
  }

  const onFormSuccess = () => {
    setIsFormOpen(false)
    fetchFormations()
  }

  if (isFormOpen) {
    return (
      <FormationForm 
        initialData={editingFormation} 
        onSuccess={onFormSuccess} 
        onCancel={() => setIsFormOpen(false)} 
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Gestion des Formations</h1>
          <p className="text-on-surface-muted">Créez et administrez le catalogue de formations.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-success hover:bg-success text-on-success px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" /> Nouvelle formation
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-on-surface-muted">Chargement...</div>
        ) : formations.length === 0 ? (
          <div className="p-12 text-center text-on-surface-muted">Aucune formation trouvée.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low text-on-surface-variant border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-4 font-semibold">Titre & Thématique</th>
                  <th className="px-6 py-4 font-semibold">Modalité / Niveau</th>
                  <th className="px-6 py-4 font-semibold">Prix</th>
                  <th className="px-6 py-4 font-semibold text-center">Sessions</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {formations.map((f) => (
                  <tr key={f.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-on-surface">{f.titre}</div>
                      <div className="text-on-surface-muted text-xs mt-1 capitalize">{f.thematique}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-on-surface">{f.modalite}</div>
                      <div className="text-on-surface-muted text-xs mt-1">{f.niveau}</div>
                    </td>
                    <td className="px-6 py-4">
                      {f.prix && f.prix > 0 ? (
                        <span className="font-bold text-on-surface">{f.prix} FCFA</span>
                      ) : (
                        <span className="text-success font-bold">Gratuit</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-medium">
                        <Users className="w-4 h-4" />
                        {f.sessions_formation[0]?.count || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${f.statut === "publie" ? "bg-success-container text-success" : "bg-surface-container text-on-surface-variant"}`}>
                        {f.statut === "publie" ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(f)} className="p-2 text-on-surface-muted hover:text-success hover:bg-success-container rounded-lg transition-colors" title="Modifier">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(f.id)} className="p-2 text-on-surface-muted hover:text-error hover:bg-error-container rounded-lg transition-colors" title="Supprimer">
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
