import { ParcoursSeed } from './types';

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

C'est ici que l'ingénieur agronome ou le technicien de la banque va vérifier si vos rendements sont réalistes. Un rendement de 40 tonnes de pommes de terre à l'hectare ne s'obtient pas par miracle : il est le résultat d'un itinéraire technique rigoureux.

L'itinéraire technique est la séquence logique et chronologique de toutes les opérations agricoles sur une parcelle. Vous devez détailler les étapes suivantes :

1. **Préparation du sol :** Labours, pulvérisage, épierrage. Utiliserez-vous un tracteur ou de la main-d'œuvre manuelle ? Quel apport de fumure de fond ?
2. **Semis ou Plantation :** Densité de semis, choix des semences (certifiées ou non), préparation des pépinières (pour l'oignon).
3. **Irrigation :** Mode d'irrigation (gravitaire, aspersion, goutte-à-goutte). Fréquence et volume d'eau.
4. **Entretien et fertilisation :** Sarclages, binages. Quel plan de fertilisation (NPK, Urée) et à quel stade de croissance de la plante ?
5. **Protection phytosanitaire :** Comment gérez-vous préventivement et curativement les insectes, champignons et mauvaises herbes ?
6. **Récolte et post-récolte :** Stade de maturité, technique de récolte (manuelle ou mécanisée), séchage, tri, calibrage, et stockage.

### L'itinéraire technique de Diap Touré

Dans le business plan de l'exploitation de 10 ha dans les Niayes, l'itinéraire de l'oignon a été scrupuleusement détaillé pour justifier son rendement prévisionnel de 30 tonnes/hectare.

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
      quiz_json: [
        {
          question: "Qu'est-ce qu'un itinéraire technique en agriculture ?",
          options: [
            "Le plan GPS pour que les camions arrivent à la ferme",
            "La séquence logique et chronologique de toutes les opérations agricoles sur une parcelle",
            "Le manuel d'utilisation du tracteur",
            "La route pour transporter les produits au marché"
          ],
          correctAnswer: 1,
          explanation: "C'est l'ensemble des étapes techniques (préparation, semis, irrigation, traitements, récolte) pour mener à bien une culture."
        },
        {
          question: "Pourquoi est-il important de détailler le conditionnement (emballage) de vos produits dans la fiche produit ?",
          options: [
            "Pour augmenter artificiellement le nombre de pages du business plan",
            "Parce que le conditionnement détermine en grande partie le prix de vente et la cible commerciale",
            "Ce n'est pas important, seul le produit brut compte",
            "Pour prouver qu'on aime le plastique"
          ],
          correctAnswer: 1,
          explanation: "Un produit vendu calibré en filet étiqueté de 5kg se vend plus cher et à une cible différente qu'un produit vendu en vrac dans des sacs de 100kg recyclés."
        },
        {
          question: "Quelle étape de l'itinéraire technique de Diap Touré permet de justifier son positionnement de stockage stratégique (son créneau) ?",
          options: [
            "Le labour profond",
            "L'étape de Post-récolte (fanaison et séchage sous hangar)",
            "Le semis",
            "Le désherbage manuel"
          ],
          correctAnswer: 1,
          explanation: "C'est l'étape de séchage post-récolte rigoureux sous hangar ventilé qui permet à Diap de conserver ses oignons plusieurs mois pour les vendre plus cher."
        },
        {
          question: "Dans le business plan, si vous choisissez une technologie coûteuse comme l'irrigation goutte-à-goutte, vous devez :",
          options: [
            "Le cacher au banquier pour ne pas l'effrayer avec les coûts",
            "L'expliquer dans votre itinéraire technique pour justifier son impact positif sur les rendements et l'économie d'eau",
            "Ne pas l'inclure dans vos coûts de production",
            "L'acheter sans facture"
          ],
          correctAnswer: 1,
          explanation: "Les choix technologiques coûteux doivent être techniquement argumentés dans le business plan pour justifier le besoin de financement important."
        }
      ]
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

Son calendrier est donc le suivant :
- **Campagne 1 (Oignon - Contre-saison froide) :** Pépinière en octobre, repiquage en novembre/décembre, récolte en mars/avril. (Il vise la période où les importations seront gelées).
- **Campagne 2 (Pomme de terre) :** Plantation fin décembre, récolte en mars.
- **Campagne 3 (Gombo ou Maïs doux - Hivernage) :** De juillet à septembre. Il utilise des cultures à cycle court qui supportent bien la pluie pour rentabiliser le sol, payer la main-d'œuvre permanente, et casser les cycles parasitaires (rotation des cultures).

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
      quiz_json: [
        {
          question: "Quel est l'objectif principal du calendrier de production annuel ?",
          options: [
            "Programmer les vacances du personnel",
            "Répartir stratégiquement les cycles de cultures sur l'année en tenant compte des saisons",
            "Déterminer la date de création de l'entreprise",
            "Planifier uniquement la construction des bâtiments"
          ],
          correctAnswer: 1,
          explanation: "Le calendrier annuel organise les semis, entretiens et récoltes en fonction du climat, assurant une rotation et une rentabilité optimales."
        },
        {
          question: "Pourquoi est-il risqué de sous-estimer la durée du calendrier d'installation (forage, clôture, etc.) ?",
          options: [
            "Parce que vous risquez de rater la fenêtre optimale de semis et de devoir retarder la production d'un an",
            "Parce que les ouvriers s'ennuieront",
            "Ce n'est pas risqué, cela montre qu'on est rapide",
            "Parce que le gouvernement l'interdit"
          ],
          correctAnswer: 0,
          explanation: "L'agriculture exige de respecter les saisons. Si vos infrastructures sont en retard, vous ratez la date de semis, ruinant les prévisions de l'année 1."
        },
        {
          question: "Dans le cas de Diap Touré, à quoi sert la culture du gombo ou du maïs doux pendant l'hivernage ?",
          options: [
            "À concurrencer l'oignon hollandais",
            "À utiliser le sol, payer la main-d'œuvre et pratiquer une rotation des cultures pendant la saison des pluies",
            "À nourrir uniquement sa famille",
            "Ce n'est qu'un passe-temps"
          ],
          correctAnswer: 1,
          explanation: "Les cultures d'hivernage rentabilisent l'exploitation en saison des pluies, où l'oignon est difficile à produire, et cassent les cycles des maladies."
        },
        {
          question: "Qu'est-ce qu'un plan d'approvisionnement ?",
          options: [
            "La liste des banques à contacter",
            "L'organisation des achats et des livraisons des intrants (semences, engrais) pour éviter les ruptures",
            "La carte du marché pour vendre les produits",
            "Un plan architectural de la ferme"
          ],
          correctAnswer: 1,
          explanation: "Le plan d'approvisionnement garantit que vous aurez les bons intrants, en bonne quantité, au bon moment pour votre cycle de production."
        },
        {
          question: "Quelle pratique agricole permet de ne pas appauvrir le sol et de casser les cycles parasitaires ?",
          options: [
            "La monoculture",
            "L'utilisation massive d'insecticides",
            "La rotation des cultures",
            "L'arrosage intensif"
          ],
          correctAnswer: 2,
          explanation: "Alterner différentes familles de plantes (comme les alliacées et les graminées) est une bonne pratique agricole essentielle appelée rotation des cultures."
        }
      ]
    },
    {
      id: "lec_3_3",
      titre: "Choisir votre forme juridique et organiser votre entreprise",
      duree_minutes: 8,
      contenu: `### Objectif du chapitre
À la fin de ce chapitre, vous serez capable d'argumenter le choix de la forme juridique de votre future entreprise et de présenter l'organigramme de vos ressources humaines.

### Le choix de la forme juridique

L'entreprise agricole est une entreprise comme une autre. Son choix juridique détermine ses impôts, la responsabilité de ses dirigeants, et sa capacité à lever des fonds. Bien que les lois diffèrent selon les pays de l'espace OHADA, on retrouve globalement les mêmes grandes catégories :

1. **L'Entreprise Individuelle (EI) ou le Statut de l'Entreprenant :**
   - *Avantages :* Simple et très peu coûteuse à créer. Décisions rapides (vous êtes le seul maître).
   - *Inconvénients :* Votre patrimoine personnel n'est pas protégé. En cas de faillite de la ferme, vos biens personnels peuvent être saisis. Très difficile de lever de gros financements bancaires.
2. **La Société à Responsabilité Limitée (SARL / SUARL) :**
   - *Avantages :* La forme la plus populaire. Votre responsabilité est limitée à vos apports (votre patrimoine personnel est protégé). Idéal pour s'associer à 2 ou plus, ou même seul (SUARL). Elle inspire plus confiance aux banques et fournisseurs.
   - *Inconvénients :* Plus lourde à constituer, nécessite un capital social bloqué, et une comptabilité rigoureuse.
3. **Le Groupement d'Intérêt Économique (GIE) ou la Coopérative :**
   - *Avantages :* Formes très utilisées en agriculture pour regrouper plusieurs producteurs afin d'acheter en gros ou de vendre ensemble. Souvent éligibles à des subventions de l'État.
   - *Inconvénients :* Solidarité des dettes dans le GIE. Gouvernance parfois complexe dans les grandes coopératives.

**Le choix de Diap Touré :** Pour un investissement de 55 millions de FCFA, le statut d'Entreprise Individuelle n'offre pas assez de garanties à la banque et met Diap en danger personnel. Il a opté pour la **SUARL (Société Unipersonnelle à Responsabilité Limitée)**, ce qui lui permet de gérer seul, de protéger ses biens, tout en offrant le sérieux d'une société commerciale.

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
- Titre de propriété ou Bail emphytéotique (droit d'usage du sol).
- Autorisation de forage / exploitation de l'eau (critique dans beaucoup de régions).
- Inscription aux impôts (NINEA, NIF, etc.) et au registre du commerce.

#### Ce qu'il faut retenir
- Choisissez une forme juridique adaptée à votre besoin de financement et de protection (la SARL est souvent le standard professionnel).
- Dressez un organigramme distinguant les permanents (chef de culture, gardien) et les journaliers (repiquage, récolte).
- Listez les autorisations légales spécifiques (eau, foncier) qui prouvent que votre projet est conforme à la loi.`,
      quiz_json: [
        {
          question: "Quel est l'inconvénient majeur de l'Entreprise Individuelle (EI) pour un gros projet agricole ?",
          options: [
            "Elle est très coûteuse à créer",
            "Elle ne protège pas le patrimoine personnel de l'entrepreneur en cas de faillite",
            "Elle oblige à avoir plusieurs associés",
            "Elle est interdite en agriculture"
          ],
          correctAnswer: 1,
          explanation: "En EI, le patrimoine personnel et professionnel sont confondus, ce qui est très risqué pour les projets nécessitant de lourds investissements."
        },
        {
          question: "Quel statut juridique Diap Touré a-t-il choisi pour protéger ses biens tout en gérant seul son entreprise de 55 millions de FCFA ?",
          options: [
            "Entreprise Individuelle",
            "Groupement d'Intérêt Économique (GIE)",
            "Société Unipersonnelle à Responsabilité Limitée (SUARL)",
            "Coopérative"
          ],
          correctAnswer: 2,
          explanation: "La SUARL (variante de la SARL pour un seul associé) permet de limiter la responsabilité financière au montant du capital apporté, tout en restant l'unique décideur."
        },
        {
          question: "Comment doit-on gérer la main-d'œuvre pour les opérations massives et ponctuelles comme la récolte ?",
          options: [
            "Embaucher 30 personnes en CDI (contrat permanent) toute l'année",
            "Faire appel à de la main-d'œuvre saisonnière (journaliers) uniquement pendant les pics d'activité",
            "Faire travailler uniquement le gérant",
            "Ne pas prévoir de main-d'œuvre et automatiser à 100%"
          ],
          correctAnswer: 1,
          explanation: "Le recours aux journaliers permet d'avoir la main-d'œuvre massive nécessaire aux travaux des champs tout en limitant les coûts fixes du personnel permanent."
        },
        {
          question: "Outre le registre du commerce, quelle autorisation légale est particulièrement critique pour une ferme irriguée de 10 hectares ?",
          options: [
            "La licence de vente d'alcool",
            "L'autorisation de forage / d'exploitation de la ressource en eau",
            "Le permis de transport de passagers",
            "L'autorisation de publicité à la télévision"
          ],
          correctAnswer: 1,
          explanation: "L'eau est une ressource vitale et souvent réglementée. Avoir le droit de réaliser un forage est indispensable avant de lancer un tel projet."
        },
        {
          question: "Quel rôle est indispensable parmi le personnel permanent d'une exploitation agricole moderne ?",
          options: [
            "Le directeur marketing",
            "L'avocat de l'entreprise",
            "Le chef de culture expérimenté",
            "Le community manager"
          ],
          correctAnswer: 2,
          explanation: "Le chef de culture est la cheville ouvrière de la ferme ; c'est lui qui possède l'expertise technique quotidienne pour mener la production à terme."
        }
      ]
    }
  ]
};
