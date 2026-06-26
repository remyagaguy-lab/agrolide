'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { MessageSquare, Clock, ArrowLeft, Plus } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CategorieClientProps {
  categorieId: string
}

export default function CategorieClient({ categorieId }: CategorieClientProps) {
  const [categorie, setCategorie] = useState<any>(null)
  const [threads, setThreads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Pagination
  const [page, setPage] = useState(1)
  const threadsPerPage = 20
  const [totalThreads, setTotalThreads] = useState(0)

  useEffect(() => {
    fetchData()
  }, [categorieId, page])

  const fetchData = async () => {
    setLoading(true)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Récupérer les infos de la catégorie
    const { data: cat } = await supabase
      .from('forum_categories')
      .select('*')
      .eq('id', categorieId)
      .single()
      
    if (cat) setCategorie(cat)

    // Compter le total
    const { count } = await supabase
      .from('forum_fils')
      .select('*', { count: 'exact', head: true })
      .eq('categorie_id', categorieId)
      
    if (count !== null) setTotalThreads(count)

    // Récupérer les fils de la page
    const from = (page - 1) * threadsPerPage
    const to = from + threadsPerPage - 1
    
    const { data: tData } = await supabase
      .from('forum_fils')
      .select('*, auteur:profiles(prenom, nom, avatar_url)')
      .eq('categorie_id', categorieId)
      .order('last_activity_at', { ascending: false })
      .range(from, to)
      
    if (tData) setThreads(tData)
    
    setLoading(false)
  }

  const totalPages = Math.ceil(totalThreads / threadsPerPage)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <Link href="/membres/forum" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour au forum
      </Link>
      
      {loading && !categorie ? (
        <div className="py-20 text-center text-gray-500">Chargement...</div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{categorie?.nom}</h1>
              <p className="text-gray-600 mt-2">{totalThreads} sujets dans cette catégorie</p>
            </div>
            <Link 
              href={`/membres/forum/nouveau?cat=${categorieId}`} 
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors font-medium shadow-sm"
            >
              <Plus className="w-5 h-5" /> Nouveau sujet
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Sujet</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Réponses</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Dernière activité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {threads.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                        Aucun sujet dans cette catégorie.
                      </td>
                    </tr>
                  ) : (
                    threads.map((thread) => (
                      <tr key={thread.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <Link href={`/membres/forum/fil/${thread.id}`} className="block">
                            <h3 className="text-base font-semibold text-gray-900 mb-1">{thread.titre}</h3>
                            <div className="text-sm text-gray-500">
                              Par <span className="font-medium text-gray-700">{thread.auteur?.prenom} {thread.auteur?.nom}</span> le {format(new Date(thread.created_at), "dd MMM yyyy", { locale: fr })}
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center justify-center min-w-[2rem] h-8 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                            {thread.nb_reponses}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {formatDistanceToNow(new Date(thread.last_activity_at), { addSuffix: true, locale: fr })}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} sur {totalPages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
