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

### Chiffrer l'itinéraire technique : le coût par poste

Un itinéraire technique qui ne dit pas ce qu'il coûte reste incomplet. Pour chaque culture, listez les postes de dépense **par hectare**, puis multipliez par la surface. C'est ce tableau qui alimente les charges variables du compte de résultat (chapitre 5.4) et le BFR (chapitre 5.2).

Voici les coûts de Diap Touré (en FCFA par hectare ; hypothèses pédagogiques à remplacer par vos devis et vos relevés de prix).

**Oignon : 1 300 000 FCFA/ha, soit 9,1 M FCFA pour 7 ha**

| Poste | FCFA/ha |
|---|---|
| Semences et pépinière | 150 000 |
| Fertilisation (fumure de fond, NPK, urée) | 400 000 |
| Produits phytosanitaires | 150 000 |
| Énergie et entretien de l'irrigation | 100 000 |
| Journaliers avant la récolte (pépinière, repiquage, entretien) | 200 000 |
| Journaliers de récolte, séchage et tri | 150 000 |
| Filets, étiquettes et divers | 150 000 |
| **Total** | **1 300 000** |

**Pomme de terre : 2 400 000 FCFA/ha, soit 7,2 M FCFA pour 3 ha**

| Poste | FCFA/ha |
|---|---|
| Plants (semences de pomme de terre) | 1 100 000 |
| Fertilisation | 500 000 |
| Produits phytosanitaires | 200 000 |
| Énergie et entretien de l'irrigation | 100 000 |
| Journaliers avant la récolte | 200 000 |
| Journaliers de récolte et tri | 150 000 |
| Sacs, transport interne et divers | 150 000 |
| **Total** | **2 400 000** |

**Gombo ou maïs doux en hivernage : 600 000 FCFA/ha, soit 1,8 M FCFA pour 3 ha**

| Poste | FCFA/ha |
|---|---|
| Semences | 80 000 |
| Fertilisation | 200 000 |
| Produits phytosanitaires | 70 000 |
| Énergie et entretien | 50 000 |
| Journaliers | 150 000 |
| Emballages et divers | 50 000 |
| **Total** | **600 000** |

**Total des charges variables : 9,1 + 7,2 + 1,8 = 18,1 M FCFA par campagne**, le chiffre utilisé au compte de résultat. On retrouve aussi le BFR : les intrants (semences, fertilisation, phytosanitaires, énergie) de l'oignon et de la pomme de terre font 7 × 0,80 + 3 × 1,90 = 11,3 M FCFA, et les journaliers avant la récolte 10 ha × 200 000 = 2,0 M FCFA.

**Le test de bon sens : le coût variable au kilo.** On divise le coût à l'hectare par le volume vendable à l'hectare.

| Culture | Coût variable/ha | Volume vendable/ha | Coût au kg | Prix de vente moyen |
|---|---|---|---|---|
| Oignon | 1 300 000 | 25,2 t (28 t − 10 %) | environ 52 FCFA | 200 FCFA |
| Pomme de terre | 2 400 000 | 23 t (25 t − 8 %) | environ 104 FCFA | 230 FCFA |
| Gombo / maïs doux | 600 000 | 7,2 t (8 t − 10 %) | environ 83 FCFA | 150 FCFA |

Une culture dont le coût variable au kilo se rapproche du prix de vente ne laisse aucune marge pour payer le personnel, les amortissements et la dette : elle doit être revue ou abandonnée.

### Exercice : l'itinéraire technique chiffré de votre culture principale

**Consigne.** Pour votre culture principale :

1. Décrivez les six étapes de l'itinéraire technique (préparation du sol, semis ou plantation, irrigation, entretien et fertilisation, protection phytosanitaire, récolte et post-récolte) en une à deux phrases chacune.
2. Dressez le tableau des coûts par hectare, poste par poste, avec une source (devis, prix relevé au marché, prix d'un fournisseur) et la date du relevé.
3. Calculez le coût de la surface prévue, le volume vendable à l'hectare et le coût variable au kilo.
4. Comparez ce coût au prix de vente que vous retenez et commentez l'écart.

**Critères de réussite :**

- les six étapes sont présentes et dans l'ordre chronologique ;
- le rendement annoncé est justifié par une pratique précise (variété, densité, irrigation) et non seulement par une affirmation ;
- tous les postes ont un montant, une source et une date ; le total par hectare est exact ;
- le coût au kilo est calculé et nettement inférieur au prix de vente ;
- les montants se retrouvent à l'identique dans vos charges variables et dans votre BFR.

#### Ce qu'il faut retenir
- Présentez vos produits en décrivant clairement leur variété, conditionnement et niveau de qualité.
- L'itinéraire technique est la suite logique de toutes les opérations de production.
- Une bonne maîtrise de l'itinéraire technique est indispensable pour justifier les rendements que vous allez utiliser plus tard dans vos prévisions financières.
- Chiffrez chaque poste de l'itinéraire technique à l'hectare (semences, fertilisation, phytosanitaires, énergie, journaliers, emballages) : le total alimente le compte de résultat et le BFR.
- Calculez le coût variable au kilo et comparez-le au prix de vente : c'est le premier test de rentabilité d'une culture.`,
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

### Adapter le calendrier à votre zone agro-climatique

Le calendrier de Diap vaut pour les Niayes. Le vôtre dépend de la **zone agro-climatique** où se trouve la parcelle, c'est-à-dire du régime des pluies. On distingue trois grandes situations en Afrique de l'Ouest.

- **Zone sahélienne, une seule saison des pluies (unimodale)** : environ 3 à 4 mois de pluie (de juin-juillet à septembre). Exemples : nord du Sénégal, du Mali, du Niger, du Burkina Faso, du Togo.
- **Zone soudanienne** : une saison des pluies plus longue (de mai-juin à octobre), avec une saison sèche marquée. Exemples : centre du Mali, du Burkina Faso, du Togo et du Bénin, nord de la Côte d'Ivoire.
- **Zone subhumide / guinéenne, deux saisons des pluies (bimodale)** : une grande saison (mars à juillet) et une petite saison (septembre à novembre). Exemples : sud du Togo, du Bénin, de la Côte d'Ivoire et du Ghana.

Les calendriers ci-dessous sont des **repères indicatifs**. Les dates réelles varient d'une année et d'un lieu à l'autre : confirmez-les avec le service agricole local, la météo nationale et les producteurs de votre voisinage, et notez la source dans votre dossier.

| Période | Sahélienne unimodale | Soudanienne | Subhumide / guinéenne bimodale |
|---|---|---|---|
| Novembre à février | Contre-saison froide irriguée : oignon, pomme de terre, tomate, chou | Contre-saison irriguée en bas-fonds ou sur forage : tomate, oignon, piment | Maraîchage possible toute l'année en bas-fonds ; harmattan sec de décembre à février : irrigation indispensable |
| Mars à mai | Contre-saison chaude : cultures résistantes à la chaleur, préparation des parcelles | Préparation des sols, premiers semis de maïs si la pluie s'installe | Grande saison : semis de maïs, manioc, légumes-feuilles |
| Juin à septembre | Hivernage : mil, sorgho, maïs, arachide, niébé, gombo ; semis après les premières pluies utiles | Maïs, soja, coton, riz pluvial, igname ; récolte des premiers maïs à partir de septembre | Récolte de la grande saison (juillet), puis préparation de la petite saison ; semis en août-septembre |
| Octobre à novembre | Récoltes de l'hivernage, pépinière de l'oignon et préparation de la contre-saison | Récoltes, séchage et stockage ; préparation de la contre-saison | Petite saison : deuxième cycle de maïs et de légumes, récolte en novembre-décembre |

**Ce qu'il faut en retenir pour votre dossier :**

- en zone unimodale, une seule campagne pluviale par an : la contre-saison irriguée est ce qui occupe les terres et le personnel hors hivernage ;
- en zone bimodale, deux campagnes pluviales : le plan d'assolement et le plan de trésorerie doivent montrer les deux cycles et leurs deux pics de récolte ;
- l'investissement dans l'eau (forage, irrigation) pèse plus lourd là où la saison sèche est longue ;
- la période de stockage et de vente dépend de la période de récolte de votre zone : c'est elle qui détermine les prix que vous pouvez espérer.

### Exercice : votre calendrier de production sur 12 mois

**Consigne.**

1. Indiquez votre zone agro-climatique et la source de vos dates (service agricole, météo nationale, producteurs voisins).
2. Construisez un tableau de 12 colonnes (de janvier à décembre) avec, par culture : préparation, semis ou plantation, entretien, récolte, vente. Ajoutez les pics de main-d'œuvre.
3. Ajoutez en dessous le calendrier d'installation, mois par mois, jusqu'au premier semis.
4. Calculez, pour votre première année, le pourcentage de la pleine production que vous retenez (comme les 85 % de Diap) et justifiez-le.

**Critères de réussite :**

- la zone agro-climatique est nommée et les dates sont cohérentes avec son régime de pluies ;
- aucune culture n'est planifiée en dehors de sa période réaliste, ou alors avec une irrigation prévue et chiffrée ;
- les pics de travail (repiquage, récolte) sont repérés et reliés au budget des journaliers ;
- le calendrier d'installation laisse une marge pour les imprévus (forage, bail, livraisons) ;
- les périodes d'encaissement du calendrier correspondent à celles de votre plan de trésorerie.

#### Ce qu'il faut retenir
- Vous devez différencier le calendrier de mise en place (installation) du calendrier de production (cycles de culture).
- Soyez réaliste sur les délais administratifs et d'installation des infrastructures (forage, clôture).
- Utilisez la rotation des cultures pour occuper vos terres et votre personnel toute l'année.
- Le plan d'approvisionnement doit garantir que les intrants seront disponibles au bon moment sur la ferme.
- Rattachez votre calendrier à votre zone agro-climatique (sahélienne unimodale, soudanienne, subhumide bimodale) et citez la source de vos dates.`,
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

**Fiches par pays :** statuts, foncier, identifiants fiscaux et formalités sont détaillés pays par pays, avec la date de vérification, dans le [cadre pays](/membres/formations/form_bp_agricole/cadre-pays) (Togo, Bénin, Côte d'Ivoire et Sénégal disponibles ; les autres pays suivent).

#### Ce qu'il faut retenir
- Choisissez une forme juridique adaptée à votre besoin de financement et de protection (la SARL est souvent le standard professionnel).
- Dressez un organigramme distinguant les permanents (chef de culture, gardien) et les journaliers (repiquage, récolte).
- Listez les autorisations légales spécifiques (eau, foncier) qui prouvent que votre projet est conforme à la loi.`,
      quiz_json: QUIZ["lec_3_3"]
    }
  ]
};
