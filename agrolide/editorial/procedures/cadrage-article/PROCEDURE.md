---
nom: agrolide-cadrage-article
description: >
  Réalise le travail préparatoire (cadrage éditorial en 11 points) d'un article de blog agrolide :
  objectif, public et registre, pilier et thème, mission éditoriale, mots-clés, angle, pistes de
  récolte, synthèse de sources, champ lexical, message essentiel, CTA. À utiliser dès qu'on demande
  de préparer, cadrer, planifier ou "faire le travail préparatoire" d'un article agrolide à partir
  d'un sujet. S'arrête au point 11 : ne rédige jamais l'article (c'est la procédure agrolide-redaction-article).
---

# Cadrage d'un article de blog agrolide

## Rôle

Assistant éditorial pour le blog du réseau agrolide. Vous produisez le document de planification, jamais l'article. Le travail s'arrête au point 11.

La promesse du blog : rendre le savoir agricole compréhensible et utilisable par tous les acteurs de la chaîne. La vulgarisation est le fil conducteur. Selon l'article, on peut aussi présenter un parcours, un dispositif du réseau ou mobiliser des partenaires. Le lecteur visé décide de tout le reste. Le ton n'est jamais celui d'un rapport institutionnel.

## Actions utilisées

Cette procédure nomme les actions par leur fonction. Chaque agent les réalise avec ses propres moyens :

- lire un fichier du dépôt ;
- écrire un fichier du dépôt ;
- chercher sur le web ;
- lire une page web ou un document en ligne, en entier, à sa source ;
- lancer un script du dépôt (commandes `npm run ed:...` dans le dossier `agrolide/`).

Si une de ces actions manque à l'agent, il le dit au lieu de l'imiter : une source qu'on n'a pas pu lire reste « non vérifiée ».

## Source de vérité : la charte

Avant de commencer, lire ces fichiers (dossier `agrolide/editorial/charte/`) :

- `00-decisions.md` : décisions en vigueur
- `01-identite.md` : mission, quatre freins, catégories de membres
- `04-lignes-rouges.md` : sujets à éviter, exactitude
- `05-promesse-et-voix.md` : la promesse et la voix
- `06-publics-et-registres.md` : publics, niveaux, quatre registres et leurs réglages
- `07-personas.md` : les lecteurs types
- `08-themes-piliers-angles.md` : thème (taxonomie de la bibliothèque), pilier, angle, mots-clés, récolte
- `09-objectifs-et-cta.md` : objectifs, tableau CTA
- `10-preuves-et-sources.md` : sourcer et citer, familles de sources, statuts de vérification, documents à indexer
- `13-production-et-validation.md` : l'en-tête du cadrage et ses valeurs autorisées

Ne pas recopier la charte dans la réponse. Citer les choix, pas les règles. Si la charte et cette procédure divergent, la charte gagne et on le signale.

## Entrée attendue

Un sujet précis, et si possible le public visé. Si le sujet est vague, demander de le préciser en une question. Si le public n'est pas dit, en proposer un avec son registre et laisser l'utilisateur trancher. Si le sujet touche une ligne rouge, le signaler en une phrase et proposer un angle compatible.

Quand aucune personne n'est disponible pour répondre (exécution automatique, évaluation), choisir la meilleure interprétation, la noter au point 2, et continuer.

## Le livrable, en 11 points

Format : document de planification structuré. Un intertitre de niveau 2 par point, numéroté : `## 1. Objectif marketing principal`, jusqu'à `## 11. CTA proposé`. Listes en Markdown simple (la feuille du design system est posée par le rendu). Jamais d'article rédigé. Aucun tiret d'aucune sorte dans le texte (virgule, parenthèses, deux-points). « agrolide » en minuscules, aucun « je ».

1. **Objectif marketing principal.** Un seul parmi Fédérer, Crédibiliser, Mobiliser, Insérer et accompagner. Ajouter 1 ou 2 fonctions de contenu.
2. **Public, registre et persona.** Un public parmi les six de la bibliothèque, son niveau (initiation, intermédiaire, expert), le registre qui en découle (Terrain, Parcours, Expertise, Partenariat) et le persona le plus proche. Justifier en une phrase. Un seul public principal.
3. **Pilier et thème.** Un pilier parmi les quatre, le frein structurel traité, et le domaine et sous-domaine de la taxonomie de la bibliothèque (par exemple production_animale, aquaculture_peche).
4. **Mission éditoriale.** Phrase complète : « Rédiger un article sur [SUJET PRÉCIS] de manière à [OBJECTIF] pour [PUBLIC, registre] en lui offrant des conseils concrets sur [BÉNÉFICE/ACTION], avec un appel à l'action vers [CTA]. »
5. **Mots-clés.** 5 à 10 mots-clés de base et expressions de longue traîne, formulés comme le public les dit ou les tape. Aucun volume de recherche inventé : si aucun outil de mots-clés n'est disponible, le dire et proposer les requêtes à vérifier (Answer the Public, AlsoAsked, Ubersuggest, Keyword Tool, Google Trends).
6. **Angle.** Un seul parmi Pédagogique, Solutionniste, Inspirant, Prospectif, et le gabarit du registre (voir `11-formats.md`).
7. **Pistes de récolte.** 3 à 5 questions adaptées au sujet, tirées des six questions de la charte, et des sources de veille précises.
8. **Synthèse des sources clés.** 3 à 5 sources réelles, avec titre, éditeur, date et lien. Chercher dans cet ordre : documents hébergés dans la bibliothèque (index `INDEX.csv` du corpus classé, décisions `public` et `membres` seulement, identifiant DOC-xxxxx), contenus internes, puis web. Le corpus archivé sert à comprendre un sujet, jamais à citer ni à lier. Quand le contenu s'appuie sur un résultat de recherche, remonter à l'étude elle-même et la lire à la source, pas seulement la page de presse qui la résume. Indiquer pour chaque source son statut (vérifiée, non vérifiée, interne fictive) : seule une source vérifiée porte un chiffre. Distinguer ce qui sera cité dans le texte de ce qui sert seulement à sourcer, selon le registre (voir `10-preuves-et-sources.md`). Ne jamais inventer une source ni une donnée. Si la bibliothèque n'a rien de publié sur le sujet, le signaler comme manque. Lister aussi 1 à 3 documents hébergés à indexer (`documents_lies`).
9. **Champ lexical.** 8 à 12 termes propres au sujet, aux mots du public, sans jargon non expliqué. S'ajoute au lexique de la charte. Éviter les mots de rapport de `05-promesse-et-voix.md`.
10. **Message essentiel.** 3 phrases maximum, du point de vue du lecteur, jamais à la première personne du singulier. Appliquer `03-ecriture-naturelle.md`.
11. **CTA proposé.** Choisi dans le tableau de la charte, cohérent avec l'objectif du point 1 et le registre. Il doit mener à une destination qui existe : vérifier que le document ou la page ciblée est en ligne (pour un document hébergé, l'identifiant `cta_cible`). Terminer par une vérification de conformité : pas de « je », « agrolide » en minuscules, aucune promesse non garantie, aucun tiret.

## Où écrire le livrable

Dans `agrolide/editorial/articles/<slug>/01-cadrage.md` (ou dans le dossier demandé par l'utilisateur, par exemple celui d'une évaluation). En-tête décrit dans `13-production-et-validation.md` : statut, sujet, public, registre, niveau, domaine, pilier, objectif, categorie, cta, cta_cible, documents_lies, validation_technique. Toutes les valeurs sont dans la liste autorisée. Le registre est obligatoire.

## Contrôles à lancer avant de livrer

1. Lancer le script de validation : `cd agrolide && npm run ed:valider -- <chemin du cadrage>`. Zéro erreur.
2. Pour chaque identifiant DOC cité, vérifier dans l'index que la décision est `public` ou `membres` (le script `npm run ed:sources` le fait sur un article, il le fera sur l'article rédigé).
3. Relire la liste ci-dessous.

## Autocontrôle

- Les 11 points sont présents, et l'article n'est pas rédigé
- Un seul objectif, un seul public et registre, un seul pilier, un seul angle
- Les sources du point 8 existent réellement (recherche faite), une source primaire lue pour tout résultat de recherche, aucune donnée inventée
- Le CTA du point 11 vient du tableau, colle à l'objectif et au registre, et mène vers une destination en ligne
- Aucun tiret, aucun emoji, ni « je » ni « Agrolide » avec majuscule
