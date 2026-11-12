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
  sillons: Cercle[];
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
 "sillons": [
  {
   "c": [
    1340.75,
    1859.41
   ],
   "r": 895.59
  },
  {
   "c": [
    1339.35,
    1874.78
   ],
   "r": 848.59
  },
  {
   "c": [
    1339.32,
    1815.12
   ],
   "r": 736.46
  },
  {
   "c": [
    1335.67,
    1800.05
   ],
   "r": 658.68
  },
  {
   "c": [
    1357.7,
    1779.03
   ],
   "r": 590.66
  },
  {
   "c": [
    1360.37,
    1791.13
   ],
   "r": 540.01
  }
 ],
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
