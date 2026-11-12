import * as React from 'react'
import { ArchPhoto, Arche, Motif } from '@/components/brand'
import Breadcrumb, { type BreadcrumbItem } from './Breadcrumb'
import { cn } from '@/lib/utils/formatters'


export interface DetailHeroProps {
  /** Rubrique de la fiche (« Formation », « Événement »…). */
  label?: string
  /** Titre de la fiche : le seul <h1>. */
  title: React.ReactNode
  /** Visuel de la fiche (couverture) : affiché à travers l'arche de la marque. Sans visuel : arche pleine en filigrane. */
  image?: { src: string; alt: string } | null
  breadcrumb?: BreadcrumbItem[]
  className?: string
  /** Pastilles et informations clés sous le titre. */
  children?: React.ReactNode
}

/**
 * En-tête d'une fiche de détail (formation, événement, membre…) : bandeau vert profond, motif discret,
 * titre à gauche et visuel vu à travers l'arche à droite (l'arche repose sur le bord bas du bandeau, comme au héros de l'accueil).
 * Une seule photo en arche par écran : ce composant est le visuel fort de la fiche.
 */
export function DetailHero({ label, title, image, breadcrumb, className, children }: DetailHeroProps) {
  return (
    <section className={cn('relative overflow-hidden bg-surface-brand pt-8 text-on-surface-brand md:pt-12', className)}>
      <Motif size={800} opacity={0.05} className="text-on-surface-brand" />
      <div className="container relative z-10">
        {breadcrumb && <Breadcrumb items={breadcrumb} tone="dark" />}
        <div className="grid items-end gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)] md:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)]">
          <div className="pb-4 md:pb-16">
            {label && <p className="mb-3 text-label-md uppercase tracking-[0.12em] text-accent-sun">{label}</p>}
            <h1 className="text-headline-lg text-balance">{title}</h1>
            {children && <div className="mt-5 flex flex-wrap items-center gap-3">{children}</div>}
          </div>
          {image ? (
            <ArchPhoto
              src={image.src}
              alt={image.alt}
              className="mx-auto w-full max-w-[420px] text-on-surface-brand md:mx-0 md:max-w-none md:translate-y-px"
            />
          ) : (
            <Arche variant="plein" className="mx-auto hidden w-full max-w-[420px] text-on-surface-brand/10 md:block md:max-w-none md:translate-y-px" />
          )}
        </div>
      </div>
    </section>
  )
}
