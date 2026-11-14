/**
 * Configuration unique de l'adhésion : période gratuite, ouverture du paiement et tarifs.
 * Aucun accès base ici : importable côté client comme côté serveur.
 *
 * Pour ouvrir le paiement plus tôt que prévu : passer PAIEMENT_COTISATION_ACTIF à true.
 * Pour décaler la fin de la gratuité : modifier FIN_ADHESION_GRATUITE (une seule ligne).
 * Tout le reste (page « Ma cotisation », bandeau d'expiration, page « Rejoindre », rappels automatiques)
 * se déduit de ces deux valeurs.
 */

/** Dernier jour de l'adhésion gratuite (inclus), au format AAAA-MM-JJ. Décision de l'équipe : 31 décembre 2027. */
export const FIN_ADHESION_GRATUITE = '2027-12-31'

/** Faux tant que le paiement de la cotisation n'est pas ouvert. Il s'ouvre de toute façon après FIN_ADHESION_GRATUITE. */
export const PAIEMENT_COTISATION_ACTIF = false

const MS_PAR_JOUR = 24 * 60 * 60 * 1000

/** Instant exact de la fin de la gratuité : fin de journée (UTC) du dernier jour gratuit. */
export const FIN_GRATUITE_INSTANT = new Date(`${FIN_ADHESION_GRATUITE}T23:59:59.999Z`)

/** « 31 décembre 2027 » (fuseau fixe pour que le serveur et le navigateur affichent la même date). */
export function formaterDate(valeur: string | Date): string {
  const d = typeof valeur === 'string' ? new Date(valeur.length <= 10 ? `${valeur}T00:00:00Z` : valeur) : valeur
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

export const DATE_FIN_GRATUITE_LISIBLE = formaterDate(FIN_ADHESION_GRATUITE)

/** Vrai pendant l'année gratuite : personne n'a de cotisation à payer. */
export function gratuiteEnCours(maintenant: Date = new Date()): boolean {
  return maintenant.getTime() <= FIN_GRATUITE_INSTANT.getTime()
}

/** Vrai quand le paiement doit être proposé : ouverture volontaire ou fin de la période gratuite. */
export function paiementOuvert(maintenant: Date = new Date()): boolean {
  return PAIEMENT_COTISATION_ACTIF || !gratuiteEnCours(maintenant)
}

export type CategorieAdhesion = 'passionne' | 'junior' | 'professionnel' | 'partenaire' | 'senior'

export const CATEGORIES_ADHESION: readonly CategorieAdhesion[] = ['passionne', 'junior', 'professionnel', 'partenaire', 'senior']

export const LIBELLES_CATEGORIE: Record<CategorieAdhesion, string> = {
  passionne: 'Passionné',
  junior: 'Junior / Étudiant',
  professionnel: 'Professionnel',
  partenaire: 'Partenaire',
  senior: 'Sénior',
}

export function estCategorie(valeur: unknown): valeur is CategorieAdhesion {
  return typeof valeur === 'string' && (CATEGORIES_ADHESION as readonly string[]).includes(valeur)
}

export function libelleCategorie(valeur: string | null | undefined): string {
  return estCategorie(valeur) ? LIBELLES_CATEGORIE[valeur] : valeur || 'Non renseignée'
}

/**
 * Tarifs indicatifs (FCFA) affichés tant que le paiement n'est pas ouvert : ce sont ceux de la page publique « Rejoindre ».
 * Passionné ne paie jamais. Le tarif mensuel est le dixième de l'annuel (« 2 mois offerts » en annuel).
 */
export const TARIFS_ANNUELS_FCFA: Record<CategorieAdhesion, number> = {
  passionne: 0,
  junior: 10000,
  professionnel: 25000,
  partenaire: 70000,
  senior: 45000,
}

export const tarifAnnuel = (categorie: string | null | undefined): number | null =>
  estCategorie(categorie) ? TARIFS_ANNUELS_FCFA[categorie] : null

export const tarifMensuel = (categorie: CategorieAdhesion): number => Math.round(TARIFS_ANNUELS_FCFA[categorie] / 10)

export const formaterFcfa = (montant: number): string => `${montant.toLocaleString('fr-FR')} FCFA`

/** Passionné est gratuit sans limite de durée : aucune échéance, aucun rappel, aucune expiration. */
export const categorieSansCotisation = (categorie: string | null | undefined, estOrganisation?: boolean | null): boolean => categorie === 'passionne' || !!estOrganisation

/** Nombre de jours calendaires (UTC) entre `depuis` et une échéance AAAA-MM-JJ ; négatif si l'échéance est passée. */
export function joursAvant(echeance: string, depuis: Date = new Date()): number {
  const fin = Date.UTC(+echeance.slice(0, 4), +echeance.slice(5, 7) - 1, +echeance.slice(8, 10))
  const debut = Date.UTC(depuis.getUTCFullYear(), depuis.getUTCMonth(), depuis.getUTCDate())
  return Math.round((fin - debut) / MS_PAR_JOUR)
}
