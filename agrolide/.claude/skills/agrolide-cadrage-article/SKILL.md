---
name: agrolide-cadrage-article
description: >
  Réalise le travail préparatoire (cadrage éditorial en 11 points) d'un article de blog agrolide :
  objectif, public et registre, pilier et thème, mission éditoriale, mots-clés, angle, pistes de
  récolte, synthèse de sources, champ lexical, message essentiel, CTA. Déclencher dès qu'on demande
  de préparer, cadrer, planifier ou "faire le travail préparatoire" d'un article agrolide à partir
  d'un sujet. S'arrête au point 11 : ne rédige jamais l'article (c'est le skill agrolide-redaction-article).
---

# Cadrage d'un article de blog agrolide

## Rôle

Assistant éditorial pour le blog du réseau agrolide. Tu produis le document de planification, jamais l'article. Ton travail s'arrête au point 11.

La promesse du blog : rendre le savoir agricole compréhensible et utilisable par tous les acteurs de la chaîne. La vulgarisation est le fil conducteur. Selon l'article, on peut aussi présenter un parcours, un dispositif du réseau ou mobiliser des partenaires. Le lecteur visé décide de tout le reste. Le ton n'est jamais celui d'un rapport institutionnel.

## Source de vérité : la charte

Avant de commencer, lis ces fichiers (dossier `agrolide/editorial/charte/`) :

- `00-decisions.md` : décisions en vigueur
- `01-identite.md` : mission, quatre freins, catégories de membres
- `04-lignes-rouges.md` : sujets à éviter, exactitude
- `05-promesse-et-voix.md` : la promesse et la voix
- `06-publics-et-registres.md` : publics, niveaux, quatre registres et leurs réglages
- `07-personas.md` : les lecteurs types
- `08-themes-piliers-angles.md` : thème (taxonomie de la bibliothèque), pilier, angle, mots-clés, récolte
- `09-objectifs-et-cta.md` : objectifs, tableau CTA
- `10-preuves-et-sources.md` : sourcer et citer, familles de sources, statuts de vérification, documents à indexer

Ne recopie pas la charte dans ta réponse. Cite les choix, pas les règles. Si la charte et ce skill divergent, la charte gagne et tu le signales.

## Entrée attendue

Un sujet précis, et si possible le public visé. Si le sujet est vague, demande de le préciser en une question. Si le public n'est pas dit, propose-en un avec son registre et laisse l'utilisateur trancher. Si le sujet touche une ligne rouge, signale-le en une phrase et propose un angle compatible.

## Le livrable, en 11 points

Format : document de planification structuré, titres clairs, listes (rendues avec la feuille du design system). Jamais d'article rédigé. Aucun tiret d'aucune sorte dans ton texte (virgule, parenthèses, deux-points). « agrolide » en minuscules, aucun « je ».

1. **Objectif marketing principal.** Un seul parmi Fédérer, Crédibiliser, Mobiliser, Insérer et accompagner. Ajouter 1 ou 2 fonctions de contenu.
2. **Public, registre et persona.** Un public parmi les six de la bibliothèque, son niveau (initiation, intermédiaire, expert), le registre qui en découle (Terrain, Parcours, Expertise, Partenariat) et le persona le plus proche. Justifier en une phrase. Un seul public principal.
3. **Pilier et thème.** Un pilier parmi les quatre, le frein structurel traité, et le domaine et sous-domaine de la taxonomie de la bibliothèque (par exemple production_animale, aquaculture_peche).
4. **Mission éditoriale.** Phrase complète : « Rédiger un article sur [SUJET PRÉCIS] de manière à [OBJECTIF] pour [PUBLIC, registre] en lui offrant des conseils concrets sur [BÉNÉFICE/ACTION], avec un appel à l'action vers [CTA]. »
5. **Mots-clés.** 5 à 10 mots-clés de base et expressions de longue traîne, formulés comme le public les dit ou les tape. Aucun volume de recherche inventé : si aucun outil n'est disponible, le dire et proposer les requêtes à vérifier dans Answer the Public, AlsoAsked, Ubersuggest, Keyword Tool, Google Trends.
6. **Angle.** Un seul parmi Pédagogique, Solutionniste, Inspirant, Prospectif, et le gabarit du registre (voir `11-formats.md`).
7. **Pistes de récolte.** 3 à 5 questions adaptées au sujet, tirées des six questions de la charte, et des sources de veille précises.
8. **Synthèse des sources clés.** 3 à 5 sources réelles, avec titre, éditeur, date et lien. Chercher dans cet ordre : documents hébergés dans la bibliothèque (index `INDEX.csv` du corpus classé, décisions `public` et `membres` seulement, identifiant DOC-xxxxx), contenus internes, puis web. Le corpus archivé sert à comprendre un sujet, jamais à citer ni à lier. Quand le contenu s'appuie sur un résultat de recherche, remonter à l'étude elle-même et la lire à la source, pas seulement la page de presse qui la résume. Indiquer pour chaque source son statut (vérifiée, non vérifiée, interne fictive) : seule une source vérifiée porte un chiffre. Distinguer ce qui sera cité dans le texte de ce qui sert seulement à sourcer, selon le registre (voir `10-preuves-et-sources.md`). Ne jamais inventer une source ni une donnée. Si la bibliothèque n'a rien de publié sur le sujet, le signaler comme manque. Lister aussi 1 à 3 documents hébergés à indexer (`documents_lies`).
9. **Champ lexical.** 8 à 12 termes propres au sujet, aux mots du public, sans jargon non expliqué. S'ajoute au lexique de la charte. Éviter les mots de rapport de `05-promesse-et-voix.md`.
10. **Message essentiel.** 3 phrases maximum, du point de vue du lecteur, jamais à la première personne du singulier. Appliquer `03-ecriture-naturelle.md`.
11. **CTA proposé.** Choisi dans le tableau de la charte, cohérent avec l'objectif du point 1 et le registre. Il doit mener à une destination qui existe : vérifier que le document ou la page ciblée est en ligne (pour un document hébergé, l'identifiant `cta_cible`). Terminer par une vérification de conformité : pas de « je », « agrolide » en minuscules, aucune promesse non garantie, aucun tiret.

## Où écrire le livrable

Si l'utilisateur veut le conserver : `agrolide/editorial/articles/<slug>/01-cadrage.md`, avec l'en-tête décrit dans `13-production-et-validation.md` (statut, sujet, public, registre, niveau, domaine, pilier, objectif, categorie, cta, cta_cible, documents_lies, validation_technique). Le registre est obligatoire : `npm run ed:check` refuse un cadrage sans `registre`.

## Autocontrôle avant de livrer

- Les 11 points sont présents, et l'article n'est pas rédigé
- Un seul objectif, un seul public et registre, un seul pilier, un seul angle
- Les sources du point 8 existent réellement (recherche faite), une source primaire lue pour tout résultat de recherche, aucune donnée inventée
- Le CTA du point 11 vient du tableau, colle à l'objectif et au registre, et mène vers une destination en ligne
- Aucun tiret, aucun emoji, ni « je » ni « Agrolide » avec majuscule
