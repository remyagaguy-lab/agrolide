import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'

import { NotebookPen, ChevronRight, ExternalLink } from "@/components/ui/icons"
export interface FormationCatalogue {
  id: string
  titre: string
  description: string | null
  thematique: string | null
  niveau: string | null
  prix_fcfa: number | null
  cover_image_url: string | null
  lien_externe: string | null
  source_externe: string | null
}

/** Carte d'une formation dans le catalogue (site public et espace membre : seul `href` change). */
export function CarteCatalogue({ formation, href }: { formation: FormationCatalogue; href: string }) {
  const isExternal = !!formation.lien_externe

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest shadow-sm transition-all duration-300 hover:border-primary hover:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container">
        {formation.cover_image_url ? (
          <Image
            src={formation.cover_image_url}
            alt={formation.titre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-success-container text-on-success-container">
            <NotebookPen size={24} className="opacity-20" />
          </div>
        )}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {formation.thematique ? (
            <Badge variant="category" className="max-w-[75%] truncate bg-surface-container-lowest/90 font-medium text-on-success-container backdrop-blur-sm">
              {formation.thematique}
            </Badge>
          ) : <span />}
          {isExternal && (
            <span className="shrink-0 rounded-full bg-surface-container-lowest/90 p-1.5 text-on-surface-variant backdrop-blur-sm" title="Formation d'un partenaire">
              <ExternalLink size={16} aria-hidden />
              <span className="sr-only">Formation d&apos;un partenaire</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {formation.niveau ? (
            <span className="inline-flex items-center gap-1.5 text-label-md font-bold text-primary">
              <NotebookPen size={16} aria-hidden />
              {formation.niveau}
            </span>
          ) : null}
          {isExternal && formation.source_externe && (
            <Badge variant="neutral" className="max-w-full truncate">
              {formation.source_externe}
            </Badge>
          )}
        </div>

        <h3 className="mb-2 line-clamp-3 text-title-lg font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
          {formation.titre}
        </h3>

        <p className="mb-5 line-clamp-3 flex-1 text-body-md text-on-surface-variant">{formation.description}</p>

        <div className="flex items-center justify-between gap-3 border-t border-outline-variant pt-4">
          <span className="font-bold text-on-surface">
            {formation.prix_fcfa === 0 ? 'Gratuit' : `${formation.prix_fcfa?.toLocaleString('fr-FR')} FCFA`}
          </span>
          <span className="flex items-center gap-1 rounded-control bg-primary px-4 py-2 text-label-lg font-medium text-on-primary transition-all group-hover:gap-2">
            {isExternal ? 'Accéder' : "S'inscrire"} <ChevronRight size={16} aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  )
}
