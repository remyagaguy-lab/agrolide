import Link from 'next/link'
import type { ComponentType } from 'react'
import type { BilanParcours } from '@/lib/parcours/bilan.server'
import { RubriqueParcours } from './ParcoursBlocs'

import { Award, CalendarDays, ClipboardCheck, Download, Library, Users } from '@/components/ui/icons'

type Tuile = {
  cle: string
  Icone: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  valeur: string
  libelle: string
  detail?: string
  href?: string
}

const pluriel = (n: number, un: string, plusieurs: string) => (n > 1 ? plusieurs : un)

/** Bilan chiffré de « Mon parcours » : chaque chiffre est lu en base (examens, livrables, certificats, événements, réseau, lectures). */
export function BilanActivite({ bilan, lectures, lecturesTerminees }: { bilan: BilanParcours; lectures: number; lecturesTerminees: number }) {
  const { examens, livrables, certificats, evenements, connexions, telechargements } = bilan
  const nbCertifs = certificats.participation + certificats.reussite
  const nbEvenements = evenements.aVenir.length + evenements.passes
  const detailLivrables = [
    livrables.moyenne !== null ? `moyenne ${String(livrables.moyenne).replace('.', ',')} / 20` : '',
    livrables.aRevoir ? `${livrables.aRevoir} à revoir` : '',
    livrables.enAttente ? `${livrables.enAttente} en attente de correction` : '',
  ]
    .filter(Boolean)
    .join(' · ')

  const tuiles: Tuile[] = [
    {
      cle: 'examens',
      Icone: ClipboardCheck,
      valeur: examens.meilleur === null ? '0' : `${examens.meilleur} %`,
      libelle: examens.meilleur === null ? 'examen passé' : 'meilleur score à l’examen',
      detail: examens.passes > 0 ? `${examens.passes} tentative${examens.passes > 1 ? 's' : ''}${examens.reussis > 0 ? `, ${examens.reussis} réussie${examens.reussis > 1 ? 's' : ''}` : ''}` : undefined,
    },
    {
      cle: 'livrables',
      Icone: ClipboardCheck,
      valeur: `${livrables.valides} / ${livrables.remis}`,
      libelle: pluriel(livrables.valides, 'livrable validé', 'livrables validés'),
      detail: detailLivrables || undefined,
    },
    {
      cle: 'certificats',
      Icone: Award,
      valeur: String(nbCertifs),
      libelle: pluriel(nbCertifs, 'certificat obtenu', 'certificats obtenus'),
      detail: nbCertifs ? `${certificats.participation} de participation, ${certificats.reussite} de réussite` : undefined,
      href: '#certificats',
    },
    {
      cle: 'lectures',
      Icone: Library,
      valeur: String(lectures),
      libelle: pluriel(lectures, 'document lu', 'documents lus'),
      detail: lecturesTerminees ? `${lecturesTerminees} terminé${lecturesTerminees > 1 ? 's' : ''}` : undefined,
      href: '#lectures',
    },
    {
      cle: 'evenements',
      Icone: CalendarDays,
      valeur: String(nbEvenements),
      libelle: pluriel(nbEvenements, 'inscription à un événement', 'inscriptions à des événements'),
      detail: evenements.aVenir.length ? `${evenements.aVenir.length} à venir` : undefined,
    },
    { cle: 'reseau', Icone: Users, valeur: String(connexions), libelle: pluriel(connexions, 'connexion au réseau', 'connexions au réseau'), href: '/membres/reseau' },
    { cle: 'telechargements', Icone: Download, valeur: String(telechargements), libelle: pluriel(telechargements, 'document téléchargé', 'documents téléchargés') },
  ]

  const classe = 'flex min-h-16 items-start gap-3 rounded-card border border-outline-variant bg-surface-container-lowest px-4 py-3'
  const lien = `ag-state ${classe} transition-colors hover:border-primary`

  return (
    <RubriqueParcours id="bilan" titre="Mon bilan">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tuiles.map(({ cle, Icone, valeur, libelle, detail, href }) => {
          const contenu = (
            <>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary-container text-on-primary-container">
                <Icone className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-headline-sm font-bold leading-none text-on-surface">{valeur}</span>
                <span className="mt-1 block text-label-md text-on-surface-variant">{libelle}</span>
                {detail ? <span className="mt-0.5 block text-label-sm text-on-surface-muted">{detail}</span> : null}
              </span>
            </>
          )
          return (
            <li key={cle}>
              {!href ? (
                <div className={classe}>{contenu}</div>
              ) : href.startsWith('#') ? (
                <a href={href} className={lien}>
                  {contenu}
                </a>
              ) : (
                <Link href={href} className={lien}>
                  {contenu}
                </Link>
              )}
            </li>
          )
        })}
      </ul>

      {evenements.aVenir.length > 0 ? (
        <div className="rounded-card border border-outline-variant bg-surface-container-lowest p-4">
          <h3 className="text-title-sm font-bold text-on-surface">Mes prochains événements</h3>
          <ul className="mt-2 divide-y divide-outline-variant">
            {evenements.aVenir.slice(0, 4).map((e) => (
              <li key={e.id}>
                <Link href={`/membres/evenements/${e.id}`} className="ag-state flex min-h-11 items-center justify-between gap-3 py-2 hover:text-primary">
                  <span className="min-w-0 truncate text-body-md font-medium text-on-surface">{e.titre}</span>
                  <span className="shrink-0 text-label-md text-on-surface-variant">{new Date(e.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </RubriqueParcours>
  )
}
