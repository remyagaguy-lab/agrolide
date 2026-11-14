// Fichier généré par scripts/forme/formes_alternatives.py — NE PAS ÉDITER À LA MAIN.
// Encoche solaire (forme retenue le 14/11/2026) : un tracé par format, rayons proportionnels au petit côté.
// `inscrit` = centre optique du texte (centre du plus grand cercle inscrit), en % de la boîte ;
// `compagnon` = disque du quart de soleil logé dans l'encoche, en unités du viewBox.

export interface EncocheFormat {
  w: number
  h: number
  d: string
  inscrit: [number, number]
  compagnon: { cx: number; cy: number; r: number }
}

export type EncocheFormatId = 'portrait' | 'paysage' | 'pastille' | 'vignette'

export const ENCOCHE: Record<EncocheFormatId, EncocheFormat> = {
 "portrait": {
  "w": 400,
  "h": 500,
  "d": "M0 36A36 36 0 0 1 36 0L364 0A36 36 0 0 1 400 36L400 366.73A14 14 0 0 1 387.46 380.66A120 120 0 0 0 280.66 487.46A14 14 0 0 1 266.73 500L36 500A36 36 0 0 1 0 464L0 36Z",
  "inscrit": [
   50.0,
   41.1
  ],
  "compagnon": {
   "cx": 400,
   "cy": 500,
   "r": 80.0
  }
 },
 "paysage": {
  "w": 600,
  "h": 400,
  "d": "M0 36A36 36 0 0 1 36 0L564 0A36 36 0 0 1 600 36L600 266.73A14 14 0 0 1 587.46 280.66A120 120 0 0 0 480.66 387.46A14 14 0 0 1 466.73 400L36 400A36 36 0 0 1 0 364L0 36Z",
  "inscrit": [
   33.9,
   50.0
  ],
  "compagnon": {
   "cx": 600,
   "cy": 400,
   "r": 80.0
  }
 },
 "pastille": {
  "w": 240,
  "h": 240,
  "d": "M0 21.6A21.6 21.6 0 0 1 21.6 0L218.4 0A21.6 21.6 0 0 1 240 21.6L240 160.04A8.4 8.4 0 0 1 232.48 168.39A72 72 0 0 0 168.39 232.48A8.4 8.4 0 0 1 160.04 240L21.6 240A21.6 21.6 0 0 1 0 218.4L0 21.6Z",
  "inscrit": [
   46.2,
   46.2
  ],
  "compagnon": {
   "cx": 240,
   "cy": 240,
   "r": 48.0
  }
 },
 "vignette": {
  "w": 640,
  "h": 360,
  "d": "M0 32.4A32.4 32.4 0 0 1 32.4 0L607.6 0A32.4 32.4 0 0 1 640 32.4L640 240.06A12.6 12.6 0 0 1 628.72 252.59A108 108 0 0 0 532.59 348.72A12.6 12.6 0 0 1 520.06 360L32.4 360A32.4 32.4 0 0 1 0 327.6L0 32.4Z",
  "inscrit": [
   28.6,
   50.0
  ],
  "compagnon": {
   "cx": 640,
   "cy": 360,
   "r": 72.0
  }
 }
}
