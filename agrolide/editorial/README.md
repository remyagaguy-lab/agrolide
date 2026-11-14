# Système éditorial agrolide

Source de vérité de tout ce qu'agrolide écrit : site, articles, réseaux sociaux, formations, e-books, livres.
C'est l'équivalent éditorial du design system : une règle écrite une seule fois, appliquée partout, contrôlée par script.

## Les trois couches

| Couche | Rôle | Où |
|---|---|---|
| 1. Socle | La charte, découpée en fichiers courts, versionnés avec le code | `agrolide/editorial/charte/` |
| 2. Skills | Un skill par étape ou par format. Ils lisent le socle, ils ne le recopient pas | `agrolide/.claude/skills/agrolide-*` |
| 3. Garde-fous | Scripts qui échouent quand un contenu viole la charte | `agrolide/scripts/editorial-check.mjs` |

Règle d'or : une règle n'existe qu'à un seul endroit. Si un skill et la charte se contredisent, la charte gagne et le skill est corrigé.

## Le socle (`agrolide/editorial/charte/`)

| Fichier | Contenu |
|---|---|
| `00-decisions.md` | Journal des arbitrages (à lire en premier). Ce qui a été tranché, quand, pourquoi |
| `01-identite.md` | Qui est agrolide : histoire, mission, vision, valeurs, quatre freins, catégories de membres |
| `02-voix-et-ton.md` | Ton, voix collective, ce qu'agrolide ne dit jamais, sujets à éviter |
| `03-vocabulaire-et-typographie.md` | Orthographe de la marque, lexique, ponctuation, nombres, tirets |
| `04-personas.md` | Les quatre personas : Kodjo, Ama, Kwame, Akouvi |
| `05-strategie.md` | Objectifs, piliers, angles, tableau CTA, mots-clés |
| `06-formats.md` | Gabarit, longueur, fréquence et validation de chaque type de contenu, règles par canal |
| `07-ecriture-naturelle.md` | Neutraliser les tics d'écriture générée |
| `08-sources-et-ressources.md` | Les quatre familles de sources (hébergées, locales, en ligne, autres), statuts de vérification, indexation des documents hébergés, ressources à ajouter |

Les chantiers à concevoir vivent dans `agrolide/editorial/chantiers/` (premier : `01-import-documents-sans-doublon.md`).

## Le processus de production (formats éditoriaux)

```
brief  ->  cadrage  ->  rédaction  ->  validation technique  ->  validation éditoriale  ->  publication  ->  suivi
```

| Étape | Qui | Skill ou outil |
|---|---|---|
| Cadrage (livrable en 11 points) | Assistant | `agrolide-cadrage-article` |
| Rédaction | Assistant | `agrolide-redaction-article` |
| Validation technique | Référent du domaine | humain, obligatoire si le sujet est technique |
| Validation éditoriale | Responsable communication | humain, `npm run ed:check` en appui |
| Suivi | Responsable communication | KPI de `05-strategie.md` |

Chaque article vit dans un dossier `agrolide/editorial/articles/<slug>/` avec `01-cadrage.md` puis `02-article.md`. Cela garde la trace de l'angle, des sources et de la validation.

## Contrôle

```bash
cd agrolide && npm run ed:check
```

Erreur bloquante : tiret long ou demi-cadratin, « Agrolide » avec majuscule, BIFERA sans mention d'ex-nom.
Avertissement : première personne du singulier, tutoiement, « entrepreneur agricole ».
Ligne légitime exceptionnelle : commentaire `editorial:ignore` sur la même ligne.

## Mise en ligne d'un article

```bash
cd agrolide && npm run ed:publier -- <slug>            # brouillon
cd agrolide && npm run ed:publier -- <slug> --publie   # publié
```

Le script ne touche jamais à la base : il écrit `03-publication.sql` dans le dossier de l'article. Ce fichier s'exécute dans le terminal connecté à Cloudflare : `npx wrangler d1 execute agrolide-d1 --remote --file=editorial/articles/<slug>/03-publication.sql`. Un brouillon est consultable à l'adresse `/blog/<slug>` sans apparaître dans la liste. Il ne passe en `publie` qu'après la validation technique du référent.

## À construire ensuite

Skills par format (fiche technique, portrait, newsletter, posts par réseau, leçon de formation, e-book, livre), agent de relecture éditoriale, contrôle du contenu en base de données (articles, événements, documents).
