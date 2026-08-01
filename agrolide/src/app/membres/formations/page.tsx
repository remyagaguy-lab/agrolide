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
        return <span className="bg-[#f0f7f0] text-[#1b5e38] border border-[#c3dec4] px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"><CheckCircle className="w-3 h-3" /> Inscrit</span>
      case 'en_attente_paiement':
        return <span className="bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"><Clock className="w-3 h-3" /> En attente</span>
      case 'complete':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"><CheckCircle className="w-3 h-3" /> Terminée</span>
      case 'annule':
        return <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"><XCircle className="w-3 h-3" /> Annulée</span>
      default:
        return <span className="bg-gray-50 text-gray-600 border border-[#e8e8e4] px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">{statut || 'Inconnu'}</span>
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#1a1a1a] font-heading">Mes formations</h1>
          <p className="text-gray-500 mt-1 text-xs">Gérez vos inscriptions et téléchargez vos certificats.</p>
        </div>
        <Link 
          href="/formations" 
          className="bg-[#1b5e38] hover:bg-[#144a2c] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <BookOpen className="w-4 h-4" /> Découvrir le catalogue
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="bg-white border border-[#e8e8e4] rounded-2xl shadow-sm p-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6 text-gray-300" />
          </div>
          <h3 className="text-sm font-bold text-[#1a1a1a] mb-1">Aucune inscription</h3>
          <p className="text-xs text-gray-500 mb-4">Vous n'êtes inscrit à aucune formation pour le moment.</p>
          <Link href="/formations" className="text-[#1b5e38] text-sm font-bold hover:underline">
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
              <div key={ins.id} className="bg-white border border-[#e8e8e4] rounded-2xl shadow-sm hover:border-[#1b5e38] transition-colors p-5 flex flex-col md:flex-row gap-6 items-start md:items-center group">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(ins.statut)}
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{formation.modalite}</span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-[#1a1a1a] mb-2 group-hover:text-[#1b5e38] transition-colors">
                    <Link href={`/membres/formations/${formation.id}`}>
                      {formation.titre}
                    </Link>
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      {new Date(sessionData.date_debut).toLocaleDateString('fr-FR')} au {new Date(sessionData.date_fin).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      {sessionData.lieu}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto md:min-w-[180px] flex flex-col gap-2 border-t md:border-t-0 md:border-l border-[#e8e8e4] pt-4 md:pt-0 md:pl-5">
                  {ins.statut === 'en_attente_paiement' && (
                    <button className="w-full px-4 py-2 bg-[#f99e1d] text-white rounded-lg text-xs font-bold hover:bg-[#fcb726] transition-colors shadow-sm">
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
