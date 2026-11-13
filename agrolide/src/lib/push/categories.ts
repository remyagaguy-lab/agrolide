/**
 * Catégories d'alertes push que le membre active ou non (par appareil).
 * Partagé par le serveur (choix de qui reçoit quoi) et par l'écran de réglage.
 */
export const CATEGORIES_PUSH = [
  { cle: 'messages', libelle: 'Messages', description: 'Quand un membre vous écrit.' },
  { cle: 'reseau', libelle: 'Réseau', description: 'Invitations reçues et invitations acceptées.' },
  { cle: 'opportunites', libelle: 'Opportunités', description: 'Nouvelles offres publiées, et suite donnée à celles que vous proposez.' },
  { cle: 'activite', libelle: 'Formations, événements et bibliothèque', description: 'Inscriptions, certificats, documents et échanges du forum.' },
  { cle: 'compte', libelle: 'Mon adhésion', description: 'Cotisation, statut du compte et changements de catégorie.' },
] as const

export type CategoriePush = (typeof CATEGORIES_PUSH)[number]['cle']

export const TOUTES_CATEGORIES: CategoriePush[] = CATEGORIES_PUSH.map((c) => c.cle)

/** Catégorie d'alerte correspondant au `type` d'une notification de la cloche. */
export function categorieDuType(type: string): CategoriePush {
  switch (type) {
    case 'message': return 'messages'
    case 'connexion': return 'reseau'
    case 'opportunite': return 'opportunites'
    case 'cotisation': return 'compte'
    default: return 'activite' // formation, evenement, document, forum…
  }
}

/** Ne garde que des catégories connues (sans doublon) ; la liste est enregistrée en une chaîne séparée par des virgules. */
export function normaliserCategories(valeur: unknown): CategoriePush[] {
  const liste = Array.isArray(valeur) ? valeur : typeof valeur === 'string' ? valeur.split(',') : []
  return TOUTES_CATEGORIES.filter((c) => liste.includes(c))
}

export const serialiserCategories = (liste: CategoriePush[]) => liste.join(',')
