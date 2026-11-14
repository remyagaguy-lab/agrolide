import type { Filiere } from './types'

/**
 * Module de filière « Cultures vivrières : maïs, riz, soja ». Chiffres du cas « Riz irrigué en deux campagnes au Mali »
 * (src/content/cas-chiffres/riz-irrigue-mali.ts, calculé par scripts/modeles_bp/cas_chiffres.py) :
 * hypothèses pédagogiques, à remplacer par vos relevés de rendements et de prix datés, et par vos devis.
 */
export const culturesVivrieres: Filiere = {
  slug: 'cultures-vivrieres',
  titre: 'Cultures vivrières : maïs, riz, soja',
  resume: "Cinq leçons pour chiffrer une exploitation de cultures annuelles : choix de la culture et du système (pluvial, bas-fonds, irrigué), rendement et budget par hectare, prix saisonniers et stockage, mécanisation et main-d'œuvre, financement de campagne et seuil. Cas chiffré (riz irrigué, Mali) et classeur Excel inclus.",
  statut: 'disponible',
  casSlug: 'riz-irrigue-mali',
  gabarit: {
    libelle: "Classeur Excel : budget par hectare, rendement, prix, stockage, financement et scénarios d'une culture annuelle",
    url: '/documents/bp-agricole/Agrolide-gabarit-cultures-vivrieres.xlsx',
  },
  lecons: [
    {
      id: 'vi_1',
      titre: 'Choisir sa culture et son système : pluvial, bas-fonds, irrigué',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez comparer le maïs, le riz et le soja, et choisir un système de culture (pluvial, bas-fonds, irrigué) en fonction de l'eau, du marché et de votre capacité à financer la campagne.

### Trois cultures, trois logiques
| | Maïs | Riz | Soja |
|---|---|---|---|
| Besoin en eau | Régulier, sensible aux arrêts de pluie à la floraison | Élevé ; le riz irrigué ou de bas-fonds demande une eau maîtrisée | Modéré, sensible au manque d'eau au remplissage des graines |
| Intrants | Engrais important | Engrais et eau, parfois repiquage | Peu d'azote (la plante en fixe elle-même), mais semences et inoculum |
| Débouchés | Alimentation humaine, aliment du bétail | Alimentation humaine, rizeries, commerçants | Huile, tourteau pour l'aliment du bétail, alimentation humaine |
| Ce qui pèse le plus | Engrais et prix à la récolte | Eau, rendement et récolte | Qualité des semences et débouché organisé |

Ce tableau donne des ordres de grandeur agronomiques. Les variétés, les cycles et les besoins exacts dépendent de votre zone : demandez-les à un conseiller agricole ou à un institut de recherche local, et notez la source.

### Trois systèmes
- **Pluvial :** la pluie fait la campagne. Une seule campagne par an, un coût d'aménagement faible, mais un rendement qui varie avec la saison des pluies.
- **Bas-fonds :** une eau plus présente, souvent une seconde campagne possible. L'aménagement demande des diguettes, un drainage et un accord sur l'usage de la parcelle.
- **Irrigué :** l'eau est maîtrisée (pompe, canal, périmètre aménagé). Le rendement est plus stable et deux campagnes par an deviennent possibles, mais l'investissement et les charges d'eau sont élevés.

### Le cas de ce module
Une exploitation de **15 hectares de riz irrigué au Mali**, avec **deux campagnes par an**, soit **30 hectares-campagnes**. Le choix est volontaire : c'est le système où l'investissement, le financement et le risque se voient le mieux. Les mêmes calculs valent pour le maïs ou le soja, avec d'autres rendements, d'autres prix et d'autres charges.

### Comment choisir
1. **Le marché d'abord.** Qui achète, à quel prix, à quelle saison, en quelle quantité ? Une culture sans acheteur identifié est un risque, quel que soit le rendement.
2. **L'eau et la terre.** Disposez-vous d'un droit écrit sur la parcelle pour toute la durée de l'emprunt, et d'une eau sûre ?
3. **Votre trésorerie.** Une campagne se paie avant la récolte : semences, engrais, main-d'œuvre. Combien pouvez-vous avancer ?
4. **Votre expérience.** Une culture que vous connaissez rapporte plus qu'une culture à la mode.

#### Ce qu'il faut retenir
- Le choix de la culture vient du marché ; le choix du système vient de l'eau, du foncier et de la trésorerie.
- L'irrigation stabilise le rendement mais ajoute un investissement et des charges d'eau.
- Tous les ordres de grandeur agronomiques se vérifient auprès d'un conseiller local, avec la date.

### Exercice
Remplissez le tableau de comparaison pour la culture et le système que vous envisagez : acheteurs identifiés, source d'eau, droit sur la terre, trésorerie disponible avant la récolte.
`,
    },
    {
      id: 'vi_2',
      titre: "Rendement et budget par hectare",
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez construire le budget d'une campagne à l'hectare et utiliser un rendement mesuré, jamais un rendement espéré.

### Le rendement : mesuré, pas rêvé
Le rendement d'un cas se lit en kilogrammes par hectare **et par campagne**. Prenez-le dans l'ordre :
1. vos propres mesures sur vos parcelles (récoltes pesées, avec la date) ;
2. celles de voisins comparables (même eau, mêmes semences, même niveau d'engrais) ;
3. les références d'un institut ou d'un conseiller, avec leur source.

Un rendement de station de recherche n'est pas un rendement de paysan. Le cas retient **6 000 kg de paddy par hectare et par campagne** pour un périmètre bien conduit, comme hypothèse pédagogique ; si vous n'avez pas de mesure, partez plus bas et justifiez.

### Les pertes
Entre le champ et la vente, une partie de la récolte disparaît : oiseaux, égrenage, séchage, battage. Le cas retient **5 %** de pertes, soit 5,7 tonnes vendables par hectare et par campagne. Chaque point de perte évité est un point de chiffre d'affaires sans coût supplémentaire.

### Le budget d'une campagne à l'hectare
| Poste | M FCFA par hectare et par campagne |
|---|---|
| Semences | 0,045 |
| Engrais | 0,150 |
| Produits phytosanitaires | 0,045 |
| Eau et énergie de pompage | 0,070 |
| Labour et battage en prestation | 0,150 |
| Main-d'œuvre (repiquage, entretien, récolte) | 0,090 |
| Sacs et transport | 0,040 |
| **Total** | **0,590** |

Pour 30 hectares-campagnes, cela donne **17,7 M FCFA** de charges variables. Le chiffre d'affaires par hectare et par campagne est de 1,083 M FCFA (5,7 t × 190 FCFA/kg), soit une marge de 0,493 M FCFA par hectare avant les charges fixes.

### Le coût par kilogramme
17,7 M FCFA pour 171 tonnes : **environ 103,5 FCFA par kilogramme** de paddy en charges variables. Avec le personnel permanent, les charges fixes, les amortissements et les intérêts, le coût complet monte à **environ 162 FCFA par kilogramme** (27,7 M FCFA au total), avant impôt et avant remboursement du capital. Le prix de vente de 190 FCFA/kg laisse donc une marge de l'ordre de 28 FCFA/kg ; elle est fine.

### Quelle charge surveiller ?
En changeant une charge à la fois dans le cas : engrais + 20 % ramène le DSCR de 1,47 à 1,36, labour et battage + 10 % à 1,42, eau + 20 % à 1,42. Les charges pèsent moins que le rendement et le prix : un rendement inférieur de 10 % ramène le DSCR à 1,07.

#### Ce qu'il faut retenir
- Un rendement s'écrit par hectare et par campagne, avec la source et la date.
- Le budget à l'hectare se construit poste par poste, avec vos prix relevés.
- Le coût complet par kilogramme se compare au prix de vente avant toute décision.

### Exercice
Avec la feuille Hypothèses du classeur joint, remplissez le budget d'une campagne à l'hectare pour votre culture, calculez votre coût par kilogramme (variable puis complet) et comparez-le au prix que vous espérez.
`,
    },
    {
      id: 'vi_3',
      titre: 'Prix saisonniers et stockage : vendre à la récolte ou plus tard',
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez calculer si le stockage d'une partie de la récolte rapporte réellement, et présenter dans le plan un prix de vente prudent.

### Le prix bouge avec la saison
Les céréales et le soja se vendent souvent moins cher juste après la récolte, quand tous les producteurs vendent en même temps, et plus cher quelques mois après. Cet écart est la raison d'être du stockage, mais **il n'est pas garanti** : il varie d'une année et d'un marché à l'autre.

Relevez le prix de votre produit, sur votre marché, **à intervalles réguliers et avec la date**, pendant au moins une campagne. Une série de relevés vaut mieux qu'un prix isolé ; voyez à ce sujet la leçon sur les prix et la saisonnalité quand elle est disponible.

### Le calcul du cas
Le cas vend le paddy à la récolte à 190 FCFA/kg. On compare avec le stockage de **40 % de la récolte** (13,0 M FCFA au prix de récolte) pendant **4 mois** :
| Élément | Hypothèse pédagogique | Effet |
|---|---|---|
| Hausse de prix après 4 mois | + 15 % | Vente à 14,6 M FCFA après pertes |
| Pertes de stockage | 2 % | Déjà déduites |
| Frais de stockage (magasin, sacs, traitement, gardiennage) | 3 % de la valeur | 0,4 M FCFA |
| Coût de l'argent immobilisé | 9 % par an, soit 3 % sur 4 mois | 0,4 M FCFA |
| **Gain net** | | **0,9 M FCFA** |

Le gain net est faible face à 13,0 M FCFA stockés. Et il **disparaît si la hausse de prix est de 8,2 % seulement** : c'est le seuil de rentabilité du stockage dans ce cas.

### Les questions à poser avant de stocker
- Quelle hausse de prix a-t-on observée sur plusieurs années, et pas seulement l'an dernier ?
- Votre magasin est-il sûr (humidité, rongeurs, insectes) ? Une perte de 10 % annule le gain.
- Avez-vous besoin de cet argent tout de suite pour rembourser un crédit ou payer la campagne suivante ?
- Existe-t-il un système de stockage collectif ou un crédit sur stock dans votre pays ? Vérifiez-le auprès de la source officielle et datez-le : ne le citez pas sans vérification.

### Ce que le plan doit montrer
Dans le scénario de base, vendez **à la récolte**, au prix le plus prudent. Présentez le stockage comme une **option chiffrée** avec son seuil, pas comme un revenu acquis. Un banquier se méfie d'un plan qui compte sur la hausse de prix.

#### Ce qu'il faut retenir
- L'écart de prix entre la récolte et la période de soudure est réel mais variable.
- Le stockage coûte des pertes, des frais et le coût de l'argent : calculez le seuil de hausse de prix.
- Le prix de base du plan est celui de la récolte ; le stockage est une option.

### Exercice
Avec la feuille Stockage du classeur joint, calculez le seuil de hausse de prix au-dessus duquel stocker rapporte, avec **vos** frais et **vos** pertes, puis écrivez la part de la récolte que vous stockeriez.
`,
    },
    {
      id: 'vi_4',
      titre: "Mécanisation et main-d'œuvre",
      duree_minutes: 8,
      contenu: `### Objectif
Vous saurez décider entre acheter une machine, payer une prestation ou travailler à la main, et chiffrer la main-d'œuvre des pointes de travail.

### Les pointes de travail
Une culture annuelle demande beaucoup de bras à quelques moments : préparation du sol, repiquage ou semis, désherbage, récolte, battage. Hors de ces pointes, il n'y a presque rien à faire. Le calendrier de la leçon 3.2 le montre : placez ces pointes sur douze mois avant de chiffrer le personnel.

### Acheter, louer ou payer une prestation
Dans le cas, **labour et battage sont achetés en prestation** : 0,150 M FCFA par hectare et par campagne, soit **4,5 M FCFA par an** pour 30 hectares-campagnes. L'exploitation n'achète ni tracteur ni batteuse.

Pourquoi ? Une machine n'est rentable que si elle travaille assez d'hectares. Le module Services agricoles prend 480 hectares de labour par tracteur et par an comme hypothèse de prestataire ; une exploitation de 30 hectares-campagnes en est très loin. Acheter une machine pour soi seul ne se justifie en général que sur de grandes surfaces ou en achetant en commun.

| Solution | Avantage | Limite |
|---|---|---|
| Prestation | Pas d'investissement, pas d'entretien | Dépend de la disponibilité du prestataire à la bonne date |
| Location | Souple | Prix et disponibilité variables |
| Achat en commun (coopérative) | Partage du coût | Règles d'usage à écrire |
| Achat seul | Maîtrise du calendrier | Investissement lourd, entretien, pannes |

Demandez des devis écrits et comparez-les dans le plan, avec la date et la source. Ne présentez jamais un dispositif d'aide à l'équipement sans l'avoir vérifié (voir la fiche Cadre pays).

### La main-d'œuvre
Le cas retient **0,090 M FCFA par hectare et par campagne**, soit **2,7 M FCFA par an**, pour le repiquage, l'entretien et la récolte, plus un chef de culture et un gardien en personnel permanent (3,6 M FCFA par an). Posez-vous :
- combien de journées de travail par hectare, par tâche ?
- à quel prix la journée, relevé auprès de qui, à quelle date ?
- le travail familial est-il compté ? Un travail non payé reste un coût : il se chiffre au prix de la journée.

### La date compte plus que la machine
Un labour trop tardif décale le semis et réduit le rendement. Si votre plan dépend d'une prestation, prévoyez un **contrat ou une réservation écrite** avant la campagne et un plan de repli.

#### Ce qu'il faut retenir
- Les besoins en bras se concentrent sur quelques pointes ; chiffrez-les au calendrier.
- Sur une petite surface, la prestation ou l'achat en commun bat souvent l'achat d'une machine.
- Réservez la prestation avant la campagne : une date manquée coûte du rendement.

### Exercice
Faites la liste des tâches de votre campagne avec, pour chacune, le nombre de journées, le prix de la journée relevé et la solution retenue (main-d'œuvre, prestation, location, achat) ; chiffrez le total et comparez-le à la ligne du budget à l'hectare.
`,
    },
    {
      id: 'vi_5',
      titre: 'Financement de campagne, seuil et risques',
      duree_minutes: 9,
      contenu: `### Objectif
Vous saurez établir le coût d'un projet de culture, son financement, son seuil de rentabilité et sa couverture de dette, et présenter ses risques.

### L'investissement et le besoin de campagne
Dans le cas, **27,9 M FCFA** d'immobilisations :
| Poste | Montant | Amortissement |
|---|---|---|
| Frais d'établissement et accord foncier | 0,4 | 5 ans |
| Aménagement des parcelles (planage, diguettes, canaux, 15 ha) | 12,0 | 15 ans |
| Pompe, groupe et réseau d'irrigation | 6,0 | 8 ans |
| Magasin de stockage et aire de séchage | 5,0 | 20 ans |
| Petit matériel et motoculteur | 3,0 | 5 ans |
| Imprévus (capitalisés) | 1,5 | 10 ans |
| **Total** | **27,9** | |

S'y ajoute le **besoin de fonds de roulement de 8,0 M FCFA** : les semences, l'engrais et la main-d'œuvre se paient avant la récolte. Coût total : **35,9 M FCFA**.

### Le financement
- apport : 10,8 M FCFA (30 %) ;
- emprunt : 25,1 M FCFA à 9 % sur 7 ans dont 1 an de différé.

L'année 1, seuls les intérêts sont payés (2,3 M FCFA). À partir de l'année 2, l'annuité est d'environ **5,6 M FCFA** par an. Un crédit de campagne à court terme, remboursé à la vente de la récolte, est une autre solution pour le seul besoin de fonds de roulement : voyez le module Choisir son financement et vérifiez les conditions réelles auprès de la source, avec la date.

### Le seuil et la couverture de la dette
- Coûts fixes totaux : personnel 3,6 + charges fixes 1,5 + amortissements 2,6 + intérêts 2,3 = **10,0 M FCFA**.
- Taux de marge sur coûts variables : 45,5 %. Seuil de rentabilité : 10,0 ÷ 0,455 = **22,0 M FCFA**, soit **68 %** du chiffre d'affaires de 32,5 M FCFA (marge de sécurité : 32 %).

| Scénario (année 2) | CA | EBE | DSCR | VAN (10 %) | TRI |
|---|---|---|---|---|---|
| Réaliste | 32,5 | 9,7 | **1,47** | 5,2 | 14,2 % |
| Pessimiste (rendement − 5 %, prix − 4 %, engrais + 10 %, labour et battage + 5 %) | 29,6 | 6,2 | **1,03** | − 3,9 | 6,8 % |
| Mauvaise campagne (rendement − 20 %, prix − 5 %) | 24,7 | 1,9 | **0,34** | − 15,8 | − 3,2 % |

### Rendement et prix décident
Testés un par un : un rendement **ou** un prix inférieur de 10 % ramène le DSCR à 1,07 et rend la VAN négative (− 3,1 M FCFA). Des pertes de récolte de 10 % au lieu de 5 % le ramènent à 1,26. Pour que le DSCR reste supérieur à 1, le rendement ne doit pas baisser de plus de 11 % environ (même ordre pour le prix) : la marge est mince.

### Les risques d'une culture annuelle
- **La sécheresse ou l'inondation :** une campagne perdue ne se rattrape pas.
- **Le prix :** l'offre de tous les producteurs se rencontre à la récolte.
- **L'eau :** panne de pompe, coupure d'eau, conflit d'usage.
- **Les ravageurs et les oiseaux.**
- **Le foncier :** un droit écrit pour toute la durée de l'emprunt.

Chiffrez chaque risque et écrivez la mesure de mitigation : variétés adaptées, calendrier tenu, contrat d'achat, assurance si une offre existe, réserve de trésorerie, pompe de secours.

#### Ce qu'il faut retenir
- Le coût du projet inclut le besoin de campagne, pas seulement l'aménagement.
- Un projet de culture annuelle est sensible au rendement et au prix : testez-les un par un.
- Présentez toujours un scénario pessimiste et une mauvaise campagne.

### Exercice
Avec le classeur joint, trouvez le rendement en dessous duquel votre DSCR passe sous 1, puis proposez deux mesures chiffrées pour résister à une mauvaise campagne.
`,
    },
  ],
}
