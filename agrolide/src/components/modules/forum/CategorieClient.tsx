'use client'

import React, { useState, useEffect } from 'react'

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
    try {
      const { getCategoryWithThreads } = await import('@/app/actions/forum')
      
      const from = (page - 1) * threadsPerPage
      const result = await getCategoryWithThreads(categorieId, threadsPerPage, from)
      
      if (result) {
        setCategorie(result.category)
        setTotalThreads(result.totalCount)
        setThreads(result.threads)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(totalThreads / threadsPerPage)

  return (
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-6">
      <Link href="/membres/forum" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Retour au forum
      </Link>
      
      {loading && !categorie ? (
        <div className="py-20 text-center text-gray-500">Chargement...</div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#1a1a1a] font-heading">{categorie?.nom}</h1>
              <p className="text-xs text-gray-500 mt-1">{totalThreads} sujets dans cette catégorie</p>
            </div>
            <Link 
              href={`/membres/forum/nouveau?cat=${categorieId}`} 
              className="bg-[#1b5e38] hover:bg-[#144a2c] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Nouveau sujet
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f8faf8] border-b border-[#e8e8e4]">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sujet</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Réponses</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Dernière activité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e8e4]">
                  {threads.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-12 text-center text-xs text-gray-500">
                        Aucun sujet dans cette catégorie.
                      </td>
                    </tr>
                  ) : (
                    threads.map((thread) => (
                      <tr key={thread.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-4 py-3">
                          <Link href={`/membres/forum/fil/${thread.id}`} className="block">
                            <h3 className="text-sm font-bold text-[#1a1a1a] mb-0.5 group-hover:text-[#1b5e38] transition-colors">{thread.titre}</h3>
                            <div className="text-[11px] text-gray-500">
                              Par <span className="font-bold text-gray-700">{thread.auteur?.prenom} {thread.auteur?.nom}</span> le {format(new Date(thread.created_at), "dd MMM yyyy", { locale: fr })}
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="inline-flex items-center justify-center min-w-[24px] h-6 bg-[#f0f7f0] text-[#1b5e38] rounded-full text-[10px] font-bold border border-[#c3dec4]">
                            {thread.nb_reponses}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
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
              <div className="px-4 py-3 bg-[#f8faf8] border-t border-[#e8e8e4] flex justify-between items-center">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-white border border-[#e8e8e4] rounded hover:border-[#1b5e38] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <span className="text-[11px] font-bold text-gray-500">
                  Page {page} / {totalPages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-white border border-[#e8e8e4] rounded hover:border-[#1b5e38] disabled:opacity-50 disabled:cursor-not-allowed"
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
