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
      <Link href="/membres/forum" className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-muted hover:text-on-surface transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Retour au forum
      </Link>
      
      {loading && !categorie ? (
        <div className="py-20 text-center text-on-surface-muted">Chargement...</div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-on-surface font-heading">{categorie?.nom}</h1>
              <p className="text-xs text-on-surface-muted mt-1">{totalThreads} sujets dans cette catégorie</p>
            </div>
            <Link 
              href={`/membres/forum/nouveau?cat=${categorieId}`} 
              className="bg-primary hover:bg-primary/90 text-on-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Nouveau sujet
            </Link>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="px-4 py-3 text-[10px] font-bold text-on-surface-muted uppercase tracking-wider">Sujet</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-on-surface-muted uppercase tracking-wider text-center">Réponses</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-on-surface-muted uppercase tracking-wider">Dernière activité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {threads.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-12 text-center text-xs text-on-surface-muted">
                        Aucun sujet dans cette catégorie.
                      </td>
                    </tr>
                  ) : (
                    threads.map((thread) => (
                      <tr key={thread.id} className="hover:bg-surface-container-low transition-colors group">
                        <td className="px-4 py-3">
                          <Link href={`/membres/forum/fil/${thread.id}`} className="block">
                            <h3 className="text-sm font-bold text-on-surface mb-0.5 group-hover:text-primary transition-colors">{thread.titre}</h3>
                            <div className="text-[11px] text-on-surface-muted">
                              Par <span className="font-bold text-on-surface-variant">{thread.auteur?.prenom} {thread.auteur?.nom}</span> le {format(new Date(thread.created_at), "dd MMM yyyy", { locale: fr })}
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="inline-flex items-center justify-center min-w-[24px] h-6 bg-primary-container text-primary rounded-full text-[10px] font-bold border border-outline-variant">
                            {thread.nb_reponses}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-on-surface-muted">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-on-surface-muted" />
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
              <div className="px-4 py-3 bg-surface-container-low border-t border-outline-variant flex justify-between items-center">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-bold text-on-surface-variant bg-surface-container-lowest border border-outline-variant rounded hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <span className="text-[11px] font-bold text-on-surface-muted">
                  Page {page} / {totalPages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs font-bold text-on-surface-variant bg-surface-container-lowest border border-outline-variant rounded hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
