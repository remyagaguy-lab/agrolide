/**
 * Normalisation de texte partagée par la recherche et les suggestions.
 * Sans accès base : importable côté client comme côté serveur.
 */

/**
 * Lettres accentuées repliées vers leur équivalent simple.
 * La même table sert à la recherche SQL (expression `replace(...)`) et au terme saisi : les deux côtés
 * se replient donc de la même façon, et « elevage » trouve « Élevage ».
 */
export const REPLIS: ReadonlyArray<readonly [string, string]> = [
  ['à', 'a'], ['á', 'a'], ['â', 'a'], ['ä', 'a'], ['ã', 'a'], ['À', 'a'], ['Á', 'a'], ['Â', 'a'], ['Ä', 'a'],
  ['é', 'e'], ['è', 'e'], ['ê', 'e'], ['ë', 'e'], ['É', 'e'], ['È', 'e'], ['Ê', 'e'], ['Ë', 'e'],
  ['î', 'i'], ['ï', 'i'], ['í', 'i'], ['Î', 'i'], ['Ï', 'i'], ['Í', 'i'],
  ['ô', 'o'], ['ö', 'o'], ['ó', 'o'], ['õ', 'o'], ['Ô', 'o'], ['Ö', 'o'], ['Ó', 'o'],
  ['ù', 'u'], ['û', 'u'], ['ü', 'u'], ['ú', 'u'], ['Ù', 'u'], ['Û', 'u'], ['Ü', 'u'], ['Ú', 'u'],
  ['ç', 'c'], ['Ç', 'c'], ['ñ', 'n'], ['Ñ', 'n'], ['ÿ', 'y'],
  ['œ', 'oe'], ['Œ', 'oe'], ['æ', 'ae'], ['Æ', 'ae'], ['’', "'"],
]

const TABLE = new Map(REPLIS)

/** Minuscules, sans accents, apostrophes droites, espaces simples. */
export function normaliser(texte: string | null | undefined): string {
  if (!texte) return ''
  let out = ''
  for (const ch of texte) out += TABLE.get(ch) ?? ch
  return out
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

const MOTS_VIDES = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'd', 'l', 'et', 'ou', 'en', 'au', 'aux', 'a', 'pour', 'par', 'sur',
  'dans', 'avec', 'sans', 'chez', 'the', 'and', 'of', 'for', 'in', 'to', 'sur', 'son', 'sa', 'ses', 'mon', 'ma', 'mes',
  'expert', 'experte', 'responsable', 'charge', 'chargee',
])

/** Radical grossier : retire le pluriel (s, x) des mots de plus de trois lettres. */
function racine(mot: string) {
  return mot.length > 3 && /[sx]$/.test(mot) ? mot.slice(0, -1) : mot
}

/**
 * Mots significatifs d'un texte libre (spécialité) : sans mots vides ni mots trop courts.
 * Renvoie une table radical normalisé → mot tel que la personne l'a écrit (accents conservés),
 * pour comparer sur le radical et afficher le mot d'origine.
 */
export function motsSignificatifs(texte: string | null | undefined): Map<string, string> {
  const out = new Map<string, string>()
  for (const original of (texte ?? '').split(/[^\p{L}\p{N}]+/u)) {
    const brut = normaliser(original)
    if (brut.length < 3 || MOTS_VIDES.has(brut)) continue
    const r = racine(brut)
    if (!out.has(r)) out.set(r, original.toLowerCase())
  }
  return out
}

/** Variantes d'écriture d'une lettre normalisée : elle-même, sa majuscule et toutes ses formes accentuées. */
const VARIANTES = (() => {
  const m = new Map<string, Set<string>>()
  for (const [de, vers] of REPLIS) {
    if (vers.length !== 1) continue // les ligatures (œ, æ) ne se replient pas en une lettre
    if (!m.has(vers)) m.set(vers, new Set([vers, vers.toUpperCase()]))
    m.get(vers)!.add(de)
  }
  return m
})()

/**
 * Motif SQLite `GLOB` (sensible à la casse, avec classes de caractères) qui retrouve le terme saisi
 * quelles que soient la casse et les accents du texte stocké : « elevage » trouve « Élevage », « ÉLEVAGE ».
 * Aucune fonction n'est appliquée aux colonnes : la recherche reste rapide et sans limite d'imbrication SQL.
 * Limite connue : les ligatures (œ, æ) ne se retrouvent pas avec leur écriture en deux lettres.
 */
export function motifGlob(terme: string): string {
  let out = '*'
  for (const ch of normaliser(terme)) {
    const variantes = VARIANTES.get(ch)
    if (variantes) out += `[${[...variantes].join('')}]`
    else if (ch === '*' || ch === '?' || ch === '[') out += `[${ch}]`
    else if (ch === "'") out += "['’]"
    else if (/[a-z]/i.test(ch)) out += `[${ch.toLowerCase()}${ch.toUpperCase()}]`
    else out += ch
  }
  return out + '*'
}
