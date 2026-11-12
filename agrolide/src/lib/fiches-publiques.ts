/**
 * Fiches publiques dont l'équivalent « utilisable » vit dans l'espace membre
 * (le public sert à découvrir, le membre sert à utiliser). Seules les fiches de détail sont concernées :
 * les listes (/formations, /annuaire…) restent publiques.
 */
const FICHE_PUBLIQUE = /^\/(formations|bibliotheque|evenements|annuaire)\/([^/]+)(\/lire)?\/?$/

/** URL membre équivalente à une fiche publique, ou null si ce n'en est pas une. */
export function ficheMembre(pathname: string): string | null {
  const m = FICHE_PUBLIQUE.exec(pathname)
  if (!m) return null
  const [, rubrique, id, lire] = m
  // Le mode lecture n'existe que pour la bibliothèque.
  if (lire && rubrique !== 'bibliotheque') return null
  return `/membres/${rubrique}/${id}${lire ?? ''}`
}
