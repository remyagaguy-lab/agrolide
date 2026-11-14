import Breadcrumb from '@/components/ui/Breadcrumb'
import React from 'react'
import Link from 'next/link'
import { Sillons } from '@/components/brand'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { categorieAffichee, categorieLabel, displayName, safeExternalUrl, typeOrganisationAffiche } from '@/lib/reseau/profil'
import type { Fiche } from '@/lib/reseau/fiche'
import { ConnectionActions } from './ConnectionActions'
import { estOrganisation } from '@/lib/suivi/organisation'
import { MembreActionsMenu } from './MembreActionsMenu'
import { MemberCard } from './MemberCard'

import { Briefcase, ExternalLink, FileText, Globe, Heart, Languages, MapPin, Pencil, Sprout, Tag, Users } from "@/components/ui/icons"
const categoryVariant = (c: string | null): BadgeVariant => {
  switch ((c ?? '').toLowerCase()) {
    case 'junior': return 'junior'
    case 'professionnel': return 'professionnel'
    case 'partenaire':
    case 'organisation': return 'partenaire'
    case 'senior': return 'senior'
    default: return 'neutral'
  }
}

/** Bloc de la page : titre à pictogramme, puis contenu. */
function Bloc({ id, titre, Icone, children }: { id: string; titre: string; Icone: typeof Users; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="rounded-card border border-outline-variant bg-surface-container-lowest p-6">
      <h2 id={id} className="mb-4 flex items-center gap-2 text-title-md font-bold text-on-surface">
        <Icone className="size-5 text-primary" aria-hidden /> {titre}
      </h2>
      {children}
    </section>
  )
}

/** Une ligne « en commun » : pictogramme, intitulé discret, valeur. */
function Commun({ Icone, libelle, children }: { Icone: typeof Users; libelle: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-primary-container text-on-primary-container">
        <Icone className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-label-md font-bold uppercase tracking-wider text-on-surface-variant">{libelle}</p>
        <div className="text-body-md text-on-surface">{children}</div>
      </div>
    </li>
  )
}

/** Un groupe de pastilles de l'encart latéral. */
function Groupe({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-label-md font-bold uppercase tracking-wider text-on-surface-variant">{titre}</h2>
      <ul className="mt-2 flex flex-wrap gap-1.5">{children}</ul>
    </div>
  )
}

/** Fiche d'un membre vue par un autre membre connecté (ou par lui-même). Aucune donnée de contact. */
export function FicheView({ fiche }: { fiche: Fiche }) {
  const { membre, estMoi, state, communs, relationsCommunes, proches } = fiche
  const name = displayName(membre)
  const prenom = membre.prenom?.trim() || name
  const categorieBadge = categorieAffichee(membre)
  const category = categorieLabel(categorieBadge)
  const typeOrg = typeOrganisationAffiche(membre)
  const place = [membre.ville, membre.pays].filter(Boolean).join(', ')

  // Liens externes : visibles par le propriétaire et par ses relations seulement (règles de visibilité, §6.2).
  const linkedinUrl = safeExternalUrl(membre.linkedin_url)
  const siteWebUrl = safeExternalUrl(membre.site_web_url)
  const aDesLiens = Boolean(linkedinUrl || siteWebUrl)
  const voitLiens = estMoi || state === 'accepted'

  const aCommun = Boolean(communs) || relationsCommunes.total > 0
  const aUnEncart = membre.thematiques.length > 0 || membre.centres_interet.length > 0 || membre.langues.length > 0 || aDesLiens
  const autresRelations = relationsCommunes.total - relationsCommunes.noms.length

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:py-8">
      <Breadcrumb jsonLd={false} className="mb-0" items={[{ label: 'Annuaire', href: '/membres/annuaire' }, { label: name }]} />

      {/* Identité : bandeau teinté (sillons dans le coin), photo à cheval, un seul geste à droite */}
      <div role="region" aria-label={`Profil de ${name}`} className="overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest">
        <div className="relative h-24 overflow-hidden bg-primary-container text-on-primary-container md:h-28">
          <Sillons coin="bas-droite" opacite={0.12} className="absolute bottom-0 right-0 w-56" />
        </div>

        <div className="flex flex-col gap-6 px-5 pb-6 pt-4 md:flex-row md:items-end md:justify-between md:px-8">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
            <Avatar src={membre.photo_url} name={name} size="xl" className="relative -mt-12 size-24 ring-4 ring-surface-container-lowest" />
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h1 className="text-headline-sm font-bold text-on-surface md:text-headline-md">{name}</h1>
                {category && <Badge variant={categoryVariant(categorieBadge)}>{category}</Badge>}
                {typeOrg && <Badge variant="category">{typeOrg}</Badge>}
              </div>
              <ul className="flex flex-col gap-x-5 gap-y-1 text-body-md text-on-surface-variant sm:flex-row sm:flex-wrap">
                {(membre.specialite || (membre.organisation && membre.organisation !== name)) && (
                  <li className="flex items-start gap-1.5">
                    <Briefcase className="mt-1 size-4 shrink-0" aria-hidden />
                    <span>{[membre.specialite, membre.organisation && membre.organisation !== name ? membre.organisation : null].filter(Boolean).join(' · ')}</span>
                  </li>
                )}
                {place && (
                  <li className="flex items-center gap-1.5">
                    <MapPin className="size-4 shrink-0" aria-hidden />
                    <span>{place}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="w-full shrink-0 md:w-64">
            {estMoi ? (
              <Button variant="secondary" fullWidth href="/membres/profil/modifier">
                <Pencil className="size-5" aria-hidden />
                Modifier mon profil
              </Button>
            ) : (
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <ConnectionActions
                    principal
                    memberId={membre.id}
                    name={name}
                    state={state}
                    connectionId={fiche.connectionId}
                    ouvertContact={membre.ouvert_contact}
                    organisation={estOrganisation(membre.id, membre.categorie)}
                    suivi={fiche.suivi}
                  />
                </div>
                <MembreActionsMenu memberId={membre.id} name={name} />
              </div>
            )}
          </div>
        </div>
      </div>

      {fiche.state === 'pending_received' && fiche.noteInvitation && (
        <blockquote className="rounded-card border border-outline-variant border-l-4 border-l-primary bg-surface-container-low px-5 py-4">
          <p className="text-label-lg font-bold text-on-surface-variant">Note de {prenom} jointe à son invitation</p>
          <p className="mt-1 whitespace-pre-wrap break-words text-body-md text-on-surface">{fiche.noteInvitation}</p>
        </blockquote>
      )}

      <div className={aUnEncart ? 'grid gap-6 lg:grid-cols-[1fr_320px] lg:gap-8' : 'space-y-6'}>
        <div className="min-w-0 space-y-6">
          <Bloc id="fiche-apropos" titre="À propos" Icone={Sprout}>
            {membre.biographie ? (
              <p className="whitespace-pre-wrap text-body-lg leading-[1.8] text-on-surface-variant">{membre.biographie}</p>
            ) : (
              <p className="text-body-md text-on-surface-muted">Aucune biographie renseignée.</p>
            )}
          </Bloc>

          {aCommun && (
            <Bloc id="fiche-commun" titre="En commun avec vous" Icone={Heart}>
              <ul className="space-y-4">
                {communs?.specialite && communs.specialite.length > 0 && (
                  <Commun Icone={Briefcase} libelle="Métier proche">{communs.specialite.join(', ')}</Commun>
                )}
                {communs?.pays && (
                  <Commun Icone={MapPin} libelle="Lieu">{communs.ville ? `${communs.ville} (${communs.pays})` : communs.pays}</Commun>
                )}
                {communs && communs.thematiques.length > 0 && (
                  <Commun Icone={Tag} libelle={communs.thematiques.length > 1 ? 'Spécialités communes' : 'Spécialité commune'}>
                    <span className="mt-1 flex flex-wrap gap-1.5">
                      {communs.thematiques.map((t) => (
                        <Badge key={t} variant="category">{t}</Badge>
                      ))}
                    </span>
                  </Commun>
                )}
                {communs && communs.langues.length > 0 && (
                  <Commun Icone={Languages} libelle={communs.langues.length > 1 ? 'Langues communes' : 'Langue commune'}>{communs.langues.join(', ')}</Commun>
                )}
                {relationsCommunes.total > 0 && (
                  <Commun Icone={Users} libelle={relationsCommunes.total > 1 ? `${relationsCommunes.total} relations en commun` : '1 relation en commun'}>
                    {relationsCommunes.noms.map((r) => displayName(r)).join(', ')}
                    {autresRelations > 0 && ` et ${autresRelations} autre${autresRelations > 1 ? 's' : ''}`}
                  </Commun>
                )}
              </ul>
            </Bloc>
          )}

          {fiche.documents.length > 0 && (
            <Bloc id="fiche-contributions" titre="Contributions à la bibliothèque" Icone={FileText}>
              <ul className="space-y-2">
                {fiche.documents.map((doc) => (
                  <li key={doc.id}>
                    <Link
                      href={`/membres/bibliotheque/${doc.id}`}
                      className="ag-state flex min-h-12 items-start gap-3 rounded-control border border-outline-variant p-3 transition-colors duration-150 ease-standard hover:border-primary hover:bg-surface-container-low"
                    >
                      <FileText className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                      <span>
                        <span className="block text-label-lg font-bold text-on-surface">{doc.titre}</span>
                        {doc.type_doc && <span className="block text-body-sm capitalize text-on-surface-variant">{doc.type_doc.replaceAll('_', ' ')}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Bloc>
          )}
        </div>

        {aUnEncart && (
          <aside aria-label="Expertise, langues et liens" className="lg:sticky lg:top-6 lg:self-start">
            <div className="space-y-5 rounded-card border border-outline-variant bg-surface-container-lowest p-6">
              {membre.thematiques.length > 0 && (
                <Groupe titre="Spécialités">
                  {membre.thematiques.map((t) => (
                    <li key={t}><Badge variant="category">{t}</Badge></li>
                  ))}
                </Groupe>
              )}
              {membre.centres_interet.length > 0 && (
                <Groupe titre="Centres d’intérêt">
                  {membre.centres_interet.map((t) => (
                    <li key={t}><Badge variant="category">{t}</Badge></li>
                  ))}
                </Groupe>
              )}
              {membre.langues.length > 0 && (
                <Groupe titre="Langues">
                  {membre.langue_maternelle && (
                    <li><Badge variant="brand">{membre.langue_maternelle} · langue maternelle</Badge></li>
                  )}
                  {membre.langues.filter((l) => l !== membre.langue_maternelle).map((l) => (
                    <li key={l}><Badge variant="neutral">{l}</Badge></li>
                  ))}
                </Groupe>
              )}
              {aDesLiens && (
                <div>
                  <h2 className="text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Sur le web</h2>
                  {voitLiens ? (
                    <ul className="mt-1 space-y-1">
                      {linkedinUrl && (
                        <li>
                          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="ag-state flex min-h-11 items-center gap-2 rounded-control text-label-lg font-bold text-primary hover:underline">
                            <ExternalLink className="size-5" aria-hidden />
                            Profil LinkedIn
                            <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
                          </a>
                        </li>
                      )}
                      {siteWebUrl && (
                        <li>
                          <a href={siteWebUrl} target="_blank" rel="noopener noreferrer" className="ag-state flex min-h-11 items-center gap-2 rounded-control text-label-lg font-bold text-primary hover:underline">
                            <Globe className="size-5" aria-hidden />
                            Site internet
                            <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
                          </a>
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="mt-2 text-body-sm text-on-surface-variant">Les liens externes sont visibles par les relations de {prenom}.</p>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {proches.length > 0 && (
        <div role="region" aria-labelledby="fiche-proches" className="space-y-4 pt-4">
          <h2 id="fiche-proches" className="text-title-lg font-bold text-on-surface">
            Profils proches de {prenom}
          </h2>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">
            {proches.map((m) => (
              <MemberCard key={m.id} member={m} titreRaisons={`Points communs avec ${prenom}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
