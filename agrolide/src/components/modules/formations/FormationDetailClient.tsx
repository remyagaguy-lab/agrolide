'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, Clock, Check, AlertCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getInscriptionsFormation, inscrireSessionFormation } from '@/app/actions/formations'

export function FormationDetailClient({ initialFormation }: { initialFormation: any }) {
  const router = useRouter()
  const [formation, setFormation] = useState(initialFormation)
  const [sessions, setSessions] = useState(initialFormation.sessions_formation || [])
  const [inscriptions, setInscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState<string | null>(null) // session_id
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Fetch inscriptions on mount
  useEffect(() => {
    const fetchInscriptions = async () => {
      const data = await getInscriptionsFormation()
      if (data) setInscriptions(data)
    }
    fetchInscriptions()
  }, [])

  const handleInscription = async (sessionId: string, isWaitlist: boolean) => {
    setLoading(sessionId)
    setMessage(null)
    try {
      if (isWaitlist) {
        // Logique simplifiée pour liste d'attente (juste un message pour l'instant)
        setMessage({ type: 'success', text: "Vous avez été ajouté à la liste d'attente." })
        return
      }

      const result = await inscrireSessionFormation(sessionId)
      
      setMessage({ type: 'success', text: result.message })
      
      // Update local inscriptions state
      setInscriptions([...inscriptions, { session_id: sessionId, statut: result.statut }])
      
    } catch (err: any) {
      if (err.message === "Vous devez être connecté pour vous inscrire.") {
        router.push('/login')
        return
      }
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(null)
    }
  }

  const isGratuit = !formation.prix || formation.prix === 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Formation */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-8 mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-container text-success">
            {formation.thematique}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-surface-container text-on-surface-variant">
            {formation.modalite}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-info-container text-info">
            {formation.niveau}
          </span>
          {isGratuit ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-success-container text-on-success-container">
              Gratuit
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-warning-container text-on-warning-container">
              {formation.prix} FCFA
            </span>
          )}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-on-surface mb-6">{formation.titre}</h1>
        
        <div className="prose prose-green max-w-none text-on-surface-variant mb-8">
          <p className="whitespace-pre-line">{formation.description}</p>
        </div>
        
        {/* Intervenants */}
        {formation.intervenants && formation.intervenants.length > 0 && (
          <div className="border-t border-outline-variant pt-8">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Intervenant(s)</h3>
            <div className="flex flex-wrap gap-6">
              {formation.intervenants.map((intervenant: any) => (
                <div key={intervenant.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-success-container flex items-center justify-center text-success font-bold text-lg">
                    {intervenant.nom.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-on-surface">{intervenant.nom}</div>
                    <div className="text-sm text-on-surface-muted">{intervenant.titre}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-8 flex items-start gap-3 ${message.type === 'success' ? 'bg-success-container text-on-success-container' : 'bg-error-container text-on-error-container'}`}>
          {message.type === 'success' ? <Check className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Sessions à venir */}
      <h2 className="text-2xl font-bold text-on-surface mb-6">Sessions programmées</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {sessions.filter((s: any) => new Date(s.date_debut) >= new Date()).length > 0 ? (
          sessions.filter((s: any) => new Date(s.date_debut) >= new Date()).map((session: any) => {
            const isWaitlist = session.places_restantes <= 0
            const ins = inscriptions.find(i => i.session_id === session.id)
            const isInscrit = !!ins
            const isAttentePaiement = ins?.statut === 'en_attente_paiement'
            
            return (
              <div key={session.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm p-6 flex flex-col">
                <div className="space-y-4 mb-6 flex-1">
                  <div className="flex items-center text-on-surface-variant">
                    <Calendar className="w-5 h-5 mr-3 text-success" />
                    <span className="font-medium">
                      {new Date(session.date_debut).toLocaleDateString('fr-FR')} au {new Date(session.date_fin).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center text-on-surface-variant">
                    <MapPin className="w-5 h-5 mr-3 text-on-surface-muted" />
                    <span>{session.lieu}</span>
                  </div>
                  <div className="flex items-center text-on-surface-variant">
                    <Users className="w-5 h-5 mr-3 text-on-surface-muted" />
                    <span className={isWaitlist ? "text-error font-medium" : "font-medium"}>
                      {session.places_restantes} place(s) restante(s) sur {session.places_totales}
                    </span>
                  </div>
                </div>
                
                <div className="mt-auto">
                  {isInscrit ? (
                    <div className="w-full text-center py-3 rounded-xl font-medium bg-surface-container text-on-surface-variant flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> 
                      {isAttentePaiement ? 'En attente de paiement' : 'Inscrit ✓'}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleInscription(session.id, isWaitlist)}
                      disabled={loading === session.id}
                      className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                        isWaitlist 
                          ? 'bg-warning-container text-on-warning-container hover:bg-warning-container' 
                          : 'bg-success text-on-primary hover:bg-primary/90'
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
          <div className="col-span-full p-8 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant">
            <p className="text-on-surface-muted">Aucune session n'est programmée pour le moment.</p>
          </div>
        )}
      </div>

      {/* Avis */}
      {formation.avis_formation && formation.avis_formation.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-on-surface mb-6">Avis des participants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formation.avis_formation.map((avis: any) => (
              <div key={avis.id} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden relative">
                    {avis.profiles?.avatar_url ? (
                      <Image src={avis.profiles.avatar_url} alt={`Avatar de ${avis.profiles.first_name || 'utilisateur'}`} fill sizes="40px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-muted font-bold">
                        {avis.profiles?.prenom?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-on-surface">{avis.profiles?.prenom} {avis.profiles?.nom}</div>
                    <div className="flex text-warning text-sm">
                      {'★'.repeat(avis.note)}{'☆'.repeat(5 - avis.note)}
                    </div>
                  </div>
                </div>
                <p className="text-on-surface-variant italic">"{avis.commentaire}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
