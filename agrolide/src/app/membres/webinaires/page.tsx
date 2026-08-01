import { Calendar, Clock, Video, Lock, Unlock } from 'lucide-react'
export const metadata = { title: "Webinaires" }

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
    <div className="max-w-[1600px] mx-auto px-2 md:px-4 py-4 space-y-8">
      <div>
        <h1 className="dash-page-title">Webinaires Agrolide</h1>
        <p className="mt-2 text-gray-500 text-sm">Participez à nos sessions en direct ou revoyez les replays pour approfondir vos connaissances.</p>
      </div>

      {/* Webinaires à venir */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="icon-circle bg-[#e8f5e9]">
            <Calendar className="w-5 h-5 text-[#1b5e38]" />
          </div>
          <h2 className="dash-title">À venir</h2>
        </div>
        
        {aVenir.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {aVenir.map((webinaire: any) => (
              <div key={webinaire.id} className="card-glass-hover p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  {webinaire.acces === 'public' ? (
                    <span className="badge-glass bg-gray-100 text-gray-700">
                      <Unlock className="w-3.5 h-3.5" /> Public
                    </span>
                  ) : (
                    <span className="badge-glass bg-blue-50 text-blue-700 border-blue-100">
                      <Lock className="w-3.5 h-3.5" /> Membres
                    </span>
                  )}
                  <span className="badge-glass bg-[#e8f5e9] text-[#1b5e38] border-[#50a853]/20">
                    <Video className="w-3.5 h-3.5" /> En direct
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{webinaire.titre}</h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-grow">{webinaire.description}</p>
                
                <div className="space-y-3 pt-4 border-t border-gray-100/50">
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
                
                <button className="w-full mt-6 py-2.5 bg-[#1b5e38] text-white rounded-xl font-bold hover:bg-[#145030] transition-colors shadow-md">
                  M'inscrire au webinaire
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-glass p-8 text-center mb-16 flex flex-col items-center">
            <div className="icon-circle-lg bg-gray-50 mb-4">
              <Calendar className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">Aucun webinaire programmé pour le moment.</p>
          </div>
        )}
      </div>

      {/* Replays */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="icon-circle bg-gray-100">
            <Video className="w-5 h-5 text-gray-500" />
          </div>
          <h2 className="dash-title">Replays récents</h2>
        </div>
        
        {replays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {replays.map((webinaire: any) => (
              <div key={webinaire.id} className="card-glass overflow-hidden flex flex-col opacity-90 hover:opacity-100 transition-opacity">
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
                  <h3 className="text-base font-bold text-gray-900 mb-2">{webinaire.titre}</h3>
                  <p className="text-xs text-gray-500 mb-4 flex-1 line-clamp-2">{webinaire.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100/50">
                    <span className="text-xs text-gray-400 font-medium">
                      Diffusé le {new Date(webinaire.date_prevue).toLocaleDateString('fr-FR')}
                    </span>
                    
                    {webinaire.lien_ressource && (
                      <a 
                        href={webinaire.lien_ressource}
                        target="_blank"
                        rel="noreferrer" 
                        className="text-xs font-bold text-[#1b5e38] hover:underline"
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
          <div className="card-glass p-8 text-center flex flex-col items-center">
             <div className="icon-circle-lg bg-gray-50 mb-4">
              <Video className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">Aucun replay disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
