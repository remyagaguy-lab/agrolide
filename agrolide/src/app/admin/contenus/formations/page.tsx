"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit2, Trash2, BookOpen, Clock, Users } from "lucide-react"
import FormationForm from "@/components/modules/admin/FormationForm"

export default function AdminFormationsPage() {
  const [formations, setFormations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingFormation, setEditingFormation] = useState<any | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchFormations = async () => {
    setLoading(true)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("formations")
      .select("*, sessions_formation(count)")
      .order("created_at", { ascending: false })
      
    if (!error && data) {
      setFormations(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchFormations()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) return
    
    const supabase = createClient()
    await supabase.from("formations").delete().eq("id", id)
    fetchFormations()
  }

  const handleEdit = (formation: any) => {
    setEditingFormation(formation)
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
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Formations</h1>
          <p className="text-gray-500">Créez et administrez le catalogue de formations.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" /> Nouvelle formation
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Chargement...</div>
        ) : formations.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Aucune formation trouvée.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Titre & Thématique</th>
                  <th className="px-6 py-4 font-semibold">Modalité / Niveau</th>
                  <th className="px-6 py-4 font-semibold">Prix</th>
                  <th className="px-6 py-4 font-semibold text-center">Sessions</th>
                  <th className="px-6 py-4 font-semibold">Statut</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {formations.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{f.titre}</div>
                      <div className="text-gray-500 text-xs mt-1 capitalize">{f.thematique}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{f.modalite}</div>
                      <div className="text-gray-500 text-xs mt-1">{f.niveau}</div>
                    </td>
                    <td className="px-6 py-4">
                      {f.prix && f.prix > 0 ? (
                        <span className="font-bold text-gray-900">{f.prix} FCFA</span>
                      ) : (
                        <span className="text-green-600 font-bold">Gratuit</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                        <Users className="w-4 h-4" />
                        {f.sessions_formation[0]?.count || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${f.statut === "publie" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {f.statut === "publie" ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(f)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Modifier">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(f.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
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
