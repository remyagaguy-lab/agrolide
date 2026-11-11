#!/usr/bin/env node
/**
 * Source unique des jetons de couleur agrolide.
 *
 * Génère :
 *   - src/styles/tokens/generated.css  (jetons de référence + rôles système clair/sombre)
 *   - src/styles/tokens.ts             (mêmes valeurs en TypeScript : e-mails, PDF, graphiques)
 * Vérifie les contrastes WCAG des paires texte/fond : le script échoue si une paire est sous le seuil.
 *
 * Usage : npm run ds:tokens
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// ─── Niveau 1 : palettes de référence (ton 0–100, style HCT/Material) ───────────────
// Les couleurs de marque sont épinglées à leur valeur exacte (vérifiée sur le logo).
const ref = {
  green: {
    10: '#00210e', 20: '#00391d', 30: '#09522d', 35: '#1b5e38' /* MARQUE : vert profond */,
    40: '#296a43', 50: '#44845a', 60: '#5d9e72', 70: '#78ba8b', 80: '#92d5a5',
    90: '#daebe1' /* MARQUE : conteneur vert */, 95: '#ecf5ef', 98: '#f5faf7',
  },
  leaf: {
    // vert feuille : illustrations, graphiques, accents (jamais du texte sur fond clair)
    40: '#0e6e20', 60: '#50a853' /* MARQUE */, 80: '#82db7f', 90: '#d8f0d6',
  },
  olive: {
    10: '#1b1d00', 20: '#303300', 30: '#464a00', 40: '#5d6300', 50: '#878e2c' /* MARQUE */,
    80: '#c6cd64', 90: '#e4e6b3', 95: '#f0f2cf',
  },
  orange: {
    10: '#2b1700', 20: '#482900', 30: '#673d00', 40: '#885200', 70: '#f99e1d' /* MARQUE : CTA */,
    80: '#ffb867', 90: '#ffddbb', 95: '#fef5e8' /* MARQUE : conteneur orange */,
  },
  sun: { 60: '#fcb726' /* MARQUE : soleil / jaune doré */, 70: '#ffc77d' },
  neutral: {
    0: '#000000', 4: '#0a0f0b', 6: '#101510', 10: '#181d18', 12: '#1c211c', 17: '#262b27',
    20: '#2c322d', 22: '#313631', 24: '#353a36', 90: '#dfe4dd', 92: '#e5eae2', 94: '#eaefe8',
    95: '#edf2eb', 96: '#f0f5ed', 98: '#f6fbf3', 99: '#f9fef6', 100: '#ffffff',
  },
  neutralVariant: { 30: '#3f4940', 40: '#5f6a60', 50: '#6f7a70', 60: '#889489', 70: '#a3ada4', 80: '#becabe', 90: '#dae6d9' },
  error: { 10: '#410002', 20: '#690005', 30: '#93000a', 40: '#ba1a1a', 80: '#ffb4ab', 90: '#ffdad6' },
  info: { 10: '#001d34', 30: '#124a73', 40: '#31628d', 80: '#9dcbfb', 90: '#cfe5ff' },
  ink: { 90: '#1a1a1a' }, // texte noir de marque (sur orange/jaune)
}

// ─── Niveau 2 : rôles système ───────────────────────────────────────────────────────
const R = ref
const light = {
  primary: R.green[35], 'on-primary': '#ffffff',
  'primary-container': R.green[90], 'on-primary-container': '#0b3a20',
  secondary: R.olive[40], 'on-secondary': '#ffffff',
  'secondary-container': R.olive[95], 'on-secondary-container': R.olive[20],
  tertiary: R.orange[70], 'on-tertiary': R.ink[90], 'tertiary-hover': R.sun[60],
  'tertiary-container': R.orange[95], 'on-tertiary-container': R.orange[30],
  'accent-leaf': R.leaf[60], 'accent-sun': R.sun[60], 'accent-olive': R.olive[50],
  error: R.error[40], 'on-error': '#ffffff', 'error-container': R.error[90], 'on-error-container': R.error[10],
  success: R.leaf[40], 'on-success': '#ffffff', 'success-container': R.leaf[90], 'on-success-container': '#002204',
  warning: R.orange[40], 'on-warning': '#ffffff', 'warning-container': '#ffeedf', 'on-warning-container': R.orange[20],
  info: R.info[40], 'on-info': '#ffffff', 'info-container': R.info[90], 'on-info-container': R.info[10],
  surface: R.neutral[99], 'surface-dim': R.neutral[90], 'surface-bright': R.neutral[99],
  'surface-container-lowest': R.neutral[100], 'surface-container-low': R.neutral[98],
  'surface-container': R.neutral[96], 'surface-container-high': R.neutral[94], 'surface-container-highest': R.neutral[92],
  'on-surface': R.neutral[10], 'on-surface-variant': R.neutralVariant[30], 'on-surface-muted': R.neutralVariant[40],
  outline: R.neutralVariant[50], 'outline-variant': R.neutralVariant[90],
  'inverse-surface': R.neutral[20], 'inverse-on-surface': R.neutral[95], 'inverse-primary': R.green[80],
  'focus-ring': R.green[35],
}
const dark = {
  primary: R.green[80], 'on-primary': R.green[20],
  'primary-container': R.green[35], 'on-primary-container': R.green[90],
  secondary: R.olive[80], 'on-secondary': R.olive[10],
  'secondary-container': R.olive[30], 'on-secondary-container': R.olive[90],
  tertiary: R.orange[80], 'on-tertiary': R.orange[10], 'tertiary-hover': R.sun[70],
  'tertiary-container': R.orange[30], 'on-tertiary-container': R.orange[90],
  'accent-leaf': R.leaf[60], 'accent-sun': R.sun[60], 'accent-olive': R.olive[50],
  error: R.error[80], 'on-error': R.error[20], 'error-container': R.error[30], 'on-error-container': R.error[90],
  success: R.leaf[80], 'on-success': '#002204', 'success-container': '#005313', 'on-success-container': '#c6f0c4',
  warning: R.orange[80], 'on-warning': R.orange[20], 'warning-container': R.orange[30], 'on-warning-container': R.orange[90],
  info: R.info[80], 'on-info': R.info[10], 'info-container': R.info[30], 'on-info-container': R.info[90],
  surface: R.neutral[6], 'surface-dim': R.neutral[6], 'surface-bright': R.neutral[24],
  'surface-container-lowest': R.neutral[4], 'surface-container-low': R.neutral[10],
  'surface-container': R.neutral[12], 'surface-container-high': R.neutral[17], 'surface-container-highest': R.neutral[22],
  'on-surface': R.neutral[90], 'on-surface-variant': R.neutralVariant[80], 'on-surface-muted': R.neutralVariant[70],
  outline: R.neutralVariant[60], 'outline-variant': R.neutralVariant[30],
  'inverse-surface': R.neutral[90], 'inverse-on-surface': R.neutral[20], 'inverse-primary': R.green[35],
  'focus-ring': R.green[80],
}

// ─── Vérification des contrastes (WCAG 2.x) ─────────────────────────────────────────
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}
const TEXT = 4.5, UI = 3
const checks = []
for (const [name, theme] of [['clair', light], ['sombre', dark]]) {
  const t = (fg, bg, min = TEXT) => { if (!theme[fg] || !theme[bg]) throw new Error('rôle manquant: ' + fg + ' / ' + bg + ' (' + name + ')'); checks.push({ theme: name, fg, bg, min, value: ratio(theme[fg], theme[bg]) }) }
  for (const k of ['primary', 'secondary', 'tertiary', 'error', 'success', 'warning', 'info']) {
    t(`on-${k}`, k)
    t(`on-${k}-container`, `${k}-container`)
  }
  t('on-tertiary', 'tertiary-hover')
  for (const s of ['surface', 'surface-container-lowest', 'surface-container-low', 'surface-container', 'surface-container-high', 'surface-container-highest']) {
    t('on-surface', s); t('on-surface-variant', s); t('on-surface-muted', s)
    t('outline', s, UI); t('focus-ring', s, UI); t('primary', s); t('secondary', s); t('error', s); t('success', s); t('info', s)
  }
  t('inverse-on-surface', 'inverse-surface')
  t('on-primary', 'primary-container', 3) // information seulement
}
const failures = checks.filter((c) => c.value < c.min && !(c.fg === 'on-primary' && c.bg === 'primary-container'))
if (failures.length) {
  console.error('Contrastes insuffisants :')
  for (const f of failures) console.error(`  [${f.theme}] ${f.fg} sur ${f.bg} = ${f.value.toFixed(2)} (min ${f.min})`)
  process.exit(1)
}
console.log(`OK : ${checks.length} paires de contraste vérifiées (clair + sombre).`)

// ─── Génération CSS ─────────────────────────────────────────────────────────────────
const refVars = Object.entries(ref)
  .flatMap(([pal, tones]) => Object.entries(tones).map(([tone, hex]) => `  --ag-ref-${pal.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}-${tone}: ${hex};`))
  .join('\n')
const sysVars = (theme) => Object.entries(theme).map(([k, v]) => `  --ag-sys-color-${k}: ${v};`).join('\n')

const css = `/* FICHIER GÉNÉRÉ par scripts/ds-tokens.mjs : ne pas modifier à la main (npm run ds:tokens). */

/* Niveau 1 — référence : valeurs brutes de la marque. Ne pas utiliser dans les composants. */
:root {
${refVars}
}

/* Niveau 2 — système, thème clair (défaut) */
:root {
  color-scheme: light;
${sysVars(light)}
}

/* Niveau 2 — système, thème sombre (activé par <html data-theme="dark">) */
:root[data-theme='dark'] {
  color-scheme: dark;
${sysVars(dark)}
}
`
const out = resolve(root, 'src/styles/tokens')
mkdirSync(out, { recursive: true })
writeFileSync(resolve(out, 'generated.css'), css)

// ─── Génération TypeScript (e-mails, PDF, graphiques) ───────────────────────────────
const ts = `// FICHIER GÉNÉRÉ par scripts/ds-tokens.mjs : ne pas modifier à la main (npm run ds:tokens).
// Mêmes valeurs que src/styles/tokens/generated.css, pour les contextes sans CSS (e-mails, PDF, graphiques).

export const refPalette = ${JSON.stringify(ref, null, 2)} as const

export const lightColors = ${JSON.stringify(light, null, 2)} as const

export const darkColors = ${JSON.stringify(dark, null, 2)} as const

export type ColorRole = keyof typeof lightColors

/** Couleurs de marque, utilisables telles quelles (e-mails : toujours le thème clair). */
export const brand = {
  vertProfond: lightColors.primary,
  vertConteneur: lightColors['primary-container'],
  vertFeuille: lightColors['accent-leaf'],
  olive: lightColors['accent-olive'],
  orange: lightColors.tertiary,
  orangeConteneur: lightColors['tertiary-container'],
  soleil: lightColors['accent-sun'],
  encre: refPalette.ink[90],
} as const
`
writeFileSync(resolve(root, 'src/styles/tokens.ts'), ts)
console.log('Écrit : src/styles/tokens/generated.css, src/styles/tokens.ts')
