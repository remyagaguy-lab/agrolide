import { ParcoursSeed } from './types';

export const parcours2: ParcoursSeed = {
  id: "bp_agri_p2",
  titre: "Parcours 2 — Étudiez votre marché",
  description: "Prouver qu'il existe une demande réelle pour votre projet. De l'analyse de l'environnement macroéconomique jusqu'au diagnostic SWOT.",
  lecons: [
    {
      id: "lec_2_1",
      titre: "Comprendre l'environnement de votre filière",
      duree_minutes: 9,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous serez capable d'identifier les facteurs politiques, économiques, sociaux, technologiques, environnementaux et légaux (la méthode PESTEL) qui influencent votre filière, afin de prouver au bailleur que vous maîtrisez le contexte global dans lequel votre projet va évoluer.

### Pourquoi analyser l'environnement macroéconomique ?

Aucun projet agricole n'évolue en vase clos. La réussite de votre exploitation dépend en grande partie de facteurs externes sur lesquels vous n'avez aucun contrôle, mais que vous devez anticiper. Une subvention de l'État sur les engrais (facteur politique) peut augmenter votre marge, tandis qu'une fermeture inattendue des frontières (facteur légal/économique) peut bloquer vos exportations. 

L'analyse de l'environnement prouve à l'évaluateur de votre business plan que vous n'êtes pas naïf : vous savez dans quoi vous mettez les pieds.

### La méthode PESTEL appliquée à l'agriculture

L'outil le plus utilisé pour structurer cette analyse est le modèle PESTEL. Voici comment l'adapter au secteur agricole :

1. **Politique :** Quelles sont les orientations de l'État ? Y a-t-il des subventions, des programmes de souveraineté alimentaire, ou au contraire une instabilité politique qui menace les circuits de distribution ?
2. **Économique :** Quel est le pouvoir d'achat de la population cible ? Quel est le taux d'inflation ? Comment évoluent les coûts des intrants importés face à la monnaie locale ?
3. **Socioculturel :** Quelles sont les habitudes de consommation ? Observe-t-on une préférence croissante pour les produits locaux ou biologiques, ou une forte urbanisation qui modifie les besoins alimentaires ?
4. **Technologique :** Quelles innovations sont accessibles ? Irrigation goutte-à-goutte, utilisation de drones pour le traitement, semences améliorées résistantes à la sécheresse, applications de paiement mobile (mobile money) pour les ventes.
5. **Environnemental (Crucial en agriculture) :** Quel est le régime pluviométrique ? Y a-t-il des risques de sécheresse, d'inondation, ou de dégradation des sols ? Comment le changement climatique affecte-t-il les dates de semis ?
6. **Légal :** Quelles sont les réglementations foncières (lois sur le domaine national, baux emphytéotiques) ? Quelles sont les normes phytosanitaires exigées pour vendre en supermarché ou à l'export ?

### Le cas de Diap Touré : Le potentiel de la zone des Niayes

Reprenons l'exemple de Diap Touré au Sénégal, avec son projet de 10 hectares d'oignon et de pomme de terre. Dans son business plan, il ne s'est pas contenté de dire "la terre est fertile". Il a structuré son analyse environnementale ainsi :

- **Politique et Légal :** L'État sénégalais a mis en place des mesures de gel des importations d'oignons pendant la période de récolte locale pour protéger les producteurs. C'est une opportunité majeure qui garantit l'écoulement des stocks à un prix rémunérateur pendant quelques mois.
- **Environnemental :** La zone des Niayes bénéficie d'un microclimat côtier favorable à l'horticulture et de nappes phréatiques peu profondes (les céanes). Cependant, la menace de salinisation des terres due à l'avancée de la mer et la pression foncière due à l'urbanisation de Dakar sont des menaces identifiées.
- **Économique :** Malgré une production locale en hausse, le Sénégal reste déficitaire sur l'oignon et la pomme de terre, entraînant des prix élevés en période de soudure. La demande est donc structurellement supérieure à l'offre.
- **Technologique :** L'accès récent à des systèmes de pompage solaire abordables permet de réduire drastiquement la facture énergétique par rapport aux motopompes à essence classiques.

En quelques paragraphes, Diap a prouvé que son projet s'inscrit dans une dynamique nationale favorable (le gel des importations), tout en identifiant clairement les risques naturels de sa zone d'implantation. 

### Les facteurs clés de succès

De cette analyse environnementale, vous devez déduire les "Facteurs Clés de Succès" (FCS) de votre secteur. Ce sont les conditions obligatoires pour réussir. Pour Diap, les FCS identifiés étaient : la maîtrise absolue du calendrier agricole pour récolter pendant la période de gel des importations, et la sécurisation foncière via un bail enregistré, indispensable face à la spéculation immobilière dans les Niayes.

#### Ce qu'il faut retenir
- L'analyse PESTEL structure l'étude des contraintes et opportunités externes.
- En agriculture, l'aspect "Environnemental" (climat, eau, sols) et "Politique/Légal" (foncier, subventions, taxes) sont souvent les plus déterminants.
- L'analyse de l'environnement doit déboucher sur l'identification des facteurs clés de succès de votre projet.`,
      quiz_json: [
        {
          question: "Que signifie l'acronyme PESTEL dans l'analyse de l'environnement ?",
          options: [
            "Projet, Économie, Secteur, Technologie, Équipe, Logistique",
            "Politique, Économique, Socioculturel, Technologique, Environnemental, Légal",
            "Production, Écologie, Savoir-faire, Temps, Espace, Loi",
            "Planification, Évaluation, Stratégie, Travail, Équilibre, Lancement"
          ],
          correctAnswer: 1,
          explanation: "PESTEL est un modèle d'analyse macro-environnementale qui étudie ces 6 dimensions externes influençant l'entreprise."
        },
        {
          question: "Dans le cas de Diap Touré, le gel des importations d'oignons par l'État pendant la récolte locale est un facteur :",
          options: [
            "Technologique",
            "Socioculturel",
            "Politique",
            "Environnemental"
          ],
          correctAnswer: 2,
          explanation: "Une décision de protectionnisme prise par le gouvernement relève de l'environnement politique et légal."
        },
        {
          question: "Pourquoi est-il indispensable d'analyser l'environnement avant de chiffrer son projet ?",
          options: [
            "Pour faire un document plus long",
            "Parce que la loi l'exige pour créer une entreprise",
            "Pour identifier les opportunités et les menaces externes qui auront un impact direct sur la rentabilité",
            "Pour trouver des idées de noms pour son entreprise"
          ],
          correctAnswer: 2,
          explanation: "Anticiper les risques climatiques ou les opportunités réglementaires permet de construire un modèle financier beaucoup plus réaliste et sécurisé."
        },
        {
          question: "Qu'est-ce qu'un Facteur Clé de Succès (FCS) ?",
          options: [
            "Un élément obligatoire que l'entreprise doit maîtriser pour réussir dans son secteur",
            "Le nom du diplôme nécessaire pour être agriculteur",
            "Le montant minimum du crédit bancaire",
            "Le nombre d'employés de la ferme"
          ],
          correctAnswer: 0,
          explanation: "Les FCS sont les éléments stratégiques indispensables (ex: la maîtrise de l'irrigation en zone aride) sans lesquels le projet échouera inévitablement."
        },
        {
          question: "La salinisation des terres et l'avancée de la mer dans la zone des Niayes sont à classer dans l'environnement :",
          options: [
            "Technologique",
            "Politique",
            "Économique",
            "Environnemental"
          ],
          correctAnswer: 3,
          explanation: "Tout ce qui touche au climat, à la qualité des sols et à l'eau relève du facteur Environnemental (le 1er 'E' de PESTEL)."
        }
      ]
    },
    {
      id: "lec_2_2",
      titre: "Identifier et segmenter votre clientèle",
      duree_minutes: 8,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous serez capable de construire un tableau de segmentation client en utilisant des données primaires et secondaires, afin de démontrer précisément à qui vous allez vendre votre production et pourquoi cette clientèle a besoin de vous.

### Pourquoi l'erreur « Tout le monde mange » est fatale

C'est la phrase la plus redoutée par les évaluateurs de business plans agricoles : « L'alimentation est un besoin de base, donc tout le monde est mon client. » 

Si "tout le monde" est votre client, cela signifie que vous n'avez pas de stratégie de vente. Le marché de gros de votre capitale ne s'aborde pas de la même manière qu'un réseau de supermarchés locaux ou qu'une coopérative de femmes transformatrices. Identifier votre clientèle, c'est choisir ses batailles.

### La méthode de segmentation

La segmentation consiste à diviser le marché global en sous-groupes (segments) qui ont les mêmes besoins et les mêmes comportements d'achat. En agriculture, on distingue principalement deux types de marchés :
- **Le B2C (Business to Consumer) :** Vous vendez directement au consommateur final (vente à la ferme, paniers bio, marchés de quartier). Les marges sont plus élevées, mais les volumes vendus par client sont faibles et le temps de logistique est énorme.
- **Le B2B (Business to Business) :** Vous vendez à d'autres entreprises (grossistes, supermarchés, usines agroalimentaires, hôtels-restaurants). Les prix de vente sont plus bas, mais les volumes écoulés sont massifs.

Pour chaque segment ciblé, vous devez définir son profil qualitatif et quantitatif :
- **Profil qualitatif :** Que cherchent-ils ? (prix bas, calibrage précis, régularité d'approvisionnement, certification bio ?). Comment achètent-ils ? (paiement comptant, à crédit, sur contrat ?).
- **Profil quantitatif :** Quelle est la taille de ce segment ? Combien de tonnes peuvent-ils absorber par mois ?

### Données primaires vs Données secondaires

Pour remplir votre étude de marché, vous aurez besoin de deux types de données :
- **Les données secondaires :** Ce sont les statistiques déjà existantes (rapports ministériels, études de la FAO, articles de presse économique). Elles vous permettent de chiffrer la demande globale.
- **Les données primaires :** Ce sont les informations que vous collectez vous-même sur le terrain. (Interviews de grossistes, sondages auprès de restaurants). Elles prouvent que votre projet correspond à la réalité locale.

### L'exemple de Diap Touré : Choix du B2B

Diap Touré, avec ses 10 hectares, a une capacité de production d'environ 300 tonnes d'oignons par cycle. Il lui est strictement impossible de vendre cela kilo par kilo à des ménages.

**Ses données secondaires :** En consultant les rapports de l'Agence Nationale de la Statistique et de la Démographie (ANSD), il démontre que la consommation annuelle d'oignon au Sénégal est en croissance constante (environ 300 000 tonnes), poussée par la démographie et les habitudes culinaires (le fameux Ceebu Jën national).
**Ses données primaires :** Diap est allé interroger 5 bana-banas (grossistes) du marché Thiaroye et du marché d'intérêt national de Diamniadio.

**Sa segmentation finale retenue :**
1. **Cible Principale : Les grossistes (Bana-banas).** 
   - *Volume :* 80% de la production. 
   - *Critère d'achat :* Le prix, la quantité, et la capacité à livrer de gros tonnages d'un coup.
   - *Avantage :* Écoulement rapide, peu de stockage nécessaire.
2. **Cible Secondaire : Les supermarchés (réseaux locaux et internationaux).** 
   - *Volume :* 20% de la production (les plus beaux calibres). 
   - *Critère d'achat :* Le calibrage strict, le nettoyage, le conditionnement en filets, la traçabilité.
   - *Avantage :* Prix de vente nettement supérieur.

### Construire votre tableau de demande

Dans votre business plan, présentez ces informations sous forme de tableau clair :
| Segment | Profil (Besoins) | Taille estimée | Volume ciblé par le projet |
|---|---|---|---|
| Grossistes | Prix compétitif, volume | Très grand | 240 tonnes/an |
| Supermarchés | Calibre régulier, hygiène, emballage | Moyen en croissance | 60 tonnes/an |

#### Ce qu'il faut retenir
- "Tout le monde" n'est pas une cible commerciale.
- Segmentez en choisissant clairement entre les modèles B2B et B2C, ou en les mixant intelligemment.
- Croisez les données macro-économiques (secondaires) avec vos propres enquêtes de terrain (primaires).
- Présentez vos cibles sous forme de tableau pour faciliter la lecture du banquier.`,
      quiz_json: [
        {
          question: "Pourquoi l'affirmation « tout le monde est mon client » est-elle dangereuse dans un business plan ?",
          options: [
            "Parce qu'elle prouve un manque de stratégie commerciale ciblée",
            "Parce qu'elle montre que vous êtes trop ambitieux",
            "Parce que les gens mangent moins aujourd'hui",
            "Parce qu'il est interdit de vendre à tout le monde"
          ],
          correctAnswer: 0,
          explanation: "Ne pas cibler de segment précis indique à l'investisseur que vous ne savez ni où ni comment vous allez écouler vos produits de manière concrète."
        },
        {
          question: "Qu'est-ce qu'une donnée « primaire » dans une étude de marché ?",
          options: [
            "Une information trouvée dans un rapport de la Banque Mondiale",
            "Une information collectée directement par vous-même sur le terrain (interviews, enquêtes)",
            "Le tout premier chiffre de votre prévisionnel",
            "Une donnée concernant l'école primaire"
          ],
          correctAnswer: 1,
          explanation: "Les données primaires sont récoltées par l'entrepreneur lui-même pour son projet spécifique, contrairement aux données secondaires déjà publiées par des tiers."
        },
        {
          question: "Lequel de ces éléments caractérise généralement le modèle de vente B2B (grossistes, industrie) en agriculture ?",
          options: [
            "Volumes de vente très faibles mais marges énormes",
            "Prix de vente plus bas, mais volumes écoulés massifs",
            "Temps de logistique et de livraison très important pour chaque kilo vendu",
            "Contact direct quotidien avec le consommateur final"
          ],
          correctAnswer: 1,
          explanation: "En B2B, l'agriculteur vend de gros tonnages à un acheteur professionnel, souvent à un prix de gros (inférieur au prix de détail) mais en sécurisant des volumes importants."
        },
        {
          question: "Quelle est la cible secondaire retenue par Diap Touré pour valoriser ses meilleurs calibres d'oignons ?",
          options: [
            "L'exportation vers l'Europe",
            "Les marchés de quartier",
            "Les supermarchés locaux et internationaux",
            "La vente directe à la ferme"
          ],
          correctAnswer: 2,
          explanation: "Diap réserve 20% de sa production, celle avec le meilleur calibrage et emballage, aux supermarchés qui offrent de meilleurs prix d'achat."
        }
      ]
    },
    {
      id: "lec_2_3",
      titre: "Analyser vos concurrents et trouver votre créneau",
      duree_minutes: 8,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous serez capable de construire un tableau comparatif de la concurrence, d'identifier vos concurrents directs et indirects, et de formuler votre Proposition de Valeur Unique (votre créneau).

### Le mythe de "l'absence de concurrence"

« Mon produit est tellement bon que je n'ai pas de concurrents. »
Encore une phrase qui fait frémir les banquiers. Si un besoin existe, il est déjà satisfait d'une manière ou d'une autre. L'absence de concurrence n'existe pas. Soit vous avez mal cherché, soit le marché n'existe pas.

Pour analyser l'offre de votre secteur, vous devez cartographier deux types de concurrents :
1. **Les concurrents directs :** Ceux qui proposent exactement le même produit que vous à la même cible.
2. **Les concurrents indirects (produits de substitution) :** Ceux qui répondent au même besoin mais d'une manière différente (ex: un producteur de patate douce est un concurrent indirect pour un producteur de pomme de terre, les importations européennes sont des concurrents indirects de l'oignon local).

### La cartographie de la concurrence

Il ne s'agit pas de lister tous les agriculteurs du pays. Sélectionnez les 3 à 5 concurrents principaux qui ciblent les mêmes clients que vous. Pour chacun, analysez :
- **Leurs forces :** Sont-ils bien implantés ? Ont-ils des prix imbattables ?
- **Leurs faiblesses :** Leurs produits manquent-ils de régularité ? Ont-ils des problèmes d'emballage ? Leurs stocks sont-ils souvent épuisés ?
- **Leur stratégie de prix :** Sont-ils sur du haut de gamme, du milieu ou du bas de gamme ?

### L'analyse de l'offre par Diap Touré

L'offre d'oignon au Sénégal se divise en deux. Diap a analysé ses deux blocs de concurrents :

1. **Les producteurs locaux familiaux (Concurrents directs) :**
   - *Leurs forces :* Coûts de production faibles car main d'œuvre familiale. Forte présence pendant les 4 mois suivant la récolte.
   - *Leurs faiblesses :* Absence de zones de stockage modernes (l'oignon pourrit vite), absence de calibrage (les gros et petits oignons sont mélangés en vrac), forte dépendance aux intermédiaires (les "bana-banas" dictent les prix).
   
2. **L'oignon importé des Pays-Bas (Concurrents indirects/directs selon la période) :**
   - *Leurs forces :* Qualité constante, séchage parfait, longue durée de conservation, disponibilité toute l'année, emballages en filets propres de 25 kg.
   - *Leurs faiblesses :* Prix plus élevé en période de fermeture des frontières, et "manque de goût" reproché par certains consommateurs locaux préférant l'oignon de Galmi local.

### Trouver votre créneau (Proposition de Valeur)

L'étude de la concurrence ne sert pas à vous décourager, mais à trouver la faille dans laquelle vous insérer : c'est votre **créneau**.
Votre proposition de valeur doit être la réponse aux faiblesses de vos concurrents.

**Le créneau trouvé par Diap Touré :** 
Lui ne va pas faire de la quantité en vrac comme les producteurs familiaux. Fort de son analyse, il investit dans un **hangar de séchage et de stockage ventilé**. 
*Sa proposition de valeur :* "Proposer de l'oignon local calibré et mis en filet de 25kg (comme l'oignon importé), disponible sur le marché deux mois après le pic des récoltes locales (grâce au stockage), au moment où les petits producteurs ont écoulé leurs stocks et où les prix remontent, mais avant la réouverture des frontières aux importations."

C'est brillant, car il se glisse exactement dans l'espace vide laissé par ses deux concurrents majeurs.

### Le tableau de benchmarking

Présentez cela sous forme de tableau dans votre dossier :
| Critères | Les exploitants familiaux | L'oignon importé | Mon Projet (Le Créneau) |
|---|---|---|---|
| Qualité perçue (Goût) | Élevée (Local) | Moyenne | Élevée (Local) |
| Calibrage / Emballage | Médiocre (Vrac) | Excellent (Filets) | Excellent (Filets) |
| Période de disponibilité | Très courte (Surcharge du marché) | Toute l'année | Étendue (grâce au stockage) |
| Prix | Bas puis très instable | Élevé | Milieu de gamme premium |

#### Ce qu'il faut retenir
- Tout projet a des concurrents directs ou des produits de substitution. Les nier décrédibilise le dossier.
- Identifiez les forces et surtout les faiblesses de vos concurrents.
- Votre proposition de valeur doit exploiter ces faiblesses pour justifier pourquoi les clients vous choisiront vous.
- Synthétisez votre analyse concurrentielle dans un tableau comparatif (benchmark).`,
      quiz_json: [
        {
          question: "Qu'est-ce qu'un concurrent indirect (produit de substitution) pour un producteur de viande de poulet ?",
          options: [
            "Un producteur de poulet situé dans une autre ville",
            "Un vendeur de matériel avicole",
            "Un producteur de viande de bœuf ou de poisson répondant au même besoin de protéines",
            "Un supermarché"
          ],
          correctAnswer: 2,
          explanation: "Un concurrent indirect propose un produit différent (bœuf, poisson) qui répond cependant au même besoin du consommateur (manger de la viande/des protéines)."
        },
        {
          question: "Pourquoi affirmer dans un business plan que l'on n'a 'aucun concurrent' est-il déconseillé ?",
          options: [
            "Parce que c'est de l'arrogance",
            "Parce que cela signifie que le marché n'existe pas ou que vous avez mal étudié l'offre existante",
            "Parce que l'État l'interdit",
            "Ce n'est pas déconseillé, c'est très bien vu"
          ],
          correctAnswer: 1,
          explanation: "Tout besoin (se nourrir, se vêtir) est déjà satisfait par une solution existante. Si vous ne trouvez pas de concurrents, c'est que votre étude est incomplète."
        },
        {
          question: "Quel est le créneau majeur exploité par Diap Touré face aux producteurs familiaux locaux ?",
          options: [
            "Vendre moins cher qu'eux",
            "Produire une variété secrète",
            "Le calibrage, la mise en filet et le stockage post-récolte pour vendre quand les prix remontent",
            "Importer ses oignons de Hollande"
          ],
          correctAnswer: 2,
          explanation: "Diap attaque la faiblesse des producteurs familiaux : l'absence de stockage et de tri, ce qui l'oblige à vendre tout en même temps à bas prix."
        },
        {
          question: "À quoi sert un tableau de benchmarking concurrentiel dans un business plan ?",
          options: [
            "À montrer que l'on sait utiliser Excel",
            "À lister l'adresse et le numéro de téléphone des autres producteurs",
            "À synthétiser visuellement vos avantages (votre créneau) par rapport aux forces et faiblesses des concurrents",
            "À déterminer le statut juridique de l'entreprise"
          ],
          correctAnswer: 2,
          explanation: "Le benchmark permet au lecteur d'évaluer en un coup d'œil le positionnement de votre offre par rapport à ce qui existe déjà."
        }
      ]
    },
    {
      id: "lec_2_4",
      titre: "Réaliser votre diagnostic FFOM (SWOT)",
      duree_minutes: 6,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous serez capable de synthétiser toutes les analyses précédentes (environnement, demande, concurrence) dans un outil visuel redoutable d'efficacité : la matrice FFOM (Forces, Faiblesses, Opportunités, Menaces), aussi appelée SWOT en anglais.

### La puissance de la synthèse

Un évaluateur bancaire ou un comité d'investissement n'a pas toujours le temps de relire les 30 pages de votre étude de marché en détail. La matrice FFOM est la conclusion de votre Parcours "Étude de marché". C'est un tableau à 4 cases qui résume l'essentiel et démontre votre lucidité en tant que manager.

### Comprendre les 4 cases de la matrice

La matrice FFOM croise l'analyse *interne* (votre propre projet) avec l'analyse *externe* (l'environnement et le marché).

**L'ANALYSE INTERNE (Ce qui dépend de vous et de votre équipe)**
- **Les Forces (Strengths) :** Qu'est-ce que vous faites mieux que les autres ? Quels sont vos avantages concrets ? (Ex: accès exclusif à une technologie, équipe très qualifiée, maîtrise des coûts).
- **Les Faiblesses (Weaknesses) :** Quels sont vos handicaps internes ? (Ex: manque de fonds propres, absence de marque reconnue, manque d'expérience commerciale). Ne mentez pas, listez-les pour prouver que vous les surveillez.

**L'ANALYSE EXTERNE (Ce qui vient du marché, indépendant de vous)**
- **Les Opportunités (Opportunities) :** Les facteurs externes favorables que vous pouvez exploiter. (Ex: subvention de l'État pour l'irrigation, engouement pour le bio, concurrent principal ayant fait faillite).
- **Les Menaces (Threats) :** Les dangers externes qui planent sur votre projet. (Ex: instabilité climatique, augmentation du coût de l'énergie, arrivée de produits étrangers détaxés).

### Le diagnostic SWOT de l'exploitation de Diap Touré

Voici comment Diap a présenté son FFOM dans son business plan :

**FORCES (Interne)**
- Disponibilité d'un foncier sécurisé (Bail de 10ha enregistré).
- Expertise technique et en gestion du promoteur.
- Infrastructures modernes prévues (Goutte-à-goutte, hangar de stockage de 150 tonnes).
- Modèle de commercialisation B2B garantissant des contrats d'écoulement rapides.

**FAIBLESSES (Interne)**
- Budget initial élevé nécessitant un fort endettement.
- Nouvelle marque sur le marché face à l'omniprésence de l'oignon hollandais.
- Dépendance technique aux équipements d'irrigation solaire (besoin de maintenance pointue).

**OPPORTUNITÉS (Externe)**
- Mesures étatiques de gel des importations pendant 6 à 8 mois par an.
- Marché national largement déficitaire en oignon et pomme de terre (demande structurelle).
- Subventions régionales sur les équipements d'irrigation économes en eau.

**MENACES (Externe)**
- Changement climatique et risque de sécheresse prolongeant la saison sèche.
- Volatilité des prix des semences importées (généralement facturées en devises étrangères).
- Pression des maladies phytosanitaires spécifiques à la zone des Niayes (nématodes, mouches blanches).

### L'utilisation croisée (L'étape supérieure)

Un bon SWOT ne sert pas qu'à faire un joli tableau. L'objectif est de montrer comment vous allez croiser ces éléments dans la suite de votre business plan (votre stratégie).
Par exemple, Diap croise une de ses *Forces* (irrigation moderne) avec une *Menace* (sécheresse) : "Grâce à notre système goutte-à-goutte sur nappe, nous sommes résilients face à la menace de la sécheresse qui affectera durement nos concurrents familiaux, ce qui nous garantira d'avoir de la production quand les prix seront au plus haut."

#### Ce qu'il faut retenir
- L'analyse Interne (Forces/Faiblesses) concerne VOTRE entreprise.
- L'analyse Externe (Opportunités/Menaces) concerne l'ENVIRONNEMENT et le MARCHÉ.
- Soyez honnête sur vos Faiblesses et vos Menaces : c'est le gage de votre crédibilité.
- Un bon SWOT permet d'élaborer des stratégies croisées (utiliser une Force pour contrer une Menace).`,
      quiz_json: [
        {
          question: "Dans une matrice FFOM/SWOT, dans quelle catégorie doit-on classer 'Une sécheresse annoncée' ?",
          options: [
            "Force",
            "Faiblesse",
            "Opportunité",
            "Menace"
          ],
          correctAnswer: 3,
          explanation: "Le climat est un élément externe négatif, il s'agit donc d'une Menace."
        },
        {
          question: "Dans quelle catégorie doit-on classer 'L'absence d'expérience commerciale du porteur de projet' ?",
          options: [
            "Force",
            "Faiblesse",
            "Opportunité",
            "Menace"
          ],
          correctAnswer: 1,
          explanation: "C'est un handicap interne propre à l'équipe dirigeante, donc une Faiblesse."
        },
        {
          question: "L'analyse Interne de la matrice FFOM se compose des :",
          options: [
            "Opportunités et Menaces",
            "Forces et Menaces",
            "Forces et Faiblesses",
            "Faiblesses et Opportunités"
          ],
          correctAnswer: 2,
          explanation: "Les Forces et les Faiblesses concernent les capacités propres à l'entreprise (Interne)."
        },
        {
          question: "Dans le FFOM de Diap Touré, le 'gel des importations par l'État' est classé comme :",
          options: [
            "Une Force",
            "Une Faiblesse",
            "Une Opportunité",
            "Une Menace"
          ],
          correctAnswer: 2,
          explanation: "C'est un élément politique externe extrêmement favorable pour le projet, c'est donc une Opportunité."
        }
      ]
    }
  ]
};
