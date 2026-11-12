'use client'

import React, { useState, useEffect } from 'react'

import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
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
          <h1 className="text-headline-lg font-extrabold tracking-tight text-on-surface">Forum Communautaire</h1>
          <p className="text-on-surface-muted mt-2 text-sm">Discutez, partagez et trouvez des réponses avec les autres membres.</p>
        </div>
        <Link 
          href="/membres/forum/nouveau" 
          className={buttonVariants({ variant: 'secondary' })}
        >
          <Plus className="w-5 h-5" /> Nouveau sujet
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center text-on-surface-muted bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-8">Chargement du forum...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-surface-container-low px-5 py-3 border-b border-outline-variant flex justify-between items-center">
                <h2 className="text-sm font-bold text-on-surface">{cat.nom}</h2>
                <Link href={`/membres/forum/categorie/${cat.id}`} className="text-label-sm font-bold text-primary bg-primary-container px-2 py-1 rounded hover:bg-primary-container transition-colors border border-transparent hover:border-outline-variant">
                  Voir
                </Link>
              </div>
              
              <div className="divide-y divide-outline-variant">
                {cat.recent_threads.length === 0 ? (
                  <div className="p-5 text-center text-on-surface-muted text-xs">
                    Aucun sujet. Soyez le premier !
                  </div>
                ) : (
                  cat.recent_threads.map((thread: any) => (
                    <Link 
                      key={thread.id} 
                      href={`/membres/forum/fil/${thread.id}`}
                      className="block p-4 hover:bg-surface-container-low transition-colors group"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-on-surface truncate mb-1 group-hover:text-primary transition-colors">
                            {thread.titre}
                          </h3>
                          <div className="flex items-center gap-1.5 text-label-sm text-on-surface-muted">
                            <span className="font-semibold text-on-surface-variant">
                              {thread.auteur?.prenom}
                            </span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(thread.last_activity_at), { addSuffix: true, locale: fr })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-primary bg-primary-container px-2 py-0.5 rounded text-label-sm font-bold shrink-0 border border-outline-variant">
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
