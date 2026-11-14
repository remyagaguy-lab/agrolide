import type { Filiere } from './types'
import { elevage } from './elevage'
import { maraichage } from './maraichage'
import { aquaculture } from './aquaculture'
import { transformation } from './transformation'
import { culturesPerennes } from './cultures-perennes'

/** Modules par filière : optionnels, hors de la séquence de 23 leçons (aucun effet sur la progression ni sur le certificat). */
export const FILIERES: Filiere[] = [
  elevage,
  maraichage,
  aquaculture,
  transformation,
  culturesPerennes,
  {
    slug: 'services-agricoles',
    titre: 'Services agricoles',
    resume: "Mécanisation, stockage, intrants, logistique : vendre un service aux producteurs.",
    statut: 'a_venir',
    lecons: [],
    prevu: '30/04/2027',
  },
]

export const trouverFiliere = (slug: string) => FILIERES.find((f) => f.slug === slug)
