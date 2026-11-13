import { ParcoursSeed } from './types';
import { QUIZ } from './quiz_banque';

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

### Et dans votre pays ?

Le cas ci-dessous est sénégalais : pour votre business plan, appliquez le PESTEL à VOTRE pays et à VOTRE zone. Pensez en particulier aux règles communes de l'espace UEMOA/CEDEAO (tarif extérieur commun, circulation des produits agricoles entre pays, comme l'oignon du Niger ou le maïs), aux mesures nationales d'ouverture ou de suspension des importations, aux subventions d'intrants et aux saisons : le sud du Togo, du Bénin, de la Côte d'Ivoire et du Ghana connaît deux saisons des pluies, le nord et le Sahel une seule.

### Le cas de Diap Touré : Le potentiel de la zone des Niayes

Reprenons l'exemple de Diap Touré au Sénégal, avec son projet de 10 hectares d'oignon et de pomme de terre. Dans son business plan, il ne s'est pas contenté de dire "la terre est fertile". Il a structuré son analyse environnementale ainsi :

- **Politique et Légal :** L'État sénégalais suspend régulièrement les importations d'oignon et de pomme de terre pendant la récolte locale pour protéger les producteurs (par exemple en janvier 2025 puis en janvier 2026). C'est une opportunité, mais instable : les dates changent d'une année à l'autre, le marché peut être rouvert par anticipation et des plafonds de prix peuvent être imposés. Diap ne bâtit donc pas son modèle sur cette protection : il la traite comme un bonus incertain.
- **Environnemental :** La zone des Niayes bénéficie d'un microclimat côtier favorable à l'horticulture et de nappes phréatiques peu profondes (les céanes). Cependant, la menace de salinisation des terres due à l'avancée de la mer et la pression foncière due à l'urbanisation de Dakar sont des menaces identifiées.
- **Économique :** La production d'oignon a dépassé 400 000 tonnes en 2024. Le marché connaît ainsi deux visages : surabondance à la récolte (des prix de 105-110 FCFA/kg ont été observés au bord des champs en 2025) et tensions quelques mois plus tard. Le gain se trouve donc dans l'étalement des ventes, pas dans une pénurie permanente.
- **Technologique :** L'accès récent à des systèmes de pompage solaire abordables permet de réduire drastiquement la facture énergétique par rapport aux motopompes à essence classiques.

En quelques paragraphes, Diap a prouvé que son projet s'inscrit dans une dynamique nationale favorable (politique de protection des producteurs, mais instable), tout en identifiant clairement les risques naturels de sa zone d'implantation. 

### Les facteurs clés de succès

De cette analyse environnementale, vous devez déduire les "Facteurs Clés de Succès" (FCS) de votre secteur. Ce sont les conditions obligatoires pour réussir. Pour Diap, les FCS identifiés étaient : la maîtrise du calendrier agricole et du stockage pour vendre en dehors du pic de récolte, quelle que soit la politique d'importation, et la sécurisation foncière par un acte reconnu (affectation ou bail selon le régime foncier), indispensable face à la spéculation immobilière dans les Niayes.

#### Ce qu'il faut retenir
- L'analyse PESTEL structure l'étude des contraintes et opportunités externes.
- En agriculture, l'aspect "Environnemental" (climat, eau, sols) et "Politique/Légal" (foncier, subventions, taxes) sont souvent les plus déterminants.
- L'analyse de l'environnement doit déboucher sur l'identification des facteurs clés de succès de votre projet.`,
      quiz_json: QUIZ["lec_2_1"]
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

Diap Touré, avec ses 10 hectares, a une capacité de production d'environ 176 tonnes d'oignon vendable par campagne (7 hectares × 28 t/ha, après 10 % de pertes). Il lui est strictement impossible de vendre cela kilo par kilo à des ménages.

**Ses données secondaires :** En consultant les rapports de l'Agence Nationale de la Statistique et de la Démographie (ANSD), il démontre que la consommation annuelle d'oignon au Sénégal est en croissance constante (entre 380 000 et 480 000 tonnes selon les sources de 2023 à 2025), poussée par la démographie et les habitudes culinaires (le fameux Ceebu Jën national).
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
| Grossistes | Prix compétitif, volume | Très grand | 141 tonnes/an |
| Supermarchés | Calibre régulier, hygiène, emballage | Moyen en croissance | 35 tonnes/an |

#### Ce qu'il faut retenir
- "Tout le monde" n'est pas une cible commerciale.
- Segmentez en choisissant clairement entre les modèles B2B et B2C, ou en les mixant intelligemment.
- Croisez les données macro-économiques (secondaires) avec vos propres enquêtes de terrain (primaires).
- Présentez vos cibles sous forme de tableau pour faciliter la lecture du banquier.`,
      quiz_json: QUIZ["lec_2_2"]
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
   
2. **L'oignon importé (Pays-Bas et autres origines), disponible quand l'État ouvre le marché (Concurrents indirects/directs selon la période) :**
   - *Leurs forces :* Qualité constante, séchage parfait, longue durée de conservation, disponibilité toute l'année, emballages en filets propres de 25 kg.
   - *Leurs faiblesses :* Accès au marché incertain (il dépend des décisions d'ouverture de l'État d'une année à l'autre), prix plus élevé en période de fermeture, et "manque de goût" reproché par certains consommateurs locaux préférant l'oignon de Galmi local. N'oubliez pas les autres concurrents que vous ne voyez pas depuis votre région : autres zones de production du pays et importations régionales (par exemple l'oignon du Niger, premier exportateur de la région).

### Trouver votre créneau (Proposition de Valeur)

L'étude de la concurrence ne sert pas à vous décourager, mais à trouver la faille dans laquelle vous insérer : c'est votre **créneau**.
Votre proposition de valeur doit être la réponse aux faiblesses de vos concurrents.

**Le créneau trouvé par Diap Touré :** 
Lui ne va pas faire de la quantité en vrac comme les producteurs familiaux. Fort de son analyse, il investit dans un **hangar de séchage et de stockage ventilé**. 
*Sa proposition de valeur :* "Proposer de l'oignon local calibré et mis en filet de 25kg (comme l'oignon importé), disponible sur le marché deux mois après le pic des récoltes locales (grâce au stockage), au moment où les petits producteurs ont écoulé leurs stocks et où les prix remontent."

Le créneau est crédible : il répond aux faiblesses constatées de ses deux types de concurrents. Il ne tient toutefois que si le gain de prix obtenu par le stockage (environ 100 FCFA/kg dans le cas de Diap) dépasse le coût et les pertes du stockage : cela se vérifie dans les prévisions financières (chapitre 5.3).

### Le tableau de benchmarking

Présentez cela sous forme de tableau dans votre dossier :
| Critères | Les exploitants familiaux | L'oignon importé | Mon Projet (Le Créneau) |
|---|---|---|---|
| Qualité perçue (Goût) | Élevée (Local) | Moyenne | Élevée (Local) |
| Calibrage / Emballage | Médiocre (Vrac) | Excellent (Filets) | Excellent (Filets) |
| Période de disponibilité | Très courte (Surcharge du marché) | Selon les ouvertures du marché | Étendue (grâce au stockage) |
| Prix | Bas puis très instable | Élevé | Milieu de gamme premium |

#### Ce qu'il faut retenir
- Tout projet a des concurrents directs ou des produits de substitution. Les nier décrédibilise le dossier.
- Identifiez les forces et surtout les faiblesses de vos concurrents.
- Votre proposition de valeur doit exploiter ces faiblesses pour justifier pourquoi les clients vous choisiront vous.
- Synthétisez votre analyse concurrentielle dans un tableau comparatif (benchmark).`,
      quiz_json: QUIZ["lec_2_3"]
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
- Nouvelle marque sur le marché, face aux habitudes des grossistes (oignon importé ou vendu en vrac).
- Dépendance technique aux équipements d'irrigation solaire (besoin de maintenance pointue).

**OPPORTUNITÉS (Externe)**
- Politique de protection des producteurs : suspensions d'importations récurrentes depuis plusieurs années (instables, à ne pas traiter comme acquises).
- Marché en surproduction à la récolte et plus tendu quelques mois plus tard : forte demande pour un stockage de qualité.
- Dispositifs d'appui à l'irrigation économe en eau (à identifier et à nommer dans votre dossier : programme, bailleur, conditions).

**MENACES (Externe)**
- Changement climatique et risque de sécheresse prolongeant la saison sèche.
- Volatilité des prix des semences importées (généralement facturées en devises étrangères).
- Pression des ravageurs et maladies de l'oignon et de la pomme de terre (thrips, mildiou, fusariose, flétrissement bactérien).
- Revirement de la politique d'importation (ouverture anticipée, plafonds de prix) et chute des prix à la récolte.

### L'utilisation croisée (L'étape supérieure)

Un bon SWOT ne sert pas qu'à faire un joli tableau. L'objectif est de montrer comment vous allez croiser ces éléments dans la suite de votre business plan (votre stratégie).
Par exemple, Diap croise une de ses *Forces* (irrigation moderne) avec une *Menace* (sécheresse) : "Grâce à notre système goutte-à-goutte sur nappe, nous sommes résilients face à la menace de la sécheresse qui affectera durement nos concurrents familiaux, ce qui nous donne de bonnes chances d'avoir de la production quand les prix sont au plus haut."

Faites de même avec les quatre combinaisons : Force + Opportunité (attaquer), Force + Menace (se protéger), Faiblesse + Opportunité (se corriger), Faiblesse + Menace (se défendre). Exemple de ce dernier cas : la faiblesse « fort endettement » face à la menace « chute des prix » appelle un différé de remboursement et des contrats de prévente.

#### Ce qu'il faut retenir
- L'analyse Interne (Forces/Faiblesses) concerne VOTRE entreprise.
- L'analyse Externe (Opportunités/Menaces) concerne l'ENVIRONNEMENT et le MARCHÉ.
- Soyez honnête sur vos Faiblesses et vos Menaces : c'est le gage de votre crédibilité.
- Un bon SWOT permet d'élaborer des stratégies croisées (utiliser une Force pour contrer une Menace).`,
      quiz_json: QUIZ["lec_2_4"]
    }
  ]
};
