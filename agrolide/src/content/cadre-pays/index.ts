import type { FichePays } from './types'
import { togo } from './togo'
import { benin } from './benin'
import { cote_d_ivoire } from './cote-d-ivoire'
import { senegal } from './senegal'
import { burkina_faso } from './burkina-faso'
import { mali } from './mali'
import { niger } from './niger'
import { ghana } from './ghana'
import { nigeria } from './nigeria'

const aVenir = (slug: string, nom: string, devise: string, resume: string, prevuLe: string): FichePays => ({
  slug, nom, devise, resume, prevuLe, disponible: false, verifieLe: '', prochaineRevision: '', contenu: '',
})

/** Plan de publication : Togo d'abord (projet mené au Togo), puis Bénin, Côte d'Ivoire, Sénégal, puis le Burkina Faso, le Mali et le Niger, puis le Ghana et le Nigeria (publiés le 14/11/2026, moins détaillés). */
export const FICHES_PAYS: FichePays[] = [
  togo,
  benin,
  cote_d_ivoire,
  senegal,
  burkina_faso,
  mali,
  niger,
  ghana,
  nigeria,
]

export const trouverFiche = (slug: string) => FICHES_PAYS.find((f) => f.slug === slug)
