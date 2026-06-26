import React from 'react'
import { createClient } from '@supabase/supabase-js'
import { Plus, Edit, Trash2, Globe } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0

export default async function AdminAgripreneursPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: agripreneurs } = await supabase
    .from('agripreneurs')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vitrine Agripreneurs</h1>
          <p className="text-gray-600">Gérez les profils affichés dans la section success stories.</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-700 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Ajouter un profil
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
              <th className="p-4 font-semibold">Agripreneur</th>
              <th className="p-4 font-semibold">Projet / Secteur</th>
              <th className="p-4 font-semibold">Pays</th>
              <th className="p-4 font-semibold">Statut</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {agripreneurs?.map((a: any) => (
              <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                      {a.prenom.charAt(0)}{a.nom.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{a.prenom} {a.nom}</div>
                      {a.website_url && (
                        <a href={a.website_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 flex items-center gap-1">
                          <Globe className="w-3 h-3" /> Site web
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-gray-900">{a.titre_projet}</div>
                  <div className="text-sm text-gray-500">{a.secteur}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">{a.pays}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {a.statut}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!agripreneurs || agripreneurs.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Aucun agripreneur pour le moment. Cliquez sur "Ajouter un profil" pour commencer.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
