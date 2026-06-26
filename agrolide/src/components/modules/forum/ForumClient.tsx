'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Récupérer les catégories
    const { data: cats, error: catsError } = await supabase
      .from('forum_categories')
      .select('*')
      .order('ordre', { ascending: true })
      
    if (!catsError && cats) {
      // Pour chaque catégorie, on récupère les 3 derniers fils
      const catsWithThreads = await Promise.all(cats.map(async (cat) => {
        const { data: threads } = await supabase
          .from('forum_fils')
          .select('*, auteur:profiles(prenom, nom, avatar_url)')
          .eq('categorie_id', cat.id)
          .order('last_activity_at', { ascending: false })
          .limit(3)
          
        return { ...cat, recent_threads: threads || [] }
      }))
      setCategories(catsWithThreads)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forum Communautaire</h1>
          <p className="text-gray-600 mt-2">Discutez, partagez et trouvez des réponses avec les autres membres.</p>
        </div>
        <Link 
          href="/membres/forum/nouveau" 
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" /> Nouveau sujet
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-500">Chargement du forum...</div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">{cat.nom}</h2>
                <Link href={`/membres/forum/categorie/${cat.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  Voir tout
                </Link>
              </div>
              
              <div className="divide-y divide-gray-50">
                {cat.recent_threads.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    Aucun sujet dans cette catégorie. Soyez le premier !
                  </div>
                ) : (
                  cat.recent_threads.map((thread: any) => (
                    <Link 
                      key={thread.id} 
                      href={`/membres/forum/fil/${thread.id}`}
                      className="block p-6 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 truncate mb-1">
                            {thread.titre}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-medium text-gray-700">
                              {thread.auteur?.prenom} {thread.auteur?.nom}
                            </span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(thread.last_activity_at), { addSuffix: true, locale: fr })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium shrink-0">
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
