import { createClient } from '@supabase/supabase-js'
import { Calendar, Clock, Video, Lock, Unlock } from 'lucide-react'

export const revalidate = 3600 // Cache 1h

async function getWebinaires() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'
  try {
    const res = await fetch(`${API_URL}/api/webinaires`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  } catch (e) {
    console.error('Erreur fetch webinaires:', e)
    return []
  }
}

export default async function WebinairesPage() {
  const webinaires = await getWebinaires()
  
  const now = new Date()
  const aVenir = webinaires.filter((w: any) => new Date(w.date_prevue) > now)
  const replays = webinaires.filter((w: any) => new Date(w.date_prevue) <= now && w.youtube_id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Webinaires Agrolide</h1>
        <p className="text-gray-600 mt-2">Participez à nos sessions en direct ou revoyez les replays pour approfondir vos connaissances.</p>
      </div>

      {/* Webinaires à venir */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-green-700" />
        À venir
      </h2>
      
      {aVenir.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {aVenir.map((webinaire: any) => (
            <div key={webinaire.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                {webinaire.acces === 'public' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                    <Unlock className="w-3.5 h-3.5" /> Public
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                    <Lock className="w-3.5 h-3.5" /> Membres
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700">
                  <Video className="w-3.5 h-3.5" /> En direct
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{webinaire.titre}</h3>
              <p className="text-sm text-gray-500 mb-6 line-clamp-2">{webinaire.description}</p>
              
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {new Date(webinaire.date_prevue).toLocaleString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  Durée estimée : {webinaire.duree_minutes} minutes
                </div>
              </div>
              
              <button className="w-full mt-6 py-2.5 bg-green-700 text-white rounded-xl font-medium hover:bg-green-800 transition-colors">
                M'inscrire au webinaire
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center mb-16">
          <p className="text-gray-500">Aucun webinaire programmé pour le moment.</p>
        </div>
      )}

      {/* Replays */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Video className="w-6 h-6 text-green-700" />
        Replays récents
      </h2>
      
      {replays.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {replays.map((webinaire: any) => (
            <div key={webinaire.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              {/* Embed YouTube Responsive */}
              <div className="relative w-full aspect-video bg-gray-900">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${webinaire.youtube_id}`}
                  title={webinaire.titre}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{webinaire.titre}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-1">{webinaire.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Diffusé le {new Date(webinaire.date_prevue).toLocaleDateString('fr-FR')}
                  </span>
                  
                  {webinaire.lien_ressource && (
                    <a 
                      href={webinaire.lien_ressource}
                      target="_blank"
                      rel="noreferrer" 
                      className="text-sm font-medium text-green-700 hover:underline"
                    >
                      Voir les ressources
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <p className="text-gray-500">Aucun replay disponible pour le moment.</p>
        </div>
      )}
    </div>
  )
}
