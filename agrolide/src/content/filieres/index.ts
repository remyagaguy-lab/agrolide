import type { Filiere } from './types'
import { elevage } from './elevage'
import { maraichage } from './maraichage'
import { aquaculture } from './aquaculture'
import { transformation } from './transformation'
import { culturesPerennes } from './cultures-perennes'
import { servicesAgricoles } from './services-agricoles'
import { financement } from './financement'

/** Modules par filière : optionnels, hors de la séquence de 23 leçons (aucun effet sur la progression ni sur le certificat). */
export const FILIERES: Filiere[] = [
  elevage,
  maraichage,
  aquaculture,
  transformation,
  culturesPerennes,
  servicesAgricoles,
  financement,
]

export const trouverFiliere = (slug: string) => FILIERES.find((f) => f.slug === slug)
