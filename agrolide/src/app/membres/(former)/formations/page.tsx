import { Calendar, MapPin, CheckCircle, Clock, XCircle, BookOpen, PlayCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { auth } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import { suiviFormations, type SuiviFormation } from '@/lib/formations/suivi.server'
import { buttonVariants } from '@/components/ui/Button'

export const metadata = { title: "Mes formations" }

function StatutBadge({ suivi }: { suivi: SuiviFormation }) {
  const base = "px-2 py-0.5 rounded text-label-sm font-bold flex items-center gap-1 uppercase tracking-wider border"
  if (suivi.terminee) return <span className={`${base} bg-info-container text-info border-info/30`}><CheckCircle className="w-3 h-3" aria-hidden /> Terminée</span>
  switch (suivi.statut) {
    case 'en_attente_paiement':
      return <span className={`${base} bg-tertiary-container text-on-warning-container border-warning/40`}><Clock className="w-3 h-3" aria-hidden /> En attente</span>
    case 'annule':
      return <span className={`${base} bg-error-container text-error border-error/30`}><XCircle className="w-3 h-3" aria-hidden /> Annulée</span>
    case 'en_cours':
    case 'inscrit':
      return <span className={`${base} bg-primary-container text-primary border-outline-variant`}><CheckCircle className="w-3 h-3" aria-hidden /> {suivi.statut === 'inscrit' ? 'Inscrit' : 'En cours'}</span>
    default:
      return <span className={`${base} bg-surface-container-low text-on-surface-variant border-outline-variant`}>{suivi.statut || 'Inconnu'}</span>
  }
}

export default async function MesFormationsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const data = await suiviFormations(userId)

  return (
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-on-surface font-heading">Mes formations</h1>
          <p className="text-on-surface-muted mt-1 text-xs">Reprenez là où vous vous êtes arrêté(e) et retrouvez vos certificats.</p>
        </div>
        <Link href="/membres/formations/catalogue" className={buttonVariants({ variant: 'tonal' })}>
          <BookOpen className="w-4 h-4" aria-hidden /> Parcourir le catalogue
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6 text-outline" aria-hidden />
          </div>
          <h3 className="text-sm font-bold text-on-surface mb-1">Aucune inscription</h3>
          <p className="text-xs text-on-surface-muted mb-4">Vous n'êtes inscrit(e) à aucune formation pour le moment.</p>
          <Link href="/membres/formations/catalogue" className="inline-flex min-h-11 items-center text-primary text-sm font-bold hover:underline">
            Parcourir le catalogue
          </Link>
        </div>
      ) : (
        <ul className="space-y-6">
          {data.map((s) => {
            const aDesLecons = s.total > 0
            const external = !!s.lienExterne
            return (
              <li key={s.inscriptionId} className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm hover:border-primary transition-colors p-5 flex flex-col md:flex-row gap-6 items-start md:items-center group">
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <StatutBadge suivi={s} />
                    <span className="text-label-sm font-bold text-on-surface-muted uppercase tracking-wider">
                      {external ? s.sourceExterne || 'Externe' : s.modalite}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                    <Link href={`/membres/formations/${s.formationId}`}>{s.titre}</Link>
                  </h3>

                  {aDesLecons && (
                    <div className="max-w-sm">
                      <div className="flex justify-between text-label-sm text-on-surface-variant mb-1">
                        <span>{s.faites} / {s.total} leçon{s.total > 1 ? 's' : ''}</span>
                        <span>{s.pourcent} %</span>
                      </div>
                      <div
                        role="progressbar"
                        aria-label={`Progression dans « ${s.titre} »`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={s.pourcent}
                        className="h-2 w-full overflow-hidden rounded-full bg-surface-container"
                      >
                        <div className="h-full rounded-full bg-primary" style={{ width: `${s.pourcent}%` }} />
                      </div>
                    </div>
                  )}

                  {!aDesLecons && s.session && (
                    <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-muted">
                      <div className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" aria-hidden />
                        {new Date(s.session.dateDebut).toLocaleDateString('fr-FR')} au {new Date(s.session.dateFin).toLocaleDateString('fr-FR')}
                      </div>
                      {s.session.lieu && (
                        <div className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1.5" aria-hidden />
                          {s.session.lieu}
                        </div>
                      )}
                    </div>
                  )}

                  {!aDesLecons && !s.session && s.thematique && (
                    <div className="flex items-center text-xs text-on-surface-muted">
                      <BookOpen className="w-3.5 h-3.5 mr-1.5" aria-hidden />
                      {s.thematique}
                    </div>
                  )}
                </div>

                <div className="w-full md:w-auto md:min-w-[200px] flex flex-col gap-2 border-t md:border-t-0 md:border-l border-outline-variant pt-4 md:pt-0 md:pl-5">
                  {aDesLecons && !s.terminee && s.prochaineLeconId && (
                    <Link href={`/membres/formations/${s.formationId}/suivre/${s.prochaineLeconId}`} className={buttonVariants({ variant: 'secondary' })}>
                      <PlayCircle className="w-4 h-4" aria-hidden /> {s.faites > 0 ? 'Reprendre' : 'Commencer'}
                    </Link>
                  )}

                  {s.terminee && (
                    <Link href="/membres/formations/mes-certificats" className={buttonVariants({ variant: 'tonal' })}>
                      Voir mon certificat
                    </Link>
                  )}

                  {!aDesLecons && external && (
                    <a
                      href={s.lienExterne!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({ variant: 'secondary' })}
                    >
                      Accéder à la plateforme <ExternalLink className="w-4 h-4" aria-hidden />
                    </a>
                  )}

                  {!aDesLecons && !external && s.statut === 'inscrit' && (
                    <div className="text-center text-sm text-on-surface-muted font-medium">En attente de la formation</div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
