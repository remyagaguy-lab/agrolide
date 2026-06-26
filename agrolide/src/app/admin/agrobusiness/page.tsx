import React from 'react'
import { createClient } from '@supabase/supabase-js'
import { FileText, Download, CheckCircle, XCircle, Clock } from 'lucide-react'

export const revalidate = 0

export default async function AdminAgrobusinessPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: demandes } = await supabase
    .from('demandes_service')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: candidatures } = await supabase
    .from('candidatures_incubation')
    .select('*')
    .order('created_at', { ascending: false })

  const renderStatus = (statut: string) => {
    switch (statut) {
      case 'nouveau': return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Nouveau</span>
      case 'en_cours':
      case 'en_evaluation': return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">En cours</span>
      case 'traite':
      case 'accepte': return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Accepté / Traité</span>
      case 'rejete':
      case 'refuse': return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Refusé</span>
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{statut}</span>
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion Agrobusiness</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Demandes de service */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              Demandes de Service
            </h2>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              {demandes?.length || 0}
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {demandes?.map((d: any) => (
              <div key={d.id} className="p-4 border border-gray-200 rounded-xl hover:border-primary-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{d.prenom} {d.nom}</h3>
                    <p className="text-sm text-gray-500">{d.organisation ? `${d.organisation} • ` : ''}{d.pays}</p>
                  </div>
                  {renderStatus(d.statut)}
                </div>
                <div className="text-sm text-gray-700 mb-3 bg-gray-50 p-3 rounded-lg">
                  <span className="font-semibold block mb-1">Service : {d.type_service}</span>
                  {d.description}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-400">{new Date(d.created_at).toLocaleDateString()}</div>
                  <div className="flex gap-2">
                    {d.fichier_url && (
                      <a href={d.fichier_url} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded">
                        <Download className="w-3 h-3" /> Fichier
                      </a>
                    )}
                    <button className="text-xs flex items-center gap-1 text-gray-600 hover:text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      Action
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {(!demandes || demandes.length === 0) && (
              <div className="text-center py-8 text-gray-500">Aucune demande de service.</div>
            )}
          </div>
        </div>

        {/* Candidatures Incubation */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Candidatures Incubation
            </h2>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              {candidatures?.length || 0}
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {candidatures?.map((c: any) => (
              <div key={c.id} className="p-4 border border-gray-200 rounded-xl hover:border-orange-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{c.titre_projet}</h3>
                    <p className="text-sm text-gray-500">Par {c.prenom} {c.nom} • {c.pays}</p>
                  </div>
                  {renderStatus(c.statut)}
                </div>
                <div className="text-sm text-gray-700 mb-3 bg-gray-50 p-3 rounded-lg">
                  <span className="font-semibold block mb-1">Secteur : {c.secteur} ({c.stade_avancement})</span>
                  {c.description_projet.substring(0, 150)}...
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</div>
                  <div className="flex gap-2">
                    {c.cv_url && (
                      <a href={c.cv_url} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded">
                        <Download className="w-3 h-3" /> CV
                      </a>
                    )}
                    <button className="text-xs flex items-center gap-1 text-gray-600 hover:text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      Action
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {(!candidatures || candidatures.length === 0) && (
              <div className="text-center py-8 text-gray-500">Aucune candidature pour le moment.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
