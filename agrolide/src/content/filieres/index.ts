import type { Filiere } from './types'
import { elevage } from './elevage'
import { maraichage } from './maraichage'
import { aquaculture } from './aquaculture'
import { transformation } from './transformation'
import { culturesPerennes } from './cultures-perennes'
import { servicesAgricoles } from './services-agricoles'
import { financement } from './financement'
import { comptabiliteFiscalite } from './comptabilite-fiscalite'
import { impactConformite } from './impact-conformite'
import { culturesVivrieres } from './cultures-vivrieres'
import { prixSaisonnalite } from './prix-saisonnalite'

/** Modules par filière : optionnels, hors de la séquence de 23 leçons (aucun effet sur la progression ni sur le certificat). */
export const FILIERES: Filiere[] = [
  elevage,
  maraichage,
  culturesVivrieres,
  aquaculture,
  transformation,
  culturesPerennes,
  servicesAgricoles,
  financement,
  comptabiliteFiscalite,
  impactConformite,
  prixSaisonnalite,
]

export const trouverFiliere = (slug: string) => FILIERES.find((f) => f.slug === slug)
