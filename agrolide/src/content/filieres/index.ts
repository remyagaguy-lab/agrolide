import type { Filiere } from './types'
import { elevage } from './elevage'
import { maraichage } from './maraichage'
import { aquaculture } from './aquaculture'

/** Modules par filière : optionnels, hors de la séquence de 23 leçons (aucun effet sur la progression ni sur le certificat). */
export const FILIERES: Filiere[] = [
  elevage,
  maraichage,
  aquaculture,
  {
    slug: 'transformation',
    titre: 'Transformation et conditionnement',
    resume: "Huile, farine, gari, séchage, jus : de la matière première au produit vendu. Prolonge le cas attiéké.",
    statut: 'a_venir',
    lecons: [],
    prevu: '28/02/2027',
  },
  {
    slug: 'cultures-perennes',
    titre: 'Cultures pérennes et de rente',
    resume: "Anacarde, cacao, café, palmier : un horizon de 10 à 20 ans, un financement à long terme.",
    statut: 'a_venir',
    lecons: [],
    prevu: '31/03/2027',
  },
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
