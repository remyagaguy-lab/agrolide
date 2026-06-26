import React from 'react'
import { createClient } from '@supabase/supabase-js'
import { Plus, Edit, Trash2, Mail, CheckCircle, XCircle } from 'lucide-react'

export const revalidate = 0

export default async function AdminPartenairesPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)

  // 1. Fetch Partenaires affichés sur le site
  const { data: partenaires } = await supabase
    .from('partenaires')
    .select('*')
    .order('created_at', { ascending: false })

  // 2. Fetch Demandes de contact partenariat
  const { data: contacts } = await supabase
    .from('contacts_partenariat')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">
      
      {/* Section 1 : Demandes de Partenariat */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary-600" />
            Demandes Entrantes
          </h2>
          <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-bold">
            {contacts?.filter(c => c.statut === 'nouveau').length || 0} nouvelles
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                  <th className="p-4 font-semibold">Organisation</th>
                  <th className="p-4 font-semibold">Contact</th>
                  <th className="p-4 font-semibold">Collaboration / Budget</th>
                  <th className="p-4 font-semibold">Statut</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contacts?.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{c.raison_sociale}</div>
                      <div className="text-sm text-gray-500">{c.secteur}</div>
                    </td>
                    <td className="p-4">
                      <a href={`mailto:${c.email}`} className="text-blue-600 hover:underline">{c.email}</a>
                      <div className="text-xs text-gray-400 mt-1">{new Date(c.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-gray-900">{c.nature_collaboration}</div>
                      <div className="text-xs text-gray-500">{c.budget || 'Non spécifié'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        c.statut === 'nouveau' ? 'bg-blue-100 text-blue-800' :
                        c.statut === 'contacte' ? 'bg-orange-100 text-orange-800' :
                        c.statut === 'conclu' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {c.statut}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="text-xs text-gray-600 hover:text-gray-900 bg-gray-100 px-2 py-1 rounded transition-colors">
                          Détails
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!contacts || contacts.length === 0) && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Aucune demande reçue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 2 : Partenaires Affichés */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Vitrine Partenaires</h2>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-700 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Ajouter un partenaire
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="p-4 font-semibold">Nom</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Niveau</th>
                <th className="p-4 font-semibold">Statut</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {partenaires?.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{p.nom}</td>
                  <td className="p-4 text-gray-600">{p.type}</td>
                  <td className="p-4 text-gray-600">{p.niveau}</td>
                  <td className="p-4">
                    {p.statut === 'actif' ? (
                      <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs w-fit">
                        <CheckCircle className="w-3 h-3" /> Actif
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-700 bg-gray-100 px-2 py-1 rounded-full text-xs w-fit">
                        <XCircle className="w-3 h-3" /> Inactif
                      </span>
                    )}
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
              {(!partenaires || partenaires.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Aucun partenaire enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}
