import { ParcoursSeed } from './types';
import { QUIZ } from './quiz_banque';

export const parcours3: ParcoursSeed = {
  id: "bp_agri_p3",
  titre: "Parcours 3 — Construisez l'offre et l'exploitation",
  description: "Décrire concrètement ce que vous produisez, comment vous le produisez (itinéraire technique), et l'organisation légale et humaine de votre entreprise.",
  lecons: [
    {
      id: "lec_3_1",
      titre: "Présenter vos produits et votre itinéraire technique",
      duree_minutes: 9,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous serez capable de rédiger une fiche produit claire et surtout de détailler votre itinéraire technique (ou processus de production) pour prouver au bailleur que vous maîtrisez techniquement votre métier.

### La présentation de vos produits

L'évaluateur de votre dossier n'est probablement pas un agriculteur. Si vous parlez de "variété Galmi", de "bulbes de calibre 50-70mm" sans explication, il ne comprendra pas. Vous devez présenter votre produit de manière professionnelle et compréhensible.

Pour chaque produit, décrivez :
- **La variété choisie et pourquoi :** (ex: Oignon Violet de Galmi, choisi pour sa bonne résistance à la chaleur et sa longue conservation).
- **Le conditionnement (l'emballage) :** Le produit brut a peu de valeur. Précisez si vous vendez en vrac dans des sacs recyclés (déconseillé), ou calibré dans des filets neufs de 25 kg étiquetés à votre marque. C'est ce qui justifiera votre prix de vente.
- **Les normes de qualité :** Mentionnez si vous appliquez des normes (Bio, Global GAP, ou simplement des normes d'hygiène locales) pour accéder aux supermarchés.

### L'itinéraire technique cultural (Le cœur du métier)

C'est ici que l'ingénieur agronome ou le technicien de la banque va vérifier si vos rendements sont réalistes. Un rendement de 25 tonnes de pommes de terre à l'hectare ne s'obtient pas par miracle : il est le résultat d'un itinéraire technique rigoureux.

L'itinéraire technique est la séquence logique et chronologique de toutes les opérations agricoles sur une parcelle. Vous devez détailler les étapes suivantes :

1. **Préparation du sol :** Labours, pulvérisage, épierrage. Utiliserez-vous un tracteur ou de la main-d'œuvre manuelle ? Quel apport de fumure de fond ?
2. **Semis ou Plantation :** Densité de semis, choix des semences (certifiées ou non), préparation des pépinières (pour l'oignon).
3. **Irrigation :** Mode d'irrigation (gravitaire, aspersion, goutte-à-goutte). Fréquence et volume d'eau.
4. **Entretien et fertilisation :** Sarclages, binages. Quel plan de fertilisation (NPK, Urée) et à quel stade de croissance de la plante ?
5. **Protection phytosanitaire :** Comment gérez-vous préventivement et curativement les insectes, champignons et mauvaises herbes ?
6. **Récolte et post-récolte :** Stade de maturité, technique de récolte (manuelle ou mécanisée), séchage, tri, calibrage, et stockage.

### L'itinéraire technique de Diap Touré

Dans le business plan de l'exploitation de 10 ha dans les Niayes, l'itinéraire de l'oignon a été scrupuleusement détaillé pour justifier son rendement prévisionnel de 28 tonnes/hectare.

- **Variétés :** Violet de Galmi et Orient F1.
- **Pépinière :** 45 jours sous ombrière, avec désinfection du sol par solarisation (technique écologique rassurante pour le banquier).
- **Préparation :** Labour profond mécanisé (sous-traitance à un prestataire local).
- **Irrigation :** Adoption du goutte-à-goutte (efficience de 90% par rapport à l'eau) avec pompage solaire. Ce choix technique justifie d'ailleurs le gros besoin en financement initial.
- **Phytosanitaire :** Programme de traitement préventif contre le thrips (ravageur principal) et utilisation de fongicides contre le mildiou en cas d'humidité.
- **Post-récolte (le plus important) :** Arrêt de l'irrigation 15 jours avant la récolte. Fanaison sur le champ pendant 4 jours, puis séchage sous hangar ventilé pendant 3 semaines avant mise en filet.

Grâce à cette description, la banque comprend immédiatement que Diap n'est pas un amateur. Il sait exactement comment mener sa culture de A à Z.

#### Ce qu'il faut retenir
- Présentez vos produits en décrivant clairement leur variété, conditionnement et niveau de qualité.
- L'itinéraire technique est la suite logique de toutes les opérations de production.
- Une bonne maîtrise de l'itinéraire technique est indispensable pour justifier les rendements que vous allez utiliser plus tard dans vos prévisions financières.`,
      quiz_json: QUIZ["lec_3_1"]
    },
    {
      id: "lec_3_2",
      titre: "Planifier votre production (Calendrier de réalisation)",
      duree_minutes: 10,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous serez capable de construire un calendrier de production et un plan d'approvisionnement, en intégrant les contraintes de saisonnalité spécifiques à l'agriculture.

### L'agriculture, c'est l'art de maîtriser le temps

Contrairement à une usine de chaussures qui peut produire 365 jours par an au même rythme, une exploitation agricole est dictée par la saisonnalité. Votre business plan doit comporter deux calendriers distincts, souvent présentés sous forme de diagrammes (type diagramme de Gantt simplifié) :
1. Le calendrier d'installation (avant le démarrage).
2. Le calendrier de production annuel (une fois la ferme lancée).

### Le calendrier d'installation

Ce calendrier liste toutes les tâches préalables à la première mise en terre. Un évaluateur regardera ce calendrier pour vérifier que vous avez prévu suffisamment de temps pour les imprévus.
Par exemple :
- Mois 1 : Signature du bail, formalités administratives.
- Mois 2 : Défrichage, dessouchage et installation de la clôture.
- Mois 3 : Forage du puits, installation du système de pompage solaire et du réseau goutte-à-goutte.
- Mois 4 : Construction du magasin de stockage, achat des premiers intrants.
- Mois 5 : Premier semis en pépinière.

Beaucoup d'agriculteurs sous-estiment ce délai. Si vous prévoyez de planter au Mois 2 alors que l'installation du forage prend généralement 3 mois dans votre région, la banque saura que votre plan est irréaliste.

### Le calendrier de production annuel

C'est ici que la saisonnalité intervient. Vous devez répartir les cultures sur l'année pour optimiser l'utilisation du sol, de l'eau, et de la main-d'œuvre.

**Le cas Diap Touré (Le calendrier de rotation) :**
Sur ses 10 hectares, Diap ne peut pas planter de l'oignon toute l'année, car il y a une saison des pluies (hivernage) très humide qui favorise les maladies fongiques. 

Son calendrier est donc le suivant. Attention : les cinq mois d'installation constituent l'**année 0** du projet (aucun chiffre d'affaires). La première campagne complète ouvre l'**année 1**, dont les rendements sont prudemment fixés à 85 % de la pleine production (montée en puissance).
- **Plan d'assolement :** 7 ha d'oignon et 3 ha de pomme de terre en contre-saison froide ; 3 ha de gombo ou de maïs doux en hivernage (les 7 autres hectares se reposent en engrais vert).
- **Campagne 1 (Oignon, 7 ha - Contre-saison froide) :** Pépinière en octobre, repiquage en novembre/décembre, récolte en mars/avril, puis séchage et vente entre avril et août (environ 40 % du volume est stocké sous hangar pour être vendu quand les prix remontent).
- **Campagne 2 (Pomme de terre, 3 ha) :** Plantation fin décembre, récolte en mars (cycle d'environ 90 jours).
- **Campagne 3 (Gombo ou Maïs doux, 3 ha - Hivernage) :** De juillet à septembre. Il utilise des cultures à cycle court qui supportent bien la pluie pour rentabiliser le sol, payer la main-d'œuvre permanente, et casser les cycles parasitaires (rotation des cultures).

Grâce à ce calendrier, Diap démontre qu'il fait une **rotation des cultures** (bonnes pratiques agricoles) et qu'il évite de laisser ses terres et son personnel inactifs pendant l'hivernage.

### Le plan d'approvisionnement

Si votre production est bien planifiée, vos achats (approvisionnement) doivent l'être aussi. Vous devez lister vos besoins en intrants (semences, engrais, produits phytosanitaires, carburant, emballages) et préciser **quand** et **où** vous les achèterez.
Une rupture de stock d'engrais en plein cycle de croissance peut ruiner une campagne entière.

**L'astuce de Diap :** Il précise dans son business plan qu'il contractualise avec un grand fournisseur local d'intrants certifiés, avec livraison programmée un mois avant chaque phase critique de la culture, évitant ainsi les pénuries fréquentes du marché.

#### Ce qu'il faut retenir
- Vous devez différencier le calendrier de mise en place (installation) du calendrier de production (cycles de culture).
- Soyez réaliste sur les délais administratifs et d'installation des infrastructures (forage, clôture).
- Utilisez la rotation des cultures pour occuper vos terres et votre personnel toute l'année.
- Le plan d'approvisionnement doit garantir que les intrants seront disponibles au bon moment sur la ferme.`,
      quiz_json: QUIZ["lec_3_2"]
    },
    {
      id: "lec_3_3",
      titre: "Choisir votre forme juridique et organiser votre entreprise",
      duree_minutes: 8,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous serez capable d'argumenter le choix de la forme juridique de votre future entreprise et de présenter l'organigramme de vos ressources humaines.

### Le choix de la forme juridique

L'entreprise agricole est une entreprise comme une autre. Son choix juridique détermine ses impôts, la responsabilité de ses dirigeants, et sa capacité à lever des fonds. Bien que les lois diffèrent selon les pays de l'espace OHADA, on retrouve globalement les mêmes grandes catégories :

1. **L'Entreprise Individuelle (EI) ou le Statut de l'Entreprenant (régime simplifié OHADA pour les petites activités, avec un plafond de chiffre d'affaires fixé par chaque pays) :**
   - *Avantages :* Simple et très peu coûteuse à créer. Décisions rapides (vous êtes le seul maître).
   - *Inconvénients :* Votre patrimoine personnel n'est pas protégé. En cas de faillite de la ferme, vos biens personnels peuvent être saisis. Très difficile de lever de gros financements bancaires.
2. **La Société à Responsabilité Limitée (SARL, ou SARLU avec un associé unique ; SUARL au Sénégal) :**
   - *Avantages :* La forme la plus populaire. Votre responsabilité est limitée à vos apports (votre patrimoine personnel est protégé). Idéal pour s'associer à 2 ou plus, ou même seul (SARLU). Elle inspire plus confiance aux banques et fournisseurs.
   - *Inconvénients :* Plus lourde à constituer, nécessite un capital social bloqué, et une comptabilité rigoureuse.
3. **Le Groupement d'Intérêt Économique (GIE) ou la Société coopérative (régie dans l'espace OHADA par un Acte uniforme de 2010) :**
   - *Avantages :* Formes très utilisées en agriculture pour regrouper plusieurs producteurs afin d'acheter en gros ou de vendre ensemble. Souvent éligibles à des subventions de l'État.
   - *Inconvénients :* Solidarité des dettes dans le GIE. Gouvernance parfois complexe dans les grandes coopératives.
4. **La Société par Actions Simplifiée (SAS ou SASU) :**
   - *Avantages :* Statuts très libres, utile si vous prévoyez d'accueillir des investisseurs ou de signer un pacte d'associés.
   - *Inconvénients :* Plus exigeante à tenir (obligations de contrôle des comptes selon les cas) : à envisager pour un projet qui change d'échelle.

**Le choix de Diap Touré :** Pour un investissement de 55 millions de FCFA, le statut d'Entreprise Individuelle n'offre pas assez de garanties à la banque et met Diap en danger personnel. Il a opté pour la **SARL à associé unique (SARLU, appelée SUARL au Sénégal)**, ce qui lui permet de gérer seul, de protéger ses biens, tout en offrant le sérieux d'une société commerciale.

### L'organisation des Ressources Humaines (Organigramme)

L'agriculture demande beaucoup de main-d'œuvre. Un investisseur regardera avec attention comment vous comptez gérer les hommes et les femmes sur votre exploitation.
Vous devez distinguer la main-d'œuvre permanente de la main-d'œuvre saisonnière.

1. **Le personnel permanent :** 
   Ils ont des contrats annuels. Pour une ferme de 10ha moderne, il faut un organigramme clair.
   - *Direction :* Le gérant (Diap Touré).
   - *Pôle Technique :* Un chef de culture expérimenté (indispensable, c'est lui qui veille sur les plantes au quotidien), un responsable irrigation/maintenance (pour le solaire et le goutte-à-goutte), 2 ouvriers agricoles permanents et 1 gardien.
   
2. **Le personnel saisonnier (journaliers) :**
   En agriculture, on n'embauche pas 50 personnes à l'année. On utilise les "journaliers" pour les gros pics d'activité :
   - Pendant le repiquage des oignons (besoin de 20 femmes pendant une semaine).
   - Pendant la récolte et le tri (besoin de 30 personnes).

**Le budget RH :** Cet organigramme servira directement à remplir vos tableaux financiers (Module 5). Vous devrez budgétiser les salaires fixes mensuels, et ajouter une provision pour la main-d'œuvre journalière en fonction du calendrier de production.

### Les aspects réglementaires supplémentaires

N'oubliez pas d'inclure dans ce chapitre les éventuelles autorisations nécessaires :
- Un acte foncier reconnu : titre de propriété, bail, acte d'affectation (au Sénégal, les terres du domaine national sont affectées par les communes), certificat foncier ou attestation de détention coutumière formalisée selon les pays. Renseignez-vous auprès du service foncier compétent.
- Autorisation de forage / exploitation de l'eau (critique dans beaucoup de régions).
- Inscription aux impôts (identifiant fiscal propre à chaque pays : NINEA au Sénégal, NIF au Togo, IFU au Bénin et au Burkina Faso, numéro de compte contribuable en Côte d'Ivoire, TIN au Ghana et au Nigeria) et au registre du commerce.
- Obligations fiscales et sociales : impôt sur les bénéfices, TVA et traitement des produits agricoles, cotisations sociales des salariés, code du travail. Elles diffèrent d'un pays à l'autre : demandez conseil à un expert-comptable local avant de chiffrer.

#### Ce qu'il faut retenir
- Choisissez une forme juridique adaptée à votre besoin de financement et de protection (la SARL est souvent le standard professionnel).
- Dressez un organigramme distinguant les permanents (chef de culture, gardien) et les journaliers (repiquage, récolte).
- Listez les autorisations légales spécifiques (eau, foncier) qui prouvent que votre projet est conforme à la loi.`,
      quiz_json: QUIZ["lec_3_3"]
    }
  ]
};
