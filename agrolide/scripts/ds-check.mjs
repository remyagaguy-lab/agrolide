#!/usr/bin/env node
/**
 * Garde-fou du design system : `npm run ds:check`.
 * Échoue si un hexadécimal ou une classe Tailwind `gray-*`, `green-*`, `red-*`, `blue-*` apparaît dans src/
 * en dehors de la liste blanche ci-dessous. Les couleurs viennent des rôles (bg-primary, text-on-surface…).
 *
 * Liste blanche (chaque entrée est une raison, pas une commodité) :
 *  - jetons et page de démonstration (valeurs de référence, par nature)
 *  - src/components/ui : bibliothèque de composants
 *  - logos de marques tierces (Google, WhatsApp, LinkedIn) : couleurs imposées par les marques
 *  - PDF et graphiques déjà branchés sur src/styles/tokens.ts ou sur les variables --ag-sys-*
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')

const ALLOW_PREFIX = [
  'src/styles/', // jetons générés
  'src/components/ui/', // bibliothèque de composants
  'src/app/design-system/', // démonstration des jetons
  'src/app/api/', // gabarits d'e-mail HTML : couleurs en ligne, thème clair (pas de CSS dans un e-mail)
  'src/lib/auth/', // hors périmètre du design system (propriété de la session sécurité/performance)
]
const ALLOW_FILES = new Map([
  ['src/app/actions/admin-documents.ts', 'gabarit e-mail HTML (couleurs en ligne)'],
  ['src/components/auth/GoogleButton.tsx', 'logo Google (couleurs de marque imposées)'],
  ['src/components/brand/forme-paths.ts', 'tracés générés par scripts/forme/vectorize.py (tons de feuille mesurés sur l’emblème source)'],
  ['src/components/modules/formations/CertificatPDF.tsx', 'PDF branché sur tokens.ts'],
])

const HEX = /(?<![&\w/#-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![\w-])/g
const TW = /(?<![\w-])(?:[a-z0-9-]+:)*(?:bg|text|border(?:-[trblxy])?|from|to|via|ring|fill|stroke|divide|outline|decoration|placeholder|accent|caret|shadow)-(?:gray|green|red|blue)-\d{2,3}(?:\/\d+)?(?![\w-])/g

function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p, acc)
    else if (/\.(tsx?|css)$/.test(e)) acc.push(p)
  }
  return acc
}

let bad = 0
for (const file of walk(join(root, 'src'))) {
  const rel = relative(root, file).replace(/\\/g, '/')
  if (ALLOW_PREFIX.some((p) => rel.startsWith(p)) || ALLOW_FILES.has(rel)) continue
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (/ds-check:ignore/.test(line)) return
    const hits = [...(line.match(HEX) ?? []), ...(line.match(TW) ?? [])]
    for (const h of hits) {
      bad++
      console.error(`${rel}:${i + 1}  ${h}`)
    }
  })
}

if (bad) {
  console.error(`\n✗ ${bad} couleur(s) en dur. Utilisez les rôles du design system (voir Design-System.md §3).`)
  console.error('  Cas légitime (marque tierce, PDF) : ajoutez le fichier à la liste blanche de scripts/ds-check.mjs avec sa raison.')
  process.exit(1)
}
console.log('✓ ds:check : aucune couleur en dur hors liste blanche.')
