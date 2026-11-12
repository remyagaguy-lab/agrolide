# Rapport Final de Classification — Bibliothèque Agrolide

- **Total documents inventoriés** : 1091
- **Validation schéma JSON (R1..R7)** : 1091/1091 valides (0 erreurs)
- **Documents prêts à publier (public + membres)** : 321 (`public`: 248, `membres`: 73)

## 1. Répartition par décision de publication

| Décision | Nombre | % |
|---|---:|---:|
| `non_publie_archive` | 474 | 43.4% |
| `public` | 248 | 22.7% |
| `a_valider_humain` | 149 | 13.7% |
| `exclu_doublon` | 83 | 7.6% |
| `membres` | 73 | 6.7% |
| `exclu_hors_perimetre` | 58 | 5.3% |
| `exclu_illisible` | 6 | 0.5% |

## 2. Répartition par domaine principal

| Domaine | Nombre | Public | Membres |
|---|---:|---:|---:|
| `production_vegetale` | 313 | 120 | 12 |
| `production_animale` | 279 | 57 | 24 |
| `ressources_naturelles_environnement` | 194 | 28 | 13 |
| `transversal` | 103 | 1 | 5 |
| `agroalimentaire` | 72 | 31 | 7 |
| `agroeconomie` | 68 | 11 | 12 |
| `hors_perimetre` | 62 | 0 | 0 |

## 3. Répartition par type de document

| Type | Nombre | Public | Membres |
|---|---:|---:|---:|
| `guide_pratique` | 309 | 122 | 15 |
| `cours` | 232 | 0 | 1 |
| `fiche_technique` | 183 | 88 | 1 |
| `ouvrage` | 79 | 0 | 4 |
| `outil_modele` | 77 | 22 | 3 |
| `presentation` | 60 | 6 | 7 |
| `rapport` | 36 | 1 | 21 |
| `autre` | 33 | 0 | 0 |
| `article` | 26 | 5 | 16 |
| `memoire` | 21 | 0 | 0 |
| `periodique` | 13 | 2 | 1 |
| `texte_officiel` | 10 | 2 | 1 |
| `actes_conference` | 6 | 0 | 3 |
| `these` | 6 | 0 | 0 |

## 4. Répartition par statut des droits

| Statut droits | Nombre |
|---|---:|
| `diffusion_institutionnelle` | 474 |
| `travail_academique_non_publie` | 227 |
| `inconnu` | 205 |
| `droits_reserves_commercial` | 150 |
| `libre_licence_ouverte` | 27 |
| `donnees_personnelles_confidentiel` | 8 |

## 5. Rôles de dédoublonnage & formats

| Rôle doublon | Nombre |
|---|---:|
| `unique` | 931 |
| `canonique` | 77 |
| `copie_exacte` | 67 |
| `copie_quasi_identique` | 11 |
| `fragment` | 4 |
| `version_anterieure` | 1 |

| Format source | Nombre |
|---|---:|
| `pdf` | 986 |
| `docx` | 68 |
| `pptx` | 21 |
| `ppt` | 8 |
| `doc` | 6 |
| `xlsx` | 1 |
| `odt` | 1 |

## 6. Livrables générés

- `pipeline/output/fiches/DOC-*.json` — Fiches individuelles conformes au schéma
- `pipeline/output/rapport/inventaire_complet.csv` — Tableau maître des 1 091 documents
- `pipeline/output/rapport/prets_a_publier.csv` — Documents validés pour mise en ligne (`public` + `membres`)
- `pipeline/output/rapport/a_valider_humain.md` — Liste des cas nécessitant arbitrage humain
- `pipeline/output/rapport/dedup_groups.json` & `ensembles.json` — Groupes de doublons et séries multi-parties