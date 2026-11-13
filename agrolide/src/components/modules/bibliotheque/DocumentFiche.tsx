import Link from 'next/link'
import type { ReactNode } from 'react'
import type { documents } from '@/db/schema'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { Sillons } from '@/components/brand'
import { DocumentCard, DOMAINES_VISUELS, DOMAINE_PAR_DEFAUT, type DocumentType } from '@/components/modules/bibliotheque/DocumentCard'
import { DownloadButton } from '@/components/modules/bibliotheque/DownloadButton'
import { FavoriButton } from '@/components/modules/bibliotheque/FavoriButton'
import { labelType, labelDomaine, labelSousDomaine, labelPublic, labelNiveau } from '@/lib/bibliotheque/taxonomie'

import { CalendarDays, Eye, FileType, GraduationCap, HardDrive, MapPin, Scale, ScrollText, Tag, UserRound, Users } from "@/components/ui/icons"
type Espace = 'membre' | 'public'
export type DocumentFicheData = typeof documents.$inferSelect

/** Une ligne du résumé : pictogramme, intitulé discret, valeur (même grammaire que la fiche formation). */
function Fait({ Icone, libelle, children }: { Icone: typeof Users; libelle: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary-container text-on-primary-container">
        <Icone className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <dt className="text-label-md font-bold uppercase tracking-wider text-on-surface-variant">{libelle}</dt>
        <dd className="text-body-md font-medium text-on-surface">{children}</dd>
      </div>
    </div>
  )
}

/** Un repère sous le titre : pictogramme et valeur. */
function Repere({ Icone, children }: { Icone: typeof Users; children: ReactNode }) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <Icone className="size-4 shrink-0" aria-hidden />
      {children}
    </li>
  )
}

function tailleLisible(octets: number | null) {
  if (!octets) return null
  if (octets < 1024 * 1024) return `${Math.max(1, Math.round(octets / 1024))} Ko`
  return `${(octets / 1024 / 1024).toFixed(1).replace('.', ',')} Mo`
}

/**
 * Présentation d'une fiche de document : couverture teintée par domaine, résumé, source et droits, puis un encart
 * collant avec les repères et les gestes (lire, télécharger, favori). Reçoit des données déjà lues : voir DocumentDetailView.
 */
export function DocumentFiche({
  document,
  similarDocs,
  mode,
  peutMettreEnFavori,
  favori,
}: {
  document: DocumentFicheData
  similarDocs: DocumentType[]
  mode: Espace
  peutMettreEnFavori: boolean
  favori: boolean
}) {
  const racine = mode === 'membre' ? '/membres/bibliotheque' : '/bibliotheque'
  const { Icone, fond } = (document.domaine && DOMAINES_VISUELS[document.domaine]) || DOMAINE_PAR_DEFAUT
  const sujet = document.sous_domaine ? labelSousDomaine(document.sous_domaine) : ''
  const tags = Array.from(new Set([...(document.mots_cles ?? []), document.filiere].filter(Boolean))) as string[]
  const taille = tailleLisible(document.taille_octets)
  const lectures = document.nb_telechargements || 0
  const aDroits = Boolean(document.source_organisation || document.licence)
  const rubrique = document.domaine ? labelDomaine(document.domaine) : document.thematique

  return (
    <div className={mode === 'public' ? 'container pb-24 pt-8 md:pt-12' : 'pt-6'}>
      <Breadcrumb jsonLd={mode === 'public'} items={[{ label: 'Bibliothèque', href: racine }, { label: document.titre }]} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
        {/* Contenu */}
        <div className="min-w-0 space-y-6">
          <article className="overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest">
            {/* Couverture : teinte du domaine, pictogramme, sillons dans le coin (jamais sous un texte) */}
            <div className={`relative h-32 overflow-hidden sm:h-40 ${fond}`}>
              <Sillons coin="bas-droite" opacite={0.12} className="absolute bottom-0 right-0 w-56" />
              <Icone className="absolute left-6 top-6 size-6" aria-hidden />
              <span className="absolute right-4 top-4 max-w-[60%] truncate rounded-full bg-surface-container-lowest/90 px-3 py-1 text-label-md font-medium text-on-surface">
                {labelType(document.type_doc)}
              </span>
            </div>

            <div className="p-6 md:p-8">
              {rubrique ? (
                <p className="text-label-md font-bold uppercase tracking-wider text-on-surface-variant">
                  {rubrique}
                  {sujet ? ` · ${sujet}` : ''}
                </p>
              ) : null}
              <h1 className="mt-2 text-balance break-words text-headline-sm font-bold text-on-surface md:text-headline-md">{document.titre}</h1>

              <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-body-md text-on-surface-variant">
                <Repere Icone={UserRound}>{document.auteurs || 'Auteur inconnu'}</Repere>
                {document.annee ? <Repere Icone={CalendarDays}>{document.annee}</Repere> : null}
                {document.pays ? <Repere Icone={MapPin}>{document.pays}</Repere> : null}
              </ul>

              <h2 className="mt-8 text-title-md font-bold text-on-surface">Résumé</h2>
              <p className="mt-3 whitespace-pre-line text-body-lg leading-[1.8] text-on-surface-variant">
                {document.resume || 'Aucun résumé disponible pour ce document.'}
              </p>

              {tags.length > 0 && (
                <div className="mt-8 border-t border-outline-variant pt-6">
                  <h2 className="flex items-center gap-2 text-title-md font-bold text-on-surface">
                    <Tag className="size-5 text-primary" aria-hidden /> Mots-clés
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <li key={tag}>
                        <Link
                          href={`${racine}?search=${encodeURIComponent(tag)}`}
                          className="ag-state inline-flex min-h-11 items-center rounded-full bg-surface-container-high px-4 text-label-lg text-on-surface-variant transition-colors duration-150 hover:bg-primary-container hover:text-on-primary-container"
                        >
                          {tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </article>

          {aDroits && (
            <section aria-labelledby="doc-droits" className="rounded-card border border-outline-variant bg-surface-container-lowest p-6">
              <h2 id="doc-droits" className="flex items-center gap-2 text-title-md font-bold text-on-surface">
                <Scale className="size-5 text-primary" aria-hidden /> Source et droits
              </h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                {document.source_organisation && (
                  <div>
                    <dt className="text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Source</dt>
                    <dd className="mt-1 text-body-md text-on-surface">{document.source_organisation}</dd>
                  </div>
                )}
                {document.licence && (
                  <div>
                    <dt className="text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Licence</dt>
                    <dd className="mt-1 text-body-md text-on-surface">{document.licence}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-4 text-body-sm text-on-surface-variant">
                Les droits restent ceux de la source. Merci de la citer si vous réutilisez ce document.
              </p>
            </section>
          )}
        </div>

        {/* Encart : repères et gestes (reste visible en défilant) */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="space-y-5 rounded-card border border-outline-variant bg-surface-container-lowest p-6">
            <dl className="space-y-4">
              {document.public_cible && <Fait Icone={Users} libelle="Pour qui ?">{labelPublic(document.public_cible)}</Fait>}
              {document.niveau && <Fait Icone={GraduationCap} libelle="Niveau">{labelNiveau(document.niveau)}</Fait>}
              <Fait Icone={FileType} libelle="Format">PDF</Fait>
              {taille && <Fait Icone={HardDrive} libelle="Taille">{taille}</Fait>}
              {lectures >= 5 && <Fait Icone={Eye} libelle="Lectures">{lectures.toLocaleString('fr-FR')}</Fait>}
            </dl>

            <div className="space-y-3">
              <DownloadButton documentId={document.id} mode={mode} />
              {peutMettreEnFavori && (
                <FavoriButton documentId={document.id} initial={favori} className="w-full [&>button]:w-full [&>button]:justify-center" />
              )}
            </div>

            <p className="flex items-start gap-2 border-t border-outline-variant pt-4 text-body-sm text-on-surface-variant">
              <ScrollText className="mt-0.5 size-4 shrink-0" aria-hidden />
              En consultant ce document, vous acceptez les conditions d’utilisation de la bibliothèque.
            </p>
          </div>
        </aside>
      </div>

      {similarDocs.length > 0 && (
        <div role="region" aria-labelledby="doc-similaires" className="mt-14 border-t border-outline-variant pt-10">
          <h2 id="doc-similaires" className="text-title-lg font-bold text-on-surface">
            Documents similaires
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similarDocs.map((doc) => (
              <DocumentCard key={doc.id} document={doc} publicView={mode === 'public'} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
