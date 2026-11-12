/**
 * Règles de changement de catégorie d'un membre. Fonctions pures (aucun accès base) : importables partout et testables.
 *
 * Règles (validées par l'équipe) :
 *  - Partenaire et Sénior demandent toujours la validation d'un administrateur (ils donnent une vitrine entreprise / un badge « Expert »).
 *  - Pendant l'année gratuite, ou sans cotisation payée en cours, tout autre changement s'applique tout de suite, dans les deux sens.
 *  - Avec une cotisation payée en cours : une montée s'applique tout de suite avec régularisation du montant (prorata des jours restants) ;
 *    une baisse s'applique à la prochaine échéance (fin de la cotisation payée).
 *  - Quitter Partenaire ou Sénior est toujours libre (aucun droit supplémentaire n'est obtenu).
 */
import { estCategorie, joursAvant, tarifAnnuel, type CategorieAdhesion } from './adhesion'

/** Catégories qu'un membre ne peut pas s'attribuer seul. */
export const CATEGORIES_SOUS_VALIDATION: readonly CategorieAdhesion[] = ['partenaire', 'senior']

export const demandeValidation = (categorie: CategorieAdhesion): boolean => CATEGORIES_SOUS_VALIDATION.includes(categorie)

export type ModeChangement = 'identique' | 'immediat' | 'validation' | 'prochaine_echeance'

export interface EvaluationChangement {
  mode: ModeChangement
  /** Montant à régulariser (FCFA) quand une montée s'applique en cours de cotisation payée ; 0 sinon. */
  regularisationFcfa: number
  /** Date d'effet AAAA-MM-JJ d'un changement différé (mode `prochaine_echeance`). */
  effetLe: string | null
}

export interface EntreeChangement {
  actuelle: string | null | undefined
  demandee: CategorieAdhesion
  /** Fin (AAAA-MM-JJ ou ISO) de la cotisation payée en cours, ou null si aucune. */
  finCotisationPayee: string | null
  /** Vrai quand l'administrateur vient de valider la demande : la validation n'est alors plus réclamée. */
  dejaValide?: boolean
  maintenant?: Date
}

export function evaluerChangement({ actuelle, demandee, finCotisationPayee, dejaValide = false, maintenant = new Date() }: EntreeChangement): EvaluationChangement {
  const rien = { regularisationFcfa: 0, effetLe: null }
  if (actuelle === demandee) return { mode: 'identique', ...rien }
  if (demandeValidation(demandee) && !dejaValide) return { mode: 'validation', ...rien }

  const fin = finCotisationPayee ? finCotisationPayee.slice(0, 10) : null
  const joursRestants = fin ? joursAvant(fin, maintenant) : 0
  // Pas de cotisation payée en cours : gratuité ou abonnement échu, le changement est immédiat et sans régularisation.
  if (!fin || joursRestants <= 0) return { mode: 'immediat', ...rien }

  const tarifActuel = estCategorie(actuelle) ? tarifAnnuel(actuelle) ?? 0 : 0
  const tarifDemande = tarifAnnuel(demandee) ?? 0
  if (tarifDemande > tarifActuel) {
    const regularisationFcfa = Math.round(((tarifDemande - tarifActuel) * Math.min(joursRestants, 365)) / 365)
    return { mode: 'immediat', regularisationFcfa, effetLe: null }
  }
  return { mode: 'prochaine_echeance', regularisationFcfa: 0, effetLe: fin }
}
