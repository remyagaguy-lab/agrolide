import type { FichePays } from './types'
import { togo } from './togo'
import { benin } from './benin'
import { cote_d_ivoire } from './cote-d-ivoire'
import { senegal } from './senegal'

const aVenir = (slug: string, nom: string, devise: string, resume: string, prevuLe: string): FichePays => ({
  slug, nom, devise, resume, prevuLe, disponible: false, verifieLe: '', prochaineRevision: '', contenu: '',
})

/** Plan de publication : Togo d'abord (projet mené au Togo), puis Bénin, Côte d'Ivoire, Sénégal, puis le Sahel ; Ghana et Nigeria en anglais ensuite. */
export const FICHES_PAYS: FichePays[] = [
  togo,
  benin,
  cote_d_ivoire,
  senegal,
  aVenir('burkina-faso', 'Burkina Faso', 'FCFA', 'Réforme agraire et foncière, IFU, financeurs.', '2027-01-29'),
  aVenir('mali', 'Mali', 'FCFA', 'Foncier agricole, NIF, BNDA, financeurs.', '2027-02-19'),
  aVenir('niger', 'Niger', 'FCFA', 'Foncier rural, NIF, BAGRI, financeurs.', '2027-02-19'),
]

export const trouverFiche = (slug: string) => FICHES_PAYS.find((f) => f.slug === slug)
