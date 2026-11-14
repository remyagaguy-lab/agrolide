# Système éditorial agrolide

Source de vérité de tout ce qu'agrolide écrit : site, articles, réseaux sociaux, formations, e-books, livres.
C'est l'équivalent éditorial du design system : des règles écrites une seule fois, organisées en couches, appliquées partout, contrôlées par script.

À lire en premier : `ROADMAP.md` (objectif, bilan, architecture cible, phases, règles de travail pour tout agent).

## L'idée en une phrase

agrolide rend le savoir agricole compréhensible et utilisable par tous les acteurs de la chaîne. Le lecteur change d'un contenu à l'autre, la voix de fond reste la même. Pour garder la cohérence, chaque contenu suit une chaîne de décisions : un public, un registre, un format, un canal.

## Le socle : les couches de la charte (`charte/`)

Comme le design system va des jetons aux pages, la charte va des invariants aux canaux. Chaque couche s'appuie sur la précédente.

| Couche | Fichier | Ce qu'elle fixe |
|---|---|---|
| 0. Décisions | `00-decisions.md` | Journal des arbitrages. À lire en premier |
| A. Fondations (ne changent jamais) | `01-identite.md` | Qui est agrolide, mission, valeurs, quatre freins, catégories de membres |
| | `02-langue-et-typographie.md` | Marque, lexique, tirets, nombres, polices |
| | `03-ecriture-naturelle.md` | Neutraliser les tics d'écriture générée |
| | `04-lignes-rouges.md` | Sujets à éviter, exactitude, droits, modération |
| B. Posture | `05-promesse-et-voix.md` | La promesse (rendre le savoir utilisable), la voix, le cadran de voix |
| C. Lecteurs | `06-publics-et-registres.md` | Six publics, quatre registres (Terrain, Parcours, Expertise, Partenariat) et leurs réglages |
| | `07-personas.md` | Les lecteurs types |
| D. Contenu | `08-themes-piliers-angles.md` | Thème (taxonomie de la bibliothèque), pilier, angle, mots-clés |
| | `09-objectifs-et-cta.md` | Objectifs, appels à l'action, indicateurs |
| | `10-preuves-et-sources.md` | Sourcer et citer, familles de sources, statuts, documents à indexer |
| E. Diffusion | `11-formats.md` | Formats et quatre gabarits d'article |
| | `12-canaux.md` | Canaux et registre par défaut |
| F. Processus | `13-production-et-validation.md` | Chemin, en-tête, rôles, contrôle, test de lecture |

## La chaîne de décisions d'un contenu

```
sujet  ->  public (06)  ->  registre (06)  ->  objectif et CTA (09)  ->  gabarit et format (11)  ->  canal (12)
```

Les fondations (A) et les lignes rouges ne dépendent pas de la chaîne : elles s'appliquent toujours. Le registre règle le reste : proximité, densité technique, preuves visibles, longueur, gabarit, CTA.

Exemple : un même savoir, quatre registres, dans `06-publics-et-registres.md`.

## Les couches techniques

| Couche | Rôle | Où |
|---|---|---|
| Socle | La charte ci-dessus | `agrolide/editorial/charte/` |
| Procédures | Comment faire chaque tâche, écrites sans nom d'outil. Elles lisent la charte, ne la recopient pas | `agrolide/editorial/procedures/` |
| Rôles | Qui fait quoi (phase 3) | `agrolide/editorial/roles/` |
| Garde-fous | Scripts qui échouent quand un contenu viole une règle mesurable | `agrolide/scripts/ed-*.mjs`, `editorial-check.mjs` |
| Preuves | Modèles de référence, briefs d'évaluation et sorties d'agents notées | `agrolide/editorial/modeles/`, `agrolide/editorial/evaluations/` |
| Adaptateurs | Skills générés pour chaque outil. Jamais édités à la main | `agrolide/.agents/skills/agrolide-*`, `agrolide/.claude/skills/agrolide-*` |

Point d'entrée universel : `agrolide/.agents/AGENTS.md` (section « Système éditorial »). Il renvoie vers ce dossier.

Règle d'or : une règle n'existe qu'à un seul endroit. Si une procédure et la charte se contredisent, la charte gagne et la procédure est corrigée. Pour modifier un skill, on modifie sa procédure puis on lance `npm run ed:sync`.

## Contenus produits

Article modèle de référence pour le ton : `articles/aliment-poisson-sacs-par-bassin/02-article.md` (registre Terrain).

Chaque article vit dans `editorial/articles/<slug>/` : `01-cadrage.md`, `02-article.md`, puis `03-publication.sql` généré.

## Commandes

```bash
cd agrolide && npm run ed:check                      # contrôle de la charte
cd agrolide && npm run ed:valider -- <slug>          # en-tête et structure d'un article (ou --tous)
cd agrolide && npm run ed:sources -- <slug>          # liens, identifiants DOC, chiffres rattachés à une source
cd agrolide && npm run ed:sync                       # régénère les skills depuis procedures/
cd agrolide && npm run ed:eval                       # note les sorties des briefs d'évaluation
cd agrolide && npm run ed:test                       # test de portabilité
cd agrolide && npm run ed:publier -- <slug>          # prépare le SQL, brouillon
cd agrolide && npm run ed:publier -- <slug> --publie
```

`ed:sources` lit `INDEX.csv` du corpus classé (hors du dossier `agrolide/`). Il le cherche dans le dossier principal du dépôt, ou à l'adresse donnée par la variable `AGROLIDE_INDEX_CSV`. Sans index, les identifiants DOC ne sont pas vérifiés et il le dit.

Test d'Antigravity : `editorial/portabilite/prompt-test-antigravity.md` (généré par `ed:sync`).

Le script de mise en ligne n'écrit jamais en base. Il produit `03-publication.sql`, à exécuter dans le terminal connecté à Cloudflare :
`npx wrangler d1 execute agrolide-d1 --remote --file=editorial/articles/<slug>/03-publication.sql`.
Un brouillon est consultable à `/blog/<slug>` sans figurer dans la liste. Il ne passe en `publie` qu'après la validation technique d'un référent.

## À construire ensuite

Voir `ROADMAP.md` : formats courts (phase 2), rôles (phase 3), site et formations (phase 4), formats longs (phase 5), bibliothèque (phase 6), pilotage (phase 7). Les chantiers à concevoir vivent dans `chantiers/`.
