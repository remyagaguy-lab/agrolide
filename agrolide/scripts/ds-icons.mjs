#!/usr/bin/env node
/**
 * Garde-fou des icônes : lancé par `npm run ds:check` (après le contrôle des couleurs).
 * Le jeu d'icônes est figé dans src/components/ui/icons.ts. Échoue si :
 *  1. un emoji ou un pictogramme Unicode (flèche, coche, étoile, puce…) apparaît hors commentaire :
 *     utiliser une icône de icons.ts, ou « · » comme séparateur ;
 *  2. `lucide-react` est importé ailleurs que dans icons.ts ;
 *  3. un <svg> en ligne apparaît hors formes de marque et logos de marques tierces (liste blanche) ;
 *  4. une icône du jeu porte un `strokeWidth` (le trait est posé par globals.css sur svg.lucide)
 *     ou une taille hors 16 / 20 / 24 px (size-4, size-5, size-6).
 * Ligne légitime exceptionnelle : commentaire `ds-icons:ignore` sur la même ligne.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')

const SVG_OK_PREFIX = [
  'src/components/brand/', // formes de marque : ce ne sont pas des icônes
  'src/components/ui/icons.ts',
  'src/app/design-system/', // page de démonstration
]
const SVG_OK_FILES = new Map([
  ['src/components/auth/GoogleButton.tsx', 'logo Google (marque tierce)'],
  ['src/components/layout/Footer.tsx', 'TikTok et WhatsApp (marques tierces, absents de lucide)'],
])
const PICTO = /\p{Extended_Pictographic}|[←-⇿•✓✔✗✘★☆■-◿✀-➿️]/gu
const PICTO_OK = new Set(['©', '®', '™'])
const VALID_PX = new Set([16, 20, 24])

function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, acc)
    else if (/\.(tsx?|css)$/.test(e)) acc.push(p)
  }
  return acc
}

let bad = 0
const report = (rel, n, msg) => {
  bad++
  console.error(`${rel}:${n}  ${msg}`)
}

for (const file of walk(join(root, 'src'))) {
  const rel = relative(root, file).replace(/\\/g, '/')
  const src = readFileSync(file, 'utf8')
  const lines = src.split('\n')
  const isCode = /\.tsx?$/.test(rel)

  if (isCode && rel !== 'src/components/ui/icons.ts' && /from\s+['"]lucide-react['"]/.test(src)) {
    report(rel, 1, "import de lucide-react : passer par '@/components/ui/icons'")
  }

  const iconNames = new Set(['Icone', 'Icon'])
  for (const m of src.matchAll(/import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+['"]@\/components\/ui\/icons['"]/g)) {
    for (const n of m[1].split(',')) {
      const [a, b] = n.trim().replace(/^type\s+/, '').split(/\s+as\s+/)
      if (a) iconNames.add((b ?? a).trim())
    }
  }

  lines.forEach((line, i) => {
    if (/ds-icons:ignore/.test(line)) return
    const t = line.trim()
    if (!/^(\/\/|\*|\/\*)/.test(t)) {
      // Contenu pédagogique en base (src/db) : les flèches y notent un enchaînement dans le texte, les emojis restent bannis.
      const hits = (line.match(PICTO) ?? []).filter((c) => !PICTO_OK.has(c) && !(rel.startsWith('src/db/') && /[←-⇿]/.test(c)))
      if (hits.length) {
        report(rel, i + 1, `emoji ou pictogramme « ${[...new Set(hits)].join(' ')} » : utiliser une icône de icons.ts (ou « · » comme séparateur)`)
      }
    }
    if (isCode && /<svg[\s>]/.test(line) && !SVG_OK_PREFIX.some((p) => rel.startsWith(p)) && !SVG_OK_FILES.has(rel)) {
      report(rel, i + 1, '<svg> en ligne : ajouter l’icône à icons.ts (ou liste blanche si logo de marque tierce)')
    }
  })

  if (isCode && iconNames.size) {
    const tagRe = new RegExp(`<(${[...iconNames].join('|')})(?![\\w])([^>]*?)/?>`, 'gs')
    for (const m of src.matchAll(tagRe)) {
      const attrs = m[2]
      const n = src.slice(0, m.index).split('\n').length
      if (/ds-icons:ignore/.test(lines[n - 1])) continue
      if (/strokeWidth\s*=/.test(attrs)) report(rel, n, `<${m[1]}> : strokeWidth interdit (trait unique posé par globals.css)`)
      const sp = attrs.match(/\bsize=\{?["']?(\d+)/)
      if (sp && !VALID_PX.has(+sp[1])) report(rel, n, `<${m[1]}> : size=${sp[1]} hors 16 / 20 / 24`)
      for (const c of attrs.matchAll(/(?<![\w-])(?:size|h|w)-(?:\[(\d+)px\]|(\d+(?:\.\d+)?))(?![\w-])/g)) {
        const px = c[1] ? +c[1] : +c[2] * 4
        if (!VALID_PX.has(px)) report(rel, n, `<${m[1]}> : ${c[0]} hors 16 / 20 / 24 (size-4, size-5, size-6)`)
      }
    }
  }
}

if (bad) {
  console.error(`\n✗ ${bad} écart(s) au jeu d'icônes figé (src/components/ui/icons.ts).`)
  process.exit(1)
}
console.log("✓ ds:check : aucun emoji, icônes conformes au jeu figé (trait unique, 16 / 20 / 24 px).")
