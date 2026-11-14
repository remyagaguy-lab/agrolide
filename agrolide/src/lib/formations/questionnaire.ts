/** Questionnaire d'inscription aux formations Agrolide : questions, limites et validation (pures, partagées client et serveur). */

export const PROJETS = [
  { valeur: 'oui', libelle: 'Oui, j’ai un projet en cours' },
  { valeur: 'idee', libelle: 'J’ai une idée, pas encore lancée' },
  { valeur: 'non', libelle: 'Non, je me forme d’abord' },
] as const

export const DOMAINES = [
  'Cultures vivrières',
  'Maraîchage',
  'Cultures de rente',
  'Élevage',
  'Aviculture',
  'Pisciculture',
  'Transformation agroalimentaire',
  'Commercialisation et distribution',
  'Services et agro-technologies',
  'Autre',
] as const

export const LONGUEUR_MIN = 10
export const LONGUEUR_MAX = 600

export interface Reponses {
  projet: string
  domaine: string
  objectif: string
  attentes: string
}

export type ResultatReponses = { ok: true; reponses: Reponses } | { ok: false; erreur: string }

const nettoyer = (v: unknown) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '')

/** Valide les réponses reçues (jamais de confiance au navigateur) et renvoie une version nettoyée. */
export function validerReponses(entree: unknown): ResultatReponses {
  const e = (entree && typeof entree === 'object' ? entree : {}) as Record<string, unknown>
  const projet = nettoyer(e.projet)
  const domaine = nettoyer(e.domaine)
  const objectif = nettoyer(e.objectif)
  const attentes = nettoyer(e.attentes)

  if (!PROJETS.some((p) => p.valeur === projet)) return { ok: false, erreur: 'Dites-nous si vous avez un projet.' }
  if (!(DOMAINES as readonly string[]).includes(domaine)) return { ok: false, erreur: 'Choisissez le domaine de votre projet.' }
  if (objectif.length < LONGUEUR_MIN) return { ok: false, erreur: 'Décrivez votre objectif en quelques mots (10 caractères au minimum).' }
  if (attentes.length < LONGUEUR_MIN) return { ok: false, erreur: 'Décrivez vos attentes en quelques mots (10 caractères au minimum).' }
  if (objectif.length > LONGUEUR_MAX || attentes.length > LONGUEUR_MAX) return { ok: false, erreur: `Vos réponses sont limitées à ${LONGUEUR_MAX} caractères.` }
  return { ok: true, reponses: { projet, domaine, objectif, attentes } }
}
