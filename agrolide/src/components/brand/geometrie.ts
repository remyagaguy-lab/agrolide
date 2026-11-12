// Fichier généré par scripts/forme/primitives.py — NE PAS ÉDITER À LA MAIN.
// Géométrie de l'emblème MESURÉE sur les pixels de « Favicon agrolide.png » (repère 2000 x 2000 px, y vers le bas).
// L'emblème se décompose en cercles : système concentrique du soleil, arcs des collines et des sillons,
// lentille de la feuille. Résidus d'ajustement et IoU de contrôle : scripts/forme/primitives.json.

export interface Cercle {
  c: [number, number];
  r: number;
}

export interface GeometrieEmbleme {
  repere: string;
  centre: [number, number];
  rayons: { 'soleil-clair': number; soleil: number; 'anneau-int': number; 'anneau-ext': number };
  anneauOuverture: [number, number];
  horizon: { gauche: Cercle; droite: Cercle; creux: [number, number] };
  arche: { dome: string; bande: string; ciel: string; viewBox: [number, number, number, number]; cielInscrit: Cercle; domeInscrit: Cercle; domeCentre: [number, number]; cielViewBox: [number, number, number, number] };
  traits: { liste: { d: string; epaisseur: number; boutRond: boolean }[]; viewBox: [number, number, number, number] };
  feuille: { haut: Cercle; bas: Cercle; pointes: [number, number][] };
  feuilleD: string;
  feuilleVB: [number, number, number, number];
  anneauD: { d: string; epaisseur: number; rayon: number };
}

export const GEOMETRIE: GeometrieEmbleme = {
 "repere": "pixels de Favicon agrolide.png (2000 x 2000, y vers le bas)",
 "centre": [
  1007.62,
  996.08
 ],
 "rayons": {
  "soleil-clair": 339.58,
  "soleil": 394.57,
  "anneau-int": 454.56,
  "anneau-ext": 515.49
 },
 "anneauOuverture": [
  106.5,
  133.4
 ],
 "horizon": {
  "gauche": {
   "c": [
    611.24,
    1567.31
   ],
   "r": 683.45
  },
  "droite": {
   "c": [
    1340.75,
    1859.41
   ],
   "r": 895.59
  },
  "creux": [
   1023.23,
   1022.0
  ]
 },
 "feuille": {
  "haut": {
   "c": [
    1360.37,
    1791.13
   ],
   "r": 540.01
  },
  "bas": {
   "c": [
    1002.82,
    998.16
   ],
   "r": 465.16
  },
  "pointes": [
   [
    935.08,
    1458.36
   ],
   [
    1392.56,
    1252.08
   ]
  ]
 },
 "arche": {
  "dome": "M493.63 956.73A515.49 515.49 0 1 1 1520.71 1045.8A848.59 848.59 0 0 0 1011.38 1092.13A621.15 621.15 0 0 0 493.63 956.73Z",
  "bande": "M730.58 1404.32A726.7 726.7 0 0 1 1512.48 1100.24A515.49 515.49 0 0 1 1496.17 1160.55A664.23 664.23 0 0 0 782.67 1438.79A31.23 31.23 0 0 1 730.58 1404.32Z",
  "ciel": "M566.76 885.31A454.56 454.56 0 0 1 1461.54 972A895.59 895.59 0 0 0 1023.23 1022A683.45 683.45 0 0 0 566.76 885.31Z",
  "viewBox": [
   493.63,
   480.6,
   1029.47,
   972.19
  ],
  "cielInscrit": {
   "c": [
    1063,
    775
   ],
   "r": 225.3
  },
  "domeInscrit": {
   "c": [
    1064,
    776
   ],
   "r": 286.2
  },
  "domeCentre": [
   1007.62,
   785.5
  ],
  "cielViewBox": [
   566.76,
   541.52,
   894.78,
   480.48
  ]
 },
 "traits": {
  "liste": [
   {
    "d": "M1023.23 1055.09A864.46 864.46 0 0 1 1662.18 1056.7",
    "epaisseur": 61.75,
    "boutRond": true
   },
   {
    "d": "M756.62 1421.56A695.46 695.46 0 0 1 1662.18 1190.78",
    "epaisseur": 62.47,
    "boutRond": true
   },
   {
    "d": "M863.02 1518.36A557.33 557.33 0 0 1 1662.18 1311.05",
    "epaisseur": 62.65,
    "boutRond": false
   }
  ],
  "viewBox": [
   735.98,
   968.4,
   726.2,
   489.96
  ]
 },
 "feuilleD": "M935.08 1458.36A540.01 540.01 0 0 1 1392.56 1252.08A465.16 465.16 0 0 1 935.08 1458.36Z",
 "feuilleVB": [
  935.08,
  1251.12,
  457.48,
  212.2
 ],
 "anneauD": {
  "d": "M652.9 1326.87A485.02 485.02 0 1 1 899.33 1468.86",
  "epaisseur": 60.93,
  "rayon": 485.02
 }
};
