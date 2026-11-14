import Link from 'next/link'
import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { evenements, webinaires } from '@/db/schema'
import { PageEntete } from '@/components/layout/PageEntete'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils/formatters'

import { CalendarDays, Clock, ExternalLink, FileText, Lock, Unlock, UserRound, Video } from "@/components/ui/icons"
export const metadata = { title: "Webinaires" }

type Statut = 'a_venir' | 'replay' | 'passe'

/** Une séance, qu'elle vienne de la table des webinaires ou du calendrier des événements. */
interface Seance {
  cle: string
  titre: string
  description: string | null
  date: string
  dureeMinutes: number | null
  intervenant: string | null
  acces: string | null
  statut: Statut
  /** Replay YouTube intégré dans la carte. */
  youtubeId: string | null
  /** Bouton principal : direct, replay ou fiche de l'événement. */
  action: { href: string; libelle: string; externe: boolean } | null
  documentId: string | null
}

const FILTRES: { valeur: string; libelle: string }[] = [
  { valeur: 'tous', libelle: 'Tous' },
  { valeur: 'a_venir', libelle: 'À venir' },
  { valeur: 'replay', libelle: 'Replays disponibles' },
  { valeur: 'passe', libelle: 'Passés sans replay' },
]

const formaterDate = (iso: string) =>
  new Date(iso).toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })

export default async function WebinairesPage(props: { searchParams: Promise<{ [cle: string]: string | string[] | undefined }> }) {
  const sp = await props.searchParams
  const filtre = FILTRES.some((f) => f.valeur === sp.statut) ? (sp.statut as string) : 'tous'
  const maintenant = new Date().toISOString()

  let seances: Seance[] = []
  try {
    const [lignes, evts] = await Promise.all([
      db.select().from(webinaires).orderBy(asc(webinaires.date_heure)),
      db.select().from(evenements).where(and(eq(evenements.type_evt, 'webinaire'), eq(evenements.publie, true))).orderBy(asc(evenements.date_debut)),
    ])

    seances = [
      ...lignes.map((w): Seance => {
        const passee = w.date_heure < maintenant
        return {
          cle: `w-${w.id}`, titre: w.titre, description: w.description, date: w.date_heure, dureeMinutes: w.duree_minutes,
          intervenant: w.intervenant, acces: w.acces, documentId: null,
          statut: !passee ? 'a_venir' : w.youtube_id ? 'replay' : 'passe',
          youtubeId: passee ? w.youtube_id : null,
          action: !passee && w.youtube_live_id
            ? { href: `https://www.youtube.com/watch?v=${encodeURIComponent(w.youtube_live_id)}`, libelle: 'Rejoindre le direct', externe: true }
            : null,
        }
      }),
      ...evts.map((e): Seance => {
        const passee = e.date_debut < maintenant
        const replay = passee && e.lien_replay ? e.lien_replay : null
        return {
          cle: `e-${e.id}`, titre: e.titre, description: e.description, date: e.date_debut, dureeMinutes: null,
          intervenant: null, acces: null, documentId: e.document_id || null, youtubeId: null,
          statut: !passee ? 'a_venir' : replay ? 'replay' : 'passe',
          action: replay
            ? { href: replay, libelle: 'Revoir le replay', externe: true }
            : !passee
              ? { href: `/membres/evenements/${e.id}`, libelle: "Voir et s'inscrire", externe: false }
              : { href: `/membres/evenements/${e.id}`, libelle: 'Voir la fiche', externe: false },
        }
      }),
    ]
    // À venir d'abord (le plus proche en premier), puis les séances passées, la plus récente en premier.
    seances.sort((a, b) => {
      if ((a.statut === 'a_venir') !== (b.statut === 'a_venir')) return a.statut === 'a_venir' ? -1 : 1
      return a.statut === 'a_venir' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
    })
  } catch (e) {
    console.error('Erreur lecture des webinaires:', e)
  }

  const compte = (v: string) => (v === 'tous' ? seances.length : seances.filter((s) => s.statut === v).length)
  const visibles = filtre === 'tous' ? seances : seances.filter((s) => s.statut === filtre)

  return (
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-6">
      <PageEntete
        titre="Webinaires"
        description="Séances à venir, replays et documents : tout au même endroit, filtrez pour trouver ce qui vous intéresse."
      />

      <nav aria-label="Filtrer les webinaires">
        <ul className="flex flex-wrap gap-2">
          {FILTRES.map((f) => {
            const actif = f.valeur === filtre
            return (
              <li key={f.valeur}>
                <Link
                  href={f.valeur === 'tous' ? '/membres/webinaires' : `/membres/webinaires?statut=${f.valeur}`}
                  aria-current={actif ? 'true' : undefined}
                  className={cn(
                    'ag-state inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-label-lg transition-colors',
                    actif ? 'border-primary bg-primary-container text-on-primary-container' : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary',
                  )}
                >
                  {f.libelle} <span className="text-label-md opacity-80">{compte(f.valeur)}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {visibles.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibles.map((s) => (
            <li key={s.cle} className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden flex flex-col">
              {s.youtubeId && (
                <div className="relative w-full aspect-video bg-inverse-surface border-b border-outline-variant">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(s.youtubeId)}`}
                    title={s.titre}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                  {s.statut === 'a_venir' ? (
                    <Badge variant="success" className="uppercase tracking-wider"><Video size={16} aria-hidden="true" /> À venir</Badge>
                  ) : s.statut === 'replay' ? (
                    <Badge variant="info" className="uppercase tracking-wider"><Video size={16} aria-hidden="true" /> Replay</Badge>
                  ) : (
                    <Badge variant="neutral" className="uppercase tracking-wider">Passé</Badge>
                  )}
                  {s.acces === 'public' ? (
                    <Badge variant="neutral" className="uppercase tracking-wider"><Unlock size={16} aria-hidden="true" /> Public</Badge>
                  ) : s.acces ? (
                    <Badge variant="info" className="uppercase tracking-wider"><Lock size={16} aria-hidden="true" /> Membres</Badge>
                  ) : null}
                </div>

                <h3 className="text-sm font-bold text-on-surface mb-1.5">{s.titre}</h3>
                {s.description && <p className="text-xs text-on-surface-muted mb-4 line-clamp-3 flex-grow leading-relaxed">{s.description}</p>}

                <div className="space-y-2 pt-3 mt-auto border-t border-outline-variant">
                  <p className="flex items-center text-label-sm font-medium text-on-surface-variant first-letter:capitalize">
                    <CalendarDays size={16} className="mr-1.5 text-on-surface-muted shrink-0" aria-hidden="true" />
                    {formaterDate(s.date)}
                  </p>
                  {s.dureeMinutes ? (
                    <p className="flex items-center text-label-sm font-medium text-on-surface-variant">
                      <Clock size={16} className="mr-1.5 text-on-surface-muted shrink-0" aria-hidden="true" />
                      Durée : {s.dureeMinutes} minutes
                    </p>
                  ) : null}
                  {s.intervenant ? (
                    <p className="flex items-center text-label-sm font-medium text-on-surface-variant">
                      <UserRound size={16} className="mr-1.5 text-on-surface-muted shrink-0" aria-hidden="true" />
                      {s.intervenant}
                    </p>
                  ) : null}
                </div>

                {s.action && (
                  s.action.externe ? (
                    <a href={s.action.href} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: s.statut === 'a_venir' ? 'secondary' : 'tonal', size: 'sm', fullWidth: true, className: 'mt-4' })}>
                      {s.action.libelle} <ExternalLink size={16} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link href={s.action.href} className={buttonVariants({ variant: 'tonal', size: 'sm', fullWidth: true, className: 'mt-4' })}>
                      {s.action.libelle}
                    </Link>
                  )
                )}
                {s.documentId && (
                  <Link href={`/bibliotheque/${s.documentId}`} className={buttonVariants({ variant: 'tonal', size: 'sm', fullWidth: true, className: 'mt-2' })}>
                    <FileText size={16} aria-hidden="true" /> Document du webinaire
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<CalendarDays />}
          title="Aucun webinaire dans cette catégorie"
          description="Essayez un autre filtre : les séances à venir, les replays et les documents apparaîtront ici."
        />
      )}
    </div>
  )
}
