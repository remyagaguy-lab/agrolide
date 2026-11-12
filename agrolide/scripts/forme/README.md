# Vectorisation des formes agrolide

Tracé **depuis les pixels** (aucun point dessiné à la main) de l'emblème du favicon et du marqueur « Forme »,
puis contrôle quantitatif et visuel. Les sorties alimentent `public/design-assets/`, les composants
`src/components/brand` (via `forme-paths.ts`, généré) et le composant `Logo`.

## Sources (lecture seule, hors dépôt : `Branding/Identité/`)
| Source | Produit | Style |
|---|---|---|
| `Favicon agrolide.png` (2000 px) | `emblem-couleur.svg` | emblème couleur (5 aplats) |
| idem (`primitives.py`) | `emblem-noir.svg`, `emblem-blanc.svg`, `emblem-contour.svg` | même dessin en une couleur, soleil détaché des collines par un filet d'un demi-trait ; contour |
| idem (`primitives.py`) | `arche.svg`, `fenetre.svg`, `emblem-eclate.svg` | le dôme, son ciel, l'emblème éclaté (pièces détachées) |

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

## Motif (`vectorize_motif.py`)
`Motif agrolide transparent.png` -> `motif-couleur.svg` (tuile couleur) et `motif-masque.svg` (alpha ton sur ton,
pour `mask-image` : `Motif.tsx`). Le réseau (a = 204 px, b = (102 ; 208,8)) est régulier sur les rangées 2 à 6 : elles
sont repliées sur une cellule de 204 x 417,5 (moyenne de ~40 répétitions, bruit supprimé) puis tracées avec le
même moteur ; la tuile est raccordable sans couture (anneaux tracés sur un pavage 3 x 3).

Variante **plantes seules** (sans collines), défaut de `Motif` : `motif-plantes-masque.svg` / `motif-plantes-couleur.svg`.
Les petits tirets en arc au-dessus des plantes (leur « chapeau ») sont conservés ; seules les grosses collines sombres sont retirées (`--sans-tirets` les efface aussi). `--pieds 2` dessine le second pied de
chaque plante en symétrie (non retenu : `1` par défaut).

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

## Primitives de l'emblème (`primitives.py`)
L'emblème se décompose en cercles ; le script le **mesure** (aucun point posé à la main) et en tire les primitives du design system :
- **soleil** : 4 cercles concentriques (soleil clair, soleil, anneau int./ext.), frontières radiales au niveau 0,5 du champ de
  couverture sur 61 rayons de la moitié haute, ajustement de cercle (moindres carrés) ; rapports des échos ×1,162 / ×1,339 / ×1,518 ;
- **anneau** : couronne et ouverture (angles où la couronne est blanche) ;
- **horizon** : arcs des deux collines (bas du ciel = croissant blanc + soleil) et leur creux en V ;
- **sillons** : bords des deux bandes blanches de droite (arcs de centres décalés sous la feuille) ;
- **feuille** : lentille, intersection de deux disques ajustés sur l'intérieur de la feuille.
- **traits** (sillons) : axes des trois traits verts (milieux des bords sous-pixel appariés), épaisseur = distance des bords
  (61,8 à 62,7 px, comme l'anneau : l'emblème est tracé d'un seul trait) ; bout rond du grand sillon suivi sur les pixels ;
- **arche** : le dôme = silhouette au-dessus de la 1re ligne blanche (bande gauche + sillon 1) ;
- **éclaté** : le dôme + colline, grand sillon et feuille détachés (chaque pièce = aplat intérieur + un demi-trait, coins arrondis) ;
- **emblème en une couleur** : réseau vert d'origine + soleil détaché des collines par un filet d'un demi-trait (31 px) ;
  **fenêtre** = le ciel (disque intérieur de l'anneau au-dessus des collines) ; centre optique du dôme pour les badges.

```bash
python scripts/forme/primitives.py --src "<chemin>/Branding/Identité"
```
Sorties : `src/components/brand/geometrie.ts` (consommé par `PlanSoleil`, `Sillons`, `Horizon`, `Feuille`, `Anneau`),
`public/design-assets/{soleil,anneau,horizon,sillons,feuille,arche,fenetre,emblem-eclate,emblem-noir,emblem-blanc,emblem-contour}.svg`, `scripts/forme/primitives.json` (mesures, résidus, IoU).
Résidus moyens 0,2 à 0,9 px ; IoU de contrôle 0,95 à 0,99. Règles d'usage : page `/design-system#grammaire`.

## Formes retirées (12/11/2026)
L'emblème « plein » (silhouette, le « cercle à sillons ») et l'arche des marqueurs (dôme + sillon accolé) sont retirés du design
system : la silhouette pleine se confondait avec l'identité d'une autre marque et le marqueur ne coïncidait qu'à 85 % avec l'emblème.
Les marqueurs restent dans `Branding/Identité/Marqueurs` mais ne sont plus tracés.
