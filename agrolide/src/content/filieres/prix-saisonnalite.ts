import type { Filiere } from './types'

/**
 * Module facultatif « Prix et saisonnalité » (transversal). Aucun prix réel n'est cité : la série de relevés de la leçon 2 est FICTIVE
 * (scripts/modeles_bp/prix_saisonnalite.py, classeur Agrolide-gabarit-prix-saisonnalite.xlsx). L'effet sur le plan reprend le cas
 * « Riz irrigué en deux campagnes au Mali » (src/content/cas-chiffres/riz-irrigue-mali.ts), hypothèses pédagogiques.
 */
export const prixSaisonnalite: Filiere = {
  slug: 'prix-saisonnalite',
  titre: 'Prix et saisonnalité',
  resume: "Quatre leçons transversales pour relever, lire et utiliser les prix d'un produit agricole : un relevé daté et complet, l'indice saisonnier, la volatilité et le prix prudent, l'effet sur le chiffre d'affaires et la couverture de la dette. Série d'illustration fictive et classeur Excel inclus : aucun prix réel n'est cité.",
  statut: 'disponible',
  gabarit: {
    libelle: "Classeur Excel : relevés de prix, indice saisonnier, volatilité, prix prudent et effet sur le chiffre d'affaires",
    url: '/documents/bp-agricole/Agrolide-gabarit-prix-saisonnalite.xlsx',
  },
  lecons: [
    {
      id: 'ps_1',
      titre: 'Un prix n\'est pas un chiffre : le relevé daté et complet',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez relever un prix de façon qu'un banquier puisse le vérifier, et refuser un prix sans date ni source.

### Pourquoi « 190 FCFA le kilo » ne veut rien dire seul
Le même produit se vend à plusieurs prix le même jour. Un chiffre isolé ne dit pas :
- **où** : marché de gros, marché de détail, bord de champ, magasin de la coopérative ;
- **quand** : le jour, le mois, la période de l'année ;
- **quel stade** : produit brut, séché, décortiqué, calibré, emballé ;
- **quelle unité** : kilo, sac de quel poids, tonne, mesure locale ;
- **quelle qualité** : taux d'humidité, impuretés, calibre ;
- **qui paie** : prix payé au producteur ou prix payé par l'acheteur final.

Le prix du producteur et le prix du détaillant diffèrent de toute la marge des intermédiaires. Un plan qui prend le prix du détaillant pour un prix de vente du producteur surévalue le chiffre d'affaires.

### La fiche de relevé
Pour chaque relevé, notez :
| Champ | Exemple de saisie |
|---|---|
| Date | jour, mois, année |
| Lieu | nom du marché ou de la localité |
| Produit et stade | nom du produit, état (brut, séché, emballé) |
| Unité | kilo ou sac de tel poids, convertie en prix au kilo |
| Qualité | humidité, calibre, observations |
| Prix | en FCFA par kilo, avec la monnaie |
| Source | relevé direct, commerçant interrogé, coopérative, service public |

Un relevé direct (vous observez, vous demandez à plusieurs vendeurs) vaut mieux qu'un chiffre rapporté. Quand vous citez un service public ou une publication, notez le nom, la date de publication et le lien : si vous ne pouvez pas retrouver la source, n'utilisez pas le chiffre.

### Combien de relevés
Un relevé par mois pendant une campagne complète est un minimum ; **trois ans** de relevés permettent déjà de voir un motif saisonnier et de mesurer des écarts entre années. Si vous n'avez pas de série, demandez-en une à des commerçants, à votre coopérative ou à un service de suivi des marchés, et datez-la ; en attendant, écrivez dans le plan que le prix est une hypothèse.

#### Ce qu'il faut retenir
- Un prix sans lieu, date, stade, unité et source ne se vérifie pas.
- Prix producteur et prix détaillant sont deux prix différents : choisissez celui que vous encaisserez.
- Plusieurs relevés valent mieux qu'un seul : commencez dès maintenant à les noter.

### Exercice
Préparez votre fiche de relevé (tableau ci-dessus) et relevez le prix de votre produit chez au moins trois vendeurs, le même jour, avec le détail de chaque champ.
`,
    },
    {
      id: 'ps_2',
      titre: 'La saisonnalité : l\'indice saisonnier',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez calculer un indice saisonnier à partir de relevés mensuels et dire à quel mois vendre ou acheter.

### Le motif de l'année
Pour beaucoup de produits agricoles, le prix est **bas à la récolte**, quand l'offre est abondante, et **haut à la soudure**, quand les stocks s'épuisent. Le motif n'est pas identique d'un produit, d'une zone ni d'une année à l'autre : il se **mesure**.

### Une série d'illustration
Le tableau suivant est une série **fictive**, construite pour apprendre à calculer. Elle ne représente aucun marché réel (FCFA par kilo, trois années, un relevé par mois) :
| Mois | Année 1 | Année 2 | Année 3 |
|---|---|---|---|
| Janvier | 190 | 205 | 182 |
| Mars | 204 | 222 | 192 |
| Mai | 224 | 250 | 208 |
| Juillet | 246 | 274 | 226 |
| Septembre | 210 | 226 | 196 |
| Novembre | 176 | 186 | 168 |

Les douze mois figurent dans la feuille Relevés du classeur joint.

### L'indice saisonnier en trois étapes
1. Calculez le **prix moyen de chaque année** : 207,8 pour l'année 1, 226,5 pour l'année 2, 194,8 pour l'année 3.
2. Divisez le prix de chaque mois par la moyenne de son année : c'est l'indice du mois dans l'année (1,00 = prix moyen).
3. Faites la **moyenne des trois indices** du même mois.

### Le résultat
| Mois | Indice moyen |
|---|---|
| Janvier | 0,918 |
| Mai | 1,083 |
| Juin | 1,137 |
| **Juillet** | **1,184** |
| Octobre | 0,900 |
| **Novembre** | **0,843** |
| Décembre | 0,856 |

Dans cette série, le prix de juillet dépasse de 18 % le prix moyen de l'année et celui de novembre est inférieur de 16 %. L'écart entre la soudure (juin et juillet) et la récolte (novembre et décembre) est de **36,9 %** en moyenne sur les trois ans : 36,2 % l'année 1, 42,6 % l'année 2, 31,4 % l'année 3.

### Ce que l'indice permet
- Choisir **quand vendre** : l'indice dit à quel moment le prix monte, pas combien vous gagnerez en attendant (voir la leçon sur le stockage du module Cultures vivrières).
- Choisir **quand acheter** vos intrants ou votre matière première.
- Placer les **entrées d'argent** dans le plan de trésorerie : si vous vendez à la récolte, c'est au prix bas.

#### Ce qu'il faut retenir
- L'indice saisonnier se calcule en divisant le prix du mois par la moyenne de l'année.
- Moyennez au moins trois années : une seule année peut être une exception.
- Le motif de la série fictive ne se transpose pas : calculez le vôtre.

### Exercice
Avec la feuille Relevés du classeur joint, remplacez la série fictive par **vos** relevés mensuels d'au moins deux années, et lisez l'indice de chaque mois dans la feuille Saisonnalité.
`,
    },
    {
      id: 'ps_3',
      titre: 'La volatilité et le prix prudent',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez mesurer la variation des prix d'une année à l'autre et en déduire un prix prudent pour le plan.

### Deux sources de variation
- **La saison :** le prix varie à l'intérieur de l'année (leçon précédente).
- **L'année :** le niveau moyen change d'une année à l'autre, selon la récolte, la demande, les importations, les prix des intrants et la politique des pouvoirs publics.

Un plan doit tenir compte des deux. Dans la série fictive, la moyenne annuelle passe de 207,8 à 226,5 (+ 9 %) puis à 194,8 (− 14 %).

### Mesurer la volatilité
Deux chiffres suffisent :
- l'**écart-type** : mesure de l'écart typique des relevés autour de leur moyenne (fonction ÉCARTYPE ou STDEV d'un tableur) ;
- le **coefficient de variation** : écart-type divisé par la moyenne, en pourcentage ; il permet de comparer des produits de prix différents.

Sur les 36 relevés fictifs : moyenne 209,7 ; écart-type 26,9 ; **coefficient de variation 12,8 %** ; minimum 168 ; maximum 274.

### Le prix du plan : le prix de vente, pas le meilleur prix
Si vous vendez à la récolte, ce qui compte est le **prix à la récolte**, pas la moyenne de l'année. Dans la série fictive, en prenant novembre et décembre des trois années :
| Indicateur | Valeur |
|---|---|
| Prix moyen à la récolte | 178,0 FCFA/kg |
| Écart-type à la récolte | 8,7 FCFA/kg |
| **Prix prudent (moyenne moins un écart-type)** | **169,3 FCFA/kg** |
| Prix moyen à la soudure | 243,7 FCFA/kg |

Le **prix prudent** est une règle simple : la moyenne des relevés du moment où vous vendrez, diminuée d'un écart-type. Ce n'est pas un minimum garanti : un prix peut descendre plus bas. C'est un prix auquel on peut raisonnablement s'attendre dans une mauvaise année, utile pour le scénario pessimiste.

### Les limites
- Avec trois années, l'écart-type est fragile : plus vous avez de relevés, plus il est fiable.
- Une série passée ne prévoit pas l'avenir : un changement de politique, d'importation ou de transport peut modifier le niveau des prix.
- Ne confondez pas le prix **moyen** avec le prix qu'**un acheteur** vous a promis : seul un contrat écrit fixe un prix.

#### Ce qu'il faut retenir
- Mesurez la volatilité avec l'écart-type et le coefficient de variation.
- Le plan se bâtit sur le prix de la période où l'on vend.
- Le prix prudent (moyenne moins un écart-type) alimente le scénario pessimiste.

### Exercice
Avec la feuille Volatilité du classeur joint et **vos** relevés, calculez votre prix moyen à la période de vente, votre écart-type et votre prix prudent, puis comparez-le au prix que vous aviez écrit dans votre plan.
`,
    },
    {
      id: 'ps_4',
      titre: 'Effet sur le plan : chiffre d\'affaires, DSCR et mesures',
      duree_minutes: 9,
      contenu: `### Objectif
Vous saurez mesurer l'effet d'un prix prudent sur le chiffre d'affaires et la couverture de la dette, et choisir des mesures pour réduire l'exposition au prix.

### L'exemple : le riz irrigué du module Cultures vivrières
Le cas « Riz irrigué en deux campagnes au Mali » vend 171,0 tonnes à **190 FCFA/kg** : chiffre d'affaires de 32,5 M FCFA, DSCR de 1,47, VAN de 5,2 M FCFA. Son coût complet est d'environ **162 FCFA/kg**.

Rapprochez-le de la série fictive de la leçon précédente (les chiffres sont des hypothèses, les deux séries ne viennent pas du même marché : l'exercice est un exercice de méthode) :
| Prix retenu | Chiffre d'affaires | DSCR de l'année 2 | VAN (10 %) |
|---|---|---|---|
| 190 FCFA/kg (prix du cas) | 32,5 | 1,47 | 5,2 |
| 178,0 FCFA/kg (moyenne à la récolte de la série) | 30,4 | 1,22 | − 0,2 |
| 169,3 FCFA/kg (prix prudent de la série) | 29,0 | 1,03 | − 3,9 |

Au prix prudent, le chiffre d'affaires recule de 3,5 M FCFA, le prix est inférieur de 10,9 % à celui du plan, la marge par kilogramme n'est plus que de 7,3 FCFA (169,3 moins 162) et la dette est tout juste couverte. **Un prix de plan trop optimiste cache un projet fragile.**

### Les mesures pour réduire l'exposition au prix
| Mesure | Ce qu'elle apporte | À vérifier |
|---|---|---|
| Contrat de vente écrit avec prix ou formule de prix | Un prix connu avant la campagne | La solidité de l'acheteur, les pénalités |
| Vente échelonnée sur plusieurs mois | Moyenne des prix de plusieurs périodes | Stockage sûr, besoin de trésorerie |
| Stockage d'une partie de la récolte | Accès au prix de soudure | Gain net après pertes et frais |
| Transformation ou vente directe | Une marge de plus | Investissement et débouchés |
| Diversification des cultures ou des clients | Moins de dépendance à un seul prix | Capacité de gestion |
| Achat groupé d'intrants | Un coût plus bas | Calendrier et qualité |

Aucune de ces mesures n'est gratuite : chiffrez-la dans le modèle, comme dans le cas, avant de la présenter.

### Ce que le plan doit écrire
1. Le **prix de base** : relevés datés, période de vente, source.
2. Le **prix prudent** et le scénario pessimiste qui l'utilise.
3. Le **seuil de prix** : à partir de quel prix le DSCR passe-t-il sous 1 ?
4. Les **mesures** retenues, chiffrées, et le suivi des prix prévu (relevé mensuel).

Ne mentionnez jamais un prix garanti, un prix plancher ou un dispositif de stabilisation des prix sans l'avoir vérifié auprès de la source officielle, avec la date : ils changent d'un pays et d'une année à l'autre.

#### Ce qu'il faut retenir
- Un prix de plan trop optimiste cache un DSCR fragile : testez le prix prudent.
- Un prix se couvre par un contrat, un étalement des ventes, le stockage ou la transformation, chacun chiffré.
- Le plan écrit son prix de base, son prix prudent et son seuil de prix.

### Exercice
Avec la feuille Impact du classeur joint, entrez le prix, la quantité et le coût complet de **votre** plan, calculez l'effet du prix prudent sur le chiffre d'affaires, puis reportez ce prix dans le scénario pessimiste de votre classeur de filière et lisez le DSCR.
`,
    },
  ],
}
