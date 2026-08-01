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
        <div className="py-16 text-center text-gray-400 bg-white border border-[#e8e8e4] rounded-2xl shadow-sm p-8">Chargement du forum...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white border border-[#e8e8e4] rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-[#f8faf8] px-5 py-3 border-b border-[#e8e8e4] flex justify-between items-center">
                <h2 className="text-sm font-bold text-[#1a1a1a]">{cat.nom}</h2>
                <Link href={`/membres/forum/categorie/${cat.id}`} className="text-[10px] font-bold text-[#1b5e38] bg-[#f0f7f0] px-2 py-1 rounded hover:bg-[#e3f0e3] transition-colors border border-transparent hover:border-[#c3dec4]">
                  Voir
                </Link>
              </div>
              
              <div className="divide-y divide-gray-50">
                {cat.recent_threads.length === 0 ? (
                  <div className="p-5 text-center text-gray-400 text-xs">
                    Aucun sujet. Soyez le premier !
                  </div>
                ) : (
                  cat.recent_threads.map((thread: any) => (
                    <Link 
                      key={thread.id} 
                      href={`/membres/forum/fil/${thread.id}`}
                      className="block p-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-800 truncate mb-1 group-hover:text-[#1b5e38] transition-colors">
                            {thread.titre}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                            <span className="font-semibold text-gray-600">
                              {thread.auteur?.prenom}
                            </span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(thread.last_activity_at), { addSuffix: true, locale: fr })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[#1b5e38] bg-[#f0f7f0] px-2 py-0.5 rounded text-[10px] font-bold shrink-0 border border-[#e8e8e4]">
                          <MessageSquare className="w-3 h-3" />
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
