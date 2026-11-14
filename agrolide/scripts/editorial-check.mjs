#!/usr/bin/env node
/**
 * Garde-fou éditorial : lancé par `npm run ed:check`. Applique la charte (editorial/charte/, dans ce dossier) au texte du site.
 *
 * Erreurs (le script échoue) :
 *  - tiret cadratin (—) ou demi-cadratin (–) hors commentaire : décision du 2026-11-14, tirets interdits partout ;
 *  - « Agrolide » ou « AGROLIDE » : la marque s'écrit toujours « agrolide » (noms de fichiers, d'URL et d'identifiants exclus) ;
 *  - BIFERA sans mention d'ex-nom sur la même ligne (« ex-nom d'agrolide », « anciennement BIFERA »).
 * Avertissements (informatifs, n'échouent pas) :
 *  - trait d'union entouré d'espaces utilisé comme tiret dans une phrase ;
 *  - première personne du singulier (la voix du réseau est collective) ;
 *  - tutoiement (la voix du réseau vouvoie) ;
 *  - « entrepreneur agricole » (préférer « agripreneur »).
 *
 * Périmètre : src/**\/*.ts(x), editorial/**\/*.md, .claude/skills/agrolide-*\/*.md.
 * Dans les dossiers editorial/articles/, toutes les règles s'appliquent. Dans les autres fichiers Markdown (charte, skills,
 * qui citent les règles), seule la règle des tirets s'applique.
 * Ligne légitime exceptionnelle : commentaire `editorial:ignore` sur la même ligne.
 * Options : --verbose (toutes les occurrences), --warnings (affiche aussi les avertissements en détail).
 * Le contenu stocké en base de données (articles, événements…) n'est pas encore couvert.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const appRoot = resolve(import.meta.dirname, '..')
const repoRoot = resolve(appRoot, '..')
const verbose = process.argv.includes('--verbose')
const showWarnings = process.argv.includes('--warnings') || verbose

const walk = (dir, test, acc = []) => {
  if (!existsSync(dir)) return acc
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === '.next') continue
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, test, acc)
    else if (test(p)) acc.push(p)
  }
  return acc
}

const files = [
  ...walk(join(appRoot, 'src'), (p) => /\.tsx?$/.test(p)),
  ...walk(join(appRoot, 'editorial'), (p) => p.endsWith('.md')),
  ...readdirSync(join(appRoot, '.claude', 'skills'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith('agrolide-'))
    .flatMap((d) => walk(join(appRoot, '.claude', 'skills', d.name), (p) => p.endsWith('.md'))),
]

const EX_NOM = /ex[-\s‑]?nom|ancien(?:ne)?\s+nom|anciennement|ex[-\s]BIFERA|ex\s*:\s*BIFERA/i
const STOP = /\b(de|la|le|les|des|du|un|une|et|pour|vous|votre|vos|nous)\b/i

/** Retire commentaires et blocs de commentaire d'une ligne de code. */
const stripCode = (line) =>
  line
    .replace(/\{\/\*.*?\*\/\}/g, '')
    .replace(/\/\*.*?\*\//g, '')
    .replace(/(^|\s)\/\/\s.*$/, '$1')

/** Un tiret seul entre guillemets ou balises : valeur vide affichée dans un tableau ou un champ. */
const VIDE = /(["'`>])\s*[—–]\s*(?=["'`<])/

/**
 * « je » seul (pas « jeunes », « jeton »), hors citation entre guillemets français (exemple de propos d'un porteur de projet),
 * hors libellé de choix de formulaire (la personne répond à la première personne) et hors espace de nom d'un prompt.
 */
const premierePersonne = (l, md) => {
  if (!(md || /["'`>]/.test(l)) || !STOP.test(l)) return false
  if (/<option\b|libelle\s*:|placeholder=/.test(l)) return false
  const hors = l.replace(/«[^»]*»/g, "").replace(/«[^»]*$/g, "")
  return /(?<![\p{L}])(?:[Jj]e(?![\p{L}])|[Jj]['’](?=\p{L}))/u.test(hors)
}

const rules = [
  {
    id: 'tiret-valeur-vide',
    level: 'error',
    msg: 'tiret utilisé comme « valeur vide » dans une cellule ou un champ : le remplacer par « Non renseigné » ou par un état vide du design system',
    test: (l) => VIDE.test(l),
    scope: 'all',
  },
  {
    id: 'tiret-long',
    level: 'error',
    msg: 'tiret cadratin ou demi-cadratin interdit : virgule, parenthèses, deux-points ou nouvelle phrase',
    test: (l) => /[—–]/.test(l.replace(new RegExp(VIDE.source, 'g'), '')),
    scope: 'all',
  },
  {
    id: 'marque-majuscule',
    level: 'error',
    msg: '« agrolide » s\'écrit toujours en minuscules',
    test: (l) => /(?<![\w/\-.@])(?:Agrolide|AGROLIDE)(?![\w\-]|\.(?:xlsx|pdf|png|jpe?g|svg|org|com))/.test(l),
    scope: 'strict',
  },
  {
    id: 'bifera-sans-mention',
    level: 'error',
    msg: 'BIFERA est l\'ex-nom d\'agrolide : ajouter « ex-nom d\'agrolide » ou « anciennement BIFERA »',
    test: (l) => /(?<![\w\-/.])(?:BIFERA|Bifera)(?![\w\-/])/.test(l) && !EX_NOM.test(l),
    scope: 'strict',
  },
  {
    id: 'tiret-espace',
    level: 'warn',
    msg: 'trait d\'union entouré d\'espaces utilisé comme tiret : reformuler',
    test: (l, md) => /[A-Za-zÀ-ÿ»)"'’] -[A-Za-zÀ-ÿ«("'‘]/.test(l) && STOP.test(l) && (md || /["'`>]/.test(l)),
    scope: 'all',
  },
  {
    id: 'premiere-personne',
    level: 'warn',
    msg: 'première personne du singulier : la voix du réseau est collective',
    test: (l, md) => premierePersonne(l, md),
    scope: 'strict',
  },
  {
    id: 'tutoiement',
    level: 'warn',
    msg: 'tutoiement : la voix du réseau vouvoie',
    test: (l, md) => /(?<![\p{L}\-'’])(?:tu|tes|toi)(?![\p{L}\-])/iu.test(l) && (md || /["'`>]/.test(l)) && STOP.test(l),
    scope: 'strict',
  },
  {
    id: 'entrepreneur-agricole',
    level: 'warn',
    msg: 'préférer « agripreneur » à « entrepreneur agricole »',
    test: (l) => /entrepreneurs?\s+agricoles?/i.test(l),
    scope: 'strict',
  },
  {
    id: 'registre-absent',
    level: 'error',
    msg: 'en-tête sans « registre » (Terrain, Parcours, Expertise ou Partenariat) : voir editorial/charte/06-publics-et-registres.md',
    test: () => false, // contrôle fait fichier par fichier, plus bas
    scope: 'strict',
  },
]

const hits = new Map(rules.map((r) => [r.id, []]))

for (const file of files) {
  const rel = relative(appRoot, file).replace(/\\/g, '/')
  const isMd = file.endsWith('.md')
  const strictMd = rel.startsWith('editorial/articles/')
  const lines = readFileSync(file, 'utf8').split('\n')
  if (/^editorial\/articles\/[^/]+\/(01-cadrage|02-article)\.md$/.test(rel)) {
    const entete = readFileSync(file, 'utf8').split(/\r?\n---\r?\n/)[0]
    if (!/^registre:\s*(Terrain|Parcours|Expertise|Partenariat)\s*$/m.test(entete))
      hits.get('registre-absent').push({ rel, n: 1, text: 'en-tête : registre manquant ou invalide' })
  }
  let inFence = false
  lines.forEach((raw, i) => {
    if (/editorial:ignore/.test(raw)) return
    let line = raw
    if (isMd) {
      if (/^\s*```/.test(raw)) {
        inFence = !inFence
        return
      }
      if (inFence) return
    } else {
      if (/^\s*(\/\/|\*|\/\*)/.test(raw)) return
      if (/^\s*(import|export)\b.*\bfrom\b/.test(raw)) return
      line = stripCode(raw)
    }
    for (const r of rules) {
      if (isMd && r.scope === 'strict' && !strictMd) continue
      if (r.test(line, isMd)) hits.get(r.id).push({ rel, n: i + 1, text: raw.trim().slice(0, 110) })
    }
  })
}

let errors = 0
let warnings = 0
for (const r of rules) {
  const list = hits.get(r.id)
  if (r.level === 'error') errors += list.length
  else warnings += list.length
}

const printList = (r, list, limit) => {
  const byFile = new Map()
  for (const h of list) byFile.set(h.rel, (byFile.get(h.rel) ?? 0) + 1)
  console.log(`\n[${r.level === 'error' ? 'ERREUR' : 'avertissement'}] ${r.id} : ${list.length} occurrence(s) dans ${byFile.size} fichier(s)`)
  console.log(`  ${r.msg}`)
  const shown = limit ? list.slice(0, limit) : list
  for (const h of shown) console.log(`  ${h.rel}:${h.n}  ${h.text}`)
  if (shown.length < list.length) console.log(`  … ${list.length - shown.length} autre(s) (option --verbose)`)
}

console.log(`Contrôle éditorial : ${files.length} fichiers lus.`)
for (const r of rules) {
  const list = hits.get(r.id)
  if (!list.length) continue
  if (r.level === 'error') printList(r, list, verbose ? 0 : 12)
  else if (showWarnings) printList(r, list, verbose ? 0 : 12)
  else console.log(`\n[avertissement] ${r.id} : ${list.length} occurrence(s) (option --warnings pour le détail)`)
}

console.log(`\nBilan : ${errors} erreur(s), ${warnings} avertissement(s).`)
if (errors > 0) {
  console.error('Échec : corriger les erreurs ci-dessus (charte : editorial/charte/).')
  process.exit(1)
}
