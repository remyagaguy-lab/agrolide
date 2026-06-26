import { createClient } from '@supabase/supabase-js'
import { Calendar, MapPin, CheckCircle, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'
import { DownloadCertificatButton } from '@/components/modules/formations/DownloadCertificatButton'

export const revalidate = 0 // Pas de cache pour les données membres

export default async function MesFormationsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Dans un vrai cas avec Next.js App Router, il faudrait configurer next/cookies
  // ou faire un appel SWR/Client Component. Pour la maquette, on va faire le fetch côté serveur 
  // si on passe un token, ou bien on pourrait le faire côté client. 
  // Mais comme l'utilisateur est forcé à être co, utilisons un fetch basique.
  
  // NOTE: On remplace par un Server Component statique avec explication car sans auth server-side,
  // ça marchera pas facilement en SSR sans `@supabase/ssr`. 
  // Je vais basculer ce composant en Client Component pour que `supabase.auth.getSession()` marche.
  return <MesFormationsClient />
}

// Client Component inclus dans le même fichier pour simplifier
'use client'

import { useState, useEffect } from 'react'

function MesFormationsClient() {
  const [inscriptions, setInscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const fetchInscriptions = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Obtenir infos profil
      const { data: prof } = await supabase
        .from('profiles')
        .select('nom, prenom')
        .eq('id', session.user.id)
        .single()
      setProfile(prof)

      // Obtenir inscriptions via API ou BDD directe
      const { data } = await supabase
        .from('inscriptions_formation')
        .select('*, sessions_formation(*, formations(*))')
        .eq('membre_id', session.user.id)
        .order('created_at', { ascending: false })

      if (data) setInscriptions(data)
      setLoading(false)
    }
    fetchInscriptions()
  }, [])

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'inscrit':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3.5 h-3.5" /> Inscrit</span>
      case 'en_attente_paiement':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3.5 h-3.5" /> En attente de paiement</span>
      case 'complete':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><CheckCircle className="w-3.5 h-3.5" /> Terminée</span>
      case 'annule':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3.5 h-3.5" /> Annulée</span>
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{statut}</span>
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes formations</h1>
          <p className="text-gray-600 mt-2">Gérez vos inscriptions et téléchargez vos certificats.</p>
        </div>
        <Link 
          href="/formations" 
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-green-700 hover:bg-green-800"
        >
          Découvrir le catalogue
        </Link>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100"></div>
          ))}
        </div>
      ) : inscriptions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune inscription</h3>
          <p className="text-gray-500 mb-6">Vous n'êtes inscrit à aucune formation pour le moment.</p>
          <Link href="/formations" className="text-green-700 font-medium hover:underline">
            Parcourir le catalogue
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {inscriptions.map((ins) => {
            const formation = ins.sessions_formation.formations
            const session = ins.sessions_formation
            
            return (
              <div key={ins.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusBadge(ins.statut)}
                    <span className="text-sm font-medium text-gray-500">{formation.modalite}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    <Link href={`/membres/formations/${formation.id}`} className="hover:text-green-700 transition-colors">
                      {formation.titre}
                    </Link>
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(session.date_debut).toLocaleDateString('fr-FR')} au {new Date(session.date_fin).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {session.lieu}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto md:min-w-[200px] flex flex-col gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  {ins.statut === 'en_attente_paiement' && (
                    <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                      Procéder au paiement
                    </button>
                  )}
                  
                  {ins.statut === 'complete' && profile && (
                    <DownloadCertificatButton 
                      nom={profile.nom}
                      prenom={profile.prenom}
                      formationTitre={formation.titre}
                      dateDebut={session.date_debut}
                      inscriptionId={ins.id}
                    />
                  )}
                  
                  {ins.statut === 'inscrit' && (
                    <div className="text-center text-sm text-gray-500">
                      En attente de la formation
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
