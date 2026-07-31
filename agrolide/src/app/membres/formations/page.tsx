import { Calendar, MapPin, CheckCircle, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'
import { DownloadCertificatButton } from '@/components/modules/formations/DownloadCertificatButton'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { inscriptions_formation, sessions_formation, formations, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export const metadata = { title: "Mes formations" }

export default async function MesFormationsPage() {
  const { userId } = await auth();
  const session = userId ? { user: { id: userId } } : null;
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Get user profile
  const profile = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { nom: true, prenom: true }
  })

  // Get inscriptions with relations
  const data = await db.query.inscriptions_formation.findMany({
    where: eq(inscriptions_formation.membre_id, session.user.id),
    with: {
      sessions_formation: {
        with: {
          formation: true
        }
      }
    },
    orderBy: (inscriptions, { desc }) => [desc(inscriptions.created_at)]
  })

  const getStatusBadge = (statut: string | null) => {
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
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{statut || 'Inconnu'}</span>
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

      {data.length === 0 ? (
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
          {data.map((ins) => {
            const sessionData = ins.sessions_formation
            if (!sessionData) return null
            const formation = sessionData.formation
            if (!formation) return null
            
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
                      {new Date(sessionData.date_debut).toLocaleDateString('fr-FR')} au {new Date(sessionData.date_fin).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {sessionData.lieu}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto md:min-w-[200px] flex flex-col gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  {ins.statut === 'en_attente_paiement' && (
                    <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                      Procéder au paiement
                    </button>
                  )}
                  
                  {ins.statut === 'complete' && profile && profile.nom && profile.prenom && (
                    <DownloadCertificatButton 
                      nom={profile.nom}
                      prenom={profile.prenom}
                      formationTitre={formation.titre}
                      dateDebut={sessionData.date_debut}
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
