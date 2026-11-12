import * as React from 'react'
import Link from 'next/link'
import { Check, MapPin } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { categorieLabel, displayName, type MemberSummary } from '@/lib/reseau/profil'
import { ConnectionActions } from './ConnectionActions'

const MAX_THEMES = 3

const categoryVariant = (c: string | null): BadgeVariant => {
  switch ((c ?? '').toLowerCase()) {
    case 'junior': return 'junior'
    case 'professionnel': return 'professionnel'
    case 'partenaire': return 'partenaire'
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
  const category = categorieLabel(member.categorie)
  const place = [member.ville, member.pays].filter(Boolean).join(', ')
  const headline = [member.specialite, member.organisation].filter(Boolean).join(' · ')
  const shown = member.thematiques.slice(0, MAX_THEMES)
  const rest = member.thematiques.length - shown.length

  return (
    <article className="relative flex h-full flex-col gap-4 rounded-card border border-outline-variant bg-surface-container-lowest p-5 transition-[border-color,box-shadow] duration-150 ease-standard hover:border-outline hover:shadow-elev-1">
      <div className="flex items-start gap-4">
        <Avatar src={member.photo_url} name={name} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="text-title-md text-on-surface">
            <Link
              href={`/annuaire/${member.id}`}
              className="rounded-tag after:absolute after:inset-0 after:rounded-card focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-primary"
            >
              {name}
            </Link>
          </h3>
          {headline ? (
            <p className="mt-0.5 line-clamp-2 text-body-sm text-on-surface-variant">{headline}</p>
          ) : (
            <p className="mt-0.5 text-body-sm text-on-surface-muted">Spécialité non renseignée</p>
          )}
          {place && (
            <p className="mt-1 flex items-center gap-1.5 text-body-sm text-on-surface-muted">
              <MapPin className="size-4 shrink-0" aria-hidden />
              <span className="truncate">{place}</span>
            </p>
          )}
        </div>
      </div>

      {(category || shown.length > 0) && (
        <ul className="flex flex-wrap gap-1.5" aria-label={`Profil de ${name}`}>
          {category && (
            <li>
              <Badge variant={categoryVariant(member.categorie)}>{category}</Badge>
            </li>
          )}
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
        <blockquote className="rounded-control border-l-4 border-primary bg-surface-container px-3 py-2">
          <p className="text-label-md text-on-surface-variant">Note de {member.prenom?.trim() || name}</p>
          <p className="mt-0.5 whitespace-pre-wrap break-words text-body-sm text-on-surface">{member.note}</p>
        </blockquote>
      )}

      {member.raisons && member.raisons.length > 0 && (
        <div>
          <p className="text-label-md text-on-surface-variant">{titreRaisons}</p>
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
        />
        {onIgnore && (
          <Button variant="text" fullWidth onClick={onIgnore} aria-label={`Ignorer la suggestion : ${name}`}>
            Ignorer
          </Button>
        )}
      </div>
    </article>
  )
}
