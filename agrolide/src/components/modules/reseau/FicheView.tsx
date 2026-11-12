import Breadcrumb from '@/components/ui/Breadcrumb'
import React from 'react'
import Link from 'next/link'
import { Briefcase, ExternalLink, FileText, Globe, MapPin, Pencil } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { categorieLabel, displayName, safeExternalUrl } from '@/lib/reseau/profil'
import type { Fiche } from '@/lib/reseau/fiche'
import { ConnectionActions } from './ConnectionActions'
import { MembreActionsMenu } from './MembreActionsMenu'
import { MemberCard } from './MemberCard'

const categoryVariant = (c: string | null): BadgeVariant => {
  switch ((c ?? '').toLowerCase()) {
    case 'junior': return 'junior'
    case 'professionnel': return 'professionnel'
    case 'partenaire': return 'partenaire'
    case 'senior': return 'senior'
    default: return 'neutral'
  }
}

function Bloc({ id, titre, children }: { id: string; titre: string; children: React.ReactNode }) {
  return (
    <Card role="region" aria-labelledby={id} className="space-y-3">
      <h2 id={id} className="text-title-lg text-on-surface">
        {titre}
      </h2>
      {children}
    </Card>
  )
}

/** Fiche d'un membre vue par un autre membre connecté (ou par lui-même). Aucune donnée de contact. */
export function FicheView({ fiche }: { fiche: Fiche }) {
  const { membre, estMoi, state, communs, relationsCommunes, proches } = fiche
  const name = displayName(membre)
  const prenom = membre.prenom?.trim() || name
  const category = categorieLabel(membre.categorie)
  const place = [membre.ville, membre.pays].filter(Boolean).join(', ')

  // Liens externes : visibles par le propriétaire et par ses relations seulement (règles de visibilité, §6.2).
  const linkedinUrl = safeExternalUrl(membre.linkedin_url)
  const siteWebUrl = safeExternalUrl(membre.site_web_url)
  const aDesLiens = Boolean(linkedinUrl || siteWebUrl)
  const voitLiens = estMoi || state === 'accepted'

  const aCommun = Boolean(communs) || relationsCommunes.total > 0

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 md:py-8">
      <Breadcrumb jsonLd={false} className="mb-0" items={[{ label: 'Annuaire', href: '/membres/annuaire' }, { label: name }]} />

      <Card role="region" aria-label={`Profil de ${name}`} className="p-5 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
            <Avatar src={membre.photo_url} name={name} size="xl" />
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h1 className="text-headline-sm text-on-surface">{name}</h1>
                {category && <Badge variant={categoryVariant(membre.categorie)}>{category}</Badge>}
              </div>
              {(membre.specialite || membre.organisation) && (
                <p className="flex items-start gap-2 text-body-md text-on-surface-variant">
                  <Briefcase className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>{[membre.specialite, membre.organisation].filter(Boolean).join(' · ')}</span>
                </p>
              )}
              {place && (
                <p className="flex items-center gap-2 text-body-md text-on-surface-variant">
                  <MapPin className="size-4 shrink-0" aria-hidden />
                  <span>{place}</span>
                </p>
              )}
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
                    memberId={membre.id}
                    name={name}
                    state={state}
                    connectionId={fiche.connectionId}
                    ouvertContact={membre.ouvert_contact}
                  />
                </div>
                <MembreActionsMenu memberId={membre.id} name={name} />
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Bloc id="fiche-apropos" titre="À propos">
            {membre.biographie ? (
              <p className="whitespace-pre-wrap text-body-md text-on-surface-variant">{membre.biographie}</p>
            ) : (
              <p className="text-body-md text-on-surface-muted">Aucune biographie renseignée.</p>
            )}
          </Bloc>

          {aCommun && (
            <Bloc id="fiche-commun" titre="En commun avec vous">
              <ul className="space-y-3 text-body-md text-on-surface">
                {communs?.specialite && communs.specialite.length > 0 && (
                  <li>
                    <span className="text-label-lg text-on-surface-variant">Spécialité proche : </span>
                    {communs.specialite.join(', ')}
                  </li>
                )}
                {communs?.pays && (
                  <li>
                    <span className="text-label-lg text-on-surface-variant">Lieu : </span>
                    {communs.ville ? `${communs.ville} (${communs.pays})` : communs.pays}
                  </li>
                )}
                {communs && communs.thematiques.length > 0 && (
                  <li>
                    <span className="text-label-lg text-on-surface-variant">{communs.thematiques.length > 1 ? 'Thématiques communes' : 'Thématique commune'} : </span>
                    <span className="inline-flex flex-wrap gap-1.5 align-middle">
                      {communs.thematiques.map((t) => (
                        <Badge key={t} variant="category">{t}</Badge>
                      ))}
                    </span>
                  </li>
                )}
                {communs && communs.langues.length > 0 && (
                  <li>
                    <span className="text-label-lg text-on-surface-variant">{communs.langues.length > 1 ? 'Langues communes' : 'Langue commune'} : </span>
                    {communs.langues.join(', ')}
                  </li>
                )}
                {relationsCommunes.total > 0 && (
                  <li>
                    <span className="text-label-lg text-on-surface-variant">
                      {relationsCommunes.total} {relationsCommunes.total > 1 ? 'relations en commun' : 'relation en commun'} :{' '}
                    </span>
                    {relationsCommunes.noms.map((r) => displayName(r)).join(', ')}
                    {relationsCommunes.total > relationsCommunes.noms.length && ` et ${relationsCommunes.total - relationsCommunes.noms.length} autre${relationsCommunes.total - relationsCommunes.noms.length > 1 ? 's' : ''}`}
                  </li>
                )}
              </ul>
            </Bloc>
          )}

          {fiche.documents.length > 0 && (
            <Bloc id="fiche-contributions" titre="Contributions à la bibliothèque">
              <ul className="space-y-2">
                {fiche.documents.map((doc) => (
                  <li key={doc.id}>
                    <Link
                      href={`/bibliotheque/${doc.id}`}
                      className="ag-state flex min-h-12 items-start gap-3 rounded-control border border-outline-variant p-3 transition-colors duration-150 ease-standard hover:bg-surface-container-low"
                    >
                      <FileText className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                      <span>
                        <span className="block text-label-lg text-on-surface">{doc.titre}</span>
                        {doc.type_doc && <span className="block text-body-sm capitalize text-on-surface-muted">{doc.type_doc.replaceAll('_', ' ')}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Bloc>
          )}
        </div>

        <div className="space-y-6">
          {(membre.thematiques.length > 0 || membre.langues.length > 0 || aDesLiens) && (
            <Card role="region" aria-label="Expertise, langues et liens" className="space-y-5">
              {membre.thematiques.length > 0 && (
                <div>
                  <h2 className="text-label-lg text-on-surface-variant">Thématiques</h2>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {membre.thematiques.map((t) => (
                      <li key={t}><Badge variant="category">{t}</Badge></li>
                    ))}
                  </ul>
                </div>
              )}
              {membre.langues.length > 0 && (
                <div>
                  <h2 className="text-label-lg text-on-surface-variant">Langues</h2>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {membre.langues.map((l) => (
                      <li key={l}><Badge variant="neutral">{l}</Badge></li>
                    ))}
                  </ul>
                </div>
              )}
              {aDesLiens && (
                <div>
                  <h2 className="text-label-lg text-on-surface-variant">Sur le web</h2>
                  {voitLiens ? (
                    <ul className="mt-2 space-y-1">
                      {linkedinUrl && (
                        <li>
                          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="ag-state flex min-h-12 items-center gap-2 rounded-control px-2 text-label-lg text-primary hover:underline">
                            <ExternalLink className="size-5" aria-hidden />
                            Profil LinkedIn
                            <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
                          </a>
                        </li>
                      )}
                      {siteWebUrl && (
                        <li>
                          <a href={siteWebUrl} target="_blank" rel="noopener noreferrer" className="ag-state flex min-h-12 items-center gap-2 rounded-control px-2 text-label-lg text-primary hover:underline">
                            <Globe className="size-5" aria-hidden />
                            Site internet
                            <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
                          </a>
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="mt-2 text-body-sm text-on-surface-muted">Les liens externes sont visibles par les relations de {prenom}.</p>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {proches.length > 0 && (
        <div role="region" aria-labelledby="fiche-proches" className="space-y-4">
          <h2 id="fiche-proches" className="text-title-lg text-on-surface">
            Profils proches de {prenom}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {proches.map((m) => (
              <MemberCard key={m.id} member={m} titreRaisons={`Points communs avec ${prenom}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
