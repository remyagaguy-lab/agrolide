import Link from 'next/link'
import { and, asc, desc, eq, gte, isNotNull, lt } from 'drizzle-orm'
import { db } from '@/db'
import { evenements, webinaires } from '@/db/schema'
import { PageEntete } from '@/components/layout/PageEntete'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

import { CalendarDays, Clock, ExternalLink, Lock, Unlock, UserRound, Video } from "@/components/ui/icons"
export const metadata = { title: "Webinaires" }

/** Une séance à venir, qu'elle vienne de la table des webinaires ou du calendrier des événements. */
interface SeanceAVenir {
  cle: string
  titre: string
  description: string | null
  date: string
  dureeMinutes: number | null
  intervenant: string | null
  acces: string | null
  /** Direct YouTube (webinaires) ou fiche de l'événement (inscription dans l'espace membre). */
  action: { href: string; libelle: string; externe: boolean } | null
}

const formaterDate = (iso: string) =>
  new Date(iso).toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })

export default async function WebinairesPage() {
  const maintenant = new Date().toISOString()

  let aVenir: SeanceAVenir[] = []
  let replays: (typeof webinaires.$inferSelect)[] = []

  try {
    const [prochains, replaysRows, evenementsWebinaires] = await Promise.all([
      db.select().from(webinaires).where(gte(webinaires.date_heure, maintenant)).orderBy(asc(webinaires.date_heure)),
      // Replays : séances passées dont l'enregistrement est en ligne.
      db.select().from(webinaires)
        .where(and(lt(webinaires.date_heure, maintenant), isNotNull(webinaires.youtube_id)))
        .orderBy(desc(webinaires.date_heure))
        .limit(12),
      db.select().from(evenements)
        .where(and(eq(evenements.type_evt, 'webinaire'), eq(evenements.publie, true), gte(evenements.date_debut, maintenant)))
        .orderBy(asc(evenements.date_debut)),
    ])

    replays = replaysRows

    aVenir = [
      ...prochains.map((w): SeanceAVenir => ({
        cle: `w-${w.id}`,
        titre: w.titre,
        description: w.description,
        date: w.date_heure,
        dureeMinutes: w.duree_minutes,
        intervenant: w.intervenant,
        acces: w.acces,
        action: w.youtube_live_id
          ? { href: `https://www.youtube.com/watch?v=${encodeURIComponent(w.youtube_live_id)}`, libelle: 'Rejoindre le direct', externe: true }
          : null,
      })),
      ...evenementsWebinaires.map((e): SeanceAVenir => ({
        cle: `e-${e.id}`,
        titre: e.titre,
        description: e.description,
        date: e.date_debut,
        dureeMinutes: null,
        intervenant: null,
        acces: null,
        action: { href: `/membres/evenements/${e.id}`, libelle: "Voir et s'inscrire", externe: false },
      })),
    ].sort((a, b) => a.date.localeCompare(b.date))
  } catch (e) {
    console.error('Erreur lecture des webinaires:', e)
  }

  return (
    <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-6 space-y-8">
      <PageEntete
        titre="Webinaires"
        description="Participez à nos sessions en direct ou revoyez les replays pour approfondir vos connaissances."
      />

      {/* Webinaires à venir */}
      <section aria-labelledby="webinaires-a-venir">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary-container border border-outline-variant flex items-center justify-center">
            <CalendarDays size={16} className="text-primary" aria-hidden="true" />
          </div>
          <h2 id="webinaires-a-venir" className="text-lg font-bold text-on-surface font-heading">À venir</h2>
        </div>

        {aVenir.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aVenir.map((s) => (
              <li key={s.cle} className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-5 flex flex-col hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-start mb-3 gap-2">
                  {s.acces === 'public' ? (
                    <Badge variant="neutral" className="uppercase tracking-wider"><Unlock size={16} aria-hidden="true" /> Public</Badge>
                  ) : s.acces ? (
                    <Badge variant="info" className="uppercase tracking-wider"><Lock size={16} aria-hidden="true" /> Membres</Badge>
                  ) : <span />}
                  <Badge variant="success" className="uppercase tracking-wider"><Video size={16} aria-hidden="true" /> En direct</Badge>
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
                      Durée estimée : {s.dureeMinutes} minutes
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
                    <a href={s.action.href} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'secondary', size: 'sm', fullWidth: true, className: 'mt-4' })}>
                      {s.action.libelle} <ExternalLink size={16} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link href={s.action.href} className={buttonVariants({ variant: 'secondary', size: 'sm', fullWidth: true, className: 'mt-4' })}>
                      {s.action.libelle}
                    </Link>
                  )
                )}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={<CalendarDays />}
            title="Aucun webinaire programmé"
            description="Les prochaines séances en direct apparaîtront ici dès qu'elles seront annoncées."
          />
        )}
      </section>

      {/* Replays */}
      <section aria-labelledby="webinaires-replays">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-center">
            <Video size={16} className="text-on-surface-muted" aria-hidden="true" />
          </div>
          <h2 id="webinaires-replays" className="text-lg font-bold text-on-surface font-heading">Replays récents</h2>
        </div>

        {replays.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {replays.map((w) => (
              <li key={w.id} className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden flex flex-col">
                <div className="relative w-full aspect-video bg-inverse-surface border-b border-outline-variant">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(w.youtube_id!)}`}
                    title={w.titre}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-sm font-bold text-on-surface mb-1.5">{w.titre}</h3>
                  {w.description && <p className="text-xs text-on-surface-muted mb-3 flex-1 line-clamp-2 leading-relaxed">{w.description}</p>}
                  <p className="mt-auto pt-3 border-t border-outline-variant text-label-sm text-on-surface-muted font-bold uppercase tracking-wider">
                    Diffusé le {new Date(w.date_heure).toLocaleDateString('fr-FR')}
                    {w.intervenant ? ` · ${w.intervenant}` : ''}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={<Video />}
            title="Aucun replay disponible"
            description="Les enregistrements des webinaires passés seront publiés ici."
          />
        )}
      </section>
    </div>
  )
}
