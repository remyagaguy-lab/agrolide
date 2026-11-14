import type { CasChiffre } from './types'
import { poulet_togo } from './poulet-togo'
import { attieke_cote_d_ivoire } from './attieke-cote-d-ivoire'
import { maraichage_benin } from './maraichage-benin'
import { aquaculture_senegal } from './aquaculture-senegal'
import { mangue_sechee_benin } from './mangue-sechee-benin'
import { cacao_cote_d_ivoire } from './cacao-cote-d-ivoire'
import { mecanisation_burkina_faso } from './mecanisation-burkina-faso'
import { riz_irrigue_mali } from './riz-irrigue-mali'

/** Cas chiffrés complémentaires au cas fil rouge Diap Touré (calculés par scripts/modeles_bp/cas_chiffres.py). */
export const CAS_CHIFFRES: CasChiffre[] = [poulet_togo, attieke_cote_d_ivoire, maraichage_benin, aquaculture_senegal, mangue_sechee_benin, cacao_cote_d_ivoire, mecanisation_burkina_faso, riz_irrigue_mali]

export const trouverCas = (slug: string) => CAS_CHIFFRES.find((c) => c.slug === slug)
