/** Fiche « Cadre pays » du parcours Business plan agricole : texte en Markdown, date de vérification, prochaine révision. */
export interface FichePays {
  slug: string
  nom: string
  devise: string
  /** Date de dernière vérification sur le web (AAAA-MM-JJ). */
  verifieLe: string
  /** Date limite de la prochaine révision (AAAA-MM-JJ). */
  prochaineRevision: string
  /** false = fiche annoncée mais pas encore rédigée. */
  disponible: boolean
  resume: string
  contenu: string
  /** Pour les fiches non disponibles : date prévue de publication. */
  prevuLe?: string
}
