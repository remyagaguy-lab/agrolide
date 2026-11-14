/** Écrans de lancement iOS (apple-touch-startup-image) : un fichier par taille d'appareil, généré par scripts/pwa-icones.mjs.
 * iOS n'utilise pas le manifeste pour l'écran de lancement : il cherche l'image dont la media query correspond à l'appareil. */
const APPAREILS: Array<[number, number, number]> = [
  // [largeur CSS, hauteur CSS, densité]
  [440, 956, 3], [430, 932, 3], [402, 874, 3], [393, 852, 3], [428, 926, 3], [390, 844, 3], [375, 812, 3],
  [414, 896, 3], [414, 896, 2], [414, 736, 3], [375, 667, 2], [320, 568, 2],
  [1024, 1366, 2], [834, 1194, 2], [834, 1112, 2], [810, 1080, 2], [768, 1024, 2],
]

export const startupImages = APPAREILS.map(([w, h, d]) => ({
  url: `/splash/${w * d}x${h * d}.png`,
  media: `(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${d}) and (orientation: portrait)`,
}))
