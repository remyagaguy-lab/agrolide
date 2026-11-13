import type { FichePays } from './types'
import { togo } from './togo'

const aVenir = (slug: string, nom: string, devise: string, resume: string, prevuLe: string): FichePays => ({
  slug, nom, devise, resume, prevuLe, disponible: false, verifieLe: '', prochaineRevision: '', contenu: '',
})

/** Plan de publication : Togo d'abord (projet mené au Togo), puis Bénin, Côte d'Ivoire, Sénégal, puis le Sahel ; Ghana et Nigeria en anglais ensuite. */
export const FICHES_PAYS: FichePays[] = [
  togo,
  aVenir('benin', 'Bénin', 'FCFA', 'Code foncier et domanial, IFU, FNDA, garanties et financeurs.', '2026-12-11'),
  aVenir('cote-d-ivoire', "Côte d'Ivoire", 'FCFA', 'Domaine foncier rural et certificat foncier, numéro de compte contribuable, FIRCA, ANADER.', '2026-12-18'),
  aVenir('senegal', 'Sénégal', 'FCFA', 'Domaine national, NINEA, SUARL, FONGIP, DER/FJ, BNDE, La Banque Agricole.', '2027-01-08'),
  aVenir('burkina-faso', 'Burkina Faso', 'FCFA', 'Réforme agraire et foncière, IFU, financeurs.', '2027-01-29'),
  aVenir('mali', 'Mali', 'FCFA', 'Foncier agricole, NIF, BNDA, financeurs.', '2027-02-19'),
  aVenir('niger', 'Niger', 'FCFA', 'Foncier rural, NIF, BAGRI, financeurs.', '2027-02-19'),
]

export const trouverFiche = (slug: string) => FICHES_PAYS.find((f) => f.slug === slug)
