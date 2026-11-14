# Production et validation

Comment un contenu passe de l'idée à la publication, qui valide quoi, et ce que contrôle la machine.

## Le chemin

```
sujet  ->  public et registre  ->  cadrage  ->  rédaction  ->  validation technique  ->  validation éditoriale  ->  publication  ->  suivi
```

| Étape | Qui | Outil |
|---|---|---|
| Public et registre | Responsable de la ligne éditoriale | `06-publics-et-registres.md` |
| Cadrage (livrable en 11 points) | Assistant | skill `agrolide-cadrage-article` |
| Rédaction | Assistant | skill `agrolide-redaction-article` |
| Validation technique | Référent du domaine | humain, obligatoire si le sujet est technique (voir `04-lignes-rouges.md`) |
| Validation éditoriale | Responsable communication | humain, appuyé par `npm run ed:check` |
| Publication | Responsable communication | `npm run ed:publier` (brouillon puis publié) |
| Suivi | Responsable communication | indicateurs de `09-objectifs-et-cta.md` |

## L'en-tête d'un contenu

Chaque cadrage et chaque article porte un en-tête qui permet de le classer et de le contrôler :

```
statut: cadrage | redaction | valide | publie
sujet: ...
public: producteur | technicien_conseiller | etudiant | enseignant_chercheur | entrepreneur_porteur_projet | decideur_institution
registre: Terrain | Parcours | Expertise | Partenariat
niveau: initiation | intermediaire | expert
domaine: production_animale (code de la taxonomie)
pilier: ...
objectif: ...
categorie: ... (catégorie du blog)
cta: ...
cta_cible: DOC-xxxxx
documents_lies: [DOC-xxxxx]
validation_technique: a faire | non requise | faite par <nom>
```

`npm run ed:check` refuse un article ou un cadrage sans `registre`.

## Rôles

| Rôle | Mission | État |
|---|---|---|
| Responsable de la ligne éditoriale | Garant de la charte, choisit le public et le registre | À nommer |
| Référents techniques par domaine | Valident le fond avant publication. Condition de la valeur Excellence | Membres Professionnels ou Séniors du domaine |
| Community Manager | Diffusion sur les canaux | À nommer |

## Contrôle automatique

`npm run ed:check` (dans `agrolide/`) applique les règles mesurables :

- Erreurs : tiret long ou demi-cadratin, « Agrolide » avec majuscule, BIFERA sans mention d'ex-nom, registre absent d'un article.
- Avertissements : première personne du singulier, tutoiement, tiret espacé, « entrepreneur agricole ».
- Ligne légitime exceptionnelle : commentaire `editorial:ignore` sur la même ligne.

Le contrôle ne dit pas si le texte est clair ni juste. Il ne remplace ni la relecture technique ni la lecture d'un humain du public visé.

## Un test de lecture

Avant publication d'un contenu Terrain, le faire lire à une personne du public visé (un technicien, un éleveur). Si elle ne peut pas dire en deux phrases ce qu'elle va faire, le texte est à reprendre.

## Chantiers

Les chantiers à concevoir vivent dans `agrolide/editorial/chantiers/`. Premier : `01-import-documents-sans-doublon.md`.
