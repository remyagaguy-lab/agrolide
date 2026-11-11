import { Calendar, MapPin, CheckCircle, Clock, XCircle, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { DownloadCertificatButton } from '@/components/modules/formations/DownloadCertificatButtonLazy'
import { auth } from '@/lib/auth/server'
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
      },
      formation: true
    },
    orderBy: (inscriptions, { desc }) => [desc(inscriptions.created_at)]
  })

  const getStatusBadge = (statut: string | null) => {
    if (statut === 'en_cours') {
      return <span className="bg-primary-container text-primary border border-outline-variant px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"><CheckCircle className="w-3 h-3" /> En cours</span>
    }
    switch (statut) {
      case 'inscrit':
        return <span className="bg-primary-container text-primary border border-outline-variant px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"><CheckCircle className="w-3 h-3" /> Inscrit</span>
      case 'en_attente_paiement':
        return <span className="bg-tertiary-container text-on-warning-container border border-warning/40 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"><Clock className="w-3 h-3" /> En attente</span>
      case 'complete':
        return <span className="bg-info-container text-info border border-info/30 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"><CheckCircle className="w-3 h-3" /> Terminée</span>
      case 'annule':
        return <span className="bg-error-container text-error border border-error/30 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"><XCircle className="w-3 h-3" /> Annulée</span>
      default:
        return <span className="bg-surface-container-low text-on-surface-variant border border-outline-variant px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">{statut || 'Inconnu'}</span>
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface font-heading">Mes formations</h1>
          <p className="text-on-surface-muted mt-1 text-xs">Gérez vos inscriptions et téléchargez vos certificats.</p>
        </div>
        <Link 
          href="/formations" 
          className="bg-primary hover:bg-primary/90 text-on-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <BookOpen className="w-4 h-4" /> Découvrir le catalogue
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6 text-outline" />
          </div>
          <h3 className="text-sm font-bold text-on-surface mb-1">Aucune inscription</h3>
          <p className="text-xs text-on-surface-muted mb-4">Vous n'êtes inscrit à aucune formation pour le moment.</p>
          <Link href="/formations" className="text-primary text-sm font-bold hover:underline">
            Parcourir le catalogue
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((ins) => {
            const isExternal = !!ins.formation;
            const formation = isExternal ? ins.formation : ins.sessions_formation?.formation;
            if (!formation) return null;
            
            const sessionData = ins.sessions_formation;

            return (
              <div key={ins.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm hover:border-primary transition-colors p-5 flex flex-col md:flex-row gap-6 items-start md:items-center group">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(ins.statut)}
                    <span className="text-[10px] font-bold text-on-surface-muted uppercase tracking-wider">
                      {isExternal ? formation.source_externe || 'Externe' : formation.modalite}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                    <Link href={`/membres/formations/${formation.id}`}>
                      {formation.titre}
                    </Link>
                  </h3>
                  
                  {!isExternal && sessionData && (
                    <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-muted">
                      <div className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-on-surface-muted" />
                        {new Date(sessionData.date_debut).toLocaleDateString('fr-FR')} au {new Date(sessionData.date_fin).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-on-surface-muted" />
                        {sessionData.lieu}
                      </div>
                    </div>
                  )}

                  {isExternal && formation.thematique && (
                    <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-muted">
                      <div className="flex items-center">
                        <BookOpen className="w-3.5 h-3.5 mr-1.5 text-on-surface-muted" />
                        {formation.thematique}
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full md:w-auto md:min-w-[180px] flex flex-col gap-2 border-t md:border-t-0 md:border-l border-outline-variant pt-4 md:pt-0 md:pl-5">
                  {!isExternal && ins.statut === 'en_attente_paiement' && (
                    <button className="w-full px-4 py-2 bg-tertiary text-on-tertiary rounded-lg text-xs font-bold hover:bg-accent-sun transition-colors shadow-sm">
                      Procéder au paiement
                    </button>
                  )}
                  
                  {!isExternal && ins.statut === 'complete' && profile && profile.nom && profile.prenom && sessionData && (
                    <DownloadCertificatButton 
                      nom={profile.nom}
                      prenom={profile.prenom}
                      formationTitre={formation.titre}
                      dateDebut={sessionData.date_debut}
                      inscriptionId={ins.id}
                    />
                  )}
                  
                  {!isExternal && ins.statut === 'inscrit' && (
                    <div className="text-center text-sm text-on-surface-muted font-medium">
                      En attente de la formation
                    </div>
                  )}

                  {isExternal && formation.lien_externe && (
                    <a 
                      href={formation.lien_externe} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 bg-primary text-on-primary text-center rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      Accéder à la plateforme
                    </a>
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
