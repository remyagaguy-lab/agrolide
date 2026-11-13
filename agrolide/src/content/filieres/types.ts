export interface LeconFiliere {
  id: string
  titre: string
  duree_minutes: number
  contenu: string
}

/** Module de filière : optionnel, hors de la séquence obligatoire de leçons (ne touche pas à la progression ni au certificat). */
export interface Filiere {
  slug: string
  titre: string
  resume: string
  /** « disponible » : leçons publiées ; « a_venir » : seulement la date prévue. */
  statut: 'disponible' | 'a_venir'
  /** Date prévue de publication (JJ/MM/AAAA) pour les modules à venir. */
  prevu?: string
  /** Vide tant que le module est à venir. */
  lecons: LeconFiliere[]
  /** Cas chiffré (slug dans src/content/cas-chiffres). */
  casSlug?: string
  gabarit?: { libelle: string; url: string }
}
