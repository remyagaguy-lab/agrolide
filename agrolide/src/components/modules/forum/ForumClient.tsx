'use client'

import React, { useState, useEffect } from 'react'

import Link from 'next/link'
import { MessageSquare, Clock, Plus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function ForumClient() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchForumData()
  }, [])

  const fetchForumData = async () => {
    setLoading(true)
    try {
      const { getForumCategoriesWithRecentThreads } = await import('@/app/actions/forum')
      const catsWithThreads = await getForumCategoriesWithRecentThreads()
      setCategories(catsWithThreads)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto px-2 md:px-4 py-4 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="dash-page-title">Forum Communautaire</h1>
          <p className="text-gray-500 mt-2 text-sm">Discutez, partagez et trouvez des réponses avec les autres membres.</p>
        </div>
        <Link 
          href="/membres/forum/nouveau" 
          className="btn-dash"
        >
          <Plus className="w-5 h-5" /> Nouveau sujet
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 card-glass p-8">Chargement du forum...</div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.id} className="card-glass overflow-hidden">
              <div className="bg-gradient-to-r from-[#1b5e38]/5 to-transparent px-6 py-4 border-b border-gray-100/50 flex justify-between items-center">
                <h2 className="dash-title">{cat.nom}</h2>
                <Link href={`/membres/forum/categorie/${cat.id}`} className="text-sm font-bold text-[#1b5e38] hover:text-[#50a853] transition-colors">
                  Voir tout
                </Link>
              </div>
              
              <div className="divide-y divide-gray-50/50">
                {cat.recent_threads.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-sm">
                    Aucun sujet dans cette catégorie. Soyez le premier !
                  </div>
                ) : (
                  cat.recent_threads.map((thread: any) => (
                    <Link 
                      key={thread.id} 
                      href={`/membres/forum/fil/${thread.id}`}
                      className="block p-6 hover:bg-[#e8f5e9]/20 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-gray-900 truncate mb-1">
                            {thread.titre}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-bold text-gray-700">
                              {thread.auteur?.prenom} {thread.auteur?.nom}
                            </span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(thread.last_activity_at), { addSuffix: true, locale: fr })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#1b5e38] bg-[#e8f5e9]/50 px-3 py-1 rounded-full text-xs font-bold shrink-0">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {thread.nb_reponses}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
