import * as React from 'react'
import Link from 'next/link'
import { Sillons } from '@/components/brand'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { categorieAffichee, categorieLabel, displayName, typeOrganisationAffiche, type MemberSummary } from '@/lib/reseau/profil'
import { ConnectionActions } from './ConnectionActions'
import { estOrganisation } from '@/lib/suivi/organisation'

import { Check, MapPin } from "@/components/ui/icons"
const MAX_THEMES = 3

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

/**
 * Carte de membre : qui (photo, nom, catégorie), ce qu'il fait (spécialité, organisation, lieu, thématiques)
 * et un seul geste (Se connecter / Invitation envoyée / Accepter / Message).
 * Un seul lien principal (le nom) couvre toute la carte ; les boutons restent des cibles distinctes.
 */
export function MemberCard({
  member,
  onIgnore,
  libelleEnAttente,
  titreRaisons = 'Pourquoi cette suggestion',
}: {
  member: MemberSummary
  /** Fourni pour une suggestion : ajoute le bouton « Ignorer ». */
  onIgnore?: () => void
  libelleEnAttente?: string
  /** Titre de la liste de raisons (par défaut celui d'une suggestion). */
  titreRaisons?: string
}) {
  const name = displayName(member)
  const categorieBadge = categorieAffichee(member)
  const category = categorieLabel(categorieBadge)
  const typeOrg = typeOrganisationAffiche(member)
  const place = [member.ville, member.pays].filter(Boolean).join(', ')
  const headline = [member.specialite, member.organisation].filter(Boolean).join(' · ')
  const shown = member.thematiques.slice(0, MAX_THEMES)
  const rest = member.thematiques.length - shown.length

  return (
    // Conteneur de requête : dans une grille à deux colonnes sur téléphone (< 17 rem de large), la carte devient compacte
    // (photo, nom, métier, lieu, un geste) ; en pleine largeur ou sur grand écran, elle garde sa forme complète.
    <div className="@container h-full">
    <article className="relative flex h-full flex-col overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest transition-[border-color,box-shadow] duration-150 ease-standard hover:border-primary hover:shadow-elev-1">
      {/* Bandeau teinté : sillons dans le coin, la photo le chevauche */}
      <div aria-hidden className="relative h-14 shrink-0 overflow-hidden bg-primary-container text-on-primary-container @max-[17rem]:h-10">
        <Sillons coin="bas-droite" opacite={0.12} className="absolute bottom-0 right-0 w-32" />
      </div>
      <div className="flex flex-1 flex-col gap-4 px-5 pb-5 @max-[17rem]:gap-2 @max-[17rem]:px-3 @max-[17rem]:pb-3">
        <div className="-mt-8 flex items-end justify-between gap-3 @max-[17rem]:-mt-7">
          <Avatar src={member.photo_url} name={name} size="lg" className="relative size-16 ring-4 ring-surface-container-lowest @max-[17rem]:size-14" />
          {category && (
            <div className="mb-1 flex flex-wrap justify-end gap-1.5 @max-[17rem]:hidden">
              <Badge variant={categoryVariant(categorieBadge)}>{category}</Badge>
              {typeOrg && <Badge variant="category">{typeOrg}</Badge>}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="text-title-md font-bold text-on-surface @max-[17rem]:line-clamp-2 @max-[17rem]:break-words @max-[17rem]:text-label-lg">
            <Link
              href={`/membres/annuaire/${member.id}`}
              className="rounded-tag after:absolute after:inset-0 after:rounded-card focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-primary"
            >
              {name}
            </Link>
          </h3>
          {headline ? (
            <p className="mt-0.5 line-clamp-2 text-body-md text-on-surface-variant @max-[17rem]:line-clamp-1 @max-[17rem]:text-body-sm">{headline}</p>
          ) : (
            <p className="mt-0.5 text-body-md text-on-surface-muted @max-[17rem]:text-body-sm">Métier non renseigné</p>
          )}
          {place && (
            <p className="mt-1 flex items-center gap-1.5 text-body-sm text-on-surface-variant @max-[17rem]:text-label-sm">
              <MapPin className="size-4 shrink-0" aria-hidden />
              <span className="truncate">{place}</span>
            </p>
          )}
        </div>

        {shown.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 @max-[17rem]:hidden" aria-label={`Spécialités de ${name}`}>
            {shown.map((t) => (
              <li key={t}>
                <Badge variant="category">{t}</Badge>
              </li>
            ))}
            {rest > 0 && (
              <li>
                <Badge variant="category">+{rest}</Badge>
              </li>
            )}
          </ul>
        )}

      {member.state === 'pending_received' && member.note && (
        <blockquote className="rounded-control border-l-4 border-primary bg-surface-container px-3 py-2 @max-[17rem]:px-2 @max-[17rem]:py-1.5">
          <p className="text-label-md text-on-surface-variant @max-[17rem]:hidden">Note de {member.prenom?.trim() || name}</p>
          <p className="mt-0.5 whitespace-pre-wrap break-words text-body-sm text-on-surface @max-[17rem]:line-clamp-2 @max-[17rem]:text-label-sm">{member.note}</p>
        </blockquote>
      )}

      {member.raisons && member.raisons.length > 0 && (
        <div className="rounded-control bg-surface-container-low p-3 @max-[17rem]:hidden">
          <p className="text-label-md font-bold text-on-surface-variant">{titreRaisons}</p>
          <ul className="mt-1 space-y-1">
            {member.raisons.map((r) => (
              <li key={r} className="flex items-start gap-1.5 text-body-sm text-on-surface">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="relative z-10 mt-auto space-y-1">
        <ConnectionActions
          memberId={member.id}
          name={name}
          state={member.state}
          connectionId={member.connectionId}
          ouvertContact={member.ouvert_contact}
          libelleEnAttente={libelleEnAttente}
          organisation={estOrganisation(member.id, member.categorie)}
          suivi={member.suivi}
          alertes={member.alertes}
        />
        {onIgnore && (
          <Button variant="text" fullWidth onClick={onIgnore} aria-label={`Ignorer la suggestion : ${name}`}>
            Ignorer
          </Button>
        )}
      </div>
      </div>
    </article>
    </div>
  )
}
