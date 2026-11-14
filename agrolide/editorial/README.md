# Système éditorial agrolide

Source de vérité de tout ce qu'agrolide écrit : site, articles, réseaux sociaux, formations, e-books, livres.
C'est l'équivalent éditorial du design system : des règles écrites une seule fois, organisées en couches, appliquées partout, contrôlées par script.

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

## Les trois couches techniques

| Couche | Rôle | Où |
|---|---|---|
| Socle | La charte ci-dessus | `agrolide/editorial/charte/` |
| Skills | Un skill par étape ou par format. Ils lisent la charte, ils ne la recopient pas | `agrolide/.claude/skills/agrolide-*` |
| Garde-fous | Scripts qui échouent quand un contenu viole une règle mesurable | `agrolide/scripts/editorial-check.mjs` |

Règle d'or : une règle n'existe qu'à un seul endroit. Si un skill et la charte se contredisent, la charte gagne et le skill est corrigé.

## Contenus produits

Chaque article vit dans `editorial/articles/<slug>/` : `01-cadrage.md`, `02-article.md`, puis `03-publication.sql` généré.

## Commandes

```bash
cd agrolide && npm run ed:check                      # contrôle de la charte
cd agrolide && npm run ed:publier -- <slug>          # prépare le SQL, brouillon
cd agrolide && npm run ed:publier -- <slug> --publie
```

Le script de mise en ligne n'écrit jamais en base. Il produit `03-publication.sql`, à exécuter dans le terminal connecté à Cloudflare :
`npx wrangler d1 execute agrolide-d1 --remote --file=editorial/articles/<slug>/03-publication.sql`.
Un brouillon est consultable à `/blog/<slug>` sans figurer dans la liste. Il ne passe en `publie` qu'après la validation technique d'un référent.

## À construire ensuite

Skills par format (fiche technique, portrait, newsletter, posts par réseau, leçon, e-book, livre), agent de relecture éditoriale, contrôle du contenu en base de données, chantiers dans `chantiers/`.
