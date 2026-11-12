# Propositions d'Évolution de la Taxonomie (`v1-depart` -> `v2`)

Analyse basée sur les **1091** fiches finalisées.

## 1. Couverture des sous-domaines par domaine

| Domaine | Sous-domaine | Nb docs | Public/Membres |
|---|---|---:|---:|
| `production_vegetale` | `cereales` | 31 | 12 |
| `production_vegetale` | `legumineuses_oleagineux` | 26 | 17 |
| `production_vegetale` | `tubercules_racines` | 11 | 11 |
| `production_vegetale` | `cultures_maraicheres` | 88 | 47 |
| `production_vegetale` | `arboriculture_fruitiere` | 35 | 13 |
| `production_vegetale` | `cultures_de_rente` | 5 | 3 |
| `production_vegetale` | `plantes_aromatiques_medicinales` | 14 | 6 |
| `production_vegetale` | `horticulture_jardinage` | 15 | 0 |
| `production_vegetale` | `agronomie_generale` | 16 | 0 |
| `production_vegetale` | `protection_des_cultures` | 34 | 9 |
| `production_vegetale` | `semences_amelioration` | 10 | 4 |
| `production_vegetale` | `fertilisation_amendements` | 18 | 9 |
| `production_vegetale` | `culture_sous_abri_hors_sol` | 10 | 1 |
| `production_animale` | `aviculture` | 98 | 32 |
| `production_animale` | `ruminants` | 26 | 12 |
| `production_animale` | `porcins` | 5 | 2 |
| `production_animale` | `petit_elevage` | 18 | 9 |
| `production_animale` | `apiculture` | 5 | 1 |
| `production_animale` | `aquaculture_peche` | 35 | 9 |
| `production_animale` | `alimentation_animale` | 24 | 4 |
| `production_animale` | `sante_animale` | 36 | 8 |
| `production_animale` | `genetique_reproduction` | 2 | 0 |
| `production_animale` | `batiments_equipements_elevage` | 15 | 2 |
| `production_animale` | `elevage_general` | 15 | 2 |
| `agroeconomie` | `gestion_projet_business_plan` | 21 | 4 |
| `agroeconomie` | `entrepreneuriat_agricole` | 14 | 5 |
| `agroeconomie` | `financement_credit_assurance` | 0 | 0 |
| `agroeconomie` | `economie_filieres_marches` | 13 | 8 |
| `agroeconomie` | `agriculture_contractuelle` | 1 | 0 |
| `agroeconomie` | `politiques_strategies` | 6 | 3 |
| `agroeconomie` | `organisations_paysannes` | 1 | 0 |
| `agroeconomie` | `vulgarisation_conseil` | 1 | 0 |
| `agroeconomie` | `gestion_exploitation` | 11 | 3 |
| `agroeconomie` | `foncier_droit_agricole` | 0 | 0 |
| `agroalimentaire` | `transformation_cereales_tubercules` | 12 | 8 |
| `agroalimentaire` | `transformation_fruits_legumes` | 6 | 3 |
| `agroalimentaire` | `transformation_produits_animaux` | 21 | 13 |
| `agroalimentaire` | `huiles_sucre_corps_gras` | 5 | 4 |
| `agroalimentaire` | `boissons` | 6 | 3 |
| `agroalimentaire` | `conservation_post_recolte` | 7 | 2 |
| `agroalimentaire` | `qualite_securite_normes` | 7 | 3 |
| `agroalimentaire` | `nutrition_alimentation` | 2 | 0 |
| `agroalimentaire` | `equipements_technologie` | 6 | 2 |
| `agroalimentaire` | `entreprise_agroalimentaire` | 0 | 0 |
| `ressources_naturelles_environnement` | `sol_fertilite` | 61 | 18 |
| `ressources_naturelles_environnement` | `eau_irrigation` | 67 | 5 |
| `ressources_naturelles_environnement` | `foresterie_agroforesterie` | 14 | 2 |
| `ressources_naturelles_environnement` | `climat_changement_climatique` | 12 | 2 |
| `ressources_naturelles_environnement` | `biodiversite_ecologie` | 11 | 1 |
| `ressources_naturelles_environnement` | `agroecologie_agriculture_durable` | 24 | 12 |
| `ressources_naturelles_environnement` | `energie_dechets_valorisation` | 5 | 1 |
| `transversal` | `agriculture_generale` | 18 | 3 |
| `transversal` | `methodologie_recherche` | 1 | 1 |
| `transversal` | `sciences_de_base` | 74 | 0 |
| `transversal` | `statistiques_biometrie` | 7 | 1 |
| `transversal` | `numerique_technologies` | 3 | 1 |
| `hors_perimetre` | `aucun` | 62 | 0 |

## 2. Observations et recommandations pour `taxonomie.json` v2

- **Sous-domaines à 0 document dans ce corpus** (3) : `agroeconomie/financement_credit_assurance`, `agroeconomie/foncier_droit_agricole`, `agroalimentaire/entreprise_agroalimentaire`
- **Documents classés en `type_doc = autre`** : 33 (dont `hors_perimetre`: 10, `production_animale`: 10, `transversal`: 6, `ressources_naturelles_environnement`: 4, `production_vegetale`: 3).

### Pistes d'affinage suggérées pour la v2 :
1. **Distinction `travaux_diriges_examen` vs `cours` / `autre`** : une part importante des cours académiques contient en réalité des sujets d'examen, TD/TP corrigés et formulaires étudiants (`type_doc = autre` ou `cours`).
2. **Sous-domaine `machinisme_equipement` / `genie_rural` en `production_vegetale` ou `transversal`** : plusieurs guides techniques couvrent les couveuses artisanales, pompes solaires, matériel de transformation et bâtiments.
3. **Règles de conversion automatique (`conversion_requise`)** : 105 fichiers exploitables sont au format Office (`.docx`, `.pptx`, `.ppt`, `.doc`, `.xlsx`, `.odt`). Une conversion PDF par LibreOffice permettrait de débloquer ceux qui ont déjà des droits ouverts.
4. **Campagne OCR ciblée** : sur les 149 documents en `a_valider_humain`, une majorité sont des fiches techniques ou cours scannés sans couche texte (`ocr_necessaire`) qui peuvent être réévalués après OCR.

