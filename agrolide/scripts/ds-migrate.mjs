#!/usr/bin/env node
/**
 * Codemod de migration vers les jetons du design system.
 * Remplace, dans les classes Tailwind, les couleurs en dur (bg-[#1b5e38]), les gris/verts/rouges génériques
 * (text-gray-700) et les anciens noms de la config (bg-vert-profond) par les rôles (bg-primary, text-on-surface…).
 *
 * Usage : node scripts/ds-migrate.mjs <dossier> [<dossier>…] [--write]
 * Sans --write : simulation (compte les remplacements et liste les couleurs non gérées).
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, relative } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const args = process.argv.slice(2)
const write = args.includes('--write')
const targets = args.filter((a) => !a.startsWith('--'))

// Fichiers à ne pas toucher (travail non commité de l'utilisateur, périmètre d'autres sessions, fichiers du système).
const SKIP = [
  'src/app/design-system',
  'src/components/ui',
  'src/styles',
  'src/lib/auth',
  'src/db',
]

// hex (minuscule) -> rôle par contexte
const HEX = {
  '#1b5e38': { bg: 'primary', text: 'primary', border: 'primary' },
  '#164d2e': { bg: 'primary/90', text: 'primary', border: 'primary' },
  '#144a2c': { bg: 'primary/90', text: 'primary', border: 'primary' },
  '#145030': { bg: 'primary/90', text: 'primary', border: 'primary' },
  '#154c2d': { bg: 'primary/90', text: 'primary', border: 'primary' },
  '#297b41': { bg: 'primary', text: 'primary', border: 'primary' },
  '#50a853': { bg: 'accent-leaf', text: 'primary', border: 'accent-leaf' },
  '#878e2c': { bg: 'accent-olive', text: 'secondary', border: 'accent-olive' },
  '#1a1a1a': { bg: 'on-surface', text: 'on-surface', border: 'on-surface' },
  '#4a4a4a': { text: 'on-surface-variant' },
  '#555': { text: 'on-surface-variant' }, '#555555': { text: 'on-surface-variant' },
  '#666': { text: 'on-surface-muted' }, '#666666': { text: 'on-surface-muted' },
  '#757571': { text: 'on-surface-muted' }, '#9a9a96': { text: 'on-surface-muted' },
  '#9ca3af': { text: 'on-surface-muted' }, '#6b7280': { text: 'on-surface-muted' },
  '#e8e8e4': { bg: 'surface-container-high', border: 'outline-variant' },
  '#eaeaea': { bg: 'surface-container-high', border: 'outline-variant' },
  '#e5e5e5': { bg: 'surface-container-high', border: 'outline-variant' },
  '#f0f0f0': { bg: 'surface-container', border: 'outline-variant' },
  '#f0f0ee': { bg: 'surface-container', border: 'outline-variant' },
  '#c8c8c4': { border: 'outline-variant' },
  '#f8f8f6': { bg: 'surface-container-low' }, '#f8f9fa': { bg: 'surface-container-low' },
  '#f8faf8': { bg: 'surface-container-low' }, '#fcfdfc': { bg: 'surface-container-low' },
  '#f4f8f4': { bg: 'surface-container-low' },
  '#f0f7f0': { bg: 'primary-container', border: 'outline-variant' },
  '#e8f5e9': { bg: 'success-container', text: 'on-success-container', border: 'outline-variant' },
  '#dff0e0': { bg: 'primary-container', border: 'outline-variant' },
  '#e2f3e3': { bg: 'primary-container', border: 'outline-variant' },
  '#c8e6c9': { bg: 'success-container', border: 'outline-variant' },
  '#f0fdf4': { bg: 'primary-container', border: 'outline-variant' },
  '#c3dec4': { bg: 'primary-container', border: 'outline-variant' },
  '#f99e1d': { bg: 'tertiary', text: 'on-tertiary-container', border: 'tertiary' },
  '#fcb726': { bg: 'accent-sun', text: 'on-tertiary-container', border: 'accent-sun' },
  '#fef3e2': { bg: 'tertiary-container', border: 'outline-variant' },
  '#fef9ee': { bg: 'tertiary-container', border: 'outline-variant' },
  '#fed7aa': { bg: 'tertiary-container', border: 'outline-variant' },
  '#8a4e00': { text: 'on-tertiary-container' },
  '#d32f2f': { bg: 'error', text: 'error', border: 'error' },
  '#fef0f0': { bg: 'error-container' },
}

const NAMED = {
  'vert-profond': { bg: 'primary', text: 'primary', border: 'primary' },
  'vert-principal': { bg: 'accent-leaf', text: 'primary', border: 'accent-leaf' },
  'vert-clair': { bg: 'primary-container', text: 'primary', border: 'outline-variant' },
  'vert-pale': { bg: 'primary-container', text: 'primary', border: 'outline-variant' },
  'vert-olive': { bg: 'accent-olive', text: 'secondary', border: 'accent-olive' },
  'orange-accent': { bg: 'tertiary', text: 'on-tertiary-container', border: 'tertiary' },
  'orange-dore': { bg: 'accent-sun', text: 'on-tertiary-container', border: 'accent-sun' },
  'gris-fond': { bg: 'surface-container-low' },
  'gris-border': { border: 'outline-variant', bg: 'surface-container-high' },
  'gris-light': { bg: 'surface-container', border: 'outline-variant' },
  'gris-muted': { text: 'on-surface-muted' },
  'gris-texte': { text: 'on-surface-variant' },
  'gris-titre': { text: 'on-surface' },
}

// Palette Tailwind générique -> rôle. Les gris clairs (300/400) sont laissés : ils servent souvent sur fonds sombres.
const FAMILY = {
  gray: 'neutral', slate: 'neutral', zinc: 'neutral', neutral: 'neutral',
  red: 'error', green: 'success', emerald: 'success', blue: 'info', amber: 'warning', yellow: 'warning',
}
function scale(fam, n, ctx) {
  const f = FAMILY[fam]
  if (!f) return null
  if (f === 'neutral') {
    if (ctx === 'text') return n >= 800 ? 'on-surface' : n >= 600 ? 'on-surface-variant' : n === 500 ? 'on-surface-muted' : null
    if (ctx === 'bg') return n <= 50 ? 'surface-container-low' : n === 100 ? 'surface-container' : n === 200 ? 'surface-container-high' : null
    if (ctx === 'border') return n <= 200 ? 'outline-variant' : n === 300 ? 'outline' : null
    return null
  }
  if (ctx === 'text') return n >= 800 ? `on-${f}-container` : n >= 500 ? f : null
  if (ctx === 'bg') return n <= 100 ? `${f}-container` : n >= 500 && n <= 700 ? f : null
  if (ctx === 'border') return n <= 300 ? `${f}/30` : n >= 400 ? f : null
  return null
}
function primaryScale(n, ctx) {
  if (n <= 300) return ctx === 'border' ? 'outline-variant' : ctx === 'text' ? 'primary' : 'primary-container'
  if (n <= 500) return ctx === 'bg' ? 'accent-leaf' : 'primary'
  return 'primary'
}

const ctxOf = (p) =>
  p === 'bg' ? 'bg'
    : p === 'text' || p === 'placeholder' || p === 'fill' || p === 'stroke' ? 'text'
      : p.startsWith('border') || p === 'ring' || p === 'divide' || p === 'outline' ? 'border'
        : null

const unmapped = new Map()
let total = 0

const withOp = (pre, prop, role, op) =>
  role.includes('/') ? (op ? `${pre}${prop}-${role.split('/')[0]}${op}` : `${pre}${prop}-${role}`) : `${pre}${prop}-${role}${op}`

function transform(src) {
  let out = src
  // 1) couleurs hexadécimales arbitraires : bg-[#1b5e38], hover:text-[#fff]/80…
  out = out.replace(
    /(?<![\w-])((?:[a-z0-9-]+:)*)(bg|text|border(?:-[trblxy])?|ring|divide|outline|placeholder|fill|stroke)-\[(#[0-9a-fA-F]{3,6})\](\/\d+)?/g,
    (m, pre, prop, hex, op = '') => {
      const ctx = ctxOf(prop)
      const h = hex.toLowerCase()
      const full = h.length === 4 ? '#' + [...h.slice(1)].map((c) => c + c).join('') : h
      if (full === '#ffffff') {
        const role = ctx === 'text' ? 'on-primary' : ctx === 'bg' ? 'surface-container-lowest' : null
        if (!role || op) return m
        total++
        return `${pre}${prop}-${role}`
      }
      const entry = HEX[h] ?? HEX[full]
      const role = entry?.[ctx]
      if (!role) {
        const key = h + ' ' + (ctx ?? prop)
        unmapped.set(key, (unmapped.get(key) ?? 0) + 1)
        return m
      }
      total++
      return withOp(pre, prop, role, op)
    },
  )
  // 2) palette Tailwind générique
  out = out.replace(
    /(?<![\w-])((?:[a-z0-9-]+:)*)(bg|text|border(?:-[trblxy])?|ring|divide|placeholder)-(gray|slate|zinc|neutral|red|green|emerald|blue|amber|yellow)-(\d{2,3})(\/\d+)?(?![\w-])/g,
    (m, pre, prop, fam, n, op = '') => {
      const role = scale(fam, Number(n), ctxOf(prop))
      if (!role) return m
      total++
      return withOp(pre, prop, role, op)
    },
  )
  // 3) échelle primary-NN de la config
  out = out.replace(
    /(?<![\w-])((?:[a-z0-9-]+:)*)(bg|text|border(?:-[trblxy])?|ring|divide|placeholder)-primary-(\d{2,3})(\/\d+)?(?![\w-])/g,
    (m, pre, prop, n, op = '') => {
      const ctx = ctxOf(prop)
      if (!ctx) return m
      total++
      if (ctx === 'bg' && pre.includes('hover') && Number(n) >= 600) return `${pre}${prop}-primary/90`
      return `${pre}${prop}-${primaryScale(Number(n), ctx)}${op}`
    },
  )
  // 4) noms historiques de la config
  out = out.replace(
    /(?<![\w-])((?:[a-z0-9-]+:)*)(bg|text|border(?:-[trblxy])?|ring|divide|placeholder|fill|stroke)-(vert-profond|vert-principal|vert-clair|vert-pale|vert-olive|orange-accent|orange-dore|gris-fond|gris-border|gris-light|gris-muted|gris-texte|gris-titre)(\/\d+)?(?![\w-])/g,
    (m, pre, prop, name, op = '') => {
      const role = NAMED[name]?.[ctxOf(prop)]
      if (!role) return m
      total++
      return `${pre}${prop}-${role}${op}`
    },
  )
  return out
}

function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) {
      if (e !== 'node_modules' && e !== '.next') walk(p, acc)
    } else if (/\.tsx$/.test(e)) acc.push(p)
  }
  return acc
}

let changed = 0
for (const t of targets) {
  for (const file of walk(resolve(root, t))) {
    const rel = relative(root, file).replace(/\\/g, '/')
    if (SKIP.some((s) => rel === s || rel.startsWith(s + '/'))) continue
    const src = readFileSync(file, 'utf8')
    const out = transform(src)
    if (out !== src) {
      changed++
      if (write) writeFileSync(file, out)
    }
  }
}
console.log(`${write ? 'Écrit' : 'Simulation'} : ${total} remplacements dans ${changed} fichiers.`)
console.log('Couleurs non gérées (à traiter à la main) :')
for (const [k, v] of [...unmapped].sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log(`  ${v} × ${k}`)
