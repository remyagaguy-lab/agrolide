import * as React from 'react'
import { MapPin } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import type { CartePublique } from '@/lib/reseau/carte-publique'

/** Carte vue par un visiteur sans compte (et dans l'aperçu « Voir comme un visiteur »). */
export function CartePubliqueView({ carte, titre = 'h1' }: { carte: CartePublique; titre?: 'h1' | 'h3' }) {
  const Titre = titre
  return (
    <article className="flex flex-col gap-4 rounded-card border border-outline-variant bg-surface-container-lowest p-6">
      <div className="flex items-start gap-4">
        <Avatar src={carte.photo_url} name={carte.nom} size="xl" />
        <div className="min-w-0 flex-1">
          <Titre className={titre === 'h1' ? 'text-headline-sm text-on-surface' : 'text-title-md text-on-surface'}>{carte.nom}</Titre>
          <p className={carte.specialite ? 'mt-0.5 text-body-md text-on-surface-variant' : 'mt-0.5 text-body-md text-on-surface-muted'}>
            {carte.specialite ?? 'Spécialité non renseignée'}
          </p>
          {carte.pays && (
            <p className="mt-1 flex items-center gap-1.5 text-body-sm text-on-surface-muted">
              <MapPin className="size-4 shrink-0" aria-hidden />
              {carte.pays}
            </p>
          )}
        </div>
      </div>
      {carte.thematiques.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label={`Thématiques de ${carte.nom}`}>
          {carte.thematiques.map((t) => (
            <li key={t}>
              <Badge variant="category">{t}</Badge>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
