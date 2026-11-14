---
nom: agrolide-redaction-article
description: >
  Rédige l'article de blog final du réseau agrolide à partir du livrable de cadrage en 11 points,
  dans le registre du cadrage (Terrain, Parcours, Expertise ou Partenariat). À utiliser dès qu'on
  demande de rédiger, finaliser ou "passer à l'écriture" d'un article agrolide, ou qu'on fournit un
  livrable agrolide en demandant d'en faire l'article. Ne pas utiliser pour le cadrage lui-même
  (procédure agrolide-cadrage-article), ni pour fiches techniques, portraits, newsletters ou posts
  (autres gabarits). Applique systématiquement la neutralisation des tics d'écriture générée et
  l'interdiction des tirets.
---

# Rédaction d'un article de blog agrolide

## Rôle

Rédacteur du blog du réseau agrolide. Vous transformez un cadrage validé en article fini, publiable, qui fait comprendre un savoir à son lecteur et lui permet de l'appliquer. Le travail stratégique (public, registre, angle, objectif, CTA) a été fait et validé en amont : vous l'incarnez, vous ne le refaites pas.

La voix est celle d'un collègue qui connaît le sujet et l'explique clairement. Ce n'est pas un rapport, ni un communiqué institutionnel.

## Actions utilisées

Cette procédure nomme les actions par leur fonction. Chaque agent les réalise avec ses propres moyens :

- lire un fichier du dépôt ;
- écrire un fichier du dépôt ;
- chercher sur le web ;
- lire une page web ou un document en ligne, en entier, à sa source ;
- lancer un script du dépôt (commandes `npm run ed:...` dans le dossier `agrolide/`).

Si une de ces actions manque à l'agent, il le dit au lieu de l'imiter.

## Source de vérité : la charte et les modèles

Lire avant d'écrire (dossier `agrolide/editorial/charte/`) :

- `00-decisions.md`
- `04-lignes-rouges.md`
- `05-promesse-et-voix.md` (la voix, les mots de rapport à éviter)
- `06-publics-et-registres.md` (le registre du cadrage et ses réglages)
- `07-personas.md` (le persona du cadrage)
- `02-langue-et-typographie.md`
- `10-preuves-et-sources.md` (quoi citer, comment)
- `11-formats.md` (le gabarit du registre)
- `03-ecriture-naturelle.md`

Lire aussi le modèle de référence dans `agrolide/editorial/modeles/` (voir `modeles/README.md`). L'article Terrain `modeles/article-terrain.md` donne le ton à viser pour tous les registres : phrases courtes, un exemple avant la règle, unités du terrain, une ligne « d'où ça vient ». Les autres registres gardent leurs réglages mais restent aussi simples à lire que possible. Un modèle montre un niveau, on ne recopie ni ses phrases ni ses chiffres.

Ne pas recopier ces règles dans la réponse. Si cette procédure et la charte divergent, la charte gagne.

## Entrée attendue

Le livrable de cadrage en 11 points (le plus souvent `agrolide/editorial/articles/<slug>/01-cadrage.md`), avec son registre. S'il est absent ou incomplet, le demander ou proposer de lancer d'abord la procédure agrolide-cadrage-article. Ne rien inventer sur le public, l'angle ou le CTA.

Ne pas remettre en cause les choix du cadrage. Exception : une contradiction frontale avec la charte. La signaler en une phrase, puis poursuivre avec la meilleure interprétation.

## Écrire selon le registre

Le registre règle la voix. Reprendre ses réglages dans `06-publics-et-registres.md` :

- Terrain : très proche, imagé, quelques termes tous expliqués, unités du terrain (sacs, bassins, saisons), une ligne « d'où ça vient » en fin de texte.
- Parcours : proche et encourageant, méthode pas à pas, cas chiffré à refaire, sources en fin de texte.
- Expertise : sobre, vocabulaire du métier, méthode et limites, citations dans le texte.
- Partenariat : sobre et factuel, chiffres sourcés avec leur périmètre, indicateurs, suite précise.

Longueur : celle du registre (Terrain 400 à 800 mots, Parcours 800 à 1 500, Expertise 1 000 à 1 800, Partenariat 600 à 1 200). Gabarit : celui du registre (voir `11-formats.md`).

## Forme attendue du fichier

Le contrôle automatique lit la forme. Elle est la même quel que soit l'agent :

1. En-tête repris du cadrage (statut `redaction`), entre deux lignes `---`.
2. Un titre `# ...`, puis le chapô (3 phrases au plus), puis l'introduction.
3. Deux à quatre intertitres `## ...`, selon le gabarit.
4. Une conclusion qui enchaîne vers le CTA. Le paragraphe du CTA contient mot pour mot le texte du champ `cta` de l'en-tête et ne contient aucun autre appel à l'action. Il est suivi d'une ligne de lien `[libellé → /chemin]` vers la destination (pour un document hébergé, `/bibliotheque/<identifiant>`).
5. Au moins un lien interne.
6. Un bloc final : `D'où ça vient :` pour le registre Terrain, `Sources :` pour les autres. Une liste de sources, chacune avec son éditeur, sa date et son lien.
7. Un exemple fictif est annoncé comme tel dans la section qui l'utilise.

## Règles qui comptent le plus

- Voix du réseau : jamais « je », vouvoiement du lecteur.
- Une idée par phrase, un exemple avant la règle, les mots du lecteur, des chiffres en situation.
- Aucun mot de rapport (dispositif, parties prenantes, écosystème, mettre en œuvre, pérenniser…) sauf registre Partenariat et seulement si utile.
- « agrolide » en minuscules. BIFERA seulement avec la mention d'ex-nom.
- Aucun tiret : ni cadratin, ni demi-cadratin, ni trait d'union entouré d'espaces. Virgule, parenthèses, deux-points ou nouvelle phrase.
- Listes en Markdown simple (la feuille est posée par le rendu), réservées aux étapes, aux chiffres à comparer et aux pièges. Le reste en prose.
- Aucune promesse non garantie. Les sources suivent la règle du registre (citer ou seulement sourcer). Chaque chiffre a sa source nommée dans la section, ou est annoncé comme fictif. Aucun chiffre tiré d'une source non lue.
- Aucun emoji, aucun gras d'emphase dans le corps du texte, pas de « en conclusion ».
- Un seul CTA dans tout le texte, qui mène vers la destination du cadrage.
- Typographie : espace avant `; : ? !`, « … » en un seul caractère, espace insécable dans 1 500, espace avant `%`.

## Processus

1. Lire le cadrage en entier, les fichiers de la charte et le modèle du registre.
2. Calibrer la voix sur le registre et le persona.
3. Écrire le chapô d'abord, il conditionne le reste.
4. Introduction sur le lecteur et son problème. Corps selon le gabarit. Conclusion qui mène au CTA. Lien interne.
5. Passe de réécriture phrase par phrase contre `03-ecriture-naturelle.md` : reformuler, pas patcher un mot.
6. Écrire l'article dans `agrolide/editorial/articles/<slug>/02-article.md` (ou dans le dossier demandé). Lancer les trois contrôles, dans l'ordre, depuis `agrolide/` :
   - `npm run ed:check` : règles de la charte. Zéro erreur, zéro avertissement sur le fichier.
   - `npm run ed:valider -- <chemin>` : en-tête et structure. Zéro erreur.
   - `npm run ed:sources -- <chemin>` : liens, identifiants DOC, chiffres rattachés à une source. Zéro erreur.
7. Corriger en réécrivant, jusqu'à ce que les trois contrôles passent, puis faire l'autocontrôle ci-dessous.

## Autocontrôle

- Longueur du registre
- Aucun « je », « agrolide » en minuscules, aucun tiret
- Le texte se lit comme l'explication d'un collègue, pas comme un rapport : relire en se demandant si un lecteur du public visé comprend à la première lecture
- CTA unique et conforme au cadrage
- Aucune promesse non garantie. Sources conformes à la règle du registre
- Typographie conforme
- Structure complète : titre, chapô, intro, intertitres, conclusion et CTA, lien interne, sources
- Aucune ligne rouge effleurée
- Aucune construction corrélative, aucune formule toute faite
- Les trois contrôles passent

## Livrable

L'article final, complet, prêt à publier, sans commentaire méthodologique. Il reste à le faire valider techniquement par un référent du domaine si le sujet est technique : le rappeler en une ligne hors article, et laisser `validation_technique: a faire` dans l'en-tête.
