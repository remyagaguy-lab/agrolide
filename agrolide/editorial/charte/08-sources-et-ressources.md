# Sources et ressources

Tout contenu technique s'appuie sur des sources déclarées. Ce fichier dit où chercher, dans quel ordre, et comment les citer.

## Les quatre familles de sources

| Famille | Où | Usage permis | Citation |
|---|---|---|---|
| A. Hébergées | Bibliothèque numérique du site (table `documents`, fichiers dans R2). Identifiant stable `reference`, par exemple DOC-01005 | Lien direct, citation, « pour approfondir ». Seuls les documents publiés (public ou membres) | Lien vers `/bibliotheque/<id>` |
| B. Locales, non hébergées | Corpus classé hors ligne (`Opérations/Formation/Bibliothèque-Agrolide/Classée`, index `INDEX.csv`) : documents archivés, à valider, exclus | Lecture interne pour comprendre un sujet. Jamais de lien ni de reproduction : droits réservés, droits inconnus, mémoires et thèses | Citer l'éditeur d'origine et trouver la version en ligne, ou ne pas citer |
| C. En ligne | Web : organisations (FAO, WorldFish, CGIAR, CORAF, instituts nationaux), revues, bases ouvertes | Chiffres, rapports, études, après vérification | Titre, éditeur, date de publication, lien, date de consultation |
| D. Autres ressources | Contenus internes (cas chiffrés, modules de formation, cadres par pays, replays de webinaires), témoignages de membres, référents techniques du réseau | Cas, exemples, relecture, validation | Nom du contenu, ou nom du référent avec son accord |

## Ordre de recherche

1. Famille A : la bibliothèque hébergée d'abord. Les droits sont réglés et le lecteur peut aller plus loin en un clic.
2. Famille D : les contenus internes et les référents.
3. Famille B : pour comprendre un sujet ou repérer un manque.
4. Famille C : pour ce qui manque, avec vérification à la source.

Si la bibliothèque n'a rien de publié sur le sujet, le cadrage le signale comme manque. Ce manque alimente la liste des documents à acquérir ou à produire.

## Statuts de vérification

| Statut | Sens | Peut porter un chiffre ? |
|---|---|---|
| vérifiée | Lue à la source par une personne ou un outil, titre et date confirmés | Oui |
| non vérifiée | Repérée dans un résultat de recherche ou un extrait, non lue | Non |
| interne fictive | Cas pédagogique du réseau, aux hypothèses reconstituées | Oui, présenté comme exemple, jamais comme donnée de marché |

Un chiffre porte toujours son périmètre : pays, espèce, année, méthode. Exemple : 60 à 75 % du coût de production, enquête WorldFish de 2024, Nigeria, surtout poisson-chat.

## Documents hébergés à indexer dans un article

Chaque article liste en en-tête les documents hébergés qui prolongent son sujet :

```
documents_lies: [DOC-01005, DOC-00459]
cta_cible: DOC-01005
```

Règles :

- Un document lié est publié (public ou membres) et sa fiche est à jour.
- Un document réservé aux inscrits porte la mention « réservé aux inscrits » dans le texte.
- Le CTA peut pointer vers un document lié. Les autres figurent dans un bloc « Pour approfondir ».
- Un cadrage cherche d'abord dans la taxonomie de la bibliothèque (6 domaines, 56 sujets) avant de chercher en ligne.

## Ressources à ajouter

| Ressource | Pourquoi | Priorité |
|---|---|---|
| Fiches techniques agrolide originales (400 à 600 mots, PDF hébergé) | Pas de problème de droits, formats prévus par la charte, cibles précises. Beaucoup de documents tiers sont archivés pour droits réservés | Haute |
| Registre des chiffres | Une ligne par chiffre utilisé : valeur, périmètre, source, date, prochaine vérification. Évite les chiffres périmés ou contradictoires entre articles, formations et réseaux | Haute |
| Relevés de prix datés par les membres | Remplace les hypothèses fictives des cas chiffrés par des données réelles, avec date et lieu | Haute |
| Registre des référents techniques | Qui valide quel domaine, avec disponibilité. La validation technique est obligatoire | Haute |
| Bases ouvertes | FAOSTAT, Banque mondiale, CGSpace, AGRIS, AJOL, HAL, Agritrop | Moyenne |
| Instituts et réseaux régionaux | ITRA, ISRA, INRAB, CNRA, CORAF, Inter-réseaux | Moyenne |
| Banque de témoignages avec consentement écrit | Portraits et citations conformes à la charte | Moyenne |
| Banque d'images de terrain avec crédits | La charte exige des photos réelles et créditées | Moyenne |
| Veille automatique | Alertes sur WorldFish, FAO, CGSpace : alimente le calendrier éditorial | Basse |
| Glossaire bilingue | Prépare la version anglaise | Basse |
