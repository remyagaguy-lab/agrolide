import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/formatters'
import { buttonVariants } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { labelDomaine, labelType } from '@/lib/bibliotheque/taxonomie'
import type { SuiviFormation } from '@/lib/formations/suivi.server'
import type { DocumentParcours } from '@/lib/bibliotheque/parcours.server'

import { NotebookPen, CheckCircle2, Clock, ExternalLink, FileText, PlayCircle } from "@/components/ui/icons"
/** Une rubrique de « Mon parcours » : titre, nombre, lien « tout voir » et contenu (ou état vide). */
export function RubriqueParcours({
  id,
  titre,
  nombre,
  lien,
  children,
}: {
  id: string
  titre: string
  nombre?: number
  lien?: { href: string; libelle: string }
  children: ReactNode
}) {
  return (
    <section aria-labelledby={`${id}-titre`} id={id} className="scroll-mt-24 space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={`${id}-titre`} className="text-title-lg font-bold text-on-surface">
          {titre}
          {typeof nombre === 'number' && nombre > 0 ? <span className="ml-2 text-label-lg font-medium text-on-surface-variant">{nombre}</span> : null}
        </h2>
        {lien ? (
          <Link href={lien.href} className="inline-flex min-h-11 items-center text-label-lg font-bold text-primary hover:underline">
            {lien.libelle}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  )
}

export function VideParcours({ titre, description, href, libelle }: { titre: string; description: string; href: string; libelle: string }) {
  return (
    <EmptyState
      className="py-8"
      icon={<NotebookPen />}
      title={titre}
      description={description}
      action={
        <Link href={href} className={buttonVariants({ variant: 'tonal', size: 'sm' })}>
          {libelle}
        </Link>
      }
    />
  )
}

const dateCourte = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

/** Formation suivie : état, progression et une seule action (reprendre / commencer / accéder). */
export function FormationEnCours({ s }: { s: SuiviFormation }) {
  const aDesLecons = s.total > 0
  const externe = !!s.lienExterne
  const enAttente = s.statut === 'en_attente_paiement'

  return (
    <li className="flex flex-col gap-4 rounded-card border border-outline-variant bg-surface-container-lowest p-5">
      <div className="min-w-0 space-y-2">
        <p className="text-label-md font-bold uppercase tracking-wider text-on-surface-variant">
          {externe ? s.sourceExterne || 'Partenaire' : s.thematique || s.modalite}
          {enAttente ? <span className="ml-2 inline-flex items-center gap-1 text-on-warning-container"><Clock className="size-4" aria-hidden />En attente</span> : null}
        </p>
        <h3 className="text-title-md font-bold leading-snug text-on-surface">
          <Link href={`/membres/formations/${s.formationId}`} className="hover:text-primary">
            {s.titre}
          </Link>
        </h3>
      </div>

      {aDesLecons ? (
        <div>
          <div className="mb-1.5 flex justify-between text-label-md text-on-surface-variant">
            <span>
              {s.faites} / {s.total} leçon{s.total > 1 ? 's' : ''}
            </span>
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
      ) : s.session ? (
        <p className="text-body-sm text-on-surface-variant">
          Du {new Date(s.session.dateDebut).toLocaleDateString('fr-FR')} au {new Date(s.session.dateFin).toLocaleDateString('fr-FR')}
          {s.session.lieu ? ` · ${s.session.lieu}` : ''}
        </p>
      ) : null}

      <div className="mt-auto">
        {aDesLecons && s.prochaineLeconId ? (
          <Link href={`/membres/formations/${s.formationId}/suivre/${s.prochaineLeconId}`} className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
            <PlayCircle className="size-4" aria-hidden /> {s.faites > 0 ? 'Reprendre' : 'Commencer'}
          </Link>
        ) : !aDesLecons && externe ? (
          <a href={s.lienExterne!} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
            Accéder à la plateforme <ExternalLink className="size-4" aria-hidden />
          </a>
        ) : (
          <Link href={`/membres/formations/${s.formationId}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Voir la formation
          </Link>
        )}
      </div>
    </li>
  )
}

/** Document lu ou aimé : titre, source, date, et un accès direct à la lecture. */
export function DocumentParcoursCarte({ d, reprise = false }: { d: DocumentParcours; reprise?: boolean }) {
  return (
    <li className="flex gap-4 rounded-card border border-outline-variant bg-surface-container-lowest p-4">
      <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-control', d.termine ? 'bg-success-container text-on-success-container' : 'bg-primary-container text-on-primary-container')}>
        {d.termine ? <CheckCircle2 className="size-5" aria-hidden /> : <FileText className="size-5" aria-hidden />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-label-md font-bold uppercase tracking-wider text-on-surface-variant">
          {labelType(d.type_doc)}
          {d.domaine ? ` · ${labelDomaine(d.domaine)}` : ''}
        </p>
        <h3 className="mt-0.5 line-clamp-2 text-title-sm font-bold leading-snug text-on-surface">
          <Link href={`/membres/bibliotheque/${d.id}`} className="hover:text-primary">
            {d.titre}
          </Link>
        </h3>
        <p className="mt-0.5 line-clamp-1 text-body-sm text-on-surface-variant">{d.auteurs || 'Auteur inconnu'}</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-label-md text-on-surface-variant">
            {reprise ? (d.termine ? 'Terminé' : 'Lu') : 'Aimé'} le {dateCourte(d.date)}
          </span>
          {reprise ? (
            <Link href={`/membres/bibliotheque/${d.id}/lire`} className="inline-flex min-h-11 items-center text-label-lg font-bold text-primary hover:underline">
              {d.termine ? 'Relire' : 'Reprendre'}
            </Link>
          ) : null}
        </div>
      </div>
    </li>
  )
}
