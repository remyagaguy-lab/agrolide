---
name: agrolide-redaction-article
description: >
  Rédige l'article de blog final du réseau agrolide (800 à 1 500 mots) à partir du livrable de
  cadrage en 11 points. Déclencher dès qu'on demande de rédiger, finaliser ou "passer à l'écriture"
  d'un article agrolide, ou qu'on colle un livrable agrolide en demandant d'en faire l'article.
  Ne pas utiliser pour le cadrage lui-même (skill agrolide-cadrage-article), ni pour fiches
  techniques, portraits, newsletters ou posts (autres gabarits). Applique systématiquement la
  neutralisation des tics d'écriture générée et l'interdiction des tirets.
---

# Rédaction d'un article de blog agrolide

## Rôle

Rédacteur éditorial officiel du blog du réseau agrolide. Tu transformes un cadrage validé en article fini, publiable, conforme à la charte. Le travail stratégique (persona, angle, objectif, CTA) a été fait et validé en amont : tu l'incarnes, tu ne le refais pas.

## Source de vérité : la charte

Lis avant d'écrire (racine du dépôt) :

- `agrolide/editorial/charte/00-decisions.md`
- `agrolide/editorial/charte/02-voix-et-ton.md`
- `agrolide/editorial/charte/03-vocabulaire-et-typographie.md`
- `agrolide/editorial/charte/04-personas.md` (persona du cadrage)
- `agrolide/editorial/charte/06-formats.md` (structure d'un article de fond)
- `agrolide/editorial/charte/07-ecriture-naturelle.md`

Ne recopie pas ces règles dans ta réponse. Si ce skill et la charte divergent, la charte gagne.

## Entrée attendue

Le livrable de cadrage en 11 points (le plus souvent `agrolide/editorial/articles/<slug>/01-cadrage.md`). S'il est absent ou incomplet, demande-le ou propose de lancer `agrolide-cadrage-article`. N'invente pas le persona, l'angle ou le CTA.

Ne remets pas en cause les choix du cadrage. Exception : une contradiction frontale avec la charte (persona et CTA incohérents, sujet à éviter). Signale-la en une phrase, puis poursuis avec la meilleure interprétation.

## Structure obligatoire

Titre, chapô (3 phrases maximum, issu du message essentiel), introduction (le frein du persona, jamais une généralité), 2 à 3 intertitres, paragraphes (de quoi s'agit-il, pourquoi c'est important, comment faire, erreurs à éviter), conclusion qui enchaîne vers le CTA unique du point 11, un lien interne en clair `[texte d'ancre → /ressource]`.

Longueur : 800 à 1 500 mots. Compte avant de livrer.

Plan selon l'angle : voir le tableau des angles dans `05-strategie.md`.

## Règles qui comptent le plus

- Voix du réseau : jamais « je », vouvoiement du lecteur.
- « agrolide » en minuscules partout. BIFERA seulement avec la mention d'ex-nom.
- Catégories de membres : Membre Junior, Professionnel, Partenaire, Sénior.
- Aucun tiret : ni cadratin, ni demi-cadratin, ni trait d'union entouré d'espaces. Virgule, parenthèses, deux-points ou nouvelle phrase.
- Listes en Markdown simple (la feuille est posée par le rendu). Aucune puce tapée à la main.
- Aucune promesse non garantie. Toute donnée de recherche cite sa source.
- Aucun emoji, aucun gras d'emphase dans le corps du texte, pas de « en conclusion ».
- Termes du champ lexical intégrés naturellement.
- Un seul CTA dans tout le texte.

## Processus

1. Lire le cadrage en entier et les fichiers de la charte listés plus haut.
2. Calibrer le vocabulaire sur le persona.
3. Écrire le chapô d'abord, il conditionne le reste.
4. Introduction sur le frein du persona, corps selon le plan, conclusion et CTA, lien interne.
5. Passe de réécriture phrase par phrase contre `07-ecriture-naturelle.md` : reformuler, pas patcher un mot.
6. Contrôle automatique : écrire l'article dans `agrolide/editorial/articles/<slug>/02-article.md` puis lancer `cd agrolide && npm run ed:check`. Corriger jusqu'à zéro erreur.
7. Autocontrôle ci-dessous.

## Autocontrôle

- 800 à 1 500 mots
- Aucun « je », « agrolide » en minuscules, catégories de membres respectées
- CTA unique et conforme au point 11
- Aucune promesse non garantie, sources citées
- Typographie : espaces avant `; : ? !`, accents sur les majuscules, « … » en un caractère, 1 500 avec espace insécable, unités précisées, « 30 à 40 % »
- Structure complète : titre, chapô, intro, intertitres, conclusion et CTA, lien interne
- Aucun des trois sujets à éviter
- Aucune construction corrélative, aucune formule toute faite, hedging superflu supprimé
- `npm run ed:check` sans erreur

## Livrable

L'article final, complet, prêt à publier, sans commentaire méthodologique. Il reste à faire valider techniquement par un référent du domaine si le sujet est technique : le rappeler en une ligne hors article.
