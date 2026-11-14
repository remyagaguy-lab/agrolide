// FICHIER GÉNÉRÉ par scripts/quiz_filieres/build.mjs — ne pas modifier à la main.
// Banques de quiz des modules par filière, par identifiant de leçon. Fichier serveur : ne jamais l'importer côté client
// (les bonnes réponses ne quittent le serveur qu'après correction, voir src/lib/formations/filieres-quiz.server.ts).
export type QuizQuestionFiliere = { question: string; options: string[]; correctAnswer: number; explanation: string };

export const QUIZ_FILIERES: Record<string, QuizQuestionFiliere[]> = {
  "aq_1": [
    {
      "question": "Quel système d'élevage de poissons demande le moins d'eau mais dépend le plus de l'électricité et de la technicité ?",
      "options": [
        "Les bacs hors sol avec circuit d'eau recirculée",
        "Les étangs en terre alimentés par un forage",
        "Les cages flottantes dans un lac",
        "Les étangs de barrage remplis par la pluie"
      ],
      "correctAnswer": 0,
      "explanation": "Un circuit recirculé économise l'eau mais une panne d'énergie peut tuer toute la production en quelques heures."
    },
    {
      "question": "Quel est le principal point de vigilance d'un élevage en cages flottantes ?",
      "options": [
        "Le terrassement de bassins profonds, qui est l'investissement dominant de ce système",
        "Le coût de l'électricité pour remplir les cages chaque semaine",
        "L'absence totale de risque sanitaire grâce au courant naturel de l'eau",
        "L'accès au plan d'eau et son autorisation d'usage, ainsi que la qualité de l'eau"
      ],
      "correctAnswer": 3,
      "explanation": "Sans plan d'eau autorisé et en bon état, la cage ne produit pas."
    },
    {
      "question": "Quelle raison pousse le cas du Sénégal à choisir des étangs ?",
      "options": [
        "Les étangs ne demandent aucune eau une fois remplis la première fois, quelle que soit la saison",
        "Les étangs garantissent un indice de conversion de 1,0 sur tous les cycles",
        "Le site offre du terrain et un forage, et la ferme veut limiter la technicité de départ",
        "Les étangs dispensent de toute autorisation, de tout permis et de toute déclaration"
      ],
      "correctAnswer": 2,
      "explanation": "Le choix du système suit le site, le capital et la technicité du porteur."
    },
    {
      "question": "Avant de bâtir un plan sur une espèce, quelle vérification est indispensable ?",
      "options": [
        "Que l'espèce est la plus vendue dans le monde",
        "Qu'une source fiable d'alevins existe, avec leur prix",
        "Que le porteur l'a déjà mangée",
        "Que son nom figure dans un catalogue de fournisseurs étrangers"
      ],
      "correctAnswer": 1,
      "explanation": "Sans alevins de qualité disponibles, pas de production régulière."
    },
    {
      "question": "Quel critère de site pèse sur la qualité du poisson frais livré au client ?",
      "options": [
        "La couleur des étangs et la forme des digues construites",
        "La distance au marché et la possibilité de le transporter sous glace",
        "Le nombre de voisins qui élèvent déjà des poissons dans la zone",
        "Le nom de la région où se trouve la ferme et son code postal"
      ],
      "correctAnswer": 1,
      "explanation": "Le poisson frais se conserve peu : la chaîne du froid et la distance comptent."
    },
    {
      "question": "Un sol très sableux pose quel problème pour des étangs en terre ?",
      "options": [
        "L'eau s'infiltre et les étangs ne gardent pas leur niveau",
        "Les poissons ne grandissent plus, quelle que soit la qualité de l'aliment",
        "Le forage devient inutile parce que la nappe disparaît à cet endroit",
        "L'aliment perd tout son intérêt nutritionnel au contact du sable"
      ],
      "correctAnswer": 0,
      "explanation": "C'est pourquoi la nature du sol fait partie de l'étude de site avant de creuser."
    }
  ],
  "aq_2": [
    {
      "question": "Le cas compte 12 étangs de 500 m² avec 3 alevins par m². Combien d'alevins par cycle ?",
      "options": [
        "6 000",
        "36 000",
        "1 500",
        "18 000"
      ],
      "correctAnswer": 3,
      "explanation": "12 × 500 × 3 = 18 000 ; avec 2 cycles, 36 000 par an."
    },
    {
      "question": "Avec 36 000 alevins par an et 85 % de survie, combien de poissons sont vendus ?",
      "options": [
        "36 000, la survie ne change rien",
        "5 400, en prenant les morts",
        "30 600",
        "42 353, en divisant par 0,85"
      ],
      "correctAnswer": 2,
      "explanation": "36 000 × 0,85 = 30 600."
    },
    {
      "question": "Si les poissons vendus pèsent 420 g chacun, quelle production annuelle (30 600 poissons) ?",
      "options": [
        "30 600 kg",
        "12 852 kg",
        "1 285 kg",
        "128 520 kg"
      ],
      "correctAnswer": 1,
      "explanation": "30 600 × 0,42 = 12 852 kg."
    },
    {
      "question": "À 2 600 FCFA/kg, que vaut une production de 12 852 kg ?",
      "options": [
        "3,3 millions de FCFA",
        "334 millions de FCFA",
        "33,4 millions de FCFA",
        "12,9 millions de FCFA"
      ],
      "correctAnswer": 2,
      "explanation": "12 852 × 2 600 ≈ 33,4 millions."
    },
    {
      "question": "Pourquoi le cas retient-il 2 cycles par an plutôt que 3 ?",
      "options": [
        "Parce que la loi limite à deux cycles",
        "Parce que le tilapia ne se reproduit qu'en février",
        "Parce que les alevins ne sont vendus que deux fois par an",
        "Chaque cycle dure environ six mois, vide et assec compris"
      ],
      "correctAnswer": 3,
      "explanation": "Un étang doit être vidé, séché et préparé entre deux cycles : annoncer trois cycles demande un calendrier qui le prouve."
    },
    {
      "question": "Quel effet a une baisse de survie de 5 points dans le cas (36 000 alevins, 420 g, 2 600 FCFA/kg) ?",
      "options": [
        "Environ 2,0 millions de FCFA de chiffre d'affaires en moins",
        "Aucun effet, car les coûts baissent d'autant quand il y a moins de poissons vivants",
        "Environ 20 millions de FCFA en moins, soit les deux tiers du chiffre d'affaires",
        "Un gain net, car il y a moins de poissons à nourrir et à soigner"
      ],
      "correctAnswer": 0,
      "explanation": "36 000 × 0,05 × 0,42 × 2 600 ≈ 2,0 millions."
    }
  ],
  "aq_3": [
    {
      "question": "Que mesure l'indice de conversion alimentaire ?",
      "options": [
        "Le prix de l'aliment par poisson vendu, exprimé en francs CFA par tête",
        "Le pourcentage de poissons morts pendant le cycle complet d'élevage",
        "Le poids de l'alevin à la mise en charge, mesuré à l'arrivée à la ferme",
        "Le nombre de kilos d'aliment nécessaires pour produire un kilo de poisson"
      ],
      "correctAnswer": 3,
      "explanation": "Plus il est bas, plus l'élevage est efficace."
    },
    {
      "question": "Pour 12 852 kg de poisson et un indice de 1,6, combien d'aliment faut-il ?",
      "options": [
        "Environ 8 032 kg",
        "Environ 12 852 kg",
        "Environ 20 563 kg",
        "Environ 205 630 kg"
      ],
      "correctAnswer": 2,
      "explanation": "12 852 × 1,6 ≈ 20 563 kg."
    },
    {
      "question": "Quel est le coût de cet aliment à 580 FCFA/kg ?",
      "options": [
        "Environ 1,2 million de FCFA",
        "Environ 11,9 millions de FCFA",
        "Environ 7,5 millions de FCFA",
        "Environ 119 millions de FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "20 563 × 580 ≈ 11,9 millions."
    },
    {
      "question": "Quelle part des charges variables représente l'aliment dans le cas ?",
      "options": [
        "Environ 64 %",
        "Environ 15 %",
        "Environ 30 %",
        "Environ 90 %"
      ],
      "correctAnswer": 0,
      "explanation": "11,9 ÷ 18,7 ≈ 64 % : c'est le premier poste."
    },
    {
      "question": "Quelle économie apporte la baisse de l'indice de 1,6 à 1,5 (12 852 kg, 580 FCFA/kg) ?",
      "options": [
        "Environ 7 millions de FCFA par an",
        "Environ 70 000 FCFA par an",
        "Aucune économie notable",
        "Environ 0,7 million de FCFA par an"
      ],
      "correctAnswer": 3,
      "explanation": "12 852 × 0,1 × 580 ≈ 0,75 million."
    },
    {
      "question": "Comment réduire le risque d'une rupture ou d'une hausse brutale du prix de l'aliment ?",
      "options": [
        "Passer à un seul fournisseur pour mieux négocier un prix de volume sur toute l'année",
        "Acheter l'aliment au jour le jour, sans stock, en payant au comptant chaque fois",
        "Avoir au moins deux fournisseurs, un stock de sécurité et un engagement écrit sur prix et livraison",
        "Réduire les rations de moitié dès que le prix de l'aliment monte de quelques points"
      ],
      "correctAnswer": 2,
      "explanation": "Le stock et la diversité des fournisseurs protègent la production."
    }
  ],
  "aq_4": [
    {
      "question": "Combien le cas compte-t-il d'immobilisations au total, avant le fonds de roulement ?",
      "options": [
        "25,5 millions de FCFA",
        "30,5 millions de FCFA",
        "5,0 millions de FCFA",
        "11,0 millions de FCFA"
      ],
      "correctAnswer": 0,
      "explanation": "Les 30,5 millions du coût du projet comprennent 5,0 de besoin en fonds de roulement."
    },
    {
      "question": "Quelle part des immobilisations représentent les étangs et l'eau (10,0 + 4,5 sur 25,5) ?",
      "options": [
        "Environ 10 %",
        "Plus de la moitié, environ 57 %",
        "Environ 25 %",
        "Environ 90 %"
      ],
      "correctAnswer": 1,
      "explanation": "14,5 ÷ 25,5 ≈ 57 % : ce sont les postes à comparer par plusieurs devis."
    },
    {
      "question": "Quelle est la dotation annuelle aux amortissements des étangs (10,0 M FCFA sur 20 ans) ?",
      "options": [
        "0,5 million de FCFA",
        "2,0 millions de FCFA",
        "0,05 million de FCFA",
        "10 millions de FCFA"
      ],
      "correctAnswer": 0,
      "explanation": "10,0 ÷ 20 = 0,5."
    },
    {
      "question": "Que faire avant de creuser les étangs ?",
      "options": [
        "Commander l'aliment pour deux ans",
        "Recruter tout le personnel",
        "Annoncer la production à des grossistes sans lettre d'intention",
        "Faire tester l'eau et vérifier les autorisations de votre pays, avec date et source"
      ],
      "correctAnswer": 3,
      "explanation": "Une erreur sur l'eau ou sur l'autorisation peut coûter plusieurs millions."
    },
    {
      "question": "Quelle précaution limite le risque d'introduire une maladie dans la ferme ?",
      "options": [
        "Doubler la densité de mise en charge pour que la maladie se dilue entre les poissons",
        "Éviter tout nettoyage du matériel pour ne pas stresser les poissons de la ferme",
        "Des alevins d'origine contrôlée, un contrôle des visiteurs et du matériel",
        "Mélanger les lots entre étangs pour homogénéiser la croissance des poissons"
      ],
      "correctAnswer": 2,
      "explanation": "La biosécurité protège plusieurs cycles de production."
    },
    {
      "question": "Pourquoi prévoir une pompe de secours et une énergie de secours ?",
      "options": [
        "Pour doubler la production en doublant le nombre de pompes en marche",
        "Une panne d'eau ou d'énergie peut tuer une production en quelques jours",
        "Parce que la loi l'exige dans tous les pays sans exception pour toute ferme piscicole",
        "Pour éviter de payer l'aliment pendant les semaines de panne"
      ],
      "correctAnswer": 1,
      "explanation": "Le plan de secours figure dans le dossier."
    }
  ],
  "aq_5": [
    {
      "question": "Quel est le seuil de rentabilité du cas, rapporté au chiffre d'affaires ?",
      "options": [
        "Environ 20 %",
        "Environ 50 %",
        "Environ 100 %",
        "Environ 73 %"
      ],
      "correctAnswer": 3,
      "explanation": "24,5 ÷ 33,4 ≈ 73 % : la marge de sécurité est de 27 %."
    },
    {
      "question": "Que signifie un DSCR de 0,76 en scénario pessimiste ?",
      "options": [
        "Les flux disponibles ne couvrent pas l'annuité de l'emprunt",
        "La ferme gagne 76 % de plus que prévu",
        "La banque rembourse l'exploitant",
        "Le projet est sans risque"
      ],
      "correctAnswer": 0,
      "explanation": "Il faut au moins 1 pour couvrir l'annuité ; les banques demandent souvent davantage."
    },
    {
      "question": "Quel levier est le plus à la portée du porteur pour améliorer la marge ?",
      "options": [
        "Augmenter le prix de l'aliment",
        "Supprimer les contrats de vente",
        "Réduire la mortalité et améliorer l'indice de conversion",
        "Allonger le vide sanitaire à un an"
      ],
      "correctAnswer": 2,
      "explanation": "Chaque point de survie et chaque dixième d'indice a un effet chiffrable sur l'EBE."
    },
    {
      "question": "Quelle valeur de chiffre d'affaires représente environ un point de survie dans le cas ?",
      "options": [
        "Environ 4 millions de FCFA",
        "Environ 0,4 million de FCFA",
        "Environ 40 000 FCFA",
        "Environ 0,04 million de FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "36 000 × 0,01 × 0,42 × 2 600 ≈ 0,39 million."
    },
    {
      "question": "Pourquoi une lettre d'intention d'un restaurateur vaut-elle mieux qu'un marché annoncé « immense » ?",
      "options": [
        "Elle remplace l'autorisation d'élevage et les démarches auprès de l'administration",
        "Elle garantit à elle seule le remboursement du prêt par la banque",
        "Elle précise volume, fréquence et prix, donc elle se vérifie",
        "Elle dispense l'exploitant de tout scénario de baisse du prix de vente"
      ],
      "correctAnswer": 2,
      "explanation": "Un engagement précis soutient une hypothèse de vente."
    },
    {
      "question": "Pourquoi le prix de 2 600 FCFA/kg est-il à remplacer dans votre dossier ?",
      "options": [
        "Parce que le prix du poisson est fixé par l'État",
        "Parce que le tilapia ne se vend qu'à 2 000 FCFA/kg",
        "Parce que le prix ne change jamais",
        "C'est une hypothèse pédagogique : il faut vos relevés de prix, datés, auprès de plusieurs acheteurs"
      ],
      "correctAnswer": 3,
      "explanation": "Chaque prix d'un plan porte une source et une date."
    }
  ],
  "df_1": [
    {
      "question": "Pourquoi préparer un dossier de base ?",
      "options": [
        "Parce que l'essentiel des pièces se recoupe d'un guichet à l'autre",
        "Parce qu'un seul guichet existe par pays",
        "Parce que le dossier de base remplace les pièces demandées par le guichet",
        "Parce que les conditions sont les mêmes partout"
      ],
      "correctAnswer": 0,
      "explanation": "On ajoute ensuite ce que chaque guichet exige en plus."
    },
    {
      "question": "Combien de blocs compte le dossier de base proposé ?",
      "options": [
        "Deux",
        "Huit",
        "Trois",
        "Vingt"
      ],
      "correctAnswer": 1,
      "explanation": "Projet, chiffres, entreprise, personnes, terre et actifs, marché, situation financière, risques."
    },
    {
      "question": "Que faut-il faire des conditions et des montants d'un dispositif ?",
      "options": [
        "Les recopier de mémoire",
        "Les prendre dans un article de presse ancien",
        "Les remplacer par une estimation",
        "Les relever à la source, à la date où l'on écrit"
      ],
      "correctAnswer": 3,
      "explanation": "Les conditions, pièces, délais et montants changent."
    },
    {
      "question": "Parmi ces éléments, lequel change d'un guichet à l'autre ?",
      "options": [
        "Les conditions d'éligibilité et les délais",
        "La nécessité d'avoir un projet",
        "L'existence de chiffres",
        "L'utilité d'un modèle financier"
      ],
      "correctAnswer": 0,
      "explanation": "Les pièces de base, elles, se recoupent."
    },
    {
      "question": "Quel défaut rend un dossier fragile ?",
      "options": [
        "Des chiffres sourcés et datés",
        "Des devis anciens ou sans date",
        "Un résumé d'une à deux pages",
        "Des hypothèses documentées"
      ],
      "correctAnswer": 1,
      "explanation": "Un devis doit porter sa date et sa source."
    },
    {
      "question": "À quoi sert la feuille Pièces du classeur ?",
      "options": [
        "À calculer l'impôt sur les bénéfices",
        "À fixer le taux d'intérêt de l'emprunt",
        "À suivre les pièces obtenues, leur date et ce qui manque",
        "À prévoir le prix du produit"
      ],
      "correctAnswer": 2,
      "explanation": "Elle compte les pièces à obtenir."
    }
  ],
  "df_2": [
    {
      "question": "Quelle est la source la plus fiable pour les conditions d'un dispositif ?",
      "options": [
        "Le guichet lui-même ou le texte qui le crée",
        "Un article de presse ancien",
        "Un message transféré par un contact",
        "Une conversation entendue au marché"
      ],
      "correctAnswer": 0,
      "explanation": "La presse sert à repérer un sujet, pas à fixer une condition."
    },
    {
      "question": "Quel statut écrire pour un dispositif dont l'évolution n'est pas confirmée ?",
      "options": [
        "« Actif », par habitude",
        "« En transition » ou « non confirmé », avec la date de vérification",
        "« Clos », par prudence",
        "Aucun statut"
      ],
      "correctAnswer": 1,
      "explanation": "Un statut honnête vaut mieux qu'un statut supposé."
    },
    {
      "question": "Que faire quand la liste des pièces d'un dispositif n'est pas disponible à la source ?",
      "options": [
        "Inventer une liste plausible",
        "Reprendre la liste d'un autre dispositif",
        "La demander par écrit au guichet et garder la réponse",
        "Déposer sans aucune pièce"
      ],
      "correctAnswer": 2,
      "explanation": "Notez-la « à demander au guichet » dans le registre."
    },
    {
      "question": "Quelles questions poser avant de décider de déposer ?",
      "options": [
        "Le dispositif est-il à la mode, le voisin y a-t-il postulé ?",
        "Le logo est-il connu, le site est-il récent ?",
        "Le dossier est-il le plus long possible ?",
        "Suis-je éligible, que finance le dispositif, le délai convient-il ?"
      ],
      "correctAnswer": 3,
      "explanation": "Les trois réponses se lisent dans le texte et auprès du guichet."
    },
    {
      "question": "Pourquoi déposer à un guichet auquel on n'est pas éligible est-il un problème ?",
      "options": [
        "Cela fait baisser le taux d'intérêt",
        "On perd du temps et on peut brûler une occasion",
        "Cela annule les autres dossiers",
        "Cela n'a aucune conséquence"
      ],
      "correctAnswer": 1,
      "explanation": "Vérifiez l'éligibilité dans le texte, pas sur un ouï-dire."
    },
    {
      "question": "Que contient la colonne « Date de la dernière vérification » du registre ?",
      "options": [
        "Le jour où vous avez consulté la source",
        "La date de création du dispositif",
        "La date de votre naissance",
        "La date limite de remboursement"
      ],
      "correctAnswer": 0,
      "explanation": "Elle permet de repérer les lignes à revérifier."
    }
  ],
  "df_3": [
    {
      "question": "Comment calcule-t-on le calendrier d'un dossier ?",
      "options": [
        "À partir de la date de création de l'entreprise",
        "À partir de la date de la dernière récolte",
        "À rebours, depuis la date où les fonds sont nécessaires",
        "À partir de la date de remboursement"
      ],
      "correctAnswer": 2,
      "explanation": "Marge, décaissement, instruction, puis constitution du dossier."
    },
    {
      "question": "Dans l'exemple du classeur, quelle durée totale faut-il prévoir ?",
      "options": [
        "15 jours",
        "45 jours",
        "300 jours",
        "150 jours"
      ],
      "correctAnswer": 3,
      "explanation": "15 + 30 + 60 + 45 jours. Ces délais sont des hypothèses : demandez les délais réels."
    },
    {
      "question": "Que faut-il écrire quand la date d'un appel n'est pas connue ?",
      "options": [
        "Une date approximative plausible",
        "« Non confirmé »",
        "La date de l'année précédente",
        "La date du jour"
      ],
      "correctAnswer": 1,
      "explanation": "N'inventez jamais une date d'appel."
    },
    {
      "question": "À quel rythme la veille des dispositifs est-elle proposée ?",
      "options": [
        "Une fois par mois, avec la date de consultation notée",
        "Une fois tous les cinq ans",
        "Seulement quand un voisin en parle",
        "Uniquement le jour du dépôt"
      ],
      "correctAnswer": 0,
      "explanation": "Et revérification de toute ligne vieille de plus de 90 jours."
    },
    {
      "question": "Que peut faire un porteur de projet si la décision tarde et que la campagne approche ?",
      "options": [
        "Renoncer à toute campagne",
        "Retirer son dossier",
        "Ignorer le calendrier",
        "Étudier un financement-relais ou décaler une partie de l'investissement"
      ],
      "correctAnswer": 3,
      "explanation": "Un crédit de campagne ou une avance de l'acheteur peut servir de relais."
    },
    {
      "question": "Quel est l'intérêt de garder un dossier toujours prêt ?",
      "options": [
        "Il n'a plus besoin d'être daté",
        "Il remplace la veille",
        "On peut le redéposer en quelques jours quand un appel s'ouvre",
        "Il garantit l'accord du financeur"
      ],
      "correctAnswer": 2,
      "explanation": "Les pièces datées sont à renouveler au fil du temps."
    }
  ],
  "el_1": [
    {
      "question": "Une ferme compte 3 bâtiments de 2 000 places et fait 6 bandes par an dans chacun. Combien de poussins sont mis en place par an ?",
      "options": [
        "12 000 poussins, soit une bande de chaque bâtiment",
        "6 000 poussins, soit les places d'un seul bâtiment",
        "216 000 poussins, en multipliant par le nombre de jours",
        "36 000 poussins"
      ],
      "correctAnswer": 3,
      "explanation": "3 × 2 000 × 6 = 36 000."
    },
    {
      "question": "Un élevage a 45 jours d'élevage et 15 jours de vide sanitaire. Combien de bandes par an et par bâtiment ?",
      "options": [
        "8 bandes, en ne comptant que les jours d'élevage",
        "6 bandes (365 ÷ 60 ≈ 6)",
        "24 bandes, en comptant une bande par semaine",
        "4 bandes, en comptant 90 jours par cycle complet"
      ],
      "correctAnswer": 1,
      "explanation": "Cycle complet = 45 + 15 = 60 jours ; 365 ÷ 60 ≈ 6."
    },
    {
      "question": "36 000 poussins sont mis en place avec 6 % de mortalité. Combien de poulets sont vendus ?",
      "options": [
        "33 840 poulets",
        "36 000 poulets, car les pertes sont couvertes par la banque",
        "30 000 poulets, en retirant 6 000 poussins",
        "2 160 poulets, qui correspondent aux seules pertes"
      ],
      "correctAnswer": 0,
      "explanation": "36 000 × (1 − 0,06) = 33 840."
    },
    {
      "question": "À quoi sert le vide sanitaire entre deux bandes ?",
      "options": [
        "À laisser reposer les ouvriers entre deux lots de poussins",
        "À attendre que le prix de la volaille remonte sur le marché",
        "À nettoyer et désinfecter pour casser le cycle des maladies",
        "À sécher la litière pour la revendre aux maraîchers voisins"
      ],
      "correctAnswer": 2,
      "explanation": "Le vide sanitaire fait partie du cycle ; le supprimer expose les bandes suivantes."
    },
    {
      "question": "Pourquoi décale-t-on la mise en place des bandes d'un bâtiment à l'autre ?",
      "options": [
        "Pour que les trois bâtiments se remplissent exactement en même temps",
        "Pour éviter de payer des intérêts sur l'emprunt pendant l'année",
        "Pour permettre de vendre plus cher qu'au prix de marché",
        "Pour étaler les ventes et la trésorerie sur l'année plutôt que tout vendre le même jour"
      ],
      "correctAnswer": 3,
      "explanation": "Avec des bandes décalées, on vend environ 2 800 poulets par mois au lieu de 5 640 d'un coup tous les 60 jours."
    },
    {
      "question": "Pourquoi distinguer poussins mis en place et poulets vendus ?",
      "options": [
        "Parce que les deux nombres sont toujours identiques en pratique",
        "Le chiffre d'affaires vient des poulets vendus, alors que les coûts partent des poussins mis en place",
        "Parce que seuls les poulets vendus génèrent des coûts d'aliment",
        "Parce que la banque ne finance que les poulets vendus"
      ],
      "correctAnswer": 1,
      "explanation": "La mortalité réduit les ventes sans réduire les coûts engagés."
    }
  ],
  "el_2": [
    {
      "question": "Que mesure l'indice de consommation (IC) d'un élevage de poulets ?",
      "options": [
        "Les kilos d'aliment consommés pour produire un kilo de poids vif",
        "Le nombre de poulets vendus par mètre carré de bâtiment",
        "Le prix payé pour un kilo d'aliment au fournisseur",
        "Le nombre de jours nécessaires pour atteindre 2 kg"
      ],
      "correctAnswer": 0,
      "explanation": "Plus l'IC est bas, moins l'aliment coûte par kilo produit."
    },
    {
      "question": "Avec un IC de 1,75, un poids de vente de 2,0 kg et un aliment à 380 F/kg, quel est le coût d'aliment par poussin ?",
      "options": [
        "760 F, soit 2,0 kg × 380 F",
        "665 F, soit 1,75 × 380 F",
        "1 330 F",
        "1 520 F, soit 4 kg × 380 F"
      ],
      "correctAnswer": 2,
      "explanation": "1,75 × 2,0 × 380 = 1 330 F."
    },
    {
      "question": "L'IC passe de 1,75 à 1,85 (poids 2,0 kg, aliment 380 F/kg). Quel surcoût par poussin ?",
      "options": [
        "10 F par poussin",
        "38 F par poussin",
        "190 F par poussin",
        "76 F par poussin"
      ],
      "correctAnswer": 3,
      "explanation": "0,10 × 2,0 × 380 = 76 F ; × 36 000 poussins = 2,7 M FCFA par an."
    },
    {
      "question": "L'aliment augmente de 10 % (1 330 F par poussin au départ, 36 000 poussins). Quel surcoût annuel ?",
      "options": [
        "Environ 0,5 M FCFA",
        "Environ 4,8 M FCFA",
        "Environ 13,3 M FCFA",
        "Environ 1,3 M FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "133 F × 36 000 ≈ 4,8 M FCFA."
    },
    {
      "question": "La mortalité passe de 6 % à 8 % sur 36 000 poussins, poulet vendu 3 000 F. Quelle perte de chiffre d'affaires ?",
      "options": [
        "Environ 2,2 M FCFA (720 poulets en moins)",
        "Environ 0,7 M FCFA",
        "Environ 21,6 M FCFA",
        "Aucune perte, car les coûts ne changent pas"
      ],
      "correctAnswer": 0,
      "explanation": "2 % × 36 000 = 720 poulets ; 720 × 3 000 = 2,16 M FCFA."
    },
    {
      "question": "Par poussin, l'aliment coûte 1 330 F sur un coût variable total de 2 170 F. Quelle part représente-t-il ?",
      "options": [
        "Environ 16 %",
        "Environ 33 %",
        "Environ 61 %",
        "Environ 95 %"
      ],
      "correctAnswer": 2,
      "explanation": "1 330 ÷ 2 170 ≈ 0,61 : c'est la première variable à surveiller."
    }
  ],
  "el_3": [
    {
      "question": "Charges variables de 78,1 M FCFA pour 33 840 poulets vendus. Quel est le coût variable par poulet vendu ?",
      "options": [
        "Environ 2 309 F",
        "Environ 2 170 F, qui est le coût par poussin mis en place",
        "Environ 3 000 F, qui est le prix de vente",
        "Environ 780 F, en divisant par 100 000"
      ],
      "correctAnswer": 0,
      "explanation": "78,1 M ÷ 33 840 ≈ 2 309 F (2 170 F est le coût par poussin mis en place)."
    },
    {
      "question": "Un poulet est vendu 3 000 F pour un coût variable de 2 309 F. Quelle marge et quel taux de marge ?",
      "options": [
        "Environ 2 309 F, soit 77 % du prix",
        "Environ 691 F, soit 2,3 % du prix",
        "Environ 691 F, soit 23 % du prix",
        "Environ 300 F, soit 10 % du prix"
      ],
      "correctAnswer": 2,
      "explanation": "3 000 − 2 309 = 691 ; 691 ÷ 3 000 ≈ 23 %."
    },
    {
      "question": "CA 101,5 ; charges variables 78,1 ; charges fixes 2,4 ; personnel 5,4 (M FCFA). Quel est l'EBE ?",
      "options": [
        "23,4 M FCFA, avant les charges fixes et le personnel",
        "18,0 M FCFA, avant le personnel seul",
        "8,2 M FCFA, après amortissements",
        "15,6 M FCFA"
      ],
      "correctAnswer": 3,
      "explanation": "101,5 − 78,1 − 2,4 − 5,4 = 15,6."
    },
    {
      "question": "Le prix de vente baisse de 5 % (150 F) sur 33 840 poulets vendus. Quelle perte annuelle ?",
      "options": [
        "Environ 0,5 M FCFA",
        "Environ 5,1 M FCFA",
        "Environ 50,8 M FCFA",
        "Environ 1,7 M FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "150 × 33 840 = 5,08 M FCFA, sans économie sur les coûts."
    },
    {
      "question": "Une bande de 2 000 poussins à 2 170 F de coût variable par poussin engage combien de charges variables ?",
      "options": [
        "Environ 43 M FCFA",
        "Environ 0,4 M FCFA",
        "Environ 2,2 M FCFA",
        "Environ 4,3 M FCFA"
      ],
      "correctAnswer": 3,
      "explanation": "2 000 × 2 170 = 4,34 M FCFA."
    },
    {
      "question": "Le BFR initial est de 10,0 M FCFA ; une bande engage environ 4,3 M FCFA. Combien de bandes cela couvre-t-il ?",
      "options": [
        "Moins d'une bande",
        "Environ dix bandes",
        "Un peu plus de deux bandes",
        "Exactement une bande"
      ],
      "correctAnswer": 2,
      "explanation": "10,0 ÷ 4,3 ≈ 2,3."
    }
  ],
  "el_4": [
    {
      "question": "Pourquoi faut-il sécuriser les débouchés avant la mise en place des poussins ?",
      "options": [
        "Parce que les clients n'achètent que des poussins d'un jour",
        "Parce que le poulet ne se stocke pas et continue de consommer de l'aliment s'il attend",
        "Parce que la banque refuse de financer sans commande ferme",
        "Parce que le prix du poulet est fixé par l'État avant la bande"
      ],
      "correctAnswer": 1,
      "explanation": "Un lot vendu en retard coûte de l'aliment sans recette supplémentaire."
    },
    {
      "question": "Un client paie à 30 jours et achète 8 M FCFA par mois. Quelle somme immobilise-t-il dans le BFR ?",
      "options": [
        "Environ 8 M FCFA",
        "Environ 0,8 M FCFA",
        "Environ 240 M FCFA",
        "Aucune somme, la vente est faite"
      ],
      "correctAnswer": 0,
      "explanation": "Un mois de ventes non encore payées = 8 M FCFA."
    },
    {
      "question": "Avec 33 840 poulets vendus par an, quel volume mensuel moyen viser ?",
      "options": [
        "Environ 340 poulets par mois",
        "Environ 2 800 poulets par mois",
        "Environ 28 000 poulets par mois",
        "Environ 5 640 poulets par mois"
      ],
      "correctAnswer": 1,
      "explanation": "33 840 ÷ 12 ≈ 2 820."
    },
    {
      "question": "Quelle concurrence ne faut-il pas oublier pour la volaille ?",
      "options": [
        "Uniquement les éleveurs de la même commune",
        "Les seuls fournisseurs d'aliment pour animaux",
        "Les produits de substitution : volaille importée congelée, œufs, poisson, autres viandes",
        "Aucune, car la volaille locale n'a pas de concurrent"
      ],
      "correctAnswer": 2,
      "explanation": "La concurrence se mesure au besoin satisfait, pas au produit identique."
    },
    {
      "question": "Quelle pièce montre le mieux à un financeur que la demande existe avant de produire ?",
      "options": [
        "Des lettres d'intention de rôtisseurs et de restaurants (volume, fréquence, prix)",
        "Un graphique du marché mondial de la viande de volaille",
        "La liste de toutes les fermes avicoles de la région",
        "Une photo des bâtiments terminés"
      ],
      "correctAnswer": 0,
      "explanation": "Quelques clients nommés valent mieux qu'un marché « immense » annoncé."
    },
    {
      "question": "Les ventes sont meilleures lors des fêtes. À quel moment mettre en place la bande concernée (42 jours d'élevage) ?",
      "options": [
        "La veille de la fête, pour vendre frais",
        "Six mois avant, pour stocker les poulets",
        "Après la fête, pour profiter de la demande suivante",
        "Environ six semaines avant la date de vente visée"
      ],
      "correctAnswer": 3,
      "explanation": "42 jours = 6 semaines d'élevage : il faut anticiper la mise en place."
    }
  ],
  "el_5": [
    {
      "question": "Dans la matrice de risques, la hausse du prix de l'aliment a une probabilité de 3 et un impact de 3. Quel score ?",
      "options": [
        "9 : traitement prioritaire",
        "6 : à traiter après les petits risques",
        "3 : sans conséquence",
        "33 : le plus élevé possible"
      ],
      "correctAnswer": 0,
      "explanation": "3 × 3 = 9 ; on traite d'abord les scores de 6 et plus."
    },
    {
      "question": "Un épisode de maladie a une probabilité de 2 et un impact de 3. Quel traitement ?",
      "options": [
        "Score 5 : à surveiller seulement",
        "Score 2 : à ignorer",
        "Score 6 : à traiter seulement si le budget le permet",
        "Score 6 : à traiter en priorité, avec biosécurité et plan de vaccination"
      ],
      "correctAnswer": 3,
      "explanation": "2 × 3 = 6 ; le seuil de traitement prioritaire est 6."
    },
    {
      "question": "Dans le scénario de crise, le DSCR de l'année 2 est de 0,66 pour une annuité de 6,6 M FCFA. Que manque-t-il environ ?",
      "options": [
        "Rien, car le DSCR est positif",
        "Environ 6,6 M FCFA, soit l'annuité entière",
        "Environ 2,2 M FCFA pour couvrir l'annuité",
        "Environ 0,7 M FCFA"
      ],
      "correctAnswer": 2,
      "explanation": "0,66 × 6,6 ≈ 4,4 ; 6,6 − 4,4 ≈ 2,2."
    },
    {
      "question": "Pourquoi présenter la biosécurité comme une mitigation chiffrée ?",
      "options": [
        "Parce que la loi exige un budget de 10 % pour la biosécurité",
        "Parce que vide sanitaire, vaccins et accès contrôlé ont un coût prévu dans le plan",
        "Parce qu'elle remplace l'assurance et les autres mesures",
        "Parce qu'elle augmente automatiquement le prix de vente"
      ],
      "correctAnswer": 1,
      "explanation": "Une mesure chiffrée est crédible ; une mesure vague ne l'est pas."
    },
    {
      "question": "Quelle est la bonne démarche pour la réglementation d'un élevage avicole ?",
      "options": [
        "Reprendre les règles d'un autre pays, qui sont les mêmes partout",
        "L'ignorer tant que la bande n'a pas dépassé 10 000 sujets",
        "L'attendre de la banque, qui la fournit avec le prêt",
        "La demander à l'administration de l'élevage de son pays, avec date et source dans le dossier"
      ],
      "correctAnswer": 3,
      "explanation": "Les règles varient d'un pays à l'autre et changent : date et source sont indispensables."
    },
    {
      "question": "Quelle mitigation répond au risque de coupure d'électricité pour la ventilation et le chauffage ?",
      "options": [
        "Un groupe électrogène ou un système solaire de secours, chiffré en investissement",
        "Réduire le nombre de poussins par bande de moitié",
        "Souscrire un prêt supplémentaire à chaque coupure",
        "Attendre le retour du courant sans rien prévoir"
      ],
      "correctAnswer": 0,
      "explanation": "Une panne prolongée peut perdre une bande : l'énergie de secours est un investissement du plan."
    }
  ],
  "fi_1": [
    {
      "question": "Quels sont les deux types de besoins d'un projet qu'il ne faut pas mélanger ?",
      "options": [
        "Le chiffre d'affaires et le résultat net",
        "Le personnel et les associés",
        "L'investissement et le besoin en fonds de roulement",
        "L'apport et la subvention"
      ],
      "correctAnswer": 2,
      "explanation": "L'un se finance sur plusieurs années, l'autre sur quelques mois."
    },
    {
      "question": "Pourquoi financer des intrants par un prêt de sept ans est-il une erreur de montage ?",
      "options": [
        "Parce que les intrants sont toujours gratuits",
        "La durée du financement ne correspond pas à celle du besoin",
        "Parce que les banques interdisent les prêts de sept ans",
        "Parce qu'une subvention remplace tout prêt"
      ],
      "correctAnswer": 1,
      "explanation": "Un besoin de campagne se finance sur la durée de la campagne."
    },
    {
      "question": "Que fait un fonds de garantie ?",
      "options": [
        "Il verse l'argent du prêt à votre place",
        "Il rembourse le prêt à votre place sans condition",
        "Il couvre une partie de la perte de la banque en cas de défaut",
        "Il fixe le taux d'intérêt de toutes les banques"
      ],
      "correctAnswer": 2,
      "explanation": "Il n'apporte pas d'argent : il facilite l'accès au prêt."
    },
    {
      "question": "Que permet un warrant ou un récépissé d'entrepôt ?",
      "options": [
        "Un crédit gagé sur un stock stocké dans un entrepôt agréé",
        "Un crédit sans aucun stock ni garantie",
        "Une subvention automatique de l'État",
        "L'achat de matériel agricole à crédit"
      ],
      "correctAnswer": 0,
      "explanation": "Il évite de vendre à bas prix au moment de la récolte."
    },
    {
      "question": "Où trouver les dispositifs de financement de votre pays avec leur date de vérification ?",
      "options": [
        "Dans la première leçon de la formation uniquement",
        "Dans le classeur Excel, onglet Calendrier",
        "Auprès d'un ami qui a déjà eu un prêt",
        "Dans la fiche Cadre pays"
      ],
      "correctAnswer": 3,
      "explanation": "Les plafonds, taux et conditions changent : vérifiez toujours la date."
    },
    {
      "question": "Que faut-il écrire pour chaque besoin de votre plan ?",
      "options": [
        "Seulement le montant",
        "Montant, durée, source envisagée, conditions et délai de réponse",
        "Seulement le nom de la banque",
        "Rien, avant d'avoir l'accord"
      ],
      "correctAnswer": 1,
      "explanation": "Deux besoins de durées différentes n'ont pas la même source."
    }
  ],
  "fi_2": [
    {
      "question": "Quel est le coût total du projet pris comme exemple ?",
      "options": [
        "8,0 millions de FCFA",
        "80,0 millions de FCFA",
        "800 millions de FCFA",
        "60,0 millions de FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "70,0 d'investissements dont 60,0 de matériel, plus 10,0 de besoin en fonds de roulement."
    },
    {
      "question": "Quel montage a le DSCR de l'année 2 le plus élevé ?",
      "options": [
        "A, prêt bancaire seul, avec 1,56",
        "B, prêt avec garantie, avec 1,36",
        "C, crédit-bail, avec 1,20",
        "D, subvention et prêt, avec 1,68"
      ],
      "correctAnswer": 3,
      "explanation": "La subvention réduit le prêt, donc l'annuité."
    },
    {
      "question": "Pourquoi le DSCR du crédit-bail est-il le plus faible (1,20) ?",
      "options": [
        "Pas de différé et remboursement sur seulement 5 ans",
        "Parce que le matériel ne vaut rien",
        "Parce que les loyers sont nuls",
        "Parce que l'EBE est négatif"
      ],
      "correctAnswer": 0,
      "explanation": "Loyer de 16,6 M FCFA par an pendant 5 ans."
    },
    {
      "question": "Quel est le prêt du montage A (apport de 30 %) ?",
      "options": [
        "24,0 millions de FCFA",
        "80,0 millions de FCFA",
        "56,0 millions de FCFA",
        "5,6 millions de FCFA"
      ],
      "correctAnswer": 2,
      "explanation": "70 % de 80,0."
    },
    {
      "question": "Pourquoi le coût du financement du montage C (23,2) est-il le plus bas ?",
      "options": [
        "Parce que le crédit-bail est toujours gratuit",
        "Parce que le taux est de 0 %",
        "Parce que la banque paie une partie du matériel",
        "Parce que sa durée est plus courte"
      ],
      "correctAnswer": 3,
      "explanation": "Un coût plus bas ne fait pas un meilleur montage."
    },
    {
      "question": "Que montre le montage B (garantie de 1,5 % du prêt) ?",
      "options": [
        "Moins d'apport demandé, mais une annuité plus lourde",
        "Un apport plus élevé que le montage A",
        "Une annuité plus faible que le montage A",
        "Aucun frais supplémentaire"
      ],
      "correctAnswer": 0,
      "explanation": "Prêt de 64,0 au lieu de 56,0 : annuité de 14,7 au lieu de 12,9."
    }
  ],
  "fi_3": [
    {
      "question": "Quels frais la garantie du montage B ajoute-t-elle ?",
      "options": [
        "9,6 millions de FCFA par an",
        "0,96 million de FCFA, payé une fois",
        "0 FCFA",
        "96 millions de FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "1,5 % d'un prêt de 64,0 M FCFA."
    },
    {
      "question": "Pourquoi ne pas bâtir un plan qui dépend d'une subvention non encore accordée ?",
      "options": [
        "Parce que les subventions sont interdites",
        "Parce qu'une subvention se rembourse toujours le jour même",
        "Elle peut être refusée, retardée ou versée par tranches",
        "Parce que la banque refuse toute subvention"
      ],
      "correctAnswer": 2,
      "explanation": "Présentez le plan avec et sans subvention."
    },
    {
      "question": "Que faut-il comparer pour juger un crédit-bail ?",
      "options": [
        "Seulement la couleur du matériel",
        "Seulement le montant d'un loyer",
        "Seulement le nom du financeur",
        "Le coût total et le prix d'achat comptant"
      ],
      "correctAnswer": 3,
      "explanation": "Loyers, frais et valeur de l'option d'achat entrent dans le coût."
    },
    {
      "question": "Quel est le loyer annuel du crédit-bail du cas ?",
      "options": [
        "Environ 1,7 million de FCFA",
        "Environ 16,6 millions de FCFA",
        "Environ 60 millions de FCFA",
        "Environ 83 millions de FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "60,0 M FCFA de matériel, 12 % implicite, 5 ans."
    },
    {
      "question": "Qu'est-ce qu'un contrat de culture avec préfinancement ?",
      "options": [
        "Un contrat où l'État achète toute la récolte",
        "Une subvention sans contrepartie",
        "Un acheteur finance des intrants contre une livraison",
        "Un prêt sans aucun remboursement"
      ],
      "correctAnswer": 2,
      "explanation": "Vérifiez prix, qualité exigée et pénalités."
    },
    {
      "question": "Que doit-on prévoir quand une subvention est versée après une partie des dépenses ?",
      "options": [
        "De quoi préfinancer ces dépenses",
        "Rien, l'argent arrive toujours avant",
        "Une deuxième subvention automatique",
        "L'abandon du projet"
      ],
      "correctAnswer": 0,
      "explanation": "Elle est souvent versée par tranches, sur justificatifs."
    }
  ],
  "fi_4": [
    {
      "question": "Quelle question un financeur se pose-t-il en priorité sur le remboursement ?",
      "options": [
        "Aimez-vous l'agriculture ?",
        "Avez-vous déjà voyagé ?",
        "Pouvez-vous rembourser, y compris en scénario pessimiste ?",
        "Avez-vous un site web ?"
      ],
      "correctAnswer": 2,
      "explanation": "La couverture de la dette en scénario réaliste et pessimiste."
    },
    {
      "question": "Pourquoi l'apport montre-t-il votre engagement ?",
      "options": [
        "Vous risquez votre propre argent dans le projet",
        "Parce que l'apport remplace le business plan",
        "Parce qu'il est toujours remboursé par l'État",
        "Parce qu'il dispense de garanties"
      ],
      "correctAnswer": 0,
      "explanation": "L'apport doit exister sur un compte, pas seulement dans le plan."
    },
    {
      "question": "Pourquoi le droit sur la terre doit-il être valable pour toute la durée du prêt ?",
      "options": [
        "Pour augmenter le taux d'intérêt",
        "Le financeur doit être sûr que vous pourrez exploiter",
        "Parce que la terre se vend avec le prêt",
        "Parce que la banque cultive à votre place"
      ],
      "correctAnswer": 1,
      "explanation": "C'est une condition de base d'un dossier."
    },
    {
      "question": "Que faire en cas de refus ?",
      "options": [
        "Redéposer le même dossier sans rien changer",
        "Abandonner le projet immédiatement",
        "Menacer le financeur",
        "Demander la raison par écrit pour corriger le dossier"
      ],
      "correctAnswer": 3,
      "explanation": "La raison indique ce qu'il faut améliorer avant de redéposer ailleurs."
    },
    {
      "question": "Quelle erreur est fréquente dans un dossier ?",
      "options": [
        "Un résumé de deux pages",
        "Des devis datés en annexe",
        "Des chiffres qui changent d'une section à l'autre",
        "Un scénario pessimiste calculé"
      ],
      "correctAnswer": 2,
      "explanation": "Les mêmes chiffres doivent revenir dans tout le dossier."
    },
    {
      "question": "Que faut-il demander au financeur avant de préparer le dossier ?",
      "options": [
        "Son numéro de téléphone personnel",
        "Son avis sur la météo",
        "Rien : un dossier type suffit pour tous",
        "Sa liste exacte de pièces et sa date limite"
      ],
      "correctAnswer": 3,
      "explanation": "Chaque dispositif a sa propre liste."
    }
  ],
  "fi_5": [
    {
      "question": "Que fait une assurance sur indice climatique ?",
      "options": [
        "Elle paie selon un indice de zone, pas selon vos pertes réelles",
        "Elle paie toujours exactement vos pertes",
        "Elle rembourse le prêt de la banque",
        "Elle garantit un prix de vente"
      ],
      "correctAnswer": 0,
      "explanation": "Elle couvre une pluviométrie ou une température hors seuil."
    },
    {
      "question": "Où placer la prime d'assurance dans votre plan ?",
      "options": [
        "Nulle part, elle est gratuite",
        "Dans les charges, puis tester l'effet sur le DSCR",
        "Dans l'apport",
        "Dans les produits"
      ],
      "correctAnswer": 1,
      "explanation": "Demandez un devis écrit et daté."
    },
    {
      "question": "Quel est le risque d'une assurance dont on n'a pas lu les exclusions ?",
      "options": [
        "Aucun, car l'assureur paie toujours tout",
        "Une baisse automatique du taux de prêt",
        "Un faux sentiment de sécurité",
        "Une subvention supplémentaire"
      ],
      "correctAnswer": 2,
      "explanation": "Lisez ce qui est couvert et ce qui est exclu."
    },
    {
      "question": "Quand existe un risque de change ?",
      "options": [
        "Quand le plan est en FCFA et que tout reste en FCFA",
        "Quand des coûts ou des ventes sont dans une autre monnaie que celle du plan",
        "Quand la banque est locale",
        "Quand le projet est de petite taille"
      ],
      "correctAnswer": 1,
      "explanation": "Intrants importés, matériel étranger, vente dans un pays voisin."
    },
    {
      "question": "Quelle mesure limite le risque de change ?",
      "options": [
        "Indexer les prix ou acheter à l'avance une partie des intrants importés",
        "Ne rien prévoir et espérer",
        "Supprimer le scénario pessimiste",
        "Vendre uniquement à crédit"
      ],
      "correctAnswer": 0,
      "explanation": "Testez aussi une variation défavorable de 10 à 20 %."
    },
    {
      "question": "Pourquoi une assurance est-elle une mesure de mitigation ?",
      "options": [
        "Elle supprime toute possibilité de sinistre",
        "Elle remplace le business plan",
        "Elle augmente le prix de vente",
        "Elle transfère un risque important à un assureur"
      ],
      "correctAnswer": 3,
      "explanation": "Voir la leçon 6.1 sur les risques."
    }
  ],
  "ma_1": [
    {
      "question": "Un porteur cultive 1,5 ha de tomate (1 cycle) et 1,5 ha de chou (2 cycles). Combien d'hectares-cycles par an ?",
      "options": [
        "3 hectares-cycles, soit la surface seule",
        "4,5 hectares-cycles",
        "2,25 hectares-cycles, en divisant par deux",
        "6 hectares-cycles, en comptant deux cycles partout"
      ],
      "correctAnswer": 1,
      "explanation": "1,5 × 1 + 1,5 × 2 = 4,5."
    },
    {
      "question": "Le chou donne 30 t/ha sur 1,5 ha avec 2 cycles par an. Quelle production annuelle ?",
      "options": [
        "90 t",
        "45 t, en ne comptant qu'un cycle",
        "30 t, en oubliant la surface",
        "180 t, en comptant quatre cycles"
      ],
      "correctAnswer": 0,
      "explanation": "1,5 × 2 × 30 = 90 t."
    },
    {
      "question": "Quelle est l'intensité culturale d'une exploitation de 3 ha qui réalise 4,5 hectares-cycles ?",
      "options": [
        "45 %",
        "67 %",
        "150 %",
        "450 %"
      ],
      "correctAnswer": 2,
      "explanation": "4,5 ÷ 3 = 1,5, soit 150 %."
    },
    {
      "question": "Pourquoi planter par fractions décalées plutôt que tout le même jour ?",
      "options": [
        "Pour recevoir une subvention réservée aux plantations décalées",
        "Pour réduire à zéro les pertes après récolte",
        "Pour dispenser le porteur d'irriguer pendant la saison sèche",
        "Pour étaler les récoltes, mieux utiliser la main-d'œuvre et éviter d'inonder le marché"
      ],
      "correctAnswer": 3,
      "explanation": "Tout planter le même jour, c'est tout récolter et tout vendre en même temps."
    },
    {
      "question": "Un porteur a 1 ha de tomate (1 cycle, 20 t/ha) et 1 ha de gombo (2 cycles, 10 t/ha). Quelle production annuelle ?",
      "options": [
        "30 t, en ne comptant qu'un cycle de gombo",
        "20 t, en ne comptant que la tomate",
        "60 t, en comptant trois cycles de gombo",
        "40 t"
      ],
      "correctAnswer": 3,
      "explanation": "20 + (2 × 10) = 40 t."
    },
    {
      "question": "Quelle erreur courante gonfle un plan de cultures ?",
      "options": [
        "Répartir les surfaces sur plusieurs cultures",
        "Compter plus de cycles que le calendrier n'en permet réellement",
        "Alterner les familles de plantes d'un cycle à l'autre",
        "Prévoir un engrais vert en période de repos"
      ],
      "correctAnswer": 1,
      "explanation": "Entre deux cultures, il faut le temps de préparer la parcelle."
    }
  ],
  "ma_2": [
    {
      "question": "Le forage, la pompe solaire et le goutte-à-goutte coûtent 9,0 M FCFA sur 18,8 M d'immobilisations. Quelle part ?",
      "options": [
        "Environ 48 %",
        "Environ 21 %",
        "Environ 9 %",
        "Environ 90 %"
      ],
      "correctAnswer": 0,
      "explanation": "9,0 ÷ 18,8 ≈ 0,48 : l'irrigation est près de la moitié de l'investissement."
    },
    {
      "question": "Ces équipements (9,0 M FCFA) sont amortis sur 8 ans. Quelle dotation annuelle ?",
      "options": [
        "Environ 0,9 M FCFA",
        "Environ 72 M FCFA",
        "Environ 1,1 M FCFA",
        "Environ 9,0 M FCFA"
      ],
      "correctAnswer": 2,
      "explanation": "9,0 ÷ 8 ≈ 1,1."
    },
    {
      "question": "Les charges d'eau et d'énergie du cas sont de 1,2 M FCFA par an. Que comprennent-elles ?",
      "options": [
        "Le fonctionnement, sans l'amortissement qui figure à part",
        "L'amortissement du forage et de la pompe",
        "Le salaire du gardien et du chef de culture",
        "Le remboursement de l'emprunt"
      ],
      "correctAnswer": 0,
      "explanation": "L'amortissement est une ligne séparée du compte de résultat."
    },
    {
      "question": "Quelle mitigation protège contre une panne de pompe ?",
      "options": [
        "Arroser uniquement avec la pluie",
        "Réduire la surface de moitié dès le départ",
        "Attendre la réparation sans rien prévoir",
        "Une pompe de secours ou des pièces de rechange, et un contrat d'entretien"
      ],
      "correctAnswer": 3,
      "explanation": "Sans eau, il n'y a pas de culture de contre-saison : la solution de secours est chiffrée."
    },
    {
      "question": "Que faut-il vérifier avant de forer ?",
      "options": [
        "Uniquement le prix du mètre foré",
        "Les règles de prélèvement d'eau de son pays, avec la date et la source",
        "La couleur des tuyaux autorisés",
        "Le nombre d'employés prévus dans l'équipe"
      ],
      "correctAnswer": 1,
      "explanation": "Un forage demande souvent une étude et une autorisation."
    },
    {
      "question": "Quel est l'avantage du goutte-à-goutte pour des légumes en lignes ?",
      "options": [
        "Il ne demande aucun entretien ni aucune énergie",
        "Il est moins cher que l'aspersion et consomme plus d'eau",
        "Il économise l'eau, mais coûte plus cher à installer",
        "Il remplace la nécessité d'un forage"
      ],
      "correctAnswer": 2,
      "explanation": "Économie d'eau contre investissement plus élevé."
    }
  ],
  "ma_3": [
    {
      "question": "Intrants : tomate 1,6 M FCFA/ha/cycle, chou 1,0 M FCFA/ha/cycle. Avec 1,5 ha de tomate (1 cycle) et 1,5 ha de chou (2 cycles), quels intrants annuels ?",
      "options": [
        "2,6 M FCFA, en additionnant les deux coûts par hectare",
        "3,9 M FCFA, en comptant un seul cycle de chou",
        "5,4 M FCFA",
        "7,8 M FCFA, en comptant deux cycles de tomate"
      ],
      "correctAnswer": 2,
      "explanation": "1,5 × 1,6 + 1,5 × 2 × 1,0 = 2,4 + 3,0 = 5,4."
    },
    {
      "question": "Aux intrants de 5,4 s'ajoutent main-d'œuvre saisonnière 4,0, caisses et transport 1,6, eau et énergie 1,2 (M FCFA). Quelles charges variables ?",
      "options": [
        "5,4 M FCFA, soit les intrants seuls",
        "12,2 M FCFA",
        "6,8 M FCFA, en omettant la main-d'œuvre",
        "23,0 M FCFA, qui est le chiffre d'affaires"
      ],
      "correctAnswer": 1,
      "explanation": "5,4 + 4,0 + 1,6 + 1,2 = 12,2."
    },
    {
      "question": "37,5 t de tomate à 250 F/kg et 90 t de chou à 180 F/kg, avec 10 % de pertes. Quel CA ?",
      "options": [
        "Environ 25,6 M FCFA, sans retirer les pertes",
        "Environ 9,4 M FCFA, avec la tomate seule",
        "Environ 230 M FCFA, en décalant la virgule",
        "Environ 23,0 M FCFA"
      ],
      "correctAnswer": 3,
      "explanation": "(9,375 + 16,2) × 0,9 ≈ 23,0."
    },
    {
      "question": "Les pertes après récolte passent de 10 % à 7 % sur un CA brut d'environ 25,6 M FCFA. Quel gain de CA ?",
      "options": [
        "Environ 0,8 M FCFA",
        "Environ 7,7 M FCFA",
        "Environ 0,08 M FCFA",
        "Environ 3,0 M FCFA"
      ],
      "correctAnswer": 0,
      "explanation": "3 points × 25,6 M ≈ 0,77 M FCFA, sans coût de production en plus."
    },
    {
      "question": "Quels rendements retenir dans un plan ?",
      "options": [
        "Ceux que l'on a mesurés ou que des voisins ont obtenus, avec source et date",
        "Ceux du catalogue du fournisseur de semences",
        "Les meilleurs rendements jamais observés dans le pays",
        "Des rendements arrondis à la dizaine supérieure"
      ],
      "correctAnswer": 0,
      "explanation": "Un rendement de station n'est pas le vôtre."
    },
    {
      "question": "CA de 23,0 M FCFA et charges variables de 12,2 M FCFA : quel taux de marge sur coûts variables ?",
      "options": [
        "Environ 53 %",
        "Environ 12 %",
        "Environ 47 %",
        "Environ 90 %"
      ],
      "correctAnswer": 2,
      "explanation": "(23,0 − 12,2) ÷ 23,0 ≈ 0,47."
    }
  ],
  "ma_4": [
    {
      "question": "L'oignon de Diap : 60 % vendus à 160 F à la récolte, 40 % à 260 F après stockage. Quel prix moyen ?",
      "options": [
        "210 F/kg, moyenne simple des deux prix",
        "200 F/kg",
        "260 F/kg, le prix le plus élevé",
        "100 F/kg, la différence entre les deux prix"
      ],
      "correctAnswer": 1,
      "explanation": "0,6 × 160 + 0,4 × 260 = 200 : la moyenne est pondérée."
    },
    {
      "question": "Sur quelle durée relever les prix de son marché pour construire un prix de plan ?",
      "options": [
        "Un seul jour, le jour de la récolte",
        "Une semaine, en saison sèche",
        "Aucune durée : les statistiques publiques suffisent",
        "Au moins douze mois, avec la date de chaque relevé"
      ],
      "correctAnswer": 3,
      "explanation": "Les prix varient avec la saison : il faut couvrir un cycle annuel."
    },
    {
      "question": "Dans le cas du Bénin, une crise de prix de − 15 % fait passer le DSCR de 1,61 à :",
      "options": [
        "1,41, soit une baisse de 15 % exactement",
        "1,61, le DSCR ne dépend pas des prix",
        "2,5, car les coûts baissent aussi",
        "0,89, soit une annuité non couverte"
      ],
      "correctAnswer": 3,
      "explanation": "En dessous de 1, l'exploitation ne couvre plus l'annuité."
    },
    {
      "question": "Quel produit se stocke assez bien pour vendre plus tard à meilleur prix ?",
      "options": [
        "La tomate fraîche, plusieurs mois en magasin",
        "L'oignon ou la pomme de terre, contrairement à la tomate ou au chou frais",
        "Le chou frais, sans aucune installation",
        "Tous les légumes frais, de la même manière"
      ],
      "correctAnswer": 1,
      "explanation": "Pour la tomate et le chou, ce sont le calendrier et le débouché qui comptent."
    },
    {
      "question": "Pourquoi décaler les plantations aide-t-il à vendre ?",
      "options": [
        "Pour que tous les clients achètent le même jour",
        "Pour éviter de calibrer et de trier les légumes",
        "Pour récolter hors du pic de l'offre locale, quand les prix sont plus bas",
        "Pour supprimer le besoin d'un débouché"
      ],
      "correctAnswer": 2,
      "explanation": "Moins de produit au même moment = moins de pression sur le prix."
    },
    {
      "question": "Quelle pièce rassure le mieux sur la demande avant de planter ?",
      "options": [
        "Une lettre d'intention d'un restaurateur ou d'un grossiste (volume, fréquence, prix)",
        "Un article de presse sur l'agriculture en général",
        "Une photo du terrain préparé",
        "Le prix des semences chez le fournisseur"
      ],
      "correctAnswer": 0,
      "explanation": "Un acheteur nommé vaut mieux qu'un marché « immense »."
    }
  ],
  "ma_5": [
    {
      "question": "Immobilisations 18,8 M FCFA et BFR 4,0 M FCFA : quel coût du projet ?",
      "options": [
        "14,8 M FCFA, en soustrayant le BFR",
        "18,8 M FCFA, en oubliant le BFR",
        "75,2 M FCFA, en multipliant les deux",
        "22,8 M FCFA"
      ],
      "correctAnswer": 3,
      "explanation": "18,8 + 4,0 = 22,8."
    },
    {
      "question": "Coûts fixes totaux de 7,9 M FCFA et taux de marge de 47 % : quel seuil de rentabilité ?",
      "options": [
        "Environ 16,8 M FCFA, soit 73 % du CA de 23,0",
        "Environ 3,7 M FCFA, en multipliant",
        "Environ 7,9 M FCFA, soit les coûts fixes seuls",
        "Environ 23,0 M FCFA, soit le CA"
      ],
      "correctAnswer": 0,
      "explanation": "7,9 ÷ 0,47 ≈ 16,8 ; 16,8 ÷ 23,0 ≈ 73 %."
    },
    {
      "question": "Pourquoi la marge de sécurité d'une petite exploitation est-elle étroite ?",
      "options": [
        "Parce que les petites exploitations n'ont pas de charges variables",
        "Parce que les petites surfaces rapportent toujours moins par hectare",
        "Parce que des coûts fixes importants se répartissent sur peu de surface et peu de production",
        "Parce que l'emprunt est interdit en dessous de 5 ha"
      ],
      "correctAnswer": 2,
      "explanation": "Le seuil atteint 73 % du CA, contre 53 % chez Diap Touré."
    },
    {
      "question": "En crise de prix, le DSCR de l'année 2 est de 0,89. Que signifie-t-il ?",
      "options": [
        "Les flux couvrent l'annuité avec une grande marge",
        "Les flux ne couvrent pas l'annuité : il faut une réserve, une garantie ou un report",
        "L'annuité est déjà remboursée en totalité",
        "Le DSCR ne peut pas être inférieur à 1"
      ],
      "correctAnswer": 1,
      "explanation": "En dessous de 1, l'exploitation ne rembourse pas la dette avec ses seuls flux."
    },
    {
      "question": "Quel levier améliore la marge d'une petite exploitation sans alourdir les coûts fixes ?",
      "options": [
        "Un cycle supplémentaire par an ou une culture à plus forte valeur sur les mêmes surfaces",
        "Embaucher un deuxième chef de culture",
        "Construire un second magasin de stockage",
        "Doubler le montant de l'emprunt"
      ],
      "correctAnswer": 0,
      "explanation": "Chaque hectare-cycle ajouté apporte du CA pour des coûts fixes quasi inchangés."
    },
    {
      "question": "Dans le cas du Bénin, la VAN à 10 % est de +3,4 M FCFA et le TRI de 14,6 %. Que conclure ?",
      "options": [
        "Le projet est sans risque, car la VAN est positive",
        "Le projet détruit de la valeur, car le TRI est supérieur à 10 %",
        "Le projet rapporte plus que le taux exigé, mais avec une marge de sécurité étroite",
        "Le TRI et la VAN ne permettent aucune conclusion"
      ],
      "correctAnswer": 2,
      "explanation": "TRI > taux d'actualisation ⇔ VAN > 0 ; la fragilité apparaît dans les scénarios de crise."
    }
  ],
  "cp_1": [
    {
      "question": "Sur quel horizon se lit le plan d'une culture pérenne ?",
      "options": [
        "1 à 2 ans, comme une culture annuelle",
        "10 à 20 ans",
        "3 mois, le temps d'une campagne",
        "Uniquement l'année de la première récolte"
      ],
      "correctAnswer": 1,
      "explanation": "L'investissement précède la récolte de plusieurs années et la plantation produit ensuite longtemps."
    },
    {
      "question": "Dans le cas, quelles sont les trois phases de vie de la cacaoyère ?",
      "options": [
        "Semis, récolte, vente seulement",
        "Plantation, abandon, renouvellement",
        "Pépinière, exportation, liquidation",
        "Installation, montée en production, croisière"
      ],
      "correctAnswer": 3,
      "explanation": "Années 1 à 3, 4 à 6, puis 7 à 15."
    },
    {
      "question": "Quelle part du rendement de croisière retient le cas l'année 5 ?",
      "options": [
        "25 %",
        "75 %",
        "50 %",
        "100 %"
      ],
      "correctAnswer": 2,
      "explanation": "25 % en année 4, 50 % en année 5, 75 % en année 6, 100 % dès l'année 7."
    },
    {
      "question": "Quel est l'intérêt des cultures associées pendant l'installation ?",
      "options": [
        "Elles apportent des recettes sans récolte d'arbres",
        "Elles augmentent le prix des fèves",
        "Elles dispensent d'entretenir les arbres",
        "Elles remplacent l'emprunt"
      ],
      "correctAnswer": 0,
      "explanation": "À condition de ne pas concurrencer les jeunes arbres pour l'eau et la lumière."
    },
    {
      "question": "Quelle est l'erreur la plus fréquente sur la montée en production ?",
      "options": [
        "Prendre une rampe prudente et documentée",
        "Une rampe trop optimiste, sans source",
        "Demander l'avis d'un technicien de la filière",
        "Comparer avec des producteurs de la zone"
      ],
      "correctAnswer": 1,
      "explanation": "La rampe de production doit être documentée avec source et date."
    },
    {
      "question": "Combien de tonnes de fèves par an en croisière (20 ha, 900 kg/ha) ?",
      "options": [
        "1,8 t",
        "180 t",
        "9 t",
        "18 t"
      ],
      "correctAnswer": 3,
      "explanation": "20 × 900 = 18 000 kg."
    }
  ],
  "cp_2": [
    {
      "question": "Quel est le chiffre d'affaires de croisière du cas (18 000 kg à 1 800 FCFA/kg) ?",
      "options": [
        "32,4 millions de FCFA",
        "3,24 millions de FCFA",
        "324 millions de FCFA",
        "18 millions de FCFA"
      ],
      "correctAnswer": 0,
      "explanation": "18 000 × 1 800 = 32,4 millions."
    },
    {
      "question": "Pourquoi retenir un rendement mesuré plutôt que celui d'un fournisseur de plants ?",
      "options": [
        "Parce que les fournisseurs sont interdits de publier",
        "Parce que le rendement n'influe pas sur le chiffre d'affaires",
        "C'est un potentiel, pas le vôtre",
        "Parce que le rendement est fixé par la loi"
      ],
      "correctAnswer": 2,
      "explanation": "Un rendement surestimé de 10 % déforme tout le plan."
    },
    {
      "question": "Dans le scénario pessimiste (rendement − 10 %, prix − 10 %), de combien baisse le chiffre d'affaires de croisière ?",
      "options": [
        "Environ 10 %",
        "Environ 19 %",
        "Environ 20 millions de FCFA",
        "Environ 50 %"
      ],
      "correctAnswer": 1,
      "explanation": "0,9 × 0,9 = 0,81, soit une baisse de 19 % (26,2 au lieu de 32,4)."
    },
    {
      "question": "Quelles sont les deux sources d'incertitude du prix d'une culture de rente ?",
      "options": [
        "La couleur des sacs et la saison des pluies",
        "Le prix des plants et la taille du bureau",
        "Le nom du pays et le nom de l'acheteur",
        "Marché mondial et dispositif national"
      ],
      "correctAnswer": 3,
      "explanation": "Vérifiez le dispositif de votre pays et produit, avec date et source."
    },
    {
      "question": "Pourquoi la post-récolte (fermentation, séchage) fait-elle partie de l'investissement ?",
      "options": [
        "Elle est facultative et n'a aucun coût",
        "Elle remplace l'entretien des arbres",
        "Elle fait monter la surface plantée",
        "La qualité conditionne l'accès à un acheteur et parfois une prime"
      ],
      "correctAnswer": 3,
      "explanation": "Fermentoir et séchoir : 4,0 M FCFA dans le cas."
    },
    {
      "question": "Qu'est-ce qui vaut mieux qu'une promesse orale d'un acheteur ?",
      "options": [
        "Une lettre d'intention ou un contrat d'achat",
        "Une photo de l'acheteur",
        "Un prix relevé il y a dix ans",
        "Un message d'un ami"
      ],
      "correctAnswer": 0,
      "explanation": "Voir la leçon 4.2 de la formation."
    }
  ],
  "cp_3": [
    {
      "question": "Quel est le total des immobilisations de la cacaoyère du cas ?",
      "options": [
        "70,2 millions de FCFA",
        "18,0 millions de FCFA",
        "27,0 millions de FCFA",
        "24,2 millions de FCFA"
      ],
      "correctAnswer": 2,
      "explanation": "Les 70,2 millions du coût du projet incluent déficits d'exploitation et intérêts du différé."
    },
    {
      "question": "Quelle part des immobilisations représente l'installation de la plantation (18,0 sur 27,0) ?",
      "options": [
        "Environ 10 %",
        "Les deux tiers",
        "Environ un quart",
        "La totalité"
      ],
      "correctAnswer": 1,
      "explanation": "18,0 ÷ 27,0 ≈ 67 %."
    },
    {
      "question": "Quel est l'EBE des années 1 à 3 dans le cas ?",
      "options": [
        "+ 6,8 millions de FCFA par an",
        "0, car il n'y a pas de récolte",
        "− 68 millions de FCFA par an",
        "− 6,8 millions de FCFA par an"
      ],
      "correctAnswer": 3,
      "explanation": "3,0 de recettes associées moins 5,0 d'entretien, 3,6 de personnel et 1,2 de charges fixes."
    },
    {
      "question": "Quel est le total des déficits d'exploitation à financer dans le cas ?",
      "options": [
        "2,4 millions de FCFA",
        "24,2 millions de FCFA",
        "42,1 millions de FCFA",
        "6,8 millions de FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "3 × 6,8 + 3,8 ≈ 24,2."
    },
    {
      "question": "Quel est le coût de récolte et de post-récolte en croisière (250 FCFA/kg, 18 000 kg) ?",
      "options": [
        "4,5 millions de FCFA",
        "45 millions de FCFA",
        "0,45 million de FCFA",
        "250 millions de FCFA"
      ],
      "correctAnswer": 0,
      "explanation": "18 000 × 250 = 4,5 millions."
    },
    {
      "question": "Comment réduire le coût de l'attente ?",
      "options": [
        "Planter plus vite sans entretenir",
        "Acheter des plants moins chers sans regarder la qualité",
        "Planter par tranches et garder des cultures associées plus longtemps",
        "Supprimer toute charge fixe"
      ],
      "correctAnswer": 2,
      "explanation": "Une plantation ratée coûte plus cher qu'un plant de qualité."
    }
  ],
  "cp_4": [
    {
      "question": "Quel est le coût total du projet dans le cas ?",
      "options": [
        "27,0 millions de FCFA",
        "70,2 millions de FCFA",
        "42,1 millions de FCFA",
        "28,1 millions de FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "27,0 d'immobilisations + 24,2 de déficits + 18,9 d'intérêts du différé."
    },
    {
      "question": "Pourquoi le différé est-il long (5 ans) dans le cas ?",
      "options": [
        "Parce que la banque ne prête jamais plus court",
        "Parce que la loi interdit de rembourser avant 5 ans",
        "Pas assez de production avant l'année 6",
        "Pour éviter de payer des intérêts"
      ],
      "correctAnswer": 2,
      "explanation": "Un essai avec 4 ans de différé donnait un DSCR de 0,44 la première année de remboursement."
    },
    {
      "question": "Que paie-t-on pendant le différé ?",
      "options": [
        "Rien du tout pendant les cinq premières années",
        "Capital et intérêts, comme après le différé",
        "Seulement le capital, sans aucun intérêt",
        "Les intérêts, environ 3,8 millions par an"
      ],
      "correctAnswer": 3,
      "explanation": "42,1 × 9 % ≈ 3,8 millions."
    },
    {
      "question": "Quel est le DSCR de la première année de remboursement (année 6) dans le cas ?",
      "options": [
        "1,44",
        "0,44",
        "2,43",
        "4,60"
      ],
      "correctAnswer": 0,
      "explanation": "C'est l'année la plus tendue : la banque la regardera de près."
    },
    {
      "question": "Pourquoi les intérêts du différé font-ils partie du coût du projet ?",
      "options": [
        "Parce qu'ils sont déductibles de tout impôt",
        "Ils sont payés avant les premiers gains",
        "Parce qu'ils sont remboursés par l'acheteur",
        "Parce qu'ils sont toujours nuls"
      ],
      "correctAnswer": 1,
      "explanation": "Environ 18,9 millions dans le cas."
    },
    {
      "question": "Quelle part d'apport retient le cas ?",
      "options": [
        "10 %",
        "100 %",
        "40 %",
        "0 %"
      ],
      "correctAnswer": 2,
      "explanation": "Le risque d'un projet pérenne étant long, les banques demandent souvent un apport plus élevé."
    }
  ],
  "cp_5": [
    {
      "question": "Quel est le TRI du scénario réaliste du cas ?",
      "options": [
        "11,2 %",
        "1,1 %",
        "25 %",
        "5,3 %"
      ],
      "correctAnswer": 0,
      "explanation": "À peine au-dessus du taux d'actualisation de 10 %."
    },
    {
      "question": "Quel est le délai de récupération du scénario réaliste ?",
      "options": [
        "Environ 1 an",
        "Environ 3 ans",
        "Plus de 15 ans",
        "Environ 9,1 ans"
      ],
      "correctAnswer": 3,
      "explanation": "L'argent investi n'est récupéré que très tard."
    },
    {
      "question": "Que devient la VAN en scénario pessimiste (rendement et prix − 10 %, entretien + 10 %) ?",
      "options": [
        "Négative, environ − 16,1 M FCFA",
        "Elle reste positive à 4,6 millions de FCFA, comme en réaliste",
        "Elle double grâce au prix plus bas",
        "Elle est nulle, quelle que soit l'hypothèse retenue"
      ],
      "correctAnswer": 0,
      "explanation": "Le projet ne rémunère plus l'argent investi à 10 %."
    },
    {
      "question": "Pourquoi la VAN est-elle aussi sensible au rendement et au prix sur 15 ans ?",
      "options": [
        "Parce que la VAN ne dépend que de l'année 1",
        "Parce que l'inflation est toujours nulle",
        "Parce que le TRI est fixe",
        "Recettes tardives, coûts précoces, actualisation"
      ],
      "correctAnswer": 3,
      "explanation": "C'est pourquoi les cultures pérennes sont plus sensibles aux hypothèses qu'une culture annuelle."
    },
    {
      "question": "Quel risque propre aux cultures pérennes concerne le droit sur la terre ?",
      "options": [
        "Aucun, le foncier n'a pas d'importance",
        "Le foncier ne concerne que les cultures annuelles",
        "Un droit foncier sûr pour 15 ans",
        "Il suffit d'un accord oral de dix jours"
      ],
      "correctAnswer": 2,
      "explanation": "Voir la fiche Cadre pays."
    },
    {
      "question": "Quel scénario faut-il toujours présenter, en plus du réaliste ?",
      "options": [
        "Un scénario optimiste seulement",
        "Un scénario pessimiste et un scénario de crise",
        "Aucun scénario",
        "Un scénario où le prix double"
      ],
      "correctAnswer": 1,
      "explanation": "Le DSCR passe à 0,71 en pessimiste et 0,37 en crise de prix."
    }
  ],
  "ps_1": [
    {
      "question": "Pourquoi un prix de « 190 FCFA le kilo » ne suffit-il pas dans un plan ?",
      "options": [
        "Parce que les prix sont toujours confidentiels",
        "Parce que le kilo n'existe pas comme unité",
        "Parce qu'un prix ne change jamais dans l'année",
        "Il ne dit ni où, ni quand, ni à quel stade, ni selon quelle unité"
      ],
      "correctAnswer": 3,
      "explanation": "Sans lieu, date, stade, unité et source, le prix ne se vérifie pas."
    },
    {
      "question": "Quelle différence y a-t-il entre le prix producteur et le prix détaillant ?",
      "options": [
        "Le prix détaillant inclut la marge des intermédiaires",
        "Aucune, ce sont toujours les mêmes prix",
        "Le prix producteur est toujours le plus élevé",
        "Le prix détaillant est fixé par le producteur"
      ],
      "correctAnswer": 0,
      "explanation": "Prendre le prix détaillant comme prix de vente surévalue le chiffre d'affaires."
    },
    {
      "question": "Que faire d'un chiffre dont on ne retrouve plus la source ?",
      "options": [
        "L'utiliser quand même s'il paraît plausible",
        "Ne pas l'utiliser dans le plan",
        "L'arrondir à la dizaine supérieure",
        "Le remplacer par un chiffre plus élevé"
      ],
      "correctAnswer": 1,
      "explanation": "Notez toujours le nom, la date et le lien de la source."
    },
    {
      "question": "Combien d'années de relevés permettent déjà de voir un motif saisonnier ?",
      "options": [
        "Un seul jour",
        "Une semaine",
        "Environ trois années",
        "Cinquante ans obligatoirement"
      ],
      "correctAnswer": 2,
      "explanation": "Un relevé par mois pendant une campagne complète est un minimum."
    },
    {
      "question": "Quel relevé est le plus fiable ?",
      "options": [
        "Un chiffre entendu sans précision",
        "Celui que vous avez fait vous-même chez plusieurs vendeurs, avec la date",
        "Un prix lu sur une affiche ancienne",
        "Le prix le plus élevé entendu"
      ],
      "correctAnswer": 1,
      "explanation": "Un relevé direct et daté vaut mieux qu'un chiffre rapporté."
    },
    {
      "question": "Quel prix retenir dans un plan quand on n'a pas encore de série de relevés ?",
      "options": [
        "Un prix présenté comme une hypothèse à vérifier",
        "Un prix présenté comme un fait certain",
        "Le prix garanti de l'an dernier",
        "Aucun prix, le plan reste vide"
      ],
      "correctAnswer": 0,
      "explanation": "Écrivez dans le plan que le prix est une hypothèse, puis commencez vos relevés."
    }
  ],
  "ps_2": [
    {
      "question": "Comment se comporte souvent le prix d'un produit agricole dans l'année ?",
      "options": [
        "Toujours identique toute l'année",
        "Haut à la récolte, bas à la soudure",
        "Bas à la récolte, haut à la soudure",
        "Fixé chaque jour par l'État"
      ],
      "correctAnswer": 2,
      "explanation": "Ce motif se mesure : il varie selon le produit, la zone et l'année."
    },
    {
      "question": "Comment se calcule l'indice saisonnier d'un mois ?",
      "options": [
        "Prix du mois multiplié par douze",
        "Prix du mois moins le prix du mois précédent",
        "Prix de la récolte divisé par le prix de la soudure",
        "Prix du mois divisé par le prix moyen de l'année"
      ],
      "correctAnswer": 3,
      "explanation": "1,00 correspond au prix moyen de l'année."
    },
    {
      "question": "Pourquoi moyenner l'indice sur au moins trois années ?",
      "options": [
        "Parce que la loi l'impose",
        "Parce que le tableur ne calcule pas sur une année",
        "Une seule année peut être une exception",
        "Pour obtenir un indice plus élevé"
      ],
      "correctAnswer": 2,
      "explanation": "Plus il y a d'années, plus le motif est fiable."
    },
    {
      "question": "Dans la série fictive, quel mois a l'indice moyen le plus élevé ?",
      "options": [
        "Novembre, avec 1,184",
        "Janvier, avec 0,918",
        "Octobre, avec 0,900",
        "Juillet, avec 1,184"
      ],
      "correctAnswer": 3,
      "explanation": "Novembre est le plus bas, avec 0,843."
    },
    {
      "question": "Quel est, en moyenne, l'écart entre le prix de soudure et le prix de récolte dans la série fictive ?",
      "options": [
        "Environ 3,7 %",
        "Environ 37 %",
        "Environ 370 %",
        "Aucun écart"
      ],
      "correctAnswer": 1,
      "explanation": "36,2 %, 42,6 % et 31,4 % selon l'année, soit 36,9 % en moyenne."
    },
    {
      "question": "La série fictive peut-elle servir de prix pour un vrai plan ?",
      "options": [
        "Non : elle sert à apprendre le calcul, remplacez-la par vos relevés",
        "Oui, tous les marchés ont le même motif",
        "Oui, si l'on ajoute 10 %",
        "Oui, mais seulement pour le maïs"
      ],
      "correctAnswer": 0,
      "explanation": "Le motif de la série d'illustration ne se transpose pas."
    }
  ],
  "ps_3": [
    {
      "question": "Quelles sont les deux sources de variation d'un prix ?",
      "options": [
        "Le jour de la semaine et la couleur du produit",
        "La monnaie et la langue du vendeur",
        "La saison et l'année",
        "Le poids du sac et sa marque"
      ],
      "correctAnswer": 2,
      "explanation": "Un plan doit tenir compte des deux."
    },
    {
      "question": "Que mesure le coefficient de variation ?",
      "options": [
        "La moyenne divisée par l'écart-type",
        "L'écart-type divisé par la moyenne, en pourcentage",
        "Le prix maximum moins le prix minimum",
        "La hausse de prix d'une année sur l'autre"
      ],
      "correctAnswer": 1,
      "explanation": "Il permet de comparer des produits de prix différents."
    },
    {
      "question": "Quel est le coefficient de variation de la série fictive ?",
      "options": [
        "Environ 1,28 %",
        "Environ 128 %",
        "Environ 26,9 %",
        "Environ 12,8 %"
      ],
      "correctAnswer": 3,
      "explanation": "Écart-type de 26,9 pour une moyenne de 209,7."
    },
    {
      "question": "Quel prix prend-on comme base d'un plan qui vend à la récolte ?",
      "options": [
        "Le prix de la période de récolte",
        "Le prix de soudure, plus avantageux",
        "Le prix maximum de la série",
        "Le prix moyen de l'année, quelle que soit la vente"
      ],
      "correctAnswer": 0,
      "explanation": "On encaisse le prix de la période où l'on vend."
    },
    {
      "question": "Comment se calcule le prix prudent proposé dans la leçon ?",
      "options": [
        "Moyenne plus un écart-type",
        "Prix maximum moins 10 %",
        "Moyenne des prix de la période de vente moins un écart-type",
        "Prix de l'an dernier multiplié par deux"
      ],
      "correctAnswer": 2,
      "explanation": "Dans la série fictive : 178,0 moins 8,7, soit 169,3 FCFA/kg."
    },
    {
      "question": "Le prix prudent est-il un prix garanti ?",
      "options": [
        "Oui, il est garanti par la formule",
        "Oui, mais seulement un an",
        "Oui, si l'on a trois années de relevés",
        "Non : le prix peut descendre plus bas, seul un contrat fixe un prix"
      ],
      "correctAnswer": 3,
      "explanation": "C'est un prix auquel s'attendre dans une mauvaise année, utile pour le scénario pessimiste."
    }
  ],
  "ps_4": [
    {
      "question": "Quel est le DSCR du cas de riz au prix de 190 FCFA/kg ?",
      "options": [
        "1,03",
        "1,47",
        "0,34",
        "2,47"
      ],
      "correctAnswer": 1,
      "explanation": "Chiffre d'affaires de 32,5 M FCFA, VAN de 5,2 M FCFA."
    },
    {
      "question": "Que devient le DSCR du cas au prix prudent de 169,3 FCFA/kg ?",
      "options": [
        "Environ 1,03, la dette est tout juste couverte",
        "Environ 1,47, rien ne change",
        "Environ 0,34, la dette n'est pas couverte",
        "Environ 2,10, il s'améliore"
      ],
      "correctAnswer": 0,
      "explanation": "Le chiffre d'affaires recule de 3,5 M FCFA et la VAN devient négative (− 3,9 M FCFA)."
    },
    {
      "question": "Quelle est la marge par kilogramme au prix prudent, avec un coût complet de 162 FCFA/kg ?",
      "options": [
        "Environ 73 FCFA par kilogramme",
        "Environ 28 FCFA par kilogramme",
        "Une perte de 7,3 FCFA par kilogramme",
        "Environ 7,3 FCFA par kilogramme"
      ],
      "correctAnswer": 3,
      "explanation": "169,3 moins 162."
    },
    {
      "question": "Quelle mesure donne un prix connu avant la campagne ?",
      "options": [
        "Un relevé de prix du mois passé",
        "Un contrat de vente écrit avec prix ou formule de prix",
        "L'espoir d'une hausse de prix",
        "Une photo du marché"
      ],
      "correctAnswer": 1,
      "explanation": "À condition de vérifier la solidité de l'acheteur et les pénalités."
    },
    {
      "question": "Que doit écrire le plan à propos du prix ?",
      "options": [
        "Uniquement le prix le plus élevé observé",
        "Uniquement le prix du voisin",
        "Le prix de base, le prix prudent et le seuil de prix",
        "Rien : le prix se négocie à la vente"
      ],
      "correctAnswer": 2,
      "explanation": "Et les mesures chiffrées avec le suivi mensuel des prix."
    },
    {
      "question": "Que faire avant de citer un dispositif de stabilisation des prix ?",
      "options": [
        "Le vérifier à la source officielle et dater la vérification",
        "Le citer de mémoire",
        "Le citer sans date, il ne change jamais",
        "Le recopier d'un forum"
      ],
      "correctAnswer": 0,
      "explanation": "Ces dispositifs changent d'un pays et d'une année à l'autre."
    }
  ],
  "sa_1": [
    {
      "question": "Que vend un prestataire de services agricoles ?",
      "options": [
        "Des kilos de produits agricoles récoltés",
        "Des terres cultivables en location à long terme",
        "L'usage d'une machine ou d'un savoir-faire",
        "Des plants issus de sa propre pépinière"
      ],
      "correctAnswer": 2,
      "explanation": "Le même matériel peut servir de nombreux clients, mais sa capacité est limitée."
    },
    {
      "question": "Qu'est-ce qui limite le chiffre d'affaires d'un service à machines ?",
      "options": [
        "Le nombre de pays où la machine est vendue",
        "La capacité de la machine et la durée de la saison",
        "Le prix du gasoil sur le marché mondial uniquement",
        "La couleur et la marque du tracteur"
      ],
      "correctAnswer": 1,
      "explanation": "On ne laboure pas toute l'année : la fenêtre de travail est courte."
    },
    {
      "question": "Quel est le tarif de labour du cas ?",
      "options": [
        "3 500 FCFA par hectare",
        "350 000 FCFA par hectare",
        "35 000 FCFA par tonne",
        "35 000 FCFA par hectare"
      ],
      "correctAnswer": 3,
      "explanation": "Le tarif de battage est de 17 000 FCFA par tonne."
    },
    {
      "question": "Pourquoi connaître ce que le client paie aujourd'hui pour le même service ?",
      "options": [
        "Pour fixer un tarif acceptable et comparer",
        "Pour copier le prix du voisin sans réfléchir",
        "Parce que la loi interdit de vendre moins cher",
        "Pour éviter d'écrire un contrat"
      ],
      "correctAnswer": 0,
      "explanation": "Le client compare toujours avec ce qu'il paie ou ce qu'il perd en n'ayant pas le service."
    },
    {
      "question": "Quels éléments un contrat de service doit-il préciser ?",
      "options": [
        "Uniquement le nom des deux parties",
        "Uniquement le prix, sans aucune autre condition",
        "Prestation, prix, paiement, panne, intempéries, dégâts",
        "Seulement la couleur du matériel utilisé"
      ],
      "correctAnswer": 2,
      "explanation": "Un contrat écrit, même court, évite la plupart des litiges."
    },
    {
      "question": "Quelle famille de services le cas étudié illustre-t-il ?",
      "options": [
        "La mécanisation",
        "Le stockage au froid",
        "La distribution d'intrants",
        "Le transport de personnes"
      ],
      "correctAnswer": 0,
      "explanation": "La méthode vaut aussi pour le stockage, les intrants et la logistique."
    }
  ],
  "sa_2": [
    {
      "question": "Quel est le chiffre d'affaires brut de croisière du cas (labour et battage) ?",
      "options": [
        "6,42 millions de FCFA",
        "642 millions de FCFA",
        "33,6 millions de FCFA",
        "64,2 millions de FCFA"
      ],
      "correctAnswer": 3,
      "explanation": "33,6 de labour + 30,6 de battage."
    },
    {
      "question": "Combien d'hectares sont labourés en croisière (2 tracteurs de 480 ha) ?",
      "options": [
        "480 ha",
        "960 ha",
        "96 ha",
        "1 440 ha"
      ],
      "correctAnswer": 1,
      "explanation": "2 × 480 = 960 ha, à 35 000 FCFA l'hectare : 33,6 M FCFA."
    },
    {
      "question": "Quel est le chiffre d'affaires encaissé après 5 % d'impayés ?",
      "options": [
        "64,2 millions de FCFA",
        "57,8 millions de FCFA",
        "61,0 millions de FCFA",
        "3,2 millions de FCFA"
      ],
      "correctAnswer": 2,
      "explanation": "64,2 − 3,2 = 61,0."
    },
    {
      "question": "Pourquoi ne pas retenir la capacité maximale annoncée par un fabricant ?",
      "options": [
        "Elle ignore pannes, déplacements, calendrier et clients",
        "Parce que les fabricants publient des chiffres toujours trop bas pour des raisons de modestie",
        "Parce que la capacité n'a aucun lien avec le chiffre d'affaires",
        "Parce que la loi interdit de citer un fabricant dans un dossier"
      ],
      "correctAnswer": 0,
      "explanation": "Retenez ce que vous traiterez réellement, avec des clients identifiés."
    },
    {
      "question": "Quelle part de l'activité de croisière retient l'année 1 du cas ?",
      "options": [
        "100 %",
        "65 %",
        "30 %",
        "5 %"
      ],
      "correctAnswer": 1,
      "explanation": "La clientèle se constitue : le chiffre d'affaires de l'année 1 est de 39,6 M FCFA."
    },
    {
      "question": "Quel outil aide le plus à remplir le calendrier d'un service ?",
      "options": [
        "Une publicité sans rendez-vous fixé",
        "L'achat de machines plus nombreuses",
        "L'attente des premiers appels en pleine saison",
        "Un calendrier de réservations avant la saison"
      ],
      "correctAnswer": 3,
      "explanation": "Les fenêtres de labour et de battage sont courtes."
    }
  ],
  "sa_3": [
    {
      "question": "Quel est le total des charges variables de croisière dans le cas ?",
      "options": [
        "2,53 millions de FCFA",
        "25,3 millions de FCFA",
        "253 millions de FCFA",
        "14,0 millions de FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "Gasoil 14,0 + entretien 6,8 + opérateurs 3,0 + transport et petits frais 1,5."
    },
    {
      "question": "Combien coûte le gasoil d'un hectare labouré (12 litres à 750 FCFA) ?",
      "options": [
        "900 FCFA",
        "90 000 FCFA",
        "9 000 FCFA",
        "12 750 FCFA"
      ],
      "correctAnswer": 2,
      "explanation": "12 × 750 = 9 000 FCFA, soit 26 % du tarif de 35 000 FCFA."
    },
    {
      "question": "Comment le cas chiffre-t-il l'entretien du matériel ?",
      "options": [
        "Un montant nul, le matériel étant neuf",
        "Un forfait de 100 000 FCFA par an",
        "Le double du prix d'achat",
        "10 % de la valeur du matériel par an"
      ],
      "correctAnswer": 3,
      "explanation": "10 % de 68,0 M FCFA, soit 6,8 M FCFA par an."
    },
    {
      "question": "Lequel de ces coûts reste fixe même si les hectares labourés baissent ?",
      "options": [
        "Les amortissements du matériel",
        "Le gasoil",
        "Les pièces d'entretien utilisées",
        "Les opérateurs saisonniers"
      ],
      "correctAnswer": 0,
      "explanation": "Amortissements : 9,95 M FCFA par an."
    },
    {
      "question": "Quel est le taux de marge sur coûts variables du cas ?",
      "options": [
        "Environ 5,8 %",
        "Environ 85 %",
        "Environ 58,5 %",
        "Environ 25 %"
      ],
      "correctAnswer": 2,
      "explanation": "(61,0 − 25,3) ÷ 61,0."
    },
    {
      "question": "Pourquoi le taux de marge est-il élevé alors que le service reste exigeant ?",
      "options": [
        "Pas de matière première, mais de lourdes charges fixes",
        "Parce que le gasoil est gratuit pour les prestataires",
        "Parce que les machines ne s'usent pas",
        "Parce que les clients paient toujours d'avance"
      ],
      "correctAnswer": 0,
      "explanation": "L'utilisation de la machine fait toute la différence."
    }
  ],
  "sa_4": [
    {
      "question": "Quel est le total des immobilisations du cas ?",
      "options": [
        "91,0 millions de FCFA",
        "44,0 millions de FCFA",
        "10,0 millions de FCFA",
        "81,0 millions de FCFA"
      ],
      "correctAnswer": 3,
      "explanation": "Les 91,0 millions du coût du projet incluent 10,0 de besoin en fonds de roulement."
    },
    {
      "question": "Quelle part de l'investissement représentent les tracteurs et les batteuses (68,0 sur 81,0) ?",
      "options": [
        "Environ 8 %",
        "Environ 84 %",
        "Environ 50 %",
        "Environ 100 %"
      ],
      "correctAnswer": 1,
      "explanation": "C'est le matériel qui porte le projet."
    },
    {
      "question": "À quoi correspond le besoin en fonds de roulement d'un prestataire ?",
      "options": [
        "Au crédit accordé aux clients et aux frais avancés",
        "Au prix d'achat des tracteurs",
        "Au salaire du gestionnaire uniquement",
        "À l'impôt payé en fin d'année"
      ],
      "correctAnswer": 0,
      "explanation": "Il se finance : 10,0 M FCFA dans le cas."
    },
    {
      "question": "Quel est le coût total du projet du cas ?",
      "options": [
        "81,0 millions de FCFA",
        "91,0 millions de FCFA",
        "27,3 millions de FCFA",
        "63,7 millions de FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "81,0 d'immobilisations + 10,0 de besoin en fonds de roulement."
    },
    {
      "question": "Quelle est l'annuité constante à partir de l'année 2 ?",
      "options": [
        "Environ 1,3 million de FCFA par an",
        "Environ 63,7 millions de FCFA par an",
        "Environ 12,7 millions de FCFA par an",
        "Environ 5,7 millions de FCFA par an"
      ],
      "correctAnswer": 2,
      "explanation": "Emprunt de 63,7 à 9 % sur 8 ans dont 1 an de différé ; 5,7 M FCFA d'intérêts l'année 1."
    },
    {
      "question": "Que faire avant d'acheter le matériel ?",
      "options": [
        "Acheter au plus vite le matériel le moins cher",
        "Se fier à la seule brochure du fabricant",
        "Choisir la solution sans regarder les conditions",
        "Comparer l'achat, la location et le crédit-bail sur devis"
      ],
      "correctAnswer": 3,
      "explanation": "Chaque solution a un coût : demandez des devis écrits et datés."
    }
  ],
  "sa_5": [
    {
      "question": "Quel est le seuil de rentabilité du cas, en part du chiffre d'affaires ?",
      "options": [
        "Environ 6,8 %",
        "Environ 100 %",
        "Environ 68 %",
        "Environ 30 %"
      ],
      "correctAnswer": 2,
      "explanation": "41,5 ÷ 61,0, soit une marge de sécurité de 32 %."
    },
    {
      "question": "Quel est le DSCR du scénario réaliste (année 2) ?",
      "options": [
        "1,87",
        "0,87",
        "18,7",
        "1,19"
      ],
      "correctAnswer": 0,
      "explanation": "Flux disponible d'environ 23,6 pour une annuité de 12,7."
    },
    {
      "question": "Que signifie un DSCR de 0,67 en mauvaise saison ?",
      "options": [
        "La banque est remboursée avec 67 % de marge",
        "L'annuité n'est pas couverte",
        "Le projet gagne 67 % de plus",
        "La saison a été excellente"
      ],
      "correctAnswer": 1,
      "explanation": "Activité en baisse de 30 % et impayés de 15 %."
    },
    {
      "question": "Quel est le DSCR du scénario pessimiste ?",
      "options": [
        "1,87",
        "0,67",
        "2,19",
        "1,19"
      ],
      "correctAnswer": 3,
      "explanation": "Activité − 15 %, impayés 10 %, gasoil + 10 %, entretien + 15 %."
    },
    {
      "question": "Quelle activité minimale garde le DSCR au-dessus de 1 dans le cas ?",
      "options": [
        "Environ 70 % de l'activité prévue",
        "Environ 10 % de l'activité prévue",
        "Environ 99 % de l'activité prévue",
        "Aucune activité n'est nécessaire"
      ],
      "correctAnswer": 0,
      "explanation": "Environ 672 ha de labour et 1 260 t de battage."
    },
    {
      "question": "Quel risque propre au service est le plus difficile à rattraper ?",
      "options": [
        "Un changement de couleur du matériel",
        "Une panne en pleine saison",
        "Un excès de clients en hiver",
        "Une baisse du prix des machines neuves"
      ],
      "correctAnswer": 1,
      "explanation": "Un chantier perdu ne se rattrape pas : prévoyez entretien préventif et pièces en stock."
    }
  ],
  "tr_1": [
    {
      "question": "Une unité traite 180 t de fruits, rendement 0,11, pertes de conditionnement de 4 %. Quel volume vendable ?",
      "options": [
        "19 800 kg, en oubliant les pertes",
        "1 901 kg, en divisant par dix",
        "172 800 kg, en oubliant le rendement",
        "19 008 kg"
      ],
      "correctAnswer": 3,
      "explanation": "180 000 × 0,11 × 0,96 = 19 008 kg."
    },
    {
      "question": "Avec un rendement de 0,11, combien de kilos de fruits faut-il environ pour 1 kg de produit sec ?",
      "options": [
        "Environ 1 kg",
        "Environ 0,9 kg",
        "Environ 9 kg",
        "Environ 110 kg"
      ],
      "correctAnswer": 2,
      "explanation": "1 ÷ 0,11 ≈ 9,1."
    },
    {
      "question": "Dans le cas attiéké, le rendement est de 0,55. Combien de kg de manioc frais par kg d'attiéké ?",
      "options": [
        "Environ 1,8 kg",
        "Environ 0,55 kg",
        "Environ 5,5 kg",
        "Exactement 2,5 kg"
      ],
      "correctAnswer": 0,
      "explanation": "1 ÷ 0,55 ≈ 1,8."
    },
    {
      "question": "Que vaut un point de rendement matière en plus (0,11 devient 0,12) dans le cas du Bénin ?",
      "options": [
        "Environ 69 000 FCFA, car un point de rendement est négligeable",
        "Environ 0,7 million de FCFA, soit le coût d'un sac de fruits",
        "Environ 6,9 millions de FCFA de CA",
        "Rien du tout, car le rendement ne change pas le volume vendu"
      ],
      "correctAnswer": 2,
      "explanation": "180 000 × 0,01 × 0,96 × 4 000 ≈ 6,9 millions."
    },
    {
      "question": "Comment établir le rendement matière de votre unité ?",
      "options": [
        "Reprendre celui de la brochure du fabricant de matériel",
        "Le mesurer sur vos propres lots, pesée à l'appui",
        "Le fixer à 100 % pour simplifier",
        "Copier celui d'un autre pays"
      ],
      "correctAnswer": 1,
      "explanation": "Le rendement dépend de votre matière première et de votre procédé."
    },
    {
      "question": "Que faire des épluchures et résidus dans le plan d'affaires ?",
      "options": [
        "Les ignorer car ils n'ont aucune valeur",
        "Les compter comme du produit fini",
        "Les vendre au prix du produit fini",
        "Les noter, avec leur valeur ou coût"
      ],
      "correctAnswer": 3,
      "explanation": "Un sous-produit peut rapporter un revenu ou coûter à évacuer."
    }
  ],
  "tr_2": [
    {
      "question": "Une unité traite 1,8 t de fruits par jour pendant 100 jours. Quelle capacité annuelle ?",
      "options": [
        "180 t",
        "18 t",
        "1 800 t",
        "100 t"
      ],
      "correctAnswer": 0,
      "explanation": "1,8 × 100 = 180 t."
    },
    {
      "question": "Dans le cas attiéké, 1,2 t de manioc par jour et 250 jours. Quelle capacité annuelle ?",
      "options": [
        "30 t",
        "250 t",
        "1 200 t",
        "300 t"
      ],
      "correctAnswer": 3,
      "explanation": "1,2 × 250 = 300 t."
    },
    {
      "question": "Que devient le coût fixe de l'unité si elle ne tourne que 70 jours au lieu de 100 ?",
      "options": [
        "Il baisse de 30 % comme le chiffre d'affaires",
        "Il reste le même, mais le CA baisse",
        "Il disparaît dès que l'unité cesse de produire",
        "Il double automatiquement dans le calcul du seuil"
      ],
      "correctAnswer": 1,
      "explanation": "Personnel permanent, amortissements et intérêts ne dépendent pas des jours travaillés."
    },
    {
      "question": "Que mesure le taux d'utilisation ?",
      "options": [
        "Le prix de vente rapporté au prix d'achat de la matière",
        "La part de produit fini perdue au conditionnement",
        "Jours travaillés rapportés aux jours possibles",
        "Le nombre de clients actifs sur la dernière année"
      ],
      "correctAnswer": 2,
      "explanation": "Plus il est bas, plus les coûts fixes pèsent par kilo produit."
    },
    {
      "question": "Quel moyen étale la saison d'une unité de séchage de mangues ?",
      "options": [
        "Acheter plus de séchoirs pour traiter la même quantité de fruits plus vite",
        "Vendre moins cher pour écouler plus vite le stock de produit sec",
        "Réduire le personnel permanent à zéro pendant toute la campagne",
        "Traiter un second produit hors saison"
      ],
      "correctAnswer": 3,
      "explanation": "Chaque jour de fonctionnement en plus dilue les coûts fixes."
    },
    {
      "question": "Pourquoi l'année 1 du cas retient-elle 70 % de la pleine capacité ?",
      "options": [
        "Parce que la loi limite la production de l'année 1 à 70 % pour toutes les unités",
        "Rodage de l'unité et premiers contrats : la production monte progressivement",
        "Parce que les séchoirs neufs ne fonctionnent qu'à 70 % de leur capacité nominale",
        "Parce que les fruits sont fournis gratuitement par l'État cette année-là"
      ],
      "correctAnswer": 1,
      "explanation": "Une montée en charge réaliste évite un plan trop optimiste."
    }
  ],
  "tr_3": [
    {
      "question": "Quelle part des charges variables représentent les fruits dans le cas du Bénin (19,8 sur 44,7 M FCFA) ?",
      "options": [
        "Environ 4 %",
        "Environ 80 %",
        "Environ 44 %",
        "Environ 100 %"
      ],
      "correctAnswer": 2,
      "explanation": "19,8 ÷ 44,7 ≈ 44 %."
    },
    {
      "question": "Quelle est la limite principale d'un contrat d'approvisionnement avec des producteurs ?",
      "options": [
        "Il peut vendre ailleurs si le prix monte",
        "Le contrat supprime toute variation de qualité des fruits livrés pendant la campagne",
        "Le contrat dispense l'unité de tout contrôle à l'arrivée des lots de fruits",
        "Le contrat interdit à l'unité de payer le producteur avant la fin de la campagne"
      ],
      "correctAnswer": 0,
      "explanation": "Un contrat équilibré est mieux respecté qu'un contrat trop dur."
    },
    {
      "question": "Combien de fournisseurs de matière première faut-il prévoir au minimum ?",
      "options": [
        "Un seul, afin de négocier un meilleur prix sur tout le volume annuel",
        "Aucun, puisque l'achat se fait au marché au jour le jour",
        "Au moins deux",
        "Cinquante, un par village de la zone de collecte"
      ],
      "correctAnswer": 2,
      "explanation": "Un plan B limite le risque en cas de mauvaise récolte chez l'un d'eux."
    },
    {
      "question": "Que doit préciser un bon contrat d'approvisionnement ?",
      "options": [
        "Prix, qualité, calendrier de livraison et modalités de paiement et de refus d'un lot",
        "Uniquement le prix au kilo de la matière première livrée",
        "Uniquement la quantité totale livrée sur l'année entière",
        "La couleur des sacs et le nom du chauffeur de livraison"
      ],
      "correctAnswer": 0,
      "explanation": "Ces éléments évitent les litiges à la livraison."
    },
    {
      "question": "Que faire à l'arrivée de chaque lot de matière première ?",
      "options": [
        "Tout accepter pour ne pas perdre le fournisseur",
        "Mélanger tous les lots sans trace",
        "Attendre la fin de la campagne pour trier",
        "Contrôler, peser, enregistrer, trier"
      ],
      "correctAnswer": 3,
      "explanation": "La qualité du produit fini dépend d'abord de celle de la matière première."
    },
    {
      "question": "Dans le scénario pessimiste du cas, comment évolue le prix des fruits ?",
      "options": [
        "Il baisse de 8 %",
        "Il augmente de 8 %",
        "Il reste identique",
        "Il est multiplié par deux"
      ],
      "correctAnswer": 1,
      "explanation": "Un scénario pessimiste teste une matière première plus chère."
    }
  ],
  "tr_4": [
    {
      "question": "Quel est le total des immobilisations du cas du Bénin, avant le fonds de roulement ?",
      "options": [
        "74,0 millions de FCFA",
        "60,0 millions de FCFA",
        "14,0 millions de FCFA",
        "22,0 millions de FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "Les 74,0 millions du coût du projet incluent 14,0 de besoin en fonds de roulement."
    },
    {
      "question": "Quel est le premier poste d'équipement du cas, et sa dotation annuelle (22,0 M FCFA sur 8 ans) ?",
      "options": [
        "Le véhicule, environ 22 millions par an",
        "Le local, environ 2,75 millions par an",
        "Les séchoirs, 2,75 M FCFA par an",
        "L'emballage, environ 275 000 FCFA par an"
      ],
      "correctAnswer": 2,
      "explanation": "22,0 ÷ 8 = 2,75."
    },
    {
      "question": "Quel est le coût d'emballage retenu dans le cas ?",
      "options": [
        "3 000 FCFA par kg de produit, soit environ 59 millions par an",
        "30 FCFA par kg de produit, soit environ 0,6 million par an",
        "Aucun coût, l'emballage étant fourni par l'acheteur",
        "300 FCFA par kg emballé, soit 5,9 M par an"
      ],
      "correctAnswer": 3,
      "explanation": "19 800 kg × 300 FCFA ≈ 5,9 millions."
    },
    {
      "question": "Que faire avant d'investir à propos des normes sanitaires et d'étiquetage ?",
      "options": [
        "Vérifier ce qui s'applique, avec date et source",
        "Les ignorer, elles ne concernent que les grandes unités",
        "Attendre le premier contrôle",
        "Copier celles d'un autre produit"
      ],
      "correctAnswer": 0,
      "explanation": "Les acheteurs exigent souvent des règles précises."
    },
    {
      "question": "Pourquoi prévoir une énergie de secours ?",
      "options": [
        "La loi l'impose partout pour toute unité de transformation sans exception",
        "Elle double le rendement matière en séchant plus longtemps chaque lot",
        "Une coupure peut arrêter le séchage et faire perdre un lot",
        "Elle remplace les séchoirs pendant la saison des pluies et la nuit"
      ],
      "correctAnswer": 2,
      "explanation": "Un plan de secours chiffré rassure les financeurs."
    },
    {
      "question": "Que faire avant d'acheter des séchoirs ?",
      "options": [
        "Prendre le moins cher sans autre vérification",
        "Acheter la capacité maximale proposée",
        "Se fier uniquement à la brochure",
        "Comparer les devis et la capacité réelle"
      ],
      "correctAnswer": 3,
      "explanation": "Les équipements sont le premier poste d'investissement."
    }
  ],
  "tr_5": [
    {
      "question": "Quel est le seuil de rentabilité du cas, rapporté au chiffre d'affaires ?",
      "options": [
        "Environ 71 %",
        "Environ 25 %",
        "Environ 50 %",
        "Environ 100 %"
      ],
      "correctAnswer": 0,
      "explanation": "54,1 ÷ 76,0 ≈ 71 %, soit une marge de sécurité de 29 %."
    },
    {
      "question": "Que signifie un DSCR de 0,99 en scénario pessimiste ?",
      "options": [
        "La banque est remboursée avec 99 % de marge",
        "L'annuité est à peine couverte",
        "Le projet gagne 99 % de plus",
        "Le scénario est sans risque"
      ],
      "correctAnswer": 1,
      "explanation": "Les banques demandent généralement un DSCR nettement supérieur à 1."
    },
    {
      "question": "Quel est le DSCR du scénario de crise de prix (− 15 %) ?",
      "options": [
        "1,54",
        "0,99",
        "0,79",
        "2,00"
      ],
      "correctAnswer": 2,
      "explanation": "Il tombe sous 1 : l'annuité n'est plus couverte."
    },
    {
      "question": "Pourquoi obtenir des lettres d'intention d'achat avant d'investir ?",
      "options": [
        "Pour remplacer l'agrément sanitaire et les démarches auprès de l'administration",
        "Pour éviter de calculer le seuil de rentabilité et le DSCR du projet",
        "Parce que la banque n'en veut jamais et préfère des promesses orales",
        "Pour avoir des acheteurs identifiés avant d'investir"
      ],
      "correctAnswer": 3,
      "explanation": "Une unité sans acheteurs avant la première campagne est exposée."
    },
    {
      "question": "Pourquoi le prix de 4 000 FCFA/kg est-il à remplacer dans votre dossier ?",
      "options": [
        "Le prix est fixé chaque année par l'État pour tous les produits séchés",
        "C'est une hypothèse : il faut vos relevés datés",
        "Le prix ne change jamais, quelle que soit la saison ou la qualité du produit",
        "Le prix est toujours de 2 000 FCFA/kg, quel que soit l'acheteur"
      ],
      "correctAnswer": 1,
      "explanation": "Chaque prix d'un plan porte une source et une date."
    },
    {
      "question": "Quel levier est le plus utile pour améliorer la marge d'une unité saisonnière ?",
      "options": [
        "Améliorer le rendement et allonger la saison",
        "Acheter plus de fruits avant d'avoir trouvé des acheteurs",
        "Réduire l'emballage à zéro pour gagner quelques points",
        "Supprimer le scénario de crise pour rassurer la banque"
      ],
      "correctAnswer": 0,
      "explanation": "Chaque levier doit être chiffré avec le modèle avant d'entrer dans le plan."
    }
  ],
  "ct_1": [
    {
      "question": "Quel référentiel comptable commun appliquent les pays de l'OHADA ?",
      "options": [
        "Le SYSCOHADA révisé",
        "Les normes comptables américaines",
        "Un référentiel différent dans chaque ville",
        "Aucun référentiel : chaque entreprise choisit"
      ],
      "correctAnswer": 0,
      "explanation": "Un banquier de la région y est habitué : présentez vos états dans cet ordre."
    },
    {
      "question": "Quels états présente-t-on dans un dossier ?",
      "options": [
        "Seulement le compte de résultat",
        "Seulement un relevé de compte bancaire",
        "Uniquement une liste de clients",
        "Compte de résultat, bilan, tableau de trésorerie, notes annexes"
      ],
      "correctAnswer": 3,
      "explanation": "Chaque état répond à une question du financeur."
    },
    {
      "question": "Quel solde du compte de résultat sert à calculer la couverture de la dette ?",
      "options": [
        "Le capital social",
        "Le nombre de salariés",
        "L'EBE",
        "La valeur de la terre"
      ],
      "correctAnswer": 2,
      "explanation": "L'excédent brut d'exploitation avant amortissements, intérêts et impôt."
    },
    {
      "question": "Quels éléments agricoles demandent un traitement comptable précis ?",
      "options": [
        "Les couleurs des emballages",
        "Les actifs biologiques et les subventions d'investissement",
        "Le nom du produit seulement",
        "Le prix du gasoil seulement"
      ],
      "correctAnswer": 1,
      "explanation": "Plantations, animaux de production : demandez à votre expert-comptable."
    },
    {
      "question": "Que fait le système minimal de trésorerie ?",
      "options": [
        "Il supprime l'obligation de payer les impôts",
        "Il simplifie la tenue des comptes des très petites entités",
        "Il remplace le business plan",
        "Il s'applique à toutes les grandes sociétés"
      ],
      "correctAnswer": 1,
      "explanation": "Les seuils dépendent du pays : lisez-les avec leur date."
    },
    {
      "question": "Où lire les seuils d'une comptabilité allégée dans votre pays ?",
      "options": [
        "Dans la première leçon de la formation uniquement",
        "Sur un blog sans date",
        "Dans un message d'un ami",
        "Dans le code général des impôts et auprès de l'ordre des experts-comptables"
      ],
      "correctAnswer": 3,
      "explanation": "Notez toujours la date de lecture."
    }
  ],
  "ct_2": [
    {
      "question": "Combien coûte par an un tracteur de 22,0 M FCFA amorti sur 8 ans ?",
      "options": [
        "2,75 M FCFA",
        "22,0 M FCFA",
        "0,275 M FCFA",
        "176 M FCFA"
      ],
      "correctAnswer": 0,
      "explanation": "22,0 ÷ 8 = 2,75."
    },
    {
      "question": "Pourquoi dire que l'amortissement permet de mettre de l'argent de côté est faux ?",
      "options": [
        "Parce qu'il est interdit par la loi",
        "Parce qu'il augmente automatiquement le compte bancaire",
        "C'est une charge sans décaissement, pas une épargne",
        "Parce qu'il n'existe pas en agriculture"
      ],
      "correctAnswer": 2,
      "explanation": "Pour renouveler un équipement, il faut épargner réellement."
    },
    {
      "question": "Pourquoi un projet peut-il être bénéficiaire tout en manquant de trésorerie ?",
      "options": [
        "Parce que les impôts sont nuls",
        "Parce que le bénéfice est toujours encaissé",
        "L'achat sort une fois, l'amortissement se répartit sur des années",
        "Parce que les clients paient toujours d'avance"
      ],
      "correctAnswer": 2,
      "explanation": "Dans le tableau de trésorerie, on voit l'achat l'année où il a lieu."
    },
    {
      "question": "À quoi sert une provision pour impayés ?",
      "options": [
        "À augmenter le chiffre d'affaires",
        "À payer les impôts de l'année suivante",
        "À rembourser le prêt plus vite",
        "À anticiper une perte probable sur des créances"
      ],
      "correctAnswer": 3,
      "explanation": "Elle montre que vous connaissez votre risque."
    },
    {
      "question": "Comment une subvention d'investissement est-elle traitée en comptabilité ?",
      "options": [
        "Entièrement en produit l'année du versement",
        "Reprise au résultat au rythme de l'amortissement de l'actif financé",
        "Ignorée dans le plan",
        "Rendue au financeur chaque année"
      ],
      "correctAnswer": 1,
      "explanation": "Demandez à votre comptable la présentation exacte."
    },
    {
      "question": "Que faut-il faire pour remplacer un équipement dans huit ans ?",
      "options": [
        "Épargner chaque année une somme sur un compte distinct",
        "Compter sur l'amortissement seulement",
        "Attendre une subvention automatique",
        "Ne rien prévoir"
      ],
      "correctAnswer": 0,
      "explanation": "Inscrivez cette somme dans votre budget de trésorerie."
    }
  ],
  "ct_3": [
    {
      "question": "Pourquoi ne pas citer de taux d'impôt de mémoire dans votre dossier ?",
      "options": [
        "Ils changent d'un pays et d'une année à l'autre",
        "Parce qu'ils sont toujours identiques partout",
        "Parce que les impôts n'existent pas en agriculture",
        "Parce que le banquier les connaît déjà"
      ],
      "correctAnswer": 0,
      "explanation": "Chaque valeur porte une source et une date de lecture."
    },
    {
      "question": "Que doit porter chaque valeur fiscale de votre modèle ?",
      "options": [
        "Rien, seulement le chiffre",
        "Le nom de votre ami comptable",
        "Sa source et sa date de lecture",
        "Le prix d'achat du terrain"
      ],
      "correctAnswer": 2,
      "explanation": "Article du code ou site de l'administration."
    },
    {
      "question": "Année 1 : perte de 10. Année 2 : bénéfice de 25. Si la perte est reportable, quel bénéfice est imposable l'année 2 ?",
      "options": [
        "25",
        "35",
        "10",
        "15"
      ],
      "correctAnswer": 3,
      "explanation": "25 − 10 = 15 ; avec un taux d'exemple de 30 %, l'impôt est de 4,5 au lieu de 7,5."
    },
    {
      "question": "Peut-on compter sur une exonération dans le scénario réaliste sans l'avoir vérifiée ?",
      "options": [
        "Oui, toujours",
        "Non : présentez le plan avec et sans exonération",
        "Oui, si un blog en parle",
        "Oui, si elle existe dans un autre pays"
      ],
      "correctAnswer": 1,
      "explanation": "Une exonération non confirmée par écrit ne se compte pas."
    },
    {
      "question": "Où lire les cotisations sociales employeur ?",
      "options": [
        "Dans un message d'un voisin",
        "Dans les statuts d'une coopérative d'un autre pays",
        "Sur une publicité",
        "Sur le site de la caisse de sécurité sociale du pays"
      ],
      "correctAnswer": 3,
      "explanation": "Elles alimentent la ligne cotisations sociales du modèle."
    },
    {
      "question": "Quand faire relire ses hypothèses fiscales par un professionnel ?",
      "options": [
        "Avant le dépôt du dossier de financement",
        "Jamais",
        "Seulement après un refus",
        "Seulement après un contrôle"
      ],
      "correctAnswer": 0,
      "explanation": "Un expert-comptable ou un centre de gestion agréé."
    }
  ],
  "ct_4": [
    {
      "question": "Pourquoi séparer les comptes de l'entreprise et ceux de la famille ?",
      "options": [
        "Pour payer moins d'impôt",
        "Parce que la loi l'interdit autrement",
        "Sans séparation, on ne peut pas lire les comptes de l'entreprise",
        "Pour augmenter le prix de vente"
      ],
      "correctAnswer": 2,
      "explanation": "Un compte bancaire ou de mobile money par usage."
    },
    {
      "question": "Quelles lignes un tableau de bord mensuel compare-t-il au plan ?",
      "options": [
        "La météo et le prix du pétrole",
        "Chiffre d'affaires, charges variables, EBE, trésorerie, créances clients",
        "Le nombre de visiteurs d'un site",
        "Le salaire du directeur de la banque"
      ],
      "correctAnswer": 1,
      "explanation": "Cinq lignes suffisent pour piloter."
    },
    {
      "question": "Quel écart mérite une explication écrite sur une ligne du tableau de bord ?",
      "options": [
        "Plus de 10 %",
        "Moins de 1 %",
        "Aucun écart",
        "Seulement plus de 90 %"
      ],
      "correctAnswer": 0,
      "explanation": "Et, si besoin, une action corrective."
    },
    {
      "question": "Que contient le registre des ventes ?",
      "options": [
        "La météo du jour seulement",
        "Date, client, quantité, prix, paiement",
        "Le nom de l'expert-comptable",
        "Le montant de l'apport seulement"
      ],
      "correctAnswer": 1,
      "explanation": "À renseigner à chaque vente."
    },
    {
      "question": "Quand faire appel à un expert-comptable ?",
      "options": [
        "Jamais, c'est inutile",
        "Seulement pour acheter du matériel",
        "Pour les états de fin d'année, les déclarations, un dossier de financement",
        "Uniquement pour choisir le nom de l'entreprise"
      ],
      "correctAnswer": 2,
      "explanation": "Ses honoraires entrent dans vos charges fixes."
    },
    {
      "question": "Que faut-il mettre dans l'agenda partagé avec le comptable ?",
      "options": [
        "Les anniversaires des clients",
        "Les prix du marché mondial",
        "Les dates de pleine lune",
        "Les échéances de déclarations et de cotisations"
      ],
      "correctAnswer": 3,
      "explanation": "Avec les dates lues dans les textes du pays."
    }
  ],
  "im_1": [
    {
      "question": "Pourquoi les financeurs évaluent-ils l'impact social ?",
      "options": [
        "Parce que c'est interdit de ne pas en parler",
        "Parce que cela remplace le business plan",
        "Beaucoup de programmes le demandent avec des indicateurs",
        "Parce que les banques ne regardent que cela"
      ],
      "correctAnswer": 2,
      "explanation": "Un dossier chiffré se démarque."
    },
    {
      "question": "Quel est un bon indicateur d'emploi ?",
      "options": [
        "Le nombre de réunions tenues",
        "Emplois permanents et saisonniers créés, par sexe et par âge",
        "La couleur de l'uniforme",
        "Le nombre de kilomètres parcourus"
      ],
      "correctAnswer": 1,
      "explanation": "Vérifiable dans le registre du personnel."
    },
    {
      "question": "Quelle formulation d'objectif est la plus crédible ?",
      "options": [
        "Changer la vie de tous les jeunes",
        "Réduire la pauvreté dans le monde",
        "Faire de notre mieux",
        "6 emplois permanents dont 2 occupés par des femmes, dès la deuxième année"
      ],
      "correctAnswer": 3,
      "explanation": "Un objectif doit être daté, chiffré et correspondre à des moyens."
    },
    {
      "question": "Quel risque faut-il anticiper pour l'accès des femmes à la terre ?",
      "options": [
        "Il est souvent plus difficile : à traiter dans le plan foncier",
        "Aucun risque",
        "Il est toujours automatique",
        "Il ne concerne que les villes"
      ],
      "correctAnswer": 0,
      "explanation": "Ne l'ignorez pas dans votre plan."
    },
    {
      "question": "Comment vérifier le revenu des producteurs fournisseurs avant et après le projet ?",
      "options": [
        "Par une enquête simple avec deux relevés datés",
        "En supposant un chiffre",
        "En copiant un autre pays",
        "Sans aucune mesure"
      ],
      "correctAnswer": 0,
      "explanation": "Un revenu sans date n'est pas mesurable."
    },
    {
      "question": "Les conditions de travail sont-elles seulement un engagement moral ?",
      "options": [
        "Oui, uniquement morales",
        "Non, elles ne concernent que l'État",
        "Non, ce sont aussi des exigences légales",
        "Oui, sauf pour les petites exploitations"
      ],
      "correctAnswer": 2,
      "explanation": "Sécurité, âge minimal, paiement à temps."
    }
  ],
  "im_2": [
    {
      "question": "Quels sont les deux sens à ne pas confondre en matière d'environnement ?",
      "options": [
        "Le prix de l'eau et celui du gasoil",
        "La saison sèche et la saison humide seulement",
        "Le sol et le ciel uniquement",
        "L'impact du projet sur l'environnement et l'effet du climat sur le projet"
      ],
      "correctAnswer": 3,
      "explanation": "L'un est ce que vous causez, l'autre ce que vous subissez."
    },
    {
      "question": "Que faut-il vérifier d'abord sur l'eau ?",
      "options": [
        "La couleur de l'eau seulement",
        "L'origine, la quantité et l'autorisation éventuelle",
        "Le prix d'un seau",
        "Le nom du fournisseur de la pompe"
      ],
      "correctAnswer": 1,
      "explanation": "L'autorisation dépend du pays."
    },
    {
      "question": "D'où doivent venir les données climatiques d'un dossier ?",
      "options": [
        "De sources datées : service météo, institut de recherche",
        "D'un souvenir d'un voisin",
        "D'une publicité",
        "D'un autre pays au hasard"
      ],
      "correctAnswer": 0,
      "explanation": "Avec la date et la source."
    },
    {
      "question": "Qu'est-ce qu'une mesure d'adaptation au climat ?",
      "options": [
        "Attendre la pluie",
        "Vendre toute la récolte d'avance",
        "Variétés adaptées, irrigation maîtrisée, calendrier, couverture du sol",
        "Supprimer le scénario pessimiste"
      ],
      "correctAnswer": 2,
      "explanation": "Elle a un coût et un effet à chiffrer."
    },
    {
      "question": "Quand une étude d'impact environnemental est-elle exigée ?",
      "options": [
        "Toujours pour tous les projets",
        "Selon le pays, la taille et la nature du projet",
        "Jamais, nulle part",
        "Uniquement en saison sèche"
      ],
      "correctAnswer": 1,
      "explanation": "Vérifiez les seuils auprès de l'administration."
    },
    {
      "question": "Quel intérêt peut avoir une mesure environnementale pour le plan ?",
      "options": [
        "Aucun, c'est seulement un coût",
        "Elle remplace l'assurance",
        "Elle supprime les risques",
        "Économiser eau et intrants ou améliorer la couverture de la dette"
      ],
      "correctAnswer": 3,
      "explanation": "Mettez le coût et le gain dans le modèle."
    }
  ],
  "im_3": [
    {
      "question": "Pourquoi la conformité compte-t-elle pour un financeur ?",
      "options": [
        "Parce que les banques aiment les formulaires",
        "Parce que cela remplace les garanties",
        "Il refuse d'assumer le risque d'une activité hors des règles",
        "Parce que cela réduit les taux à zéro"
      ],
      "correctAnswer": 2,
      "explanation": "Foncier, autorisations, droit du travail."
    },
    {
      "question": "Où trouver les exigences de votre pays ?",
      "options": [
        "Dans un forum sans date",
        "Dans la fiche Cadre pays, puis auprès des administrations",
        "Dans une publicité",
        "Nulle part, elles n'existent pas"
      ],
      "correctAnswer": 1,
      "explanation": "Notez la date de vérification."
    },
    {
      "question": "Que faut-il joindre pour prouver le droit sur la terre ?",
      "options": [
        "Une simple promesse orale",
        "Une photo du terrain",
        "Rien",
        "Titre, attestation ou bail valable pour la durée du projet"
      ],
      "correctAnswer": 3,
      "explanation": "Un droit sûr sur toute la durée est une condition de base."
    },
    {
      "question": "Pourquoi tenir un cahier de culture ou d'élevage ?",
      "options": [
        "Il prouve l'origine et les traitements, utile pour la traçabilité",
        "Pour décorer le bureau",
        "Pour remplacer le business plan",
        "Pour éviter de payer des impôts"
      ],
      "correctAnswer": 0,
      "explanation": "Les supermarchés et l'export le demandent souvent."
    },
    {
      "question": "Où placer le coût des autorisations, analyses et formations ?",
      "options": [
        "Dans les investissements ou les charges fixes du plan",
        "Nulle part",
        "Dans le chiffre d'affaires",
        "Dans l'apport"
      ],
      "correctAnswer": 0,
      "explanation": "Un plan qui les oublie sous-estime ses besoins."
    },
    {
      "question": "Une fiche Cadre pays signale un point non confirmé : que faire ?",
      "options": [
        "Le considérer comme confirmé",
        "L'ignorer",
        "Le copier tel quel dans le dossier",
        "Le vérifier auprès de l'administration avant de l'utiliser"
      ],
      "correctAnswer": 3,
      "explanation": "Une information non confirmée n'est jamais acquise."
    }
  ],
  "vi_1": [
    {
      "question": "Par quoi doit commencer le choix d'une culture ?",
      "options": [
        "Par la culture que tous les voisins plantent cette année",
        "Par le rendement annoncé sur l'emballage des semences",
        "Par le marché : qui achète, à quel prix, à quelle saison",
        "Par la machine qu'on aimerait acheter"
      ],
      "correctAnswer": 2,
      "explanation": "Une culture sans acheteur identifié est un risque, quel que soit le rendement."
    },
    {
      "question": "Quel est le principal avantage d'un système irrigué ?",
      "options": [
        "Aucun investissement initial",
        "Un rendement plus stable et deux campagnes possibles",
        "Aucune charge d'eau ni d'énergie",
        "L'absence totale de risque de prix"
      ],
      "correctAnswer": 1,
      "explanation": "Mais l'investissement et les charges d'eau sont élevés."
    },
    {
      "question": "Combien d'hectares-campagnes compte le cas étudié ?",
      "options": [
        "15 (une seule campagne par an)",
        "300 (dix campagnes par an)",
        "45 (trois campagnes par an)",
        "30 (15 hectares, deux campagnes par an)"
      ],
      "correctAnswer": 3,
      "explanation": "Un hectare cultivé deux fois dans l'année compte pour deux hectares-campagnes."
    },
    {
      "question": "D'où doivent venir les ordres de grandeur agronomiques d'un plan (cycle, variété, besoins) ?",
      "options": [
        "D'un conseiller ou d'un institut local, avec la source et la date",
        "D'un souvenir approximatif de la saison passée",
        "D'une publicité du fournisseur de semences",
        "De ce qui se pratique dans un autre continent"
      ],
      "correctAnswer": 0,
      "explanation": "Les variétés et les besoins dépendent de votre zone."
    },
    {
      "question": "Pourquoi le soja demande-t-il en général moins d'engrais azoté que le maïs ?",
      "options": [
        "Il pousse sans aucune eau",
        "Il ne se vend qu'à l'exportation",
        "La plante fixe elle-même une partie de l'azote",
        "Il n'a aucun besoin en semences de qualité"
      ],
      "correctAnswer": 2,
      "explanation": "Il reste sensible à la qualité des semences et au manque d'eau au remplissage des graines."
    },
    {
      "question": "Pourquoi un droit écrit sur la parcelle est-il demandé dans le plan ?",
      "options": [
        "Parce que le banquier choisit les variétés",
        "Pour sécuriser la terre pendant toute la durée de l'emprunt",
        "Pour éviter de payer l'eau",
        "Pour supprimer le besoin d'un contrat de vente"
      ],
      "correctAnswer": 1,
      "explanation": "Sans droit sûr sur la terre, l'aménagement et l'emprunt sont menacés."
    }
  ],
  "vi_2": [
    {
      "question": "Comment s'exprime correctement un rendement dans un plan ?",
      "options": [
        "En kilogrammes par hectare et par campagne, avec source et date",
        "En tonnes pour toute l'exploitation, sans surface",
        "En chiffre d'affaires par mois",
        "En pourcentage du prix de vente"
      ],
      "correctAnswer": 0,
      "explanation": "Sans la surface ni la campagne, le chiffre ne se vérifie pas."
    },
    {
      "question": "Quel rendement le cas retient-il, comme hypothèse pédagogique ?",
      "options": [
        "600 kg de paddy par hectare et par campagne",
        "6 000 kg de paddy par hectare et par campagne",
        "60 000 kg de paddy par hectare et par campagne",
        "6 000 kg de paddy par hectare et par an"
      ],
      "correctAnswer": 1,
      "explanation": "C'est une hypothèse à remplacer par vos mesures datées."
    },
    {
      "question": "Quel est le budget total d'une campagne à l'hectare dans le cas ?",
      "options": [
        "0,059 M FCFA",
        "5,90 M FCFA",
        "0,590 M FCFA",
        "1,083 M FCFA"
      ],
      "correctAnswer": 2,
      "explanation": "1,083 M FCFA est le chiffre d'affaires par hectare et par campagne, pas le budget."
    },
    {
      "question": "Quelles sont les charges variables de croisière du cas ?",
      "options": [
        "1,77 M FCFA",
        "32,5 M FCFA",
        "27,7 M FCFA",
        "17,7 M FCFA"
      ],
      "correctAnswer": 3,
      "explanation": "30 hectares-campagnes × 0,590 M FCFA."
    },
    {
      "question": "Quel est le coût variable du paddy par kilogramme dans le cas ?",
      "options": [
        "Environ 10,3 FCFA par kilogramme",
        "Environ 103,5 FCFA par kilogramme",
        "Environ 190 FCFA par kilogramme",
        "Environ 1 035 FCFA par kilogramme"
      ],
      "correctAnswer": 1,
      "explanation": "17,7 M FCFA pour 171 tonnes. Le coût complet monte à environ 162 FCFA/kg."
    },
    {
      "question": "Parmi ces variations, laquelle ramène le plus le DSCR du cas ?",
      "options": [
        "Un engrais plus cher de 20 % (DSCR 1,36)",
        "Un labour et battage plus chers de 10 % (DSCR 1,42)",
        "Un rendement inférieur de 10 % (DSCR 1,07)",
        "Une eau plus chère de 20 % (DSCR 1,42)"
      ],
      "correctAnswer": 2,
      "explanation": "Le rendement et le prix pèsent plus lourd que chaque charge prise seule."
    }
  ],
  "vi_3": [
    {
      "question": "Pourquoi les prix des céréales sont-ils souvent plus bas juste après la récolte ?",
      "options": [
        "Parce que tous les producteurs vendent en même temps",
        "Parce que la loi fixe un prix plancher après la récolte",
        "Parce que la demande disparaît totalement",
        "Parce que le grain est toujours de mauvaise qualité"
      ],
      "correctAnswer": 0,
      "explanation": "L'écart avec la période de soudure existe mais varie d'une année à l'autre."
    },
    {
      "question": "Quel prix de base un plan prudent retient-il pour la vente de la récolte ?",
      "options": [
        "Le prix le plus haut observé de l'année",
        "Le prix de soudure, supposé garanti",
        "Le prix annoncé par un futur acheteur sans contrat",
        "Le prix à la récolte, avec le stockage en option chiffrée"
      ],
      "correctAnswer": 3,
      "explanation": "Un banquier se méfie d'un plan qui compte sur la hausse de prix."
    },
    {
      "question": "Quelle part de la récolte le cas imagine-t-il de stocker pendant 4 mois ?",
      "options": [
        "4 %",
        "100 %",
        "14 %",
        "40 %"
      ],
      "correctAnswer": 3,
      "explanation": "Soit 13,0 M FCFA au prix de récolte."
    },
    {
      "question": "Quel est le gain net du stockage dans le cas (hausse de prix de 15 %) ?",
      "options": [
        "Environ 9 M FCFA",
        "Environ 0,9 M FCFA",
        "Environ 1,7 M FCFA",
        "Aucun gain, la perte est de 0,9 M FCFA"
      ],
      "correctAnswer": 1,
      "explanation": "Le gain est faible face aux 13,0 M FCFA immobilisés."
    },
    {
      "question": "À partir de quelle hausse de prix le stockage du cas devient-il rentable ?",
      "options": [
        "À partir d'environ 8,2 %",
        "À partir de 0 %",
        "À partir d'environ 15 %",
        "À partir d'environ 30 %"
      ],
      "correctAnswer": 0,
      "explanation": "En dessous, les pertes, les frais et le coût de l'argent mangent la hausse."
    },
    {
      "question": "Que faut-il vérifier avant de compter sur un crédit sur stock ou un système de stockage collectif ?",
      "options": [
        "Rien : ces dispositifs existent partout aux mêmes conditions",
        "Uniquement le nom du dispositif cité par un voisin",
        "Son existence et ses conditions réelles, à la source et à la date",
        "Seulement le taux annoncé sur une affiche ancienne"
      ],
      "correctAnswer": 2,
      "explanation": "Ne citez jamais un dispositif ou un taux sans vérification datée."
    }
  ],
  "vi_4": [
    {
      "question": "À quels moments une culture annuelle demande-t-elle le plus de bras ?",
      "options": [
        "Toute l'année, de manière constante",
        "Uniquement le jour de la vente",
        "Aux pointes : préparation, semis ou repiquage, désherbage, récolte, battage",
        "Uniquement pendant la saison sèche"
      ],
      "correctAnswer": 2,
      "explanation": "Placez ces pointes sur un calendrier avant de chiffrer le personnel."
    },
    {
      "question": "Comment le cas se procure-t-il le labour et le battage ?",
      "options": [
        "En prestation, sans acheter de tracteur ni de batteuse",
        "Il achète deux tracteurs et deux batteuses",
        "Il emprunte du matériel sans aucun coût",
        "Il laboure et bat à la main uniquement"
      ],
      "correctAnswer": 0,
      "explanation": "Le poste labour et battage coûte 4,5 M FCFA par an."
    },
    {
      "question": "Pourquoi acheter une machine pour 30 hectares-campagnes se justifie rarement ?",
      "options": [
        "Les machines sont interdites sur les petites surfaces",
        "La machine ne travaillerait pas assez d'hectares pour s'amortir",
        "Une machine ne peut jamais labourer du riz",
        "Le banquier refuse tout achat de matériel"
      ],
      "correctAnswer": 1,
      "explanation": "L'achat en commun ou la prestation sont souvent préférables."
    },
    {
      "question": "Combien le cas retient-il pour la main-d'œuvre saisonnière par an ?",
      "options": [
        "0,27 M FCFA",
        "27 M FCFA",
        "4,5 M FCFA",
        "2,7 M FCFA"
      ],
      "correctAnswer": 3,
      "explanation": "0,090 M FCFA par hectare et par campagne, pour 30 hectares-campagnes."
    },
    {
      "question": "Que fait-on du travail familial dans le plan ?",
      "options": [
        "On le compte pour zéro",
        "On le chiffre au prix de la journée",
        "On le supprime du calendrier",
        "On le remplace par un emprunt"
      ],
      "correctAnswer": 1,
      "explanation": "Un travail non payé reste un coût du projet."
    },
    {
      "question": "Que faut-il prévoir si le plan dépend d'une prestation de labour ?",
      "options": [
        "Une réservation ou un contrat écrit avant la campagne, et un plan de repli",
        "Rien : la machine sera forcément disponible",
        "Un seul appel téléphonique la veille",
        "Un second emprunt, par précaution"
      ],
      "correctAnswer": 0,
      "explanation": "Un labour tardif décale le semis et réduit le rendement."
    }
  ],
  "vi_5": [
    {
      "question": "Quel est le coût total du projet du cas ?",
      "options": [
        "27,9 M FCFA",
        "8,0 M FCFA",
        "25,1 M FCFA",
        "35,9 M FCFA"
      ],
      "correctAnswer": 3,
      "explanation": "27,9 M FCFA d'immobilisations plus 8,0 M FCFA de besoin de fonds de roulement."
    },
    {
      "question": "Pourquoi le besoin de fonds de roulement existe-t-il dans une culture annuelle ?",
      "options": [
        "Parce que la récolte est payée d'avance",
        "Parce que l'eau est gratuite",
        "Les semences, l'engrais et la main-d'œuvre se paient avant la récolte",
        "Parce qu'il n'y a aucune charge avant la vente"
      ],
      "correctAnswer": 2,
      "explanation": "Le cas retient 8,0 M FCFA."
    },
    {
      "question": "Quels sont le montant de l'emprunt et l'annuité du cas ?",
      "options": [
        "35,9 M FCFA et environ 2,3 M FCFA par an",
        "10,8 M FCFA et environ 5,6 M FCFA par an",
        "25,1 M FCFA et environ 12,7 M FCFA par an",
        "25,1 M FCFA et environ 5,6 M FCFA par an"
      ],
      "correctAnswer": 3,
      "explanation": "À 9 % sur 7 ans dont 1 an de différé, avec 30 % d'apport."
    },
    {
      "question": "Quel est le seuil de rentabilité du cas, en part du chiffre d'affaires ?",
      "options": [
        "68 %, soit une marge de sécurité de 32 %",
        "32 %, soit une marge de sécurité de 68 %",
        "100 %, soit aucune marge de sécurité",
        "15 %, soit une marge de sécurité de 85 %"
      ],
      "correctAnswer": 0,
      "explanation": "Coûts fixes totaux de 10,0 M FCFA divisés par un taux de marge de 45,5 %."
    },
    {
      "question": "Quels sont les trois DSCR du cas (réaliste, pessimiste, mauvaise campagne) ?",
      "options": [
        "1,03 puis 1,47 puis 0,34",
        "2,47 puis 2,03 puis 1,34",
        "1,47 puis 1,03 puis 0,34",
        "0,47 puis 0,03 puis 0,34"
      ],
      "correctAnswer": 2,
      "explanation": "Dans la mauvaise campagne, l'annuité n'est pas couverte."
    },
    {
      "question": "De combien le rendement peut-il baisser avant que le DSCR passe sous 1, dans le cas ?",
      "options": [
        "D'environ 50 %",
        "D'environ 11 %",
        "D'environ 1 %",
        "D'aucun pourcentage : la dette est toujours couverte"
      ],
      "correctAnswer": 1,
      "explanation": "La marge est mince : rendement et prix décident du projet."
    }
  ]
};
