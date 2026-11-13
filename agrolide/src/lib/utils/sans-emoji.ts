/**
 * Aucun emoji sur le site (règle du propriétaire) : ce module nettoie les textes saisis (formulaires, éditeur d'admin)
 * avant leur écriture en base. Le garde-fou `npm run ds:check` ne voit que le code ; ceci couvre les données.
 */

// Pictogrammes emoji (hors © ® ™, qui sont du texte), sélecteurs de variante, liens de jointure, drapeaux, coches décoratives.
const EMOJI =
  /(?![©®™])(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|[✓✔✗✘★☆])(?:[️‍⃣]|\p{Emoji_Modifier}|\p{Extended_Pictographic})*[ \t]?/gu

/** Retire les emojis (et l'espace qui les suit) ; supprime les espaces laissés en fin de ligne. */
export function retirerEmojis(texte: string): string {
  if (!texte) return texte
  return texte.replace(EMOJI, '').replace(/[ \t]+$/gm, '')
}

/** Clés dont la valeur n'est jamais un texte rédigé (adresses, identifiants, dates) : laissées telles quelles. */
const CLES_TECHNIQUES = /(^|_)(id|url|lien|href|slug|email|mail|token|date|iso)(_|$)|Url$|Id$/i

/** Applique `retirerEmojis` aux champs texte d'un objet (récursif), sauf aux champs techniques. */
export function nettoyerTextes<T>(valeur: T, cle = ''): T {
  if (typeof valeur === 'string') return (CLES_TECHNIQUES.test(cle) ? valeur : retirerEmojis(valeur)) as T
  if (Array.isArray(valeur)) return valeur.map((v) => nettoyerTextes(v, cle)) as T
  if (valeur && typeof valeur === 'object' && Object.getPrototypeOf(valeur) === Object.prototype) {
    return Object.fromEntries(Object.entries(valeur).map(([k, v]) => [k, nettoyerTextes(v, k)])) as T
  }
  return valeur
}
