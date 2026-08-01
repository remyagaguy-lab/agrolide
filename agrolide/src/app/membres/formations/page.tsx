import { Calendar, MapPin, CheckCircle, Clock, XCircle, BookOpen } from 'lucide-react'
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
        return <span className="badge-glass bg-[#50a853]/10 text-[#1b5e38]"><CheckCircle className="w-3.5 h-3.5" /> Inscrit</span>
      case 'en_attente_paiement':
        return <span className="badge-glass bg-[#f99e1d]/10 text-[#8a4e00]"><Clock className="w-3.5 h-3.5" /> En attente de paiement</span>
      case 'complete':
        return <span className="badge-glass bg-blue-100 text-blue-800"><CheckCircle className="w-3.5 h-3.5" /> Terminée</span>
      case 'annule':
        return <span className="badge-glass bg-red-100 text-red-800"><XCircle className="w-3.5 h-3.5" /> Annulée</span>
      default:
        return <span className="badge-glass bg-gray-100 text-gray-800">{statut || 'Inconnu'}</span>
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto px-2 md:px-4 py-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="dash-page-title">Mes formations</h1>
          <p className="text-gray-500 mt-2 text-sm">Gérez vos inscriptions et téléchargez vos certificats.</p>
        </div>
        <Link 
          href="/formations" 
          className="btn-dash"
        >
          <BookOpen className="w-4 h-4" /> Découvrir le catalogue
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="card-glass p-12 text-center flex flex-col items-center">
          <div className="icon-circle-lg bg-gray-50 mb-4">
            <Calendar className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune inscription</h3>
          <p className="text-gray-500 mb-6">Vous n'êtes inscrit à aucune formation pour le moment.</p>
          <Link href="/formations" className="text-[#1b5e38] font-bold hover:underline">
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
              <div key={ins.id} className="card-glass-hover p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusBadge(ins.statut)}
                    <span className="text-sm font-medium text-gray-500">{formation.modalite}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    <Link href={`/membres/formations/${formation.id}`} className="hover:text-[#1b5e38] transition-colors">
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

                <div className="w-full md:w-auto md:min-w-[200px] flex flex-col gap-3 border-t md:border-t-0 md:border-l border-gray-100/50 pt-4 md:pt-0 md:pl-6">
                  {ins.statut === 'en_attente_paiement' && (
                    <button className="w-full px-4 py-2.5 bg-[#f99e1d] text-white rounded-full text-sm font-bold hover:bg-[#fcb726] transition-colors shadow-md">
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
                    <div className="text-center text-sm text-gray-500 font-medium">
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
