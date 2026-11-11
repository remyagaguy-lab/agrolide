# Vectorisation des formes agrolide

Tracé **depuis les pixels** (aucun point dessiné à la main) de l'emblème du favicon et du marqueur « Forme »,
puis contrôle quantitatif et visuel. Les sorties alimentent `public/design-assets/`, les composants
`src/components/brand` (via `forme-paths.ts`, généré) et le composant `Logo`.

## Sources (lecture seule, hors dépôt : `Branding/Identité/`)
| Source | Produit | Style |
|---|---|---|
| `Favicon agrolide.png` (2000 px) | `emblem-couleur.svg` | emblème couleur (5 aplats) |
| idem | `emblem-plein.svg` | silhouette pleine (équivaut à `favicon-forme-*`) |
| idem | `emblem-creux.svg` | contour, trait de 3 px (équivaut à `favicon-contour-*`) |
| `Marqueurs/Forme agrolide.png` (2752 px) | `arche-creux.svg` | arche épaisse + bande en contour |
| `Marqueurs/forme plein agrolide.png` (895 px) | `arche-plein.svg` | dôme + bande pleins |

## Utilisation
```bash
python -m venv .venv-forme && .venv-forme/Scripts/pip install -r scripts/forme/requirements.txt   # ou bin/pip
python scripts/forme/vectorize.py --src "<chemin>/Branding/Identité"    # trace + écrit les SVG et forme-paths.ts
python scripts/forme/verify.py  --src "<chemin>/Branding/Identité"      # IoU, écart de bord, images de différence, planches 16-96 px
python scripts/forme/icons.py                                            # icônes proposées (public/design-assets/icons)
```
`--src` peut être remplacé par la variable `AGROLIDE_BRANDING_DIR` ; sans l'un ni l'autre, le dossier
`Branding/Identité` est cherché dans les dossiers parents. Ces outils ne sont **pas** des dépendances de
production : ils ne figurent pas dans `package.json`, et les SVG générés sont versionnés.

## Méthode (`bezier_trace.py`)
1. **Champ de couverture** : pour l'emblème, démélange à deux pôles de chaque pixel (blanc, vert, orange, jaune,
   deux verts de feuille) : on obtient, par couleur, la part réelle de couverture, d'où des frontières exactes
   (niveau 0,5) y compris entre aplats voisins. Pour les marqueurs : écart au blanc normalisé.
2. **Contour sous-pixel** : suréchantillonnage bicubique ×4, marching squares (contourpy) au niveau 0,5.
3. **Lissage dépendant de la courbure** : la source est un agrandissement à marches d'escalier de ~10 px
   (période) et ~1 px (amplitude). Les portions douces sont lissées fortement (σ 14 px, biais compensé) ;
   extrémités arrondies et coins (rayon < 14 px) à peine (σ 1,5 px).
4. **Ajustement de Schneider** (moindres carrés, reparamétrage de Newton), tangentes partagées (G1),
   fusion des segments redondants, angles vifs détectés (virage > 60° sur ±3 px).
5. **Couches** de l'emblème couleur : chaque couche inférieure passe sous le trait vert (8 px pour les bases,
   3 px pour les tons) ; aucun liseré ne dépasse, quel que soit le lissage indépendant de chaque contour.

## Contrôle (`verify.py`)
Rastérisation resvg à l'échelle exacte de la source, IoU du masque, distance entre le tracé (Bézier
échantillonnées) et le contour sous-pixel de la source (moyenne, p95, max), images de différence
(rouge : vecteur en trop, bleu : manque), planches 16/24/32/48/96 px sur fond clair, vert `#1b5e38` et `#101510`.
Les scores sont consignés dans le dossier de notes (`Design-System-formes-verification.md`).
