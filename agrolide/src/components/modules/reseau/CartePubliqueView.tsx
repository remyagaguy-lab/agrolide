import * as React from 'react'
import { Sillons } from '@/components/brand'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import type { CartePublique } from '@/lib/reseau/carte-publique'

import { MapPin } from "@/components/ui/icons"
/** Carte vue par un visiteur sans compte (et dans l'aperçu « Voir comme un visiteur »). Ni e-mail ni téléphone. */
export function CartePubliqueView({ carte, titre = 'h1' }: { carte: CartePublique; titre?: 'h1' | 'h3' }) {
  const Titre = titre
  const grande = titre === 'h1'
  return (
    <article className="overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest">
      <div className={`relative overflow-hidden bg-primary-container text-on-primary-container ${grande ? 'h-20' : 'h-14'}`}>
        <Sillons coin="bas-droite" opacite={0.12} className="absolute bottom-0 right-0 w-44" />
      </div>
      <div className="flex flex-col gap-4 px-6 pb-6">
        <Avatar src={carte.photo_url} name={carte.nom} size="xl" className={`relative -mt-10 ring-4 ring-surface-container-lowest ${grande ? 'size-24' : ''}`} />
        <div className="min-w-0">
          <Titre className={grande ? 'text-headline-sm font-bold text-on-surface md:text-headline-md' : 'text-title-md font-bold text-on-surface'}>{carte.nom}</Titre>
          <p className={carte.specialite ? 'mt-1 text-body-md text-on-surface-variant' : 'mt-1 text-body-md text-on-surface-muted'}>
            {carte.specialite ?? 'Métier non renseigné'}
          </p>
          {carte.pays && (
            <p className="mt-1 flex items-center gap-1.5 text-body-md text-on-surface-variant">
              <MapPin className="size-4 shrink-0" aria-hidden />
              {carte.pays}
            </p>
          )}
        </div>
        {carte.thematiques.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label={`Spécialités de ${carte.nom}`}>
            {carte.thematiques.map((t) => (
              <li key={t}>
                <Badge variant="category">{t}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
