/**
 * Génère les icônes de l'application installée (PWA) à partir de l'emblème vectoriel (le même tracé que le favicon,
 * src/components/brand). Sortie : public/icons/*.png et src/app/apple-icon.png.
 * Usage : node scripts/pwa-icones.mjs   (Node >= 22.6, sharp déjà présent avec Next).
 * Fonds : jetons de marque (surface claire --ag-sys-color-surface) ; mêmes valeurs que public/manifest.json.
 */
import sharp from 'sharp'
import { FORME_PATHS } from '../src/components/brand/forme-paths.ts'
import { GEOMETRIE } from '../src/components/brand/geometrie.ts'

const SURFACE = '#f9fef6' // --ag-sys-color-surface (clair)
const FILL = { vert: '#1b5e38', soleil: '#f99e1d', 'soleil-clair': '#fcb726' } // --ag-ref-green-35 / orange-70 / sun-60
const geo = FORME_PATHS['emblem-couleur']
const S = geo.viewBox[2]

const couleur = geo.layers.map((l) => `<path d="${l.d}" fill-rule="evenodd" fill="${FILL[l.id] ?? l.fill}"/>`).join('')
const mono = `<path d="${GEOMETRIE.emblemeMono.reseau + GEOMETRIE.emblemeMono.soleil}" fill-rule="evenodd" fill="#000"/>`

/** Emblème occupant `part` de la largeur, centré, sur un fond (ou transparent). */
const svg = (taille, part, corps, fond) => {
  const e = taille * part
  const o = (taille - e) / 2
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${taille}" height="${taille}" viewBox="0 0 ${taille} ${taille}">` +
      (fond ? `<rect width="${taille}" height="${taille}" fill="${fond}"/>` : '') +
      `<g transform="translate(${o} ${o}) scale(${e / S})">${corps}</g></svg>`,
  )
}
const png = (fichier, taille, part, corps, fond) =>
  sharp(svg(taille * 4, part, corps, fond), { density: 72 }).resize(taille, taille).png({ compressionLevel: 9 }).toFile(fichier)

await Promise.all([
  // « any » : emblème plein cadre sur transparent.
  png('public/icons/icon-192.png', 192, 0.96, couleur),
  png('public/icons/icon-512.png', 512, 0.96, couleur),
  // « maskable » : zone de sécurité = cercle de 80 % au centre ; l'emblème (rond) en occupe 64 %.
  png('public/icons/icon-maskable-192.png', 192, 0.64, couleur, SURFACE),
  png('public/icons/icon-maskable-512.png', 512, 0.64, couleur, SURFACE),
  // « monochrome » (Android 13+ : icônes thématiques), le système la teinte.
  png('public/icons/icon-monochrome-512.png', 512, 0.64, mono),
  // iOS : pas de transparence (elle devient noire), coins arrondis posés par le système.
  png('src/app/apple-icon.png', 180, 0.78, couleur, SURFACE),
])
console.log('Icônes PWA générées.')
