import type { CasChiffre } from './types'
import { poulet_togo } from './poulet-togo'
import { attieke_cote_d_ivoire } from './attieke-cote-d-ivoire'
import { maraichage_benin } from './maraichage-benin'

/** Cas chiffrés complémentaires au cas fil rouge Diap Touré (calculés par scripts/modeles_bp/cas_chiffres.py). */
export const CAS_CHIFFRES: CasChiffre[] = [poulet_togo, attieke_cote_d_ivoire, maraichage_benin]

export const trouverCas = (slug: string) => CAS_CHIFFRES.find((c) => c.slug === slug)
