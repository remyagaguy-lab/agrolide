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
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#1a1a1a] font-heading mb-1">Webinaires Agrolide</h1>
        <p className="text-xs text-gray-500">Participez à nos sessions en direct ou revoyez les replays pour approfondir vos connaissances.</p>
      </div>

      {/* Webinaires à venir */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#f0f7f0] border border-[#c3dec4] flex items-center justify-center">
            <Calendar size={14} className="text-[#1b5e38]" />
          </div>
          <h2 className="text-lg font-bold text-[#1a1a1a] font-heading">À venir</h2>
        </div>
        
        {aVenir.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {aVenir.map((webinaire: any) => (
              <div key={webinaire.id} className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-5 flex flex-col hover:border-[#1b5e38]/30 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  {webinaire.acces === 'public' ? (
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#e8e8e4]">
                      <Unlock size={10} /> Public
                    </span>
                  ) : (
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border border-blue-200">
                      <Lock size={10} /> Membres
                    </span>
                  )}
                  <span className="bg-[#f0f7f0] text-[#1b5e38] px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#c3dec4]">
                    <Video size={10} /> En direct
                  </span>
                </div>
                
                <h3 className="text-sm font-bold text-[#1a1a1a] mb-1.5">{webinaire.titre}</h3>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-grow leading-relaxed">{webinaire.description}</p>
                
                <div className="space-y-2 pt-3 border-t border-[#e8e8e4]">
                  <div className="flex items-center text-[11px] font-medium text-gray-600">
                    <Calendar size={12} className="mr-1.5 text-gray-400" />
                    {new Date(webinaire.date_prevue).toLocaleString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="flex items-center text-[11px] font-medium text-gray-600">
                    <Clock size={12} className="mr-1.5 text-gray-400" />
                    Durée estimée : {webinaire.duree_minutes} minutes
                  </div>
                </div>
                
                <button className="w-full mt-4 py-2 bg-[#1b5e38] text-white rounded-lg text-xs font-bold hover:bg-[#144a2c] transition-colors shadow-sm">
                  M'inscrire au webinaire
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-8 text-center mb-8 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-[#e8e8e4] mb-3">
              <Calendar size={16} className="text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Aucun webinaire programmé pour le moment.</p>
          </div>
        )}
      </div>

      {/* Replays */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gray-50 border border-[#e8e8e4] flex items-center justify-center">
            <Video size={14} className="text-gray-500" />
          </div>
          <h2 className="text-lg font-bold text-[#1a1a1a] font-heading">Replays récents</h2>
        </div>
        
        {replays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {replays.map((webinaire: any) => (
              <div key={webinaire.id} className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] overflow-hidden flex flex-col opacity-95 hover:opacity-100 transition-opacity">
                {/* Embed YouTube Responsive */}
                <div className="relative w-full aspect-video bg-gray-900 border-b border-[#e8e8e4]">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${webinaire.youtube_id}`}
                    title={webinaire.titre}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-sm font-bold text-[#1a1a1a] mb-1.5">{webinaire.titre}</h3>
                  <p className="text-xs text-gray-500 mb-3 flex-1 line-clamp-2 leading-relaxed">{webinaire.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#e8e8e4]">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Diffusé le {new Date(webinaire.date_prevue).toLocaleDateString('fr-FR')}
                    </span>
                    
                    {webinaire.lien_ressource && (
                      <a 
                        href={webinaire.lien_ressource}
                        target="_blank"
                        rel="noreferrer" 
                        className="text-[10px] font-bold text-[#1b5e38] uppercase tracking-wider hover:underline"
                      >
                        Voir ressources
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8e4] p-8 text-center flex flex-col items-center">
             <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-[#e8e8e4] mb-3">
              <Video size={16} className="text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Aucun replay disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
