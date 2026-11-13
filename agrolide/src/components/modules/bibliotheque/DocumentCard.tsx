import Link from 'next/link'
import { Sillons } from '@/components/brand'
import { labelType, labelDomaine } from '@/lib/bibliotheque/taxonomie'

import { ArrowRight, Coins, FileText, Layers, Lock, PawPrint, Flower2, TreePine, Wheat, type LucideIcon } from "@/components/ui/icons"
export interface DocumentType {
  id: string
  titre: string
  auteurs: string
  type_doc: string
  annee?: number
  pays?: string
  nb_telechargements: number
  statut?: string
  created_at?: string
  acces?: string
  domaine?: string | null
  sous_domaine?: string | null
}

interface DocumentCardProps {
  document: DocumentType
  publicView?: boolean
}

/**
 * Un domaine = une teinte et un pictogramme : on reconnaît le sujet d'un document avant de lire son titre.
 * Couleurs par rôles du design system uniquement.
 */
export const DOMAINES_VISUELS: Record<string, { Icone: LucideIcon; fond: string }> = {
  production_vegetale: { Icone: Flower2, fond: 'bg-success-container text-on-success-container' },
  production_animale: { Icone: PawPrint, fond: 'bg-warning-container text-on-warning-container' },
  agroeconomie: { Icone: Coins, fond: 'bg-info-container text-on-info-container' },
  agroalimentaire: { Icone: Wheat, fond: 'bg-tertiary-container text-on-tertiary-container' },
  ressources_naturelles_environnement: { Icone: TreePine, fond: 'bg-primary-container text-on-primary-container' },
  transversal: { Icone: Layers, fond: 'bg-surface-container-high text-on-surface-variant' },
}
export const DOMAINE_PAR_DEFAUT = { Icone: FileText, fond: 'bg-surface-container-high text-on-surface-variant' }

export function DocumentCard({ document, publicView = false }: DocumentCardProps) {
  // Le visiteur reste sur le site public ; un membre reste dans son espace.
  const href = publicView ? `/bibliotheque/${document.id}` : `/membres/bibliotheque/${document.id}`
  // Sur le site public, on signale ce qui demande un compte ; un membre peut tout lire.
  const reserveAuxMembres = publicView && document.acces && document.acces !== 'public'
  const { Icone, fond } = (document.domaine && DOMAINES_VISUELS[document.domaine]) || DOMAINE_PAR_DEFAUT
  const repere = [document.annee, document.pays].filter(Boolean).join(' · ')
  const lectures = document.nb_telechargements || 0

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-outline-variant bg-surface-container-lowest transition-[border-color,box-shadow] duration-150 ease-standard hover:border-primary hover:shadow-elev-1"
    >
      {/* Couverture : teinte du domaine, pictogramme, sillons dans le coin (jamais sous un texte) */}
      <div className={`relative h-24 overflow-hidden ${fond}`}>
        <Sillons coin="bas-droite" opacite={0.12} className="absolute bottom-0 right-0 w-40" />
        <Icone className="absolute left-4 top-4 size-6" aria-hidden />
        <span className="absolute right-3 top-3 max-w-[60%] truncate rounded-full bg-surface-container-lowest/90 px-2.5 py-1 text-label-md font-medium text-on-surface">
          {labelType(document.type_doc)}
        </span>
        {reserveAuxMembres && (
          <span className="absolute bottom-3 left-4 inline-flex items-center gap-1 rounded-full bg-surface-container-lowest/90 px-2.5 py-1 text-label-md font-medium text-on-surface" title="Lecture réservée aux membres inscrits">
            <Lock className="size-4" aria-hidden /> Inscrits
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {document.domaine ? (
          <p className="text-label-md font-bold uppercase tracking-wider text-on-surface-variant">{labelDomaine(document.domaine)}</p>
        ) : null}
        <h3 className="mt-1 line-clamp-3 text-title-md font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
          {document.titre}
        </h3>
        <p className="mt-1 line-clamp-1 text-body-sm text-on-surface-variant">{document.auteurs || 'Auteur inconnu'}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-label-md text-on-surface-variant">
          <span className="truncate">
            {repere}
            {lectures >= 5 ? `${repere ? ' · ' : ''}${lectures} lectures` : ''}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 font-bold text-primary">
            Consulter <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  )
}
