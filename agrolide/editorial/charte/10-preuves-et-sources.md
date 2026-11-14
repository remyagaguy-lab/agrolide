# Preuves et sources

Deux questions distinctes. D'où vient ce qu'on avance (la rédaction le sait toujours) et qu'est-ce qu'on montre au lecteur (cela dépend du public). On n'est pas obligé de citer une source à chaque phrase. On est obligé de pouvoir la donner.

## Sourcer et citer

| Notion | Sens | Règle |
|---|---|---|
| Sourcer | La rédaction sait d'où vient chaque chiffre et chaque affirmation technique, et l'a vérifié | Toujours. Noté au cadrage |
| Citer | Le lecteur voit la source dans le texte | Selon le registre et le contenu (ci-dessous) |

## Quand citer, et comment

| Situation | Registre Terrain | Registre Parcours | Registre Expertise | Registre Partenariat |
|---|---|---|---|---|
| Savoir courant, geste éprouvé, sans chiffre | Rien à citer | Rien à citer | Une référence si utile | Rien à citer |
| Chiffre, résultat de recherche | Une ligne « D'où ça vient » en fin de texte | Source en fin de texte, avec l'année | Citation dans le texte, méthode et limites | Source et périmètre à côté du chiffre |
| Dose, traitement, risque sanitaire, réglementation | Source en fin de texte et validation d'un référent, obligatoires | Idem | Idem | Idem |
| Exemple fictif | Annoncé comme fictif | Annoncé comme fictif | Annoncé comme fictif | Annoncé comme fictif |

La ligne « D'où ça vient » tient en une ou deux phrases en langage simple : qui a mesuré, où, en quelle année, avec le lien. Elle ne ressemble pas à une bibliographie.

## Une source qui ne vaut pas citation

Un chiffre porte son périmètre : pays, espèce, année, méthode. Une page de presse n'est pas l'étude qu'elle résume : quand le contenu repose sur un résultat de recherche, on remonte à l'étude. Un extrait vu dans un résultat de recherche, non lu, ne porte jamais un chiffre.

## Les quatre familles de sources

| Famille | Où | Usage permis | Citation |
|---|---|---|---|
| A. Hébergées | Bibliothèque numérique du site (table `documents`, fichiers dans R2), identifiant stable `reference` (DOC-01005) | Lien direct, citation, « pour approfondir ». Seuls les documents publiés (public ou membres) | Lien vers `/bibliotheque/<id>` |
| B. Locales, non hébergées | Corpus classé hors ligne (index `INDEX.csv`) : archivés, à valider, exclus | Lecture interne pour comprendre un sujet. Jamais de lien ni de reproduction | Trouver la version en ligne de l'éditeur, ou ne pas citer |
| C. En ligne | Organisations (FAO, WorldFish, CGIAR, CORAF, instituts nationaux), revues, bases ouvertes | Chiffres, rapports, études, après vérification à la source | Titre, éditeur, date, lien |
| D. Autres ressources | Contenus internes (cas chiffrés, formations, cadres par pays, replays), témoignages, référents techniques | Cas, exemples, relecture, validation | Nom du contenu, ou du référent avec son accord |

## Ordre de recherche

1. Famille A : la bibliothèque hébergée d'abord. Les droits sont réglés et le lecteur peut aller plus loin en un clic.
2. Famille D : contenus internes et référents.
3. Famille B : pour comprendre un sujet ou repérer un manque.
4. Famille C : pour ce qui manque, avec vérification à la source.

Si la bibliothèque n'a rien de publié sur le sujet, le cadrage le signale comme manque. Ce manque alimente la liste des documents à acquérir ou à produire.

## Statuts de vérification

| Statut | Sens | Peut porter un chiffre ? |
|---|---|---|
| vérifiée | Lue à la source, titre et date confirmés | Oui |
| non vérifiée | Repérée dans un résultat de recherche ou un extrait, non lue | Non |
| interne fictive | Cas pédagogique du réseau, hypothèses reconstituées | Oui, présenté comme exemple |

## Documents hébergés à indexer dans un article

Chaque article liste en en-tête les documents hébergés qui prolongent son sujet :

```
documents_lies: [DOC-01005, DOC-00459]
cta_cible: DOC-01005
```

- Un document lié est publié et sa fiche est à jour.
- Il correspond au public et au niveau de l'article (mêmes codes que la taxonomie).
- Le CTA peut pointer vers un document lié. Les autres figurent dans un bloc « Pour approfondir ».

## Ressources à ajouter

| Ressource | Pourquoi | Priorité |
|---|---|---|
| Fiches techniques agrolide originales (400 à 600 mots, PDF hébergé) | Pas de problème de droits, adaptées à chaque public. Beaucoup de documents tiers sont archivés pour droits réservés | Haute |
| Registre des chiffres | Une ligne par chiffre utilisé : valeur, périmètre, source, date, prochaine vérification | Haute |
| Relevés de prix datés par les membres | Remplace les hypothèses fictives par des données réelles, avec date et lieu | Haute |
| Registre des référents techniques | Qui valide quel domaine, avec disponibilité | Haute |
| Bases ouvertes | FAOSTAT, Banque mondiale, CGSpace, AGRIS, AJOL, HAL, Agritrop | Moyenne |
| Instituts et réseaux régionaux | ITRA, ISRA, INRAB, CNRA, CORAF, Inter-réseaux | Moyenne |
| Banque de témoignages avec consentement écrit | Portraits et citations | Moyenne |
| Banque d'images de terrain avec crédits | Photos réelles et créditées | Moyenne |
| Veille automatique | Alertes WorldFish, FAO, CGSpace | Basse |
| Glossaire bilingue | Version anglaise | Basse |
