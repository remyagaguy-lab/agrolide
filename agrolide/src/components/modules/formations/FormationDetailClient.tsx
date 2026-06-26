'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Calendar, MapPin, Users, Clock, Check, AlertCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function FormationDetailClient({ initialFormation }: { initialFormation: any }) {
  const router = useRouter()
  const [formation, setFormation] = useState(initialFormation)
  const [sessions, setSessions] = useState(initialFormation.sessions_formation || [])
  const [inscriptions, setInscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState<string | null>(null) // session_id
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Fetch inscriptions on mount
  useEffect(() => {
    const fetchInscriptions = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data } = await supabase
          .from('inscriptions_formation')
          .select('session_id, statut')
          .eq('membre_id', session.user.id)
        if (data) setInscriptions(data)
      }
    }
    fetchInscriptions()
  }, [])

  // Setup Supabase Realtime for places_restantes
  useEffect(() => {
    const channel = supabase
      .channel('public:sessions_formation')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions_formation', filter: `formation_id=eq.${formation.id}` },
        (payload) => {
          setSessions((current: any[]) => 
            current.map(s => s.id === payload.new.id ? { ...s, places_restantes: payload.new.places_restantes } : s)
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [formation.id])

  const handleInscription = async (sessionId: string, isWaitlist: boolean) => {
    setLoading(sessionId)
    setMessage(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/connexion')
        return
      }

      if (isWaitlist) {
        // Logique simplifiée pour liste d'attente (juste un message pour l'instant)
        setMessage({ type: 'success', text: "Vous avez été ajouté à la liste d'attente." })
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'
      const res = await fetch(`${API_URL}/api/formations/sessions/${sessionId}/inscrire`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      
      const result = await res.json()
      
      if (!res.ok) {
        throw new Error(result.error || "Erreur lors de l'inscription")
      }
      
      setMessage({ type: 'success', text: result.message })
      
      // Update local inscriptions state
      setInscriptions([...inscriptions, { session_id: sessionId, statut: result.statut }])
      
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(null)
    }
  }

  const isGratuit = !formation.prix || formation.prix === 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Formation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
            {formation.thematique}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            {formation.modalite}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
            {formation.niveau}
          </span>
          {isGratuit ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
              Gratuit
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-orange-100 text-orange-800">
              {formation.prix} FCFA
            </span>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{formation.titre}</h1>
        
        <div className="prose prose-green max-w-none text-gray-600 mb-8">
          <p className="whitespace-pre-line">{formation.description}</p>
        </div>
        
        {/* Intervenants */}
        {formation.intervenants && formation.intervenants.length > 0 && (
          <div className="border-t border-gray-100 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Intervenant(s)</h3>
            <div className="flex flex-wrap gap-6">
              {formation.intervenants.map((intervenant: any) => (
                <div key={intervenant.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                    {intervenant.nom.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{intervenant.nom}</div>
                    <div className="text-sm text-gray-500">{intervenant.titre}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-8 flex items-start gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.type === 'success' ? <Check className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Sessions à venir */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sessions programmées</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {sessions.filter((s: any) => new Date(s.date_debut) >= new Date()).length > 0 ? (
          sessions.filter((s: any) => new Date(s.date_debut) >= new Date()).map((session: any) => {
            const isWaitlist = session.places_restantes <= 0
            const ins = inscriptions.find(i => i.session_id === session.id)
            const isInscrit = !!ins
            const isAttentePaiement = ins?.statut === 'en_attente_paiement'
            
            return (
              <div key={session.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
                <div className="space-y-4 mb-6 flex-1">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-green-600" />
                    <span className="font-medium">
                      {new Date(session.date_debut).toLocaleDateString('fr-FR')} au {new Date(session.date_fin).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{session.lieu}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3 text-gray-400" />
                    <span className={isWaitlist ? "text-red-600 font-medium" : "font-medium"}>
                      {session.places_restantes} place(s) restante(s) sur {session.places_totales}
                    </span>
                  </div>
                </div>
                
                <div className="mt-auto">
                  {isInscrit ? (
                    <div className="w-full text-center py-3 rounded-xl font-medium bg-gray-100 text-gray-600 flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> 
                      {isAttentePaiement ? 'En attente de paiement' : 'Inscrit ✓'}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleInscription(session.id, isWaitlist)}
                      disabled={loading === session.id}
                      className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                        isWaitlist 
                          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                          : 'bg-green-700 text-white hover:bg-green-800'
                      }`}
                    >
                      {loading === session.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        isWaitlist ? "S'inscrire sur liste d'attente" : "S'inscrire"
                      )}
                    </button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500">Aucune session n'est programmée pour le moment.</p>
          </div>
        )}
      </div>

      {/* Avis */}
      {formation.avis_formation && formation.avis_formation.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Avis des participants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formation.avis_formation.map((avis: any) => (
              <div key={avis.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    {avis.profiles?.avatar_url ? (
                      <img src={avis.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                        {avis.profiles?.prenom?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{avis.profiles?.prenom} {avis.profiles?.nom}</div>
                    <div className="flex text-yellow-400 text-sm">
                      {'★'.repeat(avis.note)}{'☆'.repeat(5 - avis.note)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{avis.commentaire}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
