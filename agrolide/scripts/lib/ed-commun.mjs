/**
 * Outils communs des garde-fous éditoriaux (ed:valider, ed:sources, ed:eval, ed:sync).
 * Sans dépendance : Node seul. Les valeurs autorisées viennent de la charte (editorial/charte/) et de la taxonomie du site.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, relative } from 'node:path'
import { execFileSync } from 'node:child_process'

export const appRoot = resolve(import.meta.dirname, '..', '..')
export const edDir = join(appRoot, 'editorial')

/* ------------------------------------------------------------------ valeurs autorisées */

export const STATUTS_CADRAGE = ['cadrage']
export const STATUTS_ARTICLE = ['redaction', 'valide', 'publie']
export const REGISTRES = ['Terrain', 'Parcours', 'Expertise', 'Partenariat']
export const NIVEAUX = ['initiation', 'intermediaire', 'expert']
export const OBJECTIFS = ['Fédérer', 'Crédibiliser', 'Mobiliser', 'Insérer et accompagner']
export const PILIERS = ['Réseau et communauté', 'Formation et savoirs', 'Entrepreneuriat agricole', 'Recherche et plaidoyer']
export const CATEGORIES = ['Agrobusiness', 'Agroeconomie', 'Agroalimentaire', 'Agroinnovation', 'Production Végétal', 'Production Animal']

/** Publics de contenu (06-publics-et-registres.md) et registre dont ils relèvent. */
export const PUBLICS = {
  producteur: 'Terrain',
  technicien_conseiller: 'Terrain',
  etudiant: 'Parcours',
  entrepreneur_porteur_projet: 'Parcours',
  enseignant_chercheur: 'Expertise',
  decideur_institution: 'Partenariat',
}
/** Registres admis par public. Expertise accepte aussi le technicien (« professionnels du métier », 06-publics-et-registres.md). */
export const REGISTRES_PAR_PUBLIC = {
  producteur: ['Terrain'],
  technicien_conseiller: ['Terrain', 'Expertise'],
  etudiant: ['Parcours'],
  entrepreneur_porteur_projet: ['Parcours'],
  enseignant_chercheur: ['Expertise'],
  decideur_institution: ['Partenariat'],
}
/** Longueur du texte courant, en mots (06-publics-et-registres.md, 00-decisions.md). */
export const LONGUEURS = {
  Terrain: [400, 800],
  Parcours: [800, 1500],
  Expertise: [1000, 1800],
  Partenariat: [600, 1200],
}

/** Domaines et sous-domaines : lus dans la taxonomie du site, jamais recopiés. */
export function lireTaxonomie() {
  const src = readFileSync(join(appRoot, 'src', 'lib', 'bibliotheque', 'taxonomie.ts'), 'utf8')
  const m = src.match(/export const DOMAINES[^=]*=\s*(\[[\s\S]*?\n\])\s*\n/)
  if (!m) throw new Error('taxonomie.ts : bloc DOMAINES introuvable')
  const domaines = JSON.parse(m[1])
  return Object.fromEntries(domaines.map((d) => [d.code, d.sousDomaines.map((s) => s.code)]))
}

/** Verbes d'appel à l'action du tableau de `09-objectifs-et-cta.md` (forme impérative). */
export const VERBES_CTA = [
  'Rejoignez',
  'Devenez',
  'Inscrivez-vous',
  'Participez',
  'Téléchargez',
  'Consultez',
  'Découvrez',
  'Contribuez',
  'Répondez',
  'Candidatez',
  'Réservez',
  'Soutenez',
]

/* ------------------------------------------------------------------ lecture d'un contenu */

/** Sépare l'en-tête (clé: valeur) du corps. Retourne null pour l'en-tête s'il est absent. */
export function lireContenu(chemin) {
  const brut = readFileSync(chemin, 'utf8').replace(/\r\n/g, '\n')
  const m = brut.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!m) return { brut, entete: null, corps: brut, lignesEntete: 0 }
  const entete = {}
  for (const l of m[1].split('\n')) {
    const i = l.indexOf(':')
    if (i < 0) continue
    entete[l.slice(0, i).trim()] = l.slice(i + 1).trim()
  }
  return { brut, entete, corps: m[2], lignesEntete: m[1].split('\n').length + 2 }
}

const RE_SOURCES = /\n\s*(Sources|D'où ça vient)\s:\s*\n/
const RE_LIEN_INTERNE = /^\[(.+?) → (\/[^\]\s]+)\]$/

/** Découpe un article en parties : titre, chapô, paragraphes, intertitres, bloc de sources. */
export function analyserCorps(corps) {
  const texte = corps.trim()
  const titre = texte.match(/^# (.+)$/m)?.[1] ?? null
  const sansTitre = texte.replace(/^# .+\n+/, '')
  const marque = sansTitre.match(RE_SOURCES)
  const parts = marque ? sansTitre.split(RE_SOURCES) : [sansTitre]
  const avant = parts[0]
  const sources = marque ? parts[2] : ''
  const paragraphes = avant.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  const intertitres = paragraphes.filter((p) => /^## /.test(p)).map((p) => p.replace(/^## /, ''))
  const chapo = paragraphes.find((p) => !/^#/.test(p)) ?? ''
  const prose = paragraphes.filter((p) => !/^#/.test(p) && !RE_LIEN_INTERNE.test(p))
  return { titre, chapo, paragraphes, intertitres, sources, marqueSources: marque ? marque[1] : null, prose, avant }
}

/** Nombre de mots du texte courant : titre, intertitres et bloc de sources compris (c'est ce que le lecteur lit). */
export function compterMots(corps) {
  const t = corps
    .replace(/\[([^\]]*?)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*?) → [^\]]*\]/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[#*_`>]/g, ' ')
  return (t.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) ?? []).length
}

export const compterPhrases = (t) => (t.replace(/\s+/g, ' ').trim().match(/[^.!?…]+(?:[.!?…]+(?=\s|$)|$)/g) ?? []).filter((s) => /\p{L}/u.test(s)).length

/* ------------------------------------------------------------------ fichiers */

export const walk = (dir, test, acc = []) => {
  if (!existsSync(dir)) return acc
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === '.next') continue
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, test, acc)
    else if (test(p)) acc.push(p)
  }
  return acc
}

export const relApp = (p) => relative(appRoot, p).replace(/\\/g, '/')

/** Résout « <slug> » ou un chemin en chemin de fichier d'article (02-article.md par défaut). */
export function resoudreArticle(arg) {
  if (existsSync(arg) && statSync(arg).isFile()) return resolve(arg)
  const parSlug = join(edDir, 'articles', arg, '02-article.md')
  if (existsSync(parSlug)) return parSlug
  throw new Error(`Article introuvable : ${arg}`)
}

/* ------------------------------------------------------------------ index de la bibliothèque */

/** Lecteur CSV minimal : séparateur « ; », guillemets doubles, champs sur plusieurs lignes. */
export function lireCsv(texte) {
  const rows = []
  let row = []
  let cur = ''
  let q = false
  const t = texte.replace(/^\uFEFF/, '')
  for (let i = 0; i < t.length; i++) {
    const c = t[i]
    if (q) {
      if (c === '"' && t[i + 1] === '"') { cur += '"'; i++ }
      else if (c === '"') q = false
      else cur += c
    } else if (c === '"') q = true
    else if (c === ';') { row.push(cur); cur = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && t[i + 1] === '\n') i++
      row.push(cur); cur = ''
      if (row.length > 1 || row[0] !== '') rows.push(row)
      row = []
    } else cur += c
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row) }
  const [tete, ...lignes] = rows
  return lignes.map((l) => Object.fromEntries(tete.map((h, i) => [h.trim(), l[i] ?? ''])))
}

/** Racine du dépôt (dossier principal, hors sparse checkout et hors worktree). */
function racineDepot() {
  try {
    const commun = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], { cwd: appRoot, encoding: 'utf8' }).trim()
    return resolve(commun, '..')
  } catch {
    return resolve(appRoot, '..')
  }
}

/**
 * Trouve INDEX.csv du corpus classé : variable AGROLIDE_INDEX_CSV, sinon le dossier principal du dépôt
 * (le corpus vit hors de agrolide/, hors du sparse checkout, donc pas dans un worktree).
 */
export function trouverIndexBibliotheque() {
  const rel = join('Opérations', 'Formation', 'Bibliothèque-Agrolide', 'Classée', '_Index', 'INDEX.csv')
  const candidats = [process.env.AGROLIDE_INDEX_CSV, join(racineDepot(), rel), join(appRoot, '..', rel)].filter(Boolean)
  return candidats.find((c) => existsSync(c)) ?? null
}

/** Index {DOC-xxxxx: ligne}. null si le corpus n'est pas disponible sur cette machine. */
export function chargerIndexBibliotheque() {
  const chemin = trouverIndexBibliotheque()
  if (!chemin) return null
  const lignes = lireCsv(readFileSync(chemin, 'utf8'))
  return { chemin, docs: new Map(lignes.map((l) => [l.id, l])) }
}

/** Un document est citable s'il est publié (public) ou réservé aux membres, jamais archivé ni à valider. */
export const DECISIONS_PUBLIEES = ['public', 'membres']
