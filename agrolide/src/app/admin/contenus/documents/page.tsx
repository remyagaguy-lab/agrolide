'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Check, X, Eye, FileText, Loader2, AlertCircle } from 'lucide-react'

type DocumentAdmin = {
  id: string
  titre: string
  auteur: string
  type: string
  statut: string
  created_at: string
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      // On trie manuellement : d'abord 'en_attente_validation', puis par date décroissante
      const { data, error } = await supabase
        .from('documents')
        .select('id, titre, auteur, type, statut, created_at')
        .order('created_at', { ascending: false })
        
      if (error) throw error
      
      // Tri prioritaire
      const sorted = [...(data || [])].sort((a, b) => {
        if (a.statut === 'en_attente_validation' && b.statut !== 'en_attente_validation') return -1
        if (a.statut !== 'en_attente_validation' && b.statut === 'en_attente_validation') return 1
        return 0
      })
      
      setDocuments(sorted)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: 'publie' | 'rejete') => {
    setProcessing(id)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      const { data: { session } } = await supabase.auth.getSession()
      
      const res = await fetch(`${API_URL}/api/bibliotheque/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ statut: newStatus })
      })
      
      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }
      
      // Update local state
      setDocuments(docs => docs.map(d => d.id === id ? { ...d, statut: newStatus } : d))
      
    } catch (err: any) {
      alert(err.message)
    } finally {
      setProcessing(null)
    }
  }

  const getStatusBadge = (statut: string) => {
    switch(statut) {
      case 'en_attente_validation': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">En attente</span>
      case 'publie': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Publié</span>
      case 'rejete': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejeté</span>
      default: return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{statut}</span>
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Modération des documents</h1>
        <p className="text-gray-600">Gérez les documents déposés par les membres dans la bibliothèque.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Aucun document trouvé.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className={doc.statut === 'en_attente_validation' ? 'bg-amber-50/30' : ''}>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">{doc.titre}</div>
                          <div className="text-sm text-gray-500">{doc.auteur}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{doc.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(doc.statut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <a 
                          href={`/membres/bibliotheque/${doc.id}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Voir la fiche"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        
                        {doc.statut === 'en_attente_validation' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(doc.id, 'publie')}
                              disabled={processing === doc.id}
                              className="p-2 text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                              title="Publier"
                            >
                              {processing === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(doc.id, 'rejete')}
                              disabled={processing === doc.id}
                              className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                              title="Rejeter"
                            >
                              {processing === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
