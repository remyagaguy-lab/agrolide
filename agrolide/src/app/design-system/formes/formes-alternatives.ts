// Fichier généré par scripts/forme/formes_alternatives.py — NE PAS ÉDITER À LA MAIN.
// Formes alternatives à l'arche : tracés par format (rayons proportionnels au petit côté) et mesures.

export interface FormeFormat {
  w: number
  h: number
  d: string
  /** Part de la boîte visible (donc de la photo conservée), en % */
  conserve: number
  /** Centre de gravité, en % de la boîte */
  gravite: [number, number]
  /** Centre du plus grand cercle inscrit (centre optique du texte), en % de la boîte */
  inscrit: [number, number]
  /** Diamètre du plus grand cercle inscrit, en % du petit côté */
  diametre: number
  /** Vignette : plage horizontale sûre pour un titre (bande de 60 à 92 % de la hauteur), en % */
  texte?: [number, number]
  compagnon?: { cx: number; cy: number; r: number }
}

export type FormeId = 'petale' | 'goutte' | 'alveole' | 'colline' | 'encoche' | 'galet'
export type FormatId = 'portrait' | 'paysage' | 'pastille' | 'vignette'

export const FORMES_ALTERNATIVES: Record<FormeId, Record<FormatId, FormeFormat>> = {
 "petale": {
  "portrait": {
   "w": 400,
   "h": 500,
   "d": "M0 184A184 184 0 0 1 184 0L372 0A28 28 0 0 1 400 28L400 316A184 184 0 0 1 216 500L28 500A28 28 0 0 1 0 472L0 184Z",
   "conserve": 92.5,
   "gravite": [
    50.0,
    50.0
   ],
   "inscrit": [
    50.0,
    41.1
   ],
   "diametre": 100.0
  },
  "paysage": {
   "w": 600,
   "h": 400,
   "d": "M0 184A184 184 0 0 1 184 0L572 0A28 28 0 0 1 600 28L600 216A184 184 0 0 1 416 400L28 400A28 28 0 0 1 0 372L0 184Z",
   "conserve": 93.8,
   "gravite": [
    50.0,
    50.0
   ],
   "inscrit": [
    33.9,
    50.0
   ],
   "diametre": 100.0
  },
  "pastille": {
   "w": 240,
   "h": 240,
   "d": "M0 110.4A110.4 110.4 0 0 1 110.4 0L223.2 0A16.8 16.8 0 0 1 240 16.8L240 129.6A110.4 110.4 0 0 1 129.6 240L16.8 240A16.8 16.8 0 0 1 0 223.2L0 110.4Z",
   "conserve": 90.6,
   "gravite": [
    50.0,
    50.0
   ],
   "inscrit": [
    50.0,
    50.0
   ],
   "diametre": 100.0
  },
  "vignette": {
   "w": 640,
   "h": 360,
   "d": "M0 165.6A165.6 165.6 0 0 1 165.6 0L614.8 0A25.2 25.2 0 0 1 640 25.2L640 194.4A165.6 165.6 0 0 1 474.4 360L25.2 360A25.2 25.2 0 0 1 0 334.8L0 165.6Z",
   "conserve": 94.7,
   "gravite": [
    50.0,
    50.0
   ],
   "inscrit": [
    28.6,
    50.0
   ],
   "diametre": 100.0,
   "texte": [
    4.0,
    84.7
   ]
  }
 },
 "goutte": {
  "portrait": {
   "w": 400,
   "h": 500,
   "d": "M0 200A200 200 0 0 1 200 0A200 200 0 0 1 400 200L400 300A200 200 0 0 1 200 500L20 500A20 20 0 0 1 0 480L0 200Z",
   "conserve": 87.0,
   "gravite": [
    48.1,
    52.0
   ],
   "inscrit": [
    50.0,
    41.1
   ],
   "diametre": 100.0
  },
  "paysage": {
   "w": 600,
   "h": 400,
   "d": "M0 200A200 200 0 0 1 200 0L400 0A200 200 0 0 1 600 200A200 200 0 0 1 400 400L20 400A20 20 0 0 1 0 380L0 200Z",
   "conserve": 89.2,
   "gravite": [
    48.3,
    51.5
   ],
   "inscrit": [
    35.7,
    50.0
   ],
   "diametre": 100.0
  },
  "pastille": {
   "w": 240,
   "h": 240,
   "d": "M0 120A120 120 0 0 1 120 0A120 120 0 0 1 240 120A120 120 0 0 1 120 240L12 240A12 12 0 0 1 0 228L0 120Z",
   "conserve": 83.7,
   "gravite": [
    47.5,
    52.5
   ],
   "inscrit": [
    50.0,
    50.0
   ],
   "diametre": 99.9
  },
  "vignette": {
   "w": 640,
   "h": 360,
   "d": "M0 180A180 180 0 0 1 180 0L460 0A180 180 0 0 1 640 180A180 180 0 0 1 460 360L18 360A18 18 0 0 1 0 342L0 180Z",
   "conserve": 90.9,
   "gravite": [
    48.6,
    51.3
   ],
   "inscrit": [
    30.4,
    50.0
   ],
   "diametre": 100.0,
   "texte": [
    4.0,
    83.1
   ]
  }
 },
 "alveole": {
  "portrait": {
   "w": 400,
   "h": 500,
   "d": "M181.98 11.26A34 34 0 0 1 218.02 11.26L384.02 115.01A34 34 0 0 1 400 143.84L400 356.16A34 34 0 0 1 384.02 384.99L218.02 488.74A34 34 0 0 1 181.98 488.74L15.98 384.99A34 34 0 0 1 0 356.16L0 143.84A34 34 0 0 1 15.98 115.01Z",
   "conserve": 74.8,
   "gravite": [
    50.0,
    50.0
   ],
   "inscrit": [
    50.0,
    48.2
   ],
   "diametre": 100.0
  },
  "paysage": {
   "w": 600,
   "h": 400,
   "d": "M139.8 13.6A34 34 0 0 1 167 0L433 0A34 34 0 0 1 460.2 13.6L584.7 179.6A34 34 0 0 1 584.7 220.4L460.2 386.4A34 34 0 0 1 433 400L167 400A34 34 0 0 1 139.8 386.4L15.3 220.4A34 34 0 0 1 15.3 179.6Z",
   "conserve": 74.8,
   "gravite": [
    50.0,
    50.0
   ],
   "inscrit": [
    42.9,
    50.0
   ],
   "diametre": 100.0
  },
  "pastille": {
   "w": 240,
   "h": 240,
   "d": "M109.8 5.89A20.4 20.4 0 0 1 130.2 5.89L213.72 54.11A20.4 20.4 0 0 1 223.92 71.78L223.92 168.22A20.4 20.4 0 0 1 213.72 185.89L130.2 234.11A20.4 20.4 0 0 1 109.8 234.11L26.28 185.89A20.4 20.4 0 0 1 16.08 168.22L16.08 71.78A20.4 20.4 0 0 1 26.28 54.11Z",
   "conserve": 64.7,
   "gravite": [
    50.0,
    50.0
   ],
   "inscrit": [
    50.0,
    50.0
   ],
   "diametre": 86.6
  },
  "vignette": {
   "w": 640,
   "h": 360,
   "d": "M150.87 10.27A30.6 30.6 0 0 1 173.74 0L466.26 0A30.6 30.6 0 0 1 489.13 10.27L621.93 159.67A30.6 30.6 0 0 1 621.93 200.33L489.13 349.73A30.6 30.6 0 0 1 466.26 360L173.74 360A30.6 30.6 0 0 1 150.87 349.73L18.07 200.33A30.6 30.6 0 0 1 18.07 159.67Z",
   "conserve": 74.8,
   "gravite": [
    50.0,
    50.0
   ],
   "inscrit": [
    39.3,
    50.0
   ],
   "diametre": 100.0,
   "texte": [
    24.8,
    75.2
   ]
  }
 },
 "colline": {
  "portrait": {
   "w": 400,
   "h": 500,
   "d": "M28 500L372 500A28 28 0 0 0 400 472L400 103A28 28 0 0 0 372 75C344 75 312 0 256 0C152 0 80 140 28 140A28 28 0 0 0 0 168L0 472A28 28 0 0 0 28 500Z",
   "conserve": 87.9,
   "gravite": [
    51.9,
    55.4
   ],
   "inscrit": [
    50.0,
    55.4
   ],
   "diametre": 100.0
  },
  "paysage": {
   "w": 600,
   "h": 400,
   "d": "M28 400L572 400A28 28 0 0 0 600 372L600 88A28 28 0 0 0 572 60C516 60 468 0 384 0C228 0 120 112 28 112A28 28 0 0 0 0 140L0 372A28 28 0 0 0 28 400Z",
   "conserve": 88.2,
   "gravite": [
    51.9,
    55.3
   ],
   "inscrit": [
    63.3,
    50.0
   ],
   "diametre": 99.9
  },
  "pastille": {
   "w": 240,
   "h": 240,
   "d": "M16.8 240L223.2 240A16.8 16.8 0 0 0 240 223.2L240 52.8A16.8 16.8 0 0 0 223.2 36C206.4 36 187.2 0 153.6 0C91.2 0 48 67.2 16.8 67.2A16.8 16.8 0 0 0 0 84L0 223.2A16.8 16.8 0 0 0 16.8 240Z",
   "conserve": 87.8,
   "gravite": [
    51.9,
    55.4
   ],
   "inscrit": [
    54.0,
    54.0
   ],
   "diametre": 92.0
  },
  "vignette": {
   "w": 640,
   "h": 360,
   "d": "M25.2 360L614.8 360A25.2 25.2 0 0 0 640 334.8L640 79.2A25.2 25.2 0 0 0 614.8 54C550.4 54 499.2 0 409.6 0C243.2 0 128 100.8 25.2 100.8A25.2 25.2 0 0 0 0 126L0 334.8A25.2 25.2 0 0 0 25.2 360Z",
   "conserve": 88.3,
   "gravite": [
    51.9,
    55.3
   ],
   "inscrit": [
    64.0,
    50.0
   ],
   "diametre": 100.0,
   "texte": [
    4.0,
    96.0
   ]
  }
 },
 "encoche": {
  "portrait": {
   "w": 400,
   "h": 500,
   "d": "M0 36A36 36 0 0 1 36 0L364 0A36 36 0 0 1 400 36L400 380A120 120 0 0 0 280 500L36 500A36 36 0 0 1 0 464L0 36Z",
   "conserve": 93.9,
   "gravite": [
    47.8,
    47.7
   ],
   "inscrit": [
    50.0,
    41.1
   ],
   "diametre": 100.0,
   "compagnon": {
    "cx": 400,
    "cy": 500,
    "r": 80.0
   }
  },
  "paysage": {
   "w": 600,
   "h": 400,
   "d": "M0 36A36 36 0 0 1 36 0L564 0A36 36 0 0 1 600 36L600 280A120 120 0 0 0 480 400L36 400A36 36 0 0 1 0 364L0 36Z",
   "conserve": 94.9,
   "gravite": [
    48.0,
    48.2
   ],
   "inscrit": [
    33.9,
    50.0
   ],
   "diametre": 100.0,
   "compagnon": {
    "cx": 600,
    "cy": 400,
    "r": 80.0
   }
  },
  "pastille": {
   "w": 240,
   "h": 240,
   "d": "M0 21.6A21.6 21.6 0 0 1 21.6 0L218.4 0A21.6 21.6 0 0 1 240 21.6L240 168A72 72 0 0 0 168 240L21.6 240A21.6 21.6 0 0 1 0 218.4L0 21.6Z",
   "conserve": 92.4,
   "gravite": [
    47.2,
    47.2
   ],
   "inscrit": [
    46.2,
    46.2
   ],
   "diametre": 92.3,
   "compagnon": {
    "cx": 240,
    "cy": 240,
    "r": 48.0
   }
  },
  "vignette": {
   "w": 640,
   "h": 360,
   "d": "M0 32.4A32.4 32.4 0 0 1 32.4 0L607.6 0A32.4 32.4 0 0 1 640 32.4L640 252A108 108 0 0 0 532 360L32.4 360A32.4 32.4 0 0 1 0 327.6L0 32.4Z",
   "conserve": 95.7,
   "gravite": [
    48.3,
    48.5
   ],
   "inscrit": [
    28.6,
    50.0
   ],
   "diametre": 100.0,
   "texte": [
    4.0,
    79.8
   ],
   "compagnon": {
    "cx": 640,
    "cy": 360,
    "r": 72.0
   }
  }
 },
 "galet": {
  "portrait": {
   "w": 400,
   "h": 500,
   "d": "M0 230A232 230 0 0 1 232 0A168 200 0 0 1 400 200A208 300 0 0 1 192 500A192 270 0 0 1 0 230Z",
   "conserve": 78.3,
   "gravite": [
    50.3,
    49.0
   ],
   "inscrit": [
    49.9,
    44.9
   ],
   "diametre": 99.4
  },
  "paysage": {
   "w": 600,
   "h": 400,
   "d": "M0 184A348 184 0 0 1 348 0A252 160 0 0 1 600 160A312 240 0 0 1 288 400A288 216 0 0 1 0 184Z",
   "conserve": 78.3,
   "gravite": [
    50.3,
    49.0
   ],
   "inscrit": [
    51.2,
    50.1
   ],
   "diametre": 99.2
  },
  "pastille": {
   "w": 240,
   "h": 240,
   "d": "M0 110.4A139.2 110.4 0 0 1 139.2 0A100.8 96 0 0 1 240 96A124.8 144 0 0 1 115.2 240A115.2 129.6 0 0 1 0 110.4Z",
   "conserve": 78.3,
   "gravite": [
    50.3,
    49.0
   ],
   "inscrit": [
    48.9,
    50.1
   ],
   "diametre": 96.3
  },
  "vignette": {
   "w": 640,
   "h": 360,
   "d": "M0 165.6A371.2 165.6 0 0 1 371.2 0A268.8 144 0 0 1 640 144A332.8 216 0 0 1 307.2 360A307.2 194.4 0 0 1 0 165.6Z",
   "conserve": 78.3,
   "gravite": [
    50.3,
    49.0
   ],
   "inscrit": [
    52.1,
    50.0
   ],
   "diametre": 99.3,
   "texte": [
    26.9,
    69.8
   ]
  }
 }
}
